import { useState } from 'react';
import { supabase } from '../lib/supabase';

type ToggleReadOptions = {
  onSuccess?: (isRead: boolean) => void;
  onError?: (message: string) => void;
};

export function useToggleRead({ onSuccess, onError }: ToggleReadOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggleRead(itemId: string, currentIsRead: boolean) {
    setLoading(true);
    setError(null);

    const newIsRead = !currentIsRead; //Invertir el estado actual

    const { error: dbError } = await supabase
      .from('items')
      .update({
        is_read: newIsRead,
        updated_at: new Date().toISOString(), //Actualiza la fecha de modificación
      })
      .eq('id', itemId);

    setLoading(false);

    if (dbError) {
      const message = 'No se pudo actualizar el estado de lectura';
      setError(message);
      onError?.(message);
      return;
    }

    onSuccess?.(newIsRead); //Devuelve el nuevo estado para que se refleje
  }

  return {
    toggleRead,
    loading,
    error,
  };
}
