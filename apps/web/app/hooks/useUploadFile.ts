import { useState } from 'react'
import { supabase } from '../lib/supabase'

type UploadedFile = {
  id: string
  storage_path: string
  file_name: string
  content_type: string
  size_bytes: number
  public_url: string
}

type UploadFileOptions = {
  onSuccess?: (file: UploadedFile) => void
  onError?: (message: string) => void
}

export function useUploadFile({ onSuccess, onError }: UploadFileOptions = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  async function uploadFile(file: {
    File: string
    name: string
    type: string
    size: number
  }) {
    setLoading(true)
    setError(null)
    setProgress(0)

    //Obtenemos el usuario actual para organizar los archivos por usuario
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      const message = 'Debes estar autenticado para subir archivos'
      setError(message)
      setLoading(false)
      onError?.(message)
      return
    }

    // Generamos una ruta única para evitar colisiones entre archivos con el mismo nombre
    const timestamp = Date.now()
    const storagePath = `${user.id}/${timestamp}_${file.name}`

    //Subir el archivo al bucket
    const { error: uploadError } = await supabase.storage
      .from('user-files')
      .upload(
        storagePath,
        {
          uri: file.File,
          name: file.name,
          type: file.type
        } as unknown as File,
        {
          contentType: file.type,
          upsert: false
        }
      )

    if (uploadError) {
      const message = 'No se pudo subir el archivo'
      setError(message)
      setLoading(false)
      onError?.(message)
      return
    }

    setProgress(50)

    //Obtener la URL pública del archivo subido
    const { data: urlData } = supabase.storage
      .from('user-files')
      .getPublicUrl(storagePath)

    const publicUrl = urlData.publicUrl

    setProgress(75)

    //Registrar el archivo en la tabla files
    const { data: fileRecord, error: dbError } = await supabase
      .from('files')
      .insert({
        storage_path: storagePath,
        file_name: file.name,
        content_type: file.type,
        size_bytes: file.size
      })
      .select() // devuelve el registro creado con su id generado
      .single()

    setLoading(false)

    if (dbError) {
      const message =
        'El archivo se subió pero no se pudo registrar en la base de datos'
      setError(message)
      onError?.(message)
      return
    }

    setProgress(100)

    //Devuelve el archivo completo con su URL pública
    onSuccess?.({
      id: fileRecord.id,
      storage_path: storagePath,
      file_name: file.name,
      content_type: file.type,
      size_bytes: file.size,
      public_url: publicUrl
    })
  }

  return {
    uploadFile,
    loading,
    progress,
    error
  }
}
