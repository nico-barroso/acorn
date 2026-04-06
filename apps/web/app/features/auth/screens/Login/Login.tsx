'use client'

import { useState } from 'react'
import { getSupabaseBrowserClient } from '../../../../lib/supabase'
import { AuthShell } from '../../components/AuthShell/AuthShell'
import { GoogleOAuthButton } from '../../components/GoogleOAuthButton/GoogleOAuthButton'
import { loginStyles } from './Login.styles'

export function Login() {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleGoogleOAuth = async () => {
    setLoading(true)
    setErrorMessage('')
    const supabase = getSupabaseBrowserClient()

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      setLoading(false)
      setErrorMessage('No se pudo iniciar con Google. Intentalo de nuevo.')
    }
  }

  return (
    <AuthShell
      badge='Acceso'
      title='Bienvenida de nuevo'
      subtitle='Inicia sesion con Google para entrar en tu espacio privado de Acorn.'
      footerLabel='No tienes cuenta?'
      footerLinkHref='/register'
      footerLinkLabel='Registrate'
      errorMessage={errorMessage}
    >
      <GoogleOAuthButton loading={loading} onClick={handleGoogleOAuth} />
      <p style={loginStyles.helperText}>Usamos OAuth seguro de Google con Supabase Auth.</p>
    </AuthShell>
  )
}
