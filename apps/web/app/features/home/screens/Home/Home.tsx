'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '../../../../lib/supabase'
import { homeStyles } from './Home.styles'

export function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')

  useEffect(() => {
    let active = true

    const loadUser = async () => {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase.auth.getUser()

      if (!active) {
        return
      }

      if (error || !data.user) {
        router.replace('/login')
        return
      }

      setEmail(data.user.email ?? 'usuario')
      setLoading(false)
    }

    loadUser()

    return () => {
      active = false
    }
  }, [router])

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.replace('/login')
  }

  if (loading) {
    return (
      <main style={homeStyles.page}>
        <p style={homeStyles.loading}>Cargando tu espacio privado...</p>
      </main>
    )
  }

  return (
    <main style={homeStyles.page}>
      <section style={homeStyles.card}>
        <h1 style={homeStyles.title}>Sesion iniciada correctamente</h1>
        <p style={homeStyles.text}>Bienvenida, {email}. Ya estas dentro de tu espacio privado.</p>
        <button type='button' style={homeStyles.button} onClick={handleSignOut}>
          Cerrar sesion
        </button>
      </section>
    </main>
  )
}
