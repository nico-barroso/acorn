import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../../lib/supabase';
import { queryClient } from '../../../lib/queryClient';
import { queryKeys } from '../../../lib/queryKeys';
import { useCurrentUserId } from '../../../hooks/useCurrentUserId';
import { useSession } from '../../../context/SessionContext';
import { formatDisplayName, sanitizeDisplayName } from '../../../utils/formatDisplayName';

type EditProfileErrors = {
  name?: string;
  email?: string;
  general?: string;
};

async function getSignedAvatarUrl(path: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from('user-files')
    .createSignedUrl(path, 3600);
  if (error) return null;
  return data.signedUrl;
}

export function useEditProfile() {
  const userId = useCurrentUserId();
  const { session, email: sessionEmail } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState(sessionEmail ?? '');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [errors, setErrors] = useState<EditProfileErrors>({});
  const [loading, setLoading] = useState(false);
  const [emailConfirmationSent, setEmailConfirmationSent] = useState(false);
  const [profileInitialized, setProfileInitialized] = useState(false);

  useEffect(() => {
    if (sessionEmail && !email) {
      setEmail(sessionEmail);
    }
  }, [sessionEmail]);

  // Profile query
  const { data: profileData } = useQuery({
    queryKey: queryKeys.profile(userId ?? ''),
    queryFn: async () => {
      if (!session?.user) return null;

      const { data } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', session.user.id)
        .single();

      return data;
    },
    enabled: Boolean(userId),
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (profileData && !profileInitialized) {
      if (profileData.display_name) setName(profileData.display_name);
      setProfileInitialized(true);
    }
  }, [profileData, profileInitialized]);

  // Avatar signed URL query — separate key so it can be invalidated independently
  const { data: cachedAvatarUrl } = useQuery({
    queryKey: queryKeys.avatarUrl(userId ?? ''),
    queryFn: () => getSignedAvatarUrl(profileData!.avatar_url!),
    enabled: Boolean(userId) && Boolean(profileData?.avatar_url),
    staleTime: 50 * 60 * 1000,
  });

  // Use local avatarUri if user picked a new image, otherwise use cached URL
  const displayAvatarUri = avatarUri && !avatarUri.startsWith('http')
    ? avatarUri
    : (avatarUri ?? cachedAvatarUrl ?? null);

  const validate = (): boolean => {
    const newErrors: EditProfileErrors = {};
    if (!name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!email.trim()) newErrors.email = 'El correo es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadAvatar = async (uid: string, localUri: string): Promise<string> => {
    const ext = localUri.split('.').pop()?.toLowerCase() ?? 'jpg';
    const contentType = ext === 'png' ? 'image/png' : 'image/jpeg';
    const filePath = `${uid}/avatar.${ext}`;

    const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', localUri, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(new Error(`XHR failed: ${xhr.status}`));
        }
      };
      xhr.onerror = () => reject(new Error('XHR error'));
      xhr.send();
    });

    const { error } = await supabase.storage
      .from('user-files')
      .upload(filePath, arrayBuffer, { upsert: true, contentType });

    if (error) throw error;

    return filePath;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const user = session?.user;
      if (!user) throw new Error('No user');

      let avatarPath: string | undefined;
      if (avatarUri && !avatarUri.startsWith('http')) {
        avatarPath = await uploadAvatar(user.id, avatarUri);
        const signedUrl = await getSignedAvatarUrl(avatarPath);
        if (signedUrl) setAvatarUri(signedUrl);
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          display_name: name.trim(),
          ...(avatarPath ? { avatar_url: avatarPath } : {}),
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      const trimmedEmail = email.trim();
      const emailChanged = trimmedEmail !== sessionEmail;
      console.log('[handleSave] sessionEmail:', sessionEmail);
      console.log('[handleSave] newEmail:', trimmedEmail);
      console.log('[handleSave] emailChanged:', emailChanged);

      if (emailChanged) {
        console.log('[handleSave] Llamando a supabase.auth.updateUser...');
        const { data: updateData, error: emailError } = await supabase.auth.updateUser({ email: trimmedEmail });
        console.log('[handleSave] updateUser data:', JSON.stringify(updateData));
        console.log('[handleSave] updateUser error:', JSON.stringify(emailError));
        if (emailError) {
          setErrors({ email: 'No se pudo actualizar el correo. Inténtalo de nuevo.' });
          setLoading(false);
          return;
        }
        setEmailConfirmationSent(true);
      }

      void queryClient.invalidateQueries({ queryKey: queryKeys.profile(user.id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.avatarUrl(user.id) });
    } catch {
      setErrors({ general: 'Error al guardar los cambios' });
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (text: string) => setName(sanitizeDisplayName(text));
  const handleNameBlur = () => setName(formatDisplayName(name));

  return {
    name,
    handleNameChange,
    handleNameBlur,
    email,
    setEmail,
    avatarUri: displayAvatarUri,
    setAvatarUri,
    errors,
    loading,
    emailConfirmationSent,
    handleSave,
  };
}
