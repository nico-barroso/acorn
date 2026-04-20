'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '../../../../lib/supabase'
import { AuthShell } from '../../components/AuthShell/AuthShell'
import { resetPasswordStyles } from './ResetPassword.styles'

function parseParamsFromUrl(url: string) {
  const [baseUrl, hash] = url.split('#')
  const searchParams = new URL(baseUrl).searchParams

  if (!hash) {
    return searchParams
  }

  const hashParams = new URLSearchParams(hash)
  hashParams.forEach((value, key) => {
    searchParams.set(key, value)
  })

  return searchParams
}

export function ResetPassword() {
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    let active = true

    const initializeRecoverySession = async () => {
      const supabase = getSupabaseBrowserClient()
      const params = parseParamsFromUrl(window.location.href)
      const code = params.get('code')
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          if (active) {
            setErrorMessage('El enlace de recuperacion no es valido o ha expirado.')
            setInitializing(false)
          }
          return
        }
      } else if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        })
        if (error) {
          if (active) {
            setErrorMessage('No se pudo validar el enlace de recuperacion.')
            setInitializing(false)
          }
          return
        }
      }

      const { data, error } = await supabase.auth.getSession()
      if ((error || !data.session) && active) {
        setErrorMessage('No hay una sesion de recuperacion activa. Solicita un nuevo enlace.')
      }

      if (active) {
        setInitializing(false)
      }
    }

    initializeRecoverySession()

    return () => {
      active = false
    }
  }, [])

  const validateForm = () => {
    let valid = true
    setPasswordError('')
    setConfirmPasswordError('')

    if (password.length < 8) {
      setPasswordError('La contrasena debe tener al menos 8 caracteres.')
      valid = false
    }

    if (confirmPassword !== password) {
      setConfirmPasswordError('Las contrasenas no coinciden.')
      valid = false
    }

    return valid
  }

  const handleUpdatePassword = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.auth.updateUser({ password })

    setLoading(false)

    if (error) {
      setErrorMessage('No se pudo actualizar la contrasena. Intentalo de nuevo.')
      return
    }

    setSuccessMessage('Contrasena actualizada correctamente. Te redirigimos al login...')
    window.setTimeout(() => {
      router.replace('/login')
    }, 1400)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await handleUpdatePassword()
  }

  return (
    <AuthShell
      badge='Nueva contrasena'
      title='Define una nueva contrasena'
      subtitle='Este paso finaliza la recuperacion de acceso a tu cuenta.'
      footerLabel='Necesitas otro enlace?'
      footerLinkHref='/forgot-password'
      footerLinkLabel='Solicitar de nuevo'
      errorMessage={errorMessage}
    >
      <form style={resetPasswordStyles.fieldGroup} onSubmit={handleSubmit}>
        <div style={resetPasswordStyles.fieldGroup}>
          <label htmlFor='reset-password' style={resetPasswordStyles.label}>
            Nueva contrasena
          </label>
          <input
            id='reset-password'
            type='password'
            placeholder='Nueva contrasena'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete='new-password'
            disabled={initializing || loading}
            aria-invalid={Boolean(passwordError)}
            aria-describedby={passwordError ? 'reset-password-error' : undefined}
            style={{
              ...resetPasswordStyles.input,
              ...(passwordError ? resetPasswordStyles.inputError : {})
            }}
          />
          {passwordError ? (
            <p id='reset-password-error' style={resetPasswordStyles.fieldError} role='alert'>
              {passwordError}
            </p>
          ) : null}
        </div>

        <div style={resetPasswordStyles.fieldGroup}>
          <label htmlFor='reset-password-confirm' style={resetPasswordStyles.label}>
            Confirmar contrasena
          </label>
          <input
            id='reset-password-confirm'
            type='password'
            placeholder='Confirmar contrasena'
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete='new-password'
            disabled={initializing || loading}
            aria-invalid={Boolean(confirmPasswordError)}
            aria-describedby={confirmPasswordError ? 'reset-password-confirm-error' : undefined}
            style={{
              ...resetPasswordStyles.input,
              ...(confirmPasswordError ? resetPasswordStyles.inputError : {})
            }}
          />
          {confirmPasswordError ? (
            <p id='reset-password-confirm-error' style={resetPasswordStyles.fieldError} role='alert'>
              {confirmPasswordError}
            </p>
          ) : null}
        </div>

        <button
          type='submit'
          disabled={initializing || loading}
          style={{
            ...resetPasswordStyles.submitButton,
            ...(initializing || loading ? resetPasswordStyles.submitButtonDisabled : {})
          }}
        >
          {initializing
            ? 'Validando enlace...'
            : loading
              ? 'Guardando nueva contrasena...'
              : 'Guardar nueva contrasena'}
        </button>
      </form>

      {successMessage ? <p style={resetPasswordStyles.successText}>{successMessage}</p> : null}

      <p style={resetPasswordStyles.helperText}>
        Si el enlace ha expirado, vuelve a solicitar uno nuevo desde la pantalla de recuperacion.
      </p>
    </AuthShell>
  )
}
