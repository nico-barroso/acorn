'use client'

import { useState } from 'react'
import { AuthShell } from '../../components/AuthShell/AuthShell'
import { getSupabaseBrowserClient } from '../../../../lib/supabase'
import { forgotPasswordStyles } from './ForgotPassword.styles'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const validateEmail = () => {
    const normalizedEmail = email.trim()
    if (!normalizedEmail) {
      setEmailError('El email es obligatorio.')
      return false
    }
    if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
      setEmailError('Introduce un email valido.')
      return false
    }

    setEmailError('')
    return true
  }

  const handleRequestReset = async () => {
    if (!validateEmail()) {
      return
    }

    setLoading(true)
    setErrorMessage('')
    setSent(false)

    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })

    setLoading(false)

    if (error) {
      setErrorMessage('No se pudo enviar el enlace. Intentalo de nuevo.')
      return
    }

    setSent(true)
  }

  return (
    <AuthShell
      badge='Recuperacion'
      title='Has olvidado tu contrasena?'
      subtitle='Te enviaremos un enlace para crear una nueva contrasena.'
      footerLabel='Quieres volver?'
      footerLinkHref='/login'
      footerLinkLabel='Iniciar sesion'
      errorMessage={errorMessage}
    >
      <input
        type='email'
        placeholder='tu@email.com'
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        style={{
          ...forgotPasswordStyles.input,
          ...(emailError ? forgotPasswordStyles.inputError : {})
        }}
      />

      {emailError ? <p style={forgotPasswordStyles.fieldError}>{emailError}</p> : null}

      <button
        type='button'
        onClick={handleRequestReset}
        disabled={loading}
        style={{
          ...forgotPasswordStyles.submitButton,
          ...(loading ? forgotPasswordStyles.submitButtonDisabled : {})
        }}
      >
        {loading ? 'Enviando enlace...' : 'Enviar enlace de recuperacion'}
      </button>

      {sent ? (
        <p style={forgotPasswordStyles.successText}>
          Revisa tu correo: hemos enviado el enlace para restablecer la contrasena.
        </p>
      ) : null}

      <p style={forgotPasswordStyles.helperText}>
        El enlace te llevara de vuelta a esta app para definir una nueva contrasena.
      </p>
    </AuthShell>
  )
}
