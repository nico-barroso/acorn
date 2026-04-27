import { useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase'

type DeleteFileOptions = {
  onSuccess?: () => void
  onError?: (message: string) => void
}

export function useDeleteFile({ onSuccess, onError }: DeleteFileOptions = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function deleteFile(fileId: string, storagePath: string) {
    setLoading(true)
    setError(null)
    const supabase = getSupabaseBrowserClient()

    //Eliminar el archivo del Storage
    const { error: storageError } = await supabase.storage
      .from('user-files')
      .remove([storagePath])

    if (storageError) {
      const message = 'No se pudo eliminar el archivo del storage'
      setError(message)
      setLoading(false)
      onError?.(message)
      return
    }

    //Eliminar el registro de la base de datos
    const { error: dbError } = await (supabase
      .from('files') as any)
      .delete()
      .eq('id', fileId)

    setLoading(false)

    if (dbError) {
      const message =
        'El archivo se eliminó del storage pero no de la base de datos'
      setError(message)
      onError?.(message)
      return
    }

    onSuccess?.()
  }

  return {
    deleteFile,
    loading,
    error
  }
}
