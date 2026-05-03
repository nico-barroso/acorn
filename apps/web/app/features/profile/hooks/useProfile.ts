import { useCallback, useEffect, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase'

export type ProfileData = {
  userId: string
  displayName: string
  email: string
  avatarUrl: string | null
}

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
        avatarUrl
      })
    } catch {
      setError('Ocurrio un error inesperado')
    } finally {
      setLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }, [])

  const deleteAccount = useCallback(async (): Promise<boolean> => {
    try {
      const supabase = getSupabaseBrowserClient()
      const { error: fnError } = await supabase.functions.invoke('delete-account', {
        method: 'POST'
      })

      if (fnError) {
        setError('No se pudo eliminar la cuenta')
        return false
      }

      await supabase.auth.signOut()
      window.location.href = '/login'
      return true
    } catch {
      setError('Ocurrio un error inesperado')
      return false
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return {
    profile,
    loading,
    error,
    signOut,
    deleteAccount,
    refetch: fetchProfile
  }
}