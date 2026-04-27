'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import { AuthShell } from '../../components/AuthShell/AuthShell'
import { GoogleOAuthButton } from '../../components/GoogleOAuthButton/GoogleOAuthButton'
import { loginStyles } from './Login.styles'

export function Login() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [sessionLoading, setSessionLoading] = useState(true)
  const [emailLoginLoading, setEmailLoginLoading] = useState(false)
  const [googleLoginLoading, setGoogleLoginLoading] = useState(false)

  const isAnyLoading = sessionLoading || emailLoginLoading || googleLoginLoading

  useEffect(() => {
    let active = true
    const supabase = getSupabaseBrowserClient()

    // Log the error if we are redirected here with one
    const params = new URLSearchParams(window.location.search)
    const urlError = params.get('error')
    if (urlError === 'oauth_exchange_failed') {
      setErrorMessage('Error al verificar la conexión con Google. Por favor, inténtalo de nuevo.')
      // Clear the url so we don't keep showing it on refresh
      window.history.replaceState(null, '', '/login')
    }

    const checkSession = async () => {
      // Validate session against Supabase servers instead of trusting local token
      const { data, error } = await supabase.auth.getUser()

      if (!active) return

      if (!error && data.user) {
        // Stop the session loading indicator immediately
        setSessionLoading(false)
        router.replace('/home')
        return
      }

      // If there's an invalid session stuck in cookies, clear it
      if (error) {
        await supabase.auth.signOut()
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
      setEmailError('Introduce un email válido.')
      valid = false
    }

    if (!password) {
      setPasswordError('La contraseña es obligatoria.')
      valid = false
    }

    return valid
  }

  const handleEmailPasswordLogin = async () => {
    if (!validateCredentials()) return

    setEmailLoginLoading(true)
    setErrorMessage('')

    try {
      const supabase = getSupabaseBrowserClient()

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      })

      if (error) {
        setErrorMessage('Credenciales inválidas o cuenta no disponible. Inténtalo de nuevo.')
      }
    } finally {
      setEmailLoginLoading(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await handleEmailPasswordLogin()
  }

  const handleGoogleOAuth = async () => {
    setGoogleLoginLoading(true)
    setErrorMessage('')

    try {
      const supabase = getSupabaseBrowserClient()

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/callback`
        }
      })

      if (error) {
        setErrorMessage('No se pudo iniciar sesión con Google. Inténtalo de nuevo.')
        setGoogleLoginLoading(false)
      }
    } catch {
      setErrorMessage('No se pudo iniciar sesión con Google. Inténtalo de nuevo.')
      setGoogleLoginLoading(false)
    }
  }

  if (sessionLoading) {
    return (
      <AuthShell
        badge='Acceso'
        title='Bienvenida de nuevo'
        subtitle='Comprobando tu sesión...'
        footerLabel='¿No tienes cuenta?'
        footerLinkHref='/register'
        footerLinkLabel='Regístrate'
      >
        <p style={loginStyles.helperText}>Un momento, estamos verificando tu acceso.</p>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      badge='Acceso'
      title='Bienvenida de nuevo'
      subtitle='Inicia sesión con email y contraseña o continúa con Google.'
      footerLabel='¿No tienes cuenta?'
      footerLinkHref='/register'
      footerLinkLabel='Regístrate'
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
            disabled={isAnyLoading}
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
            Contraseña
          </label>
          <input
            id='login-password'
            type='password'
            placeholder='Tu contraseña'
            value={password}
            autoComplete='current-password'
            disabled={isAnyLoading}
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
          disabled={isAnyLoading}
          style={{
            ...loginStyles.submitButton,
            ...(isAnyLoading ? loginStyles.submitButtonDisabled : {})
          }}
        >
          {emailLoginLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </form>

      <div style={loginStyles.dividerRow}>
        <span style={loginStyles.dividerLine} />
        <p style={loginStyles.dividerText}>o</p>
        <span style={loginStyles.dividerLine} />
      </div>

      <GoogleOAuthButton loading={googleLoginLoading} onClick={handleGoogleOAuth} />

      {!isAnyLoading ? (
        <Link href='/forgot-password' style={loginStyles.forgotLink}>
          ¿Has olvidado tu contraseña?
        </Link>
      ) : null}

      <p style={loginStyles.helperText}>
        Gestionamos la sesión con Supabase Auth y redirigimos automáticamente al Home tras iniciar sesión.
      </p>
    </AuthShell>
  )
}
