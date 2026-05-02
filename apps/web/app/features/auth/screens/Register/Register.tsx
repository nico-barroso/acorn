'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import { AuthShell } from '../../components/AuthShell/AuthShell'
import { GoogleOAuthButton } from '../../components/GoogleOAuthButton/GoogleOAuthButton'
import { registerStyles } from './Register.styles'

export function Register() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [sessionLoading, setSessionLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    let active = true
    const supabase = getSupabaseBrowserClient()

    const checkSession = async () => {
      const { data, error } = await supabase.auth.getUser()

      if (!active) {
        return
      }

      if (!error && data.user) {
        router.replace('/home')
        return
      }

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

  const validateForm = () => {
    let valid = true
    const normalizedEmail = email.trim()

    setEmailError('')
    setPasswordError('')
    setConfirmPasswordError('')

    if (!normalizedEmail) {
      setEmailError('El email es obligatorio.')
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
      setEmailError('Introduce un email válido.')
      valid = false
    }

    if (password.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres.')
      valid = false
    }

    if (confirmPassword !== password) {
      setConfirmPasswordError('Las contraseñas no coinciden.')
      valid = false
    }

    return valid
  }

  const handleEmailPasswordSignUp = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/callback`
      }
    })

    setLoading(false)

    if (error) {
      setErrorMessage('No se pudo completar el registro. Revisa los datos e inténtalo de nuevo.')
      return
    }

    if (data.session) {
      router.replace('/home')
      return
    }

    setSuccessMessage('Cuenta creada. Revisa tu correo para confirmar y después inicia sesión.')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await handleEmailPasswordSignUp()
  }

  const handleGoogleOAuth = async () => {
    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')
    const supabase = getSupabaseBrowserClient()

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/callback`
      }
    })

    if (error) {
      setLoading(false)
      setErrorMessage('No se pudo completar el registro con Google. Inténtalo otra vez.')
    }
  }

  if (sessionLoading) {
    return (
      <AuthShell
        title='Crea tu cuenta'
        subtitle='Comprobando tu sesión...'
        footerLabel='¿Ya tienes cuenta?'
        footerLinkHref='/login'
        footerLinkLabel='Iniciar sesión'
      >
        <p>Un momento, estamos preparando el alta.</p>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title='Crea tu cuenta'
      subtitle='Regístrate con email y contraseña o continúa con Google.'
      footerLabel='¿Ya tienes cuenta?'
      footerLinkHref='/login'
      footerLinkLabel='Iniciar sesión'
      errorMessage={errorMessage}
    >
      <form style={registerStyles.form} onSubmit={handleSubmit}>
        <div style={registerStyles.fieldGroup}>
          <label htmlFor='register-email' style={registerStyles.label}>
            Correo electrónico
          </label>
          <input
            id='register-email'
            type='email'
            placeholder='tu@email.com'
            value={email}
            autoComplete='email'
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailError ? 'register-email-error' : undefined}
            style={{
              ...registerStyles.input,
              ...(emailError ? registerStyles.inputError : {})
            }}
          />
          {emailError ? (
            <p id='register-email-error' style={registerStyles.fieldError} role='alert'>
              {emailError}
            </p>
          ) : null}
        </div>

        <div style={registerStyles.fieldGroup}>
          <label htmlFor='register-password' style={registerStyles.label}>
            Contraseña
          </label>
          <input
            id='register-password'
            type='password'
            placeholder='Mínimo 8 caracteres'
            value={password}
            autoComplete='new-password'
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={Boolean(passwordError)}
            aria-describedby={passwordError ? 'register-password-error' : undefined}
            style={{
              ...registerStyles.input,
              ...(passwordError ? registerStyles.inputError : {})
            }}
          />
          {passwordError ? (
            <p id='register-password-error' style={registerStyles.fieldError} role='alert'>
              {passwordError}
            </p>
          ) : null}
        </div>

        <div style={registerStyles.fieldGroup}>
          <label htmlFor='register-password-confirm' style={registerStyles.label}>
            Confirmar contraseña
          </label>
          <input
            id='register-password-confirm'
            type='password'
            placeholder='Repite tu contraseña'
            value={confirmPassword}
            autoComplete='new-password'
            onChange={(event) => setConfirmPassword(event.target.value)}
            aria-invalid={Boolean(confirmPasswordError)}
            aria-describedby={confirmPasswordError ? 'register-password-confirm-error' : undefined}
            style={{
              ...registerStyles.input,
              ...(confirmPasswordError ? registerStyles.inputError : {})
            }}
          />
          {confirmPasswordError ? (
            <p id='register-password-confirm-error' style={registerStyles.fieldError} role='alert'>
              {confirmPasswordError}
            </p>
          ) : null}
        </div>

        <button
          type='submit'
          disabled={loading}
          style={{
            ...registerStyles.submitButton,
            ...(loading ? registerStyles.submitButtonDisabled : {})
          }}
        >
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>

      {successMessage ? (
        <p style={registerStyles.successText}>{successMessage}</p>
      ) : null}

      <div style={registerStyles.dividerRow}>
        <span style={registerStyles.dividerLine} />
        <p style={registerStyles.dividerText}>o continúa con</p>
        <span style={registerStyles.dividerLine} />
      </div>

      <GoogleOAuthButton loading={loading} onClick={handleGoogleOAuth} />
    </AuthShell>
  )
}
