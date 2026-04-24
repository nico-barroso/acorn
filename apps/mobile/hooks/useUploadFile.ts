import { useState } from 'react';
import { supabase } from '../lib/supabase';

type UploadedFile = {
  id: string;
  storage_path: string;
  file_name: string;
  content_type: string;
  size_bytes: number;
  public_url: string;
};

type UploadFileOptions = {
  onSuccess?: (file: UploadedFile) => void;
  onError?: (message: string) => void;
};

export function useUploadFile({ onSuccess, onError }: UploadFileOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0); // 0-100

  async function uploadFile(file: { uri: string; name: string; type: string; size: number }) {
    console.log('[uploadFile] start', { name: file.name, type: file.type, size: file.size });
    setLoading(true);
    setError(null);
    setProgress(0);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const message = 'Debes estar autenticado para subir archivos';
      console.log('[uploadFile] no user');
      setError(message);
      setLoading(false);
      onError?.(message);
      return;
    }

    console.log('[uploadFile] user ok', user.id);

    const timestamp = Date.now();
    const storagePath = `${user.id}/${timestamp}_${file.name}`;

    console.log('[uploadFile] reading file as arraybuffer', file.uri);
    const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', file.uri, true);
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
    console.log('[uploadFile] arraybuffer size', arrayBuffer.byteLength);

    console.log('[uploadFile] uploading to storage', storagePath);
    const { error: uploadError } = await supabase.storage.from('user-files').upload(
      storagePath,
      arrayBuffer,
      {
        contentType: file.type,
        upsert: false,
      },
    );

    if (uploadError) {
      console.log('[uploadFile] storage error', uploadError);
      const message = 'No se pudo subir el archivo';
      setError(message);
      setLoading(false);
      onError?.(message);
      return;
    }

    console.log('[uploadFile] storage ok, progress 50');
    setProgress(50);

    const { data: urlData } = supabase.storage.from('user-files').getPublicUrl(storagePath);
    const publicUrl = urlData.publicUrl;
    console.log('[uploadFile] publicUrl', publicUrl);

    setProgress(75);

    const now = new Date().toISOString();

    console.log('[uploadFile] inserting into items table');
    const { data: item, error: itemError } = await supabase
      .from('items')
      .insert({
        user_id: user.id,
        type: 'file',
        title: file.name,
        is_read: false,
        is_favorite: false,
        visibility: 'private',
        created_at: now,
        updated_at: now,
      })
      .select('id')
      .single();

    if (itemError || !item) {
      console.log('[uploadFile] items insert error', itemError);
      setLoading(false);
      const message = 'El archivo se subió pero no se pudo crear el item';
      setError(message);
      onError?.(message);
      return;
    }

    console.log('[uploadFile] items insert ok', item.id);

    console.log('[uploadFile] inserting into files table');
    const { error: dbError } = await supabase
      .from('files')
      .insert({
        id: item.id,
        storage_path: storagePath,
        file_name: file.name,
        content_type: file.type,
        size_bytes: file.size,
      });

    if (dbError) {
      console.log('[uploadFile] files insert error', dbError);
      setLoading(false);
      const message = 'El archivo se subió pero no se pudo registrar en la base de datos';
      setError(message);
      onError?.(message);
      return;
    }

    console.log('[uploadFile] files insert ok');

    console.log('[uploadFile] inserting into links table');
    const { error: linkError } = await supabase
      .from('links')
      .insert({
        id: item.id,
        url: publicUrl,
        domain: null,
      });

    setLoading(false);

    if (linkError) {
      console.log('[uploadFile] links insert error', linkError);
      const message = 'El archivo se subió pero no se pudo añadir al feed';
      setError(message);
      onError?.(message);
      return;
    }

    console.log('[uploadFile] all done, calling onSuccess');
    setProgress(100);

    onSuccess?.({
      id: item.id,
      storage_path: storagePath,
      file_name: file.name,
      content_type: file.type,
      size_bytes: file.size,
      public_url: publicUrl,
    });
  }

  return {
    uploadFile,
    loading,
    progress,
    error,
  };
}
