import { useState } from 'react';
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
  const [email, setEmail] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [errors, setErrors] = useState<EditProfileErrors>({});
  const [loading, setLoading] = useState(false);
  const [profileInitialized, setProfileInitialized] = useState(false);

  // Sync email from session
  if (sessionEmail && email === '') {
    setEmail(sessionEmail);
  }

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

  // Sync local form state when profile data loads (only once)
  if (profileData && !profileInitialized) {
    if (profileData.display_name) setName(profileData.display_name);
    setProfileInitialized(true);
  }

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

    console.log('[Avatar] Upload - URI:', localUri);
    console.log('[Avatar] Upload - Ext:', ext);
    console.log('[Avatar] Upload - ContentType:', contentType);
    console.log('[Avatar] Upload - FilePath:', filePath);

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

    console.log('[Avatar] ArrayBuffer size:', arrayBuffer.byteLength);

    const { error } = await supabase.storage
      .from('user-files')
      .upload(filePath, arrayBuffer, { upsert: true, contentType });

    console.log('[Avatar] Upload - Error:', error);
    console.log('[Avatar] Upload - Success, path:', filePath);

    if (error) throw error;

    return filePath;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const user = session?.user;
      if (!user) throw new Error('No user');

      console.log('[Avatar] handleSave - userId:', user.id);
      console.log('[Avatar] handleSave - avatarUri:', avatarUri);

      let avatarPath: string | undefined;
      if (avatarUri && !avatarUri.startsWith('http')) {
        console.log('[Avatar] handleSave - Starting upload');
        avatarPath = await uploadAvatar(user.id, avatarUri);
        console.log('[Avatar] handleSave - avatarPath:', avatarPath);
        const signedUrl = await getSignedAvatarUrl(avatarPath);
        console.log('[Avatar] handleSave - signedUrl:', signedUrl);
        if (signedUrl) setAvatarUri(signedUrl);
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: name.trim(),
          ...(avatarPath ? { avatar_url: avatarPath } : {}),
        })
        .eq('id', user.id);

      console.log('[Avatar] handleSave - Profile update error:', error);
      if (error) throw error;

      // Invalidate profile and avatar URL caches
      void queryClient.invalidateQueries({ queryKey: queryKeys.profile(user.id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.avatarUrl(user.id) });
    } catch (e) {
      console.log('[Avatar] handleSave - Catch error:', e);
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
    handleSave,
  };
}
