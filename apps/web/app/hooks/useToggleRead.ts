import { useCallback } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export function useToggleRead() {
  const toggleRead = useCallback(async (itemId: string, currentIsRead: boolean): Promise<boolean> => {
    const newIsRead = !currentIsRead

    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase
      .from('items')
      .update({ is_read: newIsRead, updated_at: new Date().toISOString() })
      .eq('id', itemId)

    if (error) {
      return false
    }

    return true
  }, [])

  return { toggleRead }
}