import { useState } from "react";
import { getSupabaseBrowserClient } from "../lib/supabase";

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
    const supabase = getSupabaseBrowserClient();
    const newIsRead = !currentIsRead;

    const { error: dbError } = await (supabase as any)
      .from("items")
      .update({
        is_read: newIsRead,
        updated_at: new Date().toISOString(),
      })
      .eq("id", itemId);

    setLoading(false);

    if (dbError) {
      const message = "No se pudo actualizar el estado de lectura";
      setError(message);
      onError?.(message);
      return;
    }

    onSuccess?.(newIsRead);
  }

  return {
    toggleRead,
    loading,
    error,
  };
}
