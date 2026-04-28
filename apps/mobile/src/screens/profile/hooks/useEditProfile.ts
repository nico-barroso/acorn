import { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabase';
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [errors, setErrors] = useState<EditProfileErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setEmail(user.email ?? '');

      const { data } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', user.id)
        .single();

      if (data?.display_name) setName(data.display_name);
      if (data?.avatar_url) {
        const signedUrl = await getSignedAvatarUrl(data.avatar_url);
        if (signedUrl) setAvatarUri(signedUrl);
      }
    };

    loadProfile();
  }, []);

  const validate = (): boolean => {
    const newErrors: EditProfileErrors = {};
    if (!name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!email.trim()) newErrors.email = 'El correo es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadAvatar = async (userId: string, localUri: string): Promise<string> => {
    const ext = localUri.split('.').pop()?.toLowerCase() ?? 'jpg';
    const contentType = ext === 'png' ? 'image/png' : 'image/jpeg';
    const filePath = `${userId}/avatar.${ext}`;

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
      const { data: { user } } = await supabase.auth.getUser();
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
    avatarUri,
    setAvatarUri,
    errors,
    loading,
    handleSave,
  };
}
