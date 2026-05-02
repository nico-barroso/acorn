'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import { colors } from '@/theme/colors'
import { fonts } from '@/theme/fonts'

const s = {
  page: {
    minHeight: '100%',
    width: '100%',
    maxWidth: '560px',
    margin: '0 auto',
    padding: 'clamp(10px, 2vw, 18px)'
  } as React.CSSProperties,
  backLink: {
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px'
  } as React.CSSProperties,
  title: {
    margin: '20px 0 4px',
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold
  } as React.CSSProperties,
  subtitle: {
    margin: '0 0 28px',
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm
  } as React.CSSProperties,
  form: {
    display: 'grid',
    gap: '18px',
    marginBottom: '28px'
  } as React.CSSProperties,
  fieldGroup: {
    display: 'grid',
    gap: '6px'
  } as React.CSSProperties,
  label: {
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold
  } as React.CSSProperties,
  input: {
    width: '100%',
    minHeight: '42px',
    padding: '10px 12px',
    borderRadius: '10px',
    border: `1px solid ${colors.brown}35`,
    backgroundColor: '#fff',
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
    outline: 'none',
    boxSizing: 'border-box' as const
  } as React.CSSProperties,
  actionsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px'
  } as React.CSSProperties,
  cancelButton: {
    padding: '12px',
    borderRadius: '12px',
    border: `1px solid ${colors.brown}20`,
    backgroundColor: '#fff',
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.medium,
    cursor: 'pointer'
  } as React.CSSProperties,
  saveButton: {
    padding: '12px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: colors.salmon,
    color: '#fff',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.semibold,
    cursor: 'pointer'
  } as React.CSSProperties,
  saveButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  } as React.CSSProperties,
  successCard: {
    borderRadius: '16px',
    border: `1px solid #2e7d3222`,
    backgroundColor: '#f0faf0',
    padding: '20px',
    display: 'grid',
    gap: '12px',
    textAlign: 'center' as const
  } as React.CSSProperties,
  successTitle: {
    margin: 0,
    color: '#2e7d32',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.lg,
    fontWeight: fonts.weight.bold
  } as React.CSSProperties,
  successText: {
    margin: 0,
    color: '#2e7d32',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm
  } as React.CSSProperties,
  errorText: {
    margin: '4px 0 0',
    color: '#8b2a1b',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs
  } as React.CSSProperties
}

export function ChangePasswordScreen() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    setSaving(true)
    setError('')
    try {
      const supabase = getSupabaseBrowserClient()
      const { error: supabaseError } = await supabase.auth.updateUser({ password: newPassword })
      if (supabaseError) {
        setError('No se pudo cambiar la contraseña. Inténtalo de nuevo.')
      } else {
        setSuccess(true)
      }
    } catch {
      setError('Ocurrió un error inesperado')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main style={s.page}>
      <Link href="/profile" style={s.backLink}>← Volver al perfil</Link>

      <h1 style={s.title}>Cambiar contraseña</h1>
      <p style={s.subtitle}>Introduce tu nueva contraseña. Debe tener al menos 8 caracteres.</p>

      {success ? (
        <div style={s.successCard}>
          <p style={s.successTitle}>¡Contraseña actualizada!</p>
          <p style={s.successText}>Tu contraseña ha sido cambiada correctamente.</p>
          <Link href="/profile" style={{ ...s.saveButton, textDecoration: 'none', textAlign: 'center', display: 'block', padding: '12px' }}>
            Volver al perfil
          </Link>
        </div>
      ) : (
        <>
          <div style={s.form}>
            <div style={s.fieldGroup}>
              <label style={s.label} htmlFor="new-password">Nueva contraseña</label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setError('') }}
                onFocus={(e) => { e.currentTarget.style.borderColor = `${colors.brown}80`; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(67,40,28,0.08)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = `${colors.brown}35`; e.currentTarget.style.boxShadow = 'none' }}
                placeholder="Mínimo 8 caracteres"
                disabled={saving}
                style={s.input}
              />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label} htmlFor="confirm-password">Confirmar contraseña</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError('') }}
                onFocus={(e) => { e.currentTarget.style.borderColor = `${colors.brown}80`; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(67,40,28,0.08)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = `${colors.brown}35`; e.currentTarget.style.boxShadow = 'none' }}
                placeholder="Repite la contraseña"
                disabled={saving}
                style={s.input}
              />
            </div>
            {error && <p style={s.errorText}>{error}</p>}
          </div>

          <div style={s.actionsRow}>
            <Link href="/profile" style={{ ...s.cancelButton, textDecoration: 'none', textAlign: 'center', display: 'grid', placeItems: 'center' }}>
              Cancelar
            </Link>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !newPassword}
              style={saving || !newPassword ? { ...s.saveButton, ...s.saveButtonDisabled } : s.saveButton}
            >
              {saving ? 'Guardando...' : 'Cambiar contraseña'}
            </button>
          </div>
        </>
      )}
    </main>
  )
}
