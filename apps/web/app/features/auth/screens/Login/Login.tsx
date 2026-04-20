'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '../../../../lib/supabase'
import { AuthShell } from '../../components/AuthShell/AuthShell'
import { GoogleOAuthButton } from '../../components/GoogleOAuthButton/GoogleOAuthButton'
import { loginStyles } from './Login.styles'

export function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [sessionLoading, setSessionLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let active = true
    const supabase = getSupabaseBrowserClient()

    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (!active) {
        return
      }

      if (!error && data.session) {
        router.replace('/home')
        return
      }

      setSessionLoading(false)
    }

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.replace('/home')
      }
    })

    checkSession()

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [router])

  const validateCredentials = () => {
    let valid = true
    const normalizedEmail = email.trim()

    setEmailError('')
    setPasswordError('')

    if (!normalizedEmail) {
      setEmailError('El email es obligatorio.')
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
      setEmailError('Introduce un email valido.')
      valid = false
    }

    if (!password) {
      setPasswordError('La contrasena es obligatoria.')
      valid = false
    }

    return valid
  }

  const handleEmailPasswordLogin = async () => {
    if (!validateCredentials()) {
      return
    }

    setLoading(true)
    setErrorMessage('')

    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    })

    setLoading(false)

    if (error) {
      setErrorMessage('Credenciales invalidas o cuenta no disponible. Intentalo de nuevo.')
      return
    }

    router.replace('/home')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await handleEmailPasswordLogin()
  }

  const handleGoogleOAuth = async () => {
    setLoading(true)
    setErrorMessage('')
    const supabase = getSupabaseBrowserClient()

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/callback`
      }
    })

    if (error) {
      setLoading(false)
      setErrorMessage('No se pudo iniciar con Google. Intentalo de nuevo.')
    }
  }

  if (sessionLoading) {
    return (
      <AuthShell
        badge='Acceso'
        title='Bienvenida de nuevo'
        subtitle='Comprobando tu sesion...'
        footerLabel='No tienes cuenta?'
        footerLinkHref='/register'
        footerLinkLabel='Registrate'
      >
        <p style={loginStyles.helperText}>Un momento, estamos verificando tu acceso.</p>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      badge='Acceso'
      title='Bienvenida de nuevo'
      subtitle='Inicia sesion con email y contrasena o continua con Google.'
      footerLabel='No tienes cuenta?'
      footerLinkHref='/register'
      footerLinkLabel='Registrate'
      errorMessage={errorMessage}
    >
      <form style={loginStyles.fieldGroup} onSubmit={handleSubmit}>
        <div style={loginStyles.fieldGroup}>
          <label htmlFor='login-email' style={loginStyles.label}>
            Email
          </label>
          <input
            id='login-email'
            type='email'
            placeholder='tu@email.com'
            value={email}
            autoComplete='email'
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailError ? 'login-email-error' : undefined}
            style={{
              ...loginStyles.input,
              ...(emailError ? loginStyles.inputError : {})
            }}
          />
          {emailError ? (
            <p id='login-email-error' style={loginStyles.fieldError} role='alert'>
              {emailError}
            </p>
          ) : null}
        </div>

        <div style={loginStyles.fieldGroup}>
          <label htmlFor='login-password' style={loginStyles.label}>
            Contrasena
          </label>
          <input
            id='login-password'
            type='password'
            placeholder='Tu contrasena'
            value={password}
            autoComplete='current-password'
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={Boolean(passwordError)}
            aria-describedby={passwordError ? 'login-password-error' : undefined}
            style={{
              ...loginStyles.input,
              ...(passwordError ? loginStyles.inputError : {})
            }}
          />
          {passwordError ? (
            <p id='login-password-error' style={loginStyles.fieldError} role='alert'>
              {passwordError}
            </p>
          ) : null}
        </div>

        <button
          type='submit'
          disabled={loading}
          style={{
            ...loginStyles.submitButton,
            ...(loading ? loginStyles.submitButtonDisabled : {})
          }}
        >
          {loading ? 'Iniciando sesion...' : 'Iniciar sesion'}
        </button>
      </form>

      <div style={loginStyles.dividerRow}>
        <span style={loginStyles.dividerLine} />
        <p style={loginStyles.dividerText}>o</p>
        <span style={loginStyles.dividerLine} />
      </div>

      <GoogleOAuthButton loading={loading} onClick={handleGoogleOAuth} />
      <Link href='/forgot-password' style={loginStyles.forgotLink}>
        Has olvidado tu contrasena?
      </Link>
      <p style={loginStyles.helperText}>
        Gestionamos la sesion con Supabase Auth y redirigimos automaticamente al Home tras iniciar.
      </p>
    </AuthShell>
  )
}
