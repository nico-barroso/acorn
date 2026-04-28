import { useCallback, useEffect, useRef, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase'

export type EditProfileData = {
  userId: string
  displayName: string
  email: string
  avatarUrl: string | null
  avatarStoragePath: string | null
}

export type EditProfileResult = {
  profile: EditProfileData | null
  loading: boolean
  saving: boolean
  error: string
  success: boolean
  avatarPreview: string | null
  save: (displayName: string, file?: File | null) => Promise<boolean>
  removeAvatar: () => Promise<boolean>
  setPreviewFromFile: (file: File) => void
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 2 * 1024 * 1024

export function useEditProfile(): EditProfileResult {
  const [profile, setProfile] = useState<EditProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const revokeRef = useRef<string | null>(null)

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const supabase = getSupabaseBrowserClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        setError('No se pudo verificar tu sesion')
        setLoading(false)
        return
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', user.id)
        .single()

      let avatarUrl: string | null = null

      if (profileData?.avatar_url) {
        const { data: signedData } = await supabase.storage
          .from('user-files')
          .createSignedUrl(profileData.avatar_url, 3600)
        avatarUrl = signedData?.signedUrl || null
      }

      if (profileError && profileError.code !== 'PGRST116') {
        setError('No se pudo cargar tu perfil')
      }

      setProfile({
        userId: user.id,
        displayName: profileData?.display_name || user.email?.split('@')[0] || 'Usuario',
        email: user.email ?? '',
        avatarUrl,
        avatarStoragePath: profileData?.avatar_url || null
      })
      setAvatarPreview(avatarUrl)
    } catch {
      setError('Ocurrio un error inesperado')
    } finally {
      setLoading(false)
    }
  }, [])

  const save = useCallback(async (displayName: string, file?: File | null): Promise<boolean> => {
    if (!profile) return false

    setSaving(true)
    setError('')
    setSuccess(false)

    try {
      const supabase = getSupabaseBrowserClient()

      let avatarStoragePath = profile.avatarStoragePath

      if (file) {
        if (!ALLOWED_TYPES.includes(file.type)) {
          setError('Formato no soportado. Usa JPG, PNG, WEBP o GIF.')
          setSaving(false)
          return false
        }
        if (file.size > MAX_SIZE) {
          setError('La imagen no puede superar 2 MB.')
          setSaving(false)
          return false
        }

        const ext = file.name.split('.').pop() || 'jpg'
        const filePath = `${profile.userId}/avatar_${Date.now()}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('user-files')
          .upload(filePath, file, { upsert: false, contentType: file.type })

        if (uploadError) {
          setError('No se pudo subir la imagen. Intentalo de nuevo.')
          setSaving(false)
          return false
        }

        if (profile.avatarStoragePath) {
          await supabase.storage
            .from('user-files')
            .remove([profile.avatarStoragePath])
        }

        avatarStoragePath = filePath
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ display_name: displayName, avatar_url: avatarStoragePath })
        .eq('id', profile.userId)

      if (updateError) {
        setError('No se pudo guardar el perfil. Intentalo de nuevo.')
        setSaving(false)
        return false
      }

      let newAvatarUrl: string | null = null
      if (avatarStoragePath) {
        const { data: signedData } = await supabase.storage
          .from('user-files')
          .createSignedUrl(avatarStoragePath, 3600)
        newAvatarUrl = signedData?.signedUrl || null
      }

      setProfile(prev => prev ? {
        ...prev,
        displayName,
        avatarUrl: newAvatarUrl,
        avatarStoragePath
      } : prev)

      if (revokeRef.current) {
        URL.revokeObjectURL(revokeRef.current)
        revokeRef.current = null
      }
      setAvatarPreview(newAvatarUrl)
      setSuccess(true)
      return true
    } catch {
      setError('Ocurrio un error inesperado')
      return false
    } finally {
      setSaving(false)
    }
  }, [profile])

  const removeAvatar = useCallback(async (): Promise<boolean> => {
    if (!profile || !profile.avatarStoragePath) return false

    setSaving(true)
    setError('')

    try {
      const supabase = getSupabaseBrowserClient()

      await supabase.storage
        .from('user-files')
        .remove([profile.avatarStoragePath])

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', profile.userId)

      if (updateError) {
        setError('No se pudo eliminar la imagen.')
        setSaving(false)
        return false
      }

      setProfile(prev => prev ? { ...prev, avatarUrl: null, avatarStoragePath: null } : prev)
      setAvatarPreview(null)
      return true
    } catch {
      setError('Ocurrio un error inesperado')
      return false
    } finally {
      setSaving(false)
    }
  }, [profile])

  const setPreviewFromFile = useCallback((file: File) => {
    if (revokeRef.current) {
      URL.revokeObjectURL(revokeRef.current)
    }
    const url = URL.createObjectURL(file)
    revokeRef.current = url
    setAvatarPreview(url)
  }, [])

  useEffect(() => {
    fetchProfile()
    return () => {
      if (revokeRef.current) {
        URL.revokeObjectURL(revokeRef.current)
      }
    }
  }, [fetchProfile])

  return {
    profile,
    loading,
    saving,
    error,
    success,
    avatarPreview,
    save,
    removeAvatar,
    setPreviewFromFile
  }
}