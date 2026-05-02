'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useProfile } from '../../hooks/useProfile'
import { colors } from '@/theme/colors'
import { fonts } from '@/theme/fonts'
import { confirmModalStyles } from '../../components/ConfirmModal/ConfirmModal.styles'

const CONSEQUENCES = [
  'No podrás iniciar sesión una vez borrada tu cuenta.',
  'Tus enlaces guardados se perderán.',
  'De acuerdo al marco legal, tus datos serán eliminados en un plazo de 30 días.',
]

function getInitials(name: string, email: string): string {
  if (name && name !== 'Usuario') {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }
  const emailPart = email.split('@')[0] || ''
  if (emailPart.length >= 2) return emailPart.slice(0, 2).toUpperCase()
  return 'AC'
}

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
  content: {
    display: 'grid',
    placeItems: 'center',
    textAlign: 'center' as const,
    paddingTop: 'clamp(32px, 5vw, 48px)'
  } as React.CSSProperties,
  avatarWrapper: {
    position: 'relative' as const,
    width: '100px',
    height: '100px',
    marginBottom: '24px'
  } as React.CSSProperties,
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '999px',
    backgroundColor: `rgba(249, 111, 93, 0.12)`,
    border: `2.5px solid rgba(255,255,255,0.7)`,
    display: 'grid',
    placeItems: 'center',
    color: colors.salmon,
    fontFamily: fonts.family.primary,
    fontSize: '32px',
    fontWeight: fonts.weight.bold,
    overflow: 'hidden',
    boxShadow: '0 6px 24px rgba(67, 40, 28, 0.18)'
  } as React.CSSProperties,
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const
  } as React.CSSProperties,
  warningBadge: {
    position: 'absolute' as const,
    bottom: '2px',
    right: '2px',
    width: '28px',
    height: '28px',
    borderRadius: '999px',
    backgroundColor: '#8b2a1b',
    border: '2.5px solid #fff',
    display: 'grid',
    placeItems: 'center'
  } as React.CSSProperties,
  warningBadgeText: {
    color: '#fff',
    fontFamily: fonts.family.primary,
    fontSize: '14px',
    fontWeight: fonts.weight.bold,
    lineHeight: 1
  } as React.CSSProperties,
  title: {
    margin: '0 0 10px',
    color: colors.brown,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold,
    lineHeight: fonts.lineHeight.tight
  } as React.CSSProperties,
  subtitle: {
    margin: '0 0 28px',
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    lineHeight: fonts.lineHeight.comfortable
  } as React.CSSProperties,
  consequencesCard: {
    width: '100%',
    borderRadius: '16px',
    border: `1px solid #8b2a1b22`,
    backgroundColor: '#fdf3f1',
    padding: '16px 20px',
    marginBottom: '32px',
    textAlign: 'left' as const
  } as React.CSSProperties,
  consequencesTitle: {
    margin: '0 0 10px',
    color: '#8b2a1b',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold
  } as React.CSSProperties,
  consequenceItem: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-start',
    marginBottom: '6px'
  } as React.CSSProperties,
  bullet: {
    color: '#8b2a1b',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    flexShrink: 0,
    marginTop: '1px'
  } as React.CSSProperties,
  consequenceText: {
    margin: 0,
    color: '#8b2a1b',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    lineHeight: fonts.lineHeight.comfortable
  } as React.CSSProperties,
  deleteLink: {
    background: 'none',
    border: 'none',
    color: '#8b2a1b',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold,
    textDecoration: 'underline',
    cursor: 'pointer',
    padding: '4px 0'
  } as React.CSSProperties
}

export function DeleteAccountScreen() {
  const { profile, loading, deleteAccount } = useProfile()
  const [showModal, setShowModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const handleDelete = async () => {
    setDeleting(true)
    setDeleteError('')
    const ok = await deleteAccount()
    if (!ok) {
      setDeleteError('No se pudo eliminar la cuenta. Inténtalo de nuevo.')
      setDeleting(false)
    }
  }

  const displayName = loading ? '' : (profile?.displayName ?? 'Usuario')

  return (
    <main style={s.page}>
      <Link href="/profile" style={s.backLink}>← Volver al perfil</Link>

      <div style={s.content}>
        <div style={s.avatarWrapper}>
          <div style={s.avatar}>
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Avatar" style={s.avatarImage} />
            ) : loading ? null : (
              getInitials(displayName, profile?.email ?? '')
            )}
          </div>
          <div style={s.warningBadge}>
            <span style={s.warningBadgeText}>!</span>
          </div>
        </div>

        <h1 style={s.title}>
          No queremos verte marchar{displayName && displayName !== 'Usuario' ? `, ${displayName}` : ''}
        </h1>
        <p style={s.subtitle}>
          Lamentamos mucho que te quieras ir,<br />¿quieres borrar todos tus datos?
        </p>

        <div style={s.consequencesCard}>
          <p style={s.consequencesTitle}>Cosas que pasarán cuando elimines tu cuenta:</p>
          {CONSEQUENCES.map((item, i) => (
            <div key={i} style={{ ...s.consequenceItem, marginBottom: i < CONSEQUENCES.length - 1 ? '6px' : 0 }}>
              <span style={s.bullet}>•</span>
              <p style={s.consequenceText}>{item}</p>
            </div>
          ))}
        </div>

        <button type="button" onClick={() => setShowModal(true)} style={s.deleteLink}>
          Eliminar mi cuenta
        </button>
      </div>

      {showModal && (
        <div
          style={confirmModalStyles.overlay}
          onClick={(e) => { if (e.target === e.currentTarget && !deleting) setShowModal(false) }}
        >
          <div style={confirmModalStyles.modal}>
            <h2 style={confirmModalStyles.title}>¿Quieres eliminar tu cuenta?</h2>
            <p style={confirmModalStyles.message}>
              Esta acción es irreversible, perderás todos tus datos y contenido guardado.
            </p>
            {deleteError && (
              <p style={{ ...confirmModalStyles.message, color: '#8b2a1b', marginTop: '8px' }}>{deleteError}</p>
            )}
            <div style={confirmModalStyles.actionsRow}>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={confirmModalStyles.cancelButton}
                disabled={deleting}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                style={deleting ? { ...confirmModalStyles.dangerButton, opacity: 0.6, cursor: 'not-allowed' } : confirmModalStyles.dangerButton}
                disabled={deleting}
              >
                {deleting ? 'Eliminando...' : 'Eliminar cuenta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
