import { useState } from 'react'
import { supabase } from '../lib/supabase'

type LogoutOptions = {
  onSuccess?: () => void
  onError?: (message: string) => void
}

export function useLogout({ onSuccess, onError }: LogoutOptions = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogout() {
    setLoading(true)
    setError(null)

    const { error: logoutError } = await supabase.auth.signOut()
    //Invalida la sesión en los servidores de Supabase
    //Elimina el token guardado en AsyncStorage (móvil) o cookies (web)

    setLoading(false)

    if (logoutError) {
      const message = 'No se pudo cerrar la sesión'
      setError(message)
      onError?.(message)
      return
    }

    onSuccess?.()
  }

  return {
    handleLogout,
    loading,
    error
  }
}
