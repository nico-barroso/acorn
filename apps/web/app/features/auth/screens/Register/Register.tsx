'use client'

import { useState } from 'react'
import { getSupabaseBrowserClient } from '../../../../lib/supabase'
import { AuthShell } from '../../components/AuthShell/AuthShell'
import { GoogleOAuthButton } from '../../components/GoogleOAuthButton/GoogleOAuthButton'
import { registerStyles } from './Register.styles'

export function Register() {
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
      setErrorMessage('No se pudo completar el registro con Google. Intentalo otra vez.')
    }
  }

  return (
    <AuthShell
      badge='Registro'
      title='Crea tu cuenta en segundos'
      subtitle='Registrate con Google y empieza a guardar tus recursos de forma inteligente.'
      footerLabel='Ya tienes cuenta?'
      footerLinkHref='/login'
      footerLinkLabel='Iniciar sesion'
      errorMessage={errorMessage}
    >
      <GoogleOAuthButton loading={loading} onClick={handleGoogleOAuth} />
      <p style={registerStyles.helperText}>No pedimos contrasena manual en este flujo de alta.</p>
    </AuthShell>
  )
}
