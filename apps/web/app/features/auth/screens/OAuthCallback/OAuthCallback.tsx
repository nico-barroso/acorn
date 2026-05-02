'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import { oauthCallbackStyles } from './OAuthCallback.styles'

export function OAuthCallback() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let active = true

    const completeOAuth = async () => {
      const supabase = getSupabaseBrowserClient()
      const query = new URLSearchParams(window.location.search)
      const authErrorDescription = query.get('error_description')
      const code = query.get('code')

      if (authErrorDescription) {
        if (!active) {
          return
        }
        setErrorMessage('Google devolvio un error al autenticar. Intentalo otra vez.')
        return
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
          if (!active) {
            return
          }
          setErrorMessage('No pudimos confirmar la sesion. Prueba de nuevo.')
          return
        }
      }

      const { data, error } = await supabase.auth.getUser()

      if (error || !data.user) {
        if (!active) {
          return
        }
        setErrorMessage('No se pudo abrir tu sesion. Vuelve al login.')
        return
      }

      router.replace('/home')
    }

    completeOAuth()

    return () => {
      active = false
    }
  }, [router])

  return (
    <main style={oauthCallbackStyles.page}>
      <section style={oauthCallbackStyles.card}>
        <h1 style={oauthCallbackStyles.title}>Completando acceso</h1>
        <p style={oauthCallbackStyles.text}>Estamos validando tu sesion con Google...</p>
        {errorMessage ? <p style={oauthCallbackStyles.error}>{errorMessage}</p> : null}
      </section>
    </main>
  )
}
