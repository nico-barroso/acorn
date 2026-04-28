'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import { useProfile } from '../../hooks/useProfile'
import { confirmModalStyles } from '../../components/ConfirmModal/ConfirmModal.styles'
import { profileScreenStyles } from './ProfileScreen.styles'

type ModalType = 'signOut' | 'deleteAccount' | 'changePassword' | null

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

export function ProfileScreen() {
  const { profile, loading, error, signOut, deleteAccount } = useProfile()
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  const inputStyle = {
    width: '100%',
    minHeight: '42px',
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid #43281C35',
    backgroundColor: '#fff',
    color: '#43281C',
    fontFamily: 'CabinetGrotesk, Inter, -apple-system, sans-serif',
    fontSize: '14px',
    fontWeight: 500 as const,
    outline: 'none'
  }

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      setPasswordError('La contrasena debe tener al menos 8 caracteres')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Las contrasenas no coinciden')
      return
    }
    setPasswordSaving(true)
    setPasswordError('')
    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) {
        setPasswordError('No se pudo cambiar la contrasena. Intentalo de nuevo.')
      } else {
        setPasswordSuccess(true)
      }
    } catch {
      setPasswordError('Ocurrio un error inesperado')
    } finally {
      setPasswordSaving(false)
    }
  }

  if (loading) {
    return (
      <main style={profileScreenStyles.page}>
        <p style={profileScreenStyles.loading}>Cargando perfil...</p>
      </main>
    )
  }

  if (error || !profile) {
    return (
      <main style={profileScreenStyles.page}>
        <p style={profileScreenStyles.errorText}>{error || 'No se pudo cargar tu perfil'}</p>
      </main>
    )
  }

  const sections = [
    {
      id: 'my-profile',
      icon: '👤',
      iconStyle: profileScreenStyles.sectionIconUser,
      label: 'Mi perfil',
      onClick: undefined as (() => void) | undefined,
      href: '/profile/edit'
    },
    {
      id: 'change-password',
      icon: '🔒',
      iconStyle: profileScreenStyles.sectionIconPassword,
      label: 'Cambiar contrasena',
      onClick: () => { setNewPassword(''); setConfirmPassword(''); setPasswordError(''); setPasswordSuccess(false); setActiveModal('changePassword') }
    },
    {
      id: 'sign-out',
      icon: '→',
      iconStyle: profileScreenStyles.sectionIconLogout,
      label: 'Cerrar sesion',
      onClick: () => setActiveModal('signOut')
    },
    {
      id: 'delete-account',
      icon: '⚠',
      iconStyle: profileScreenStyles.sectionIconDanger,
      label: 'Eliminar cuenta',
      labelStyle: profileScreenStyles.sectionLabelDanger,
      onClick: () => setActiveModal('deleteAccount')
    }
  ]

  return (
    <main style={profileScreenStyles.page}>
      <header style={profileScreenStyles.header}>
        <div style={profileScreenStyles.avatarRow}>
          {profile.avatarUrl ? (
            <div style={profileScreenStyles.avatar}>
              <img src={profile.avatarUrl} alt='Avatar' style={profileScreenStyles.avatarImage} />
            </div>
          ) : (
            <div style={profileScreenStyles.avatar}>
              {getInitials(profile.displayName, profile.email)}
            </div>
          )}
          <div style={profileScreenStyles.nameSection}>
            <h1 style={profileScreenStyles.displayName}>{profile.displayName}</h1>
            <p style={profileScreenStyles.email}>{profile.email}</p>
          </div>
        </div>
      </header>

      <h2 style={profileScreenStyles.sectionTitle}>Cuenta</h2>
      <div style={profileScreenStyles.sectionCard}>
        {sections.map((section, index) => {
          const inner = (
            <>
              <div style={{ ...profileScreenStyles.sectionIcon, ...section.iconStyle }}>
                {section.icon}
              </div>
              <span style={{ ...profileScreenStyles.sectionLabel, ...(section.labelStyle || {}) }}>
                {section.label}
              </span>
              <span style={profileScreenStyles.sectionChevron}>›</span>
            </>
          )

          const style = {
            ...profileScreenStyles.sectionItem,
            ...(index < sections.length - 1 ? profileScreenStyles.sectionItemBorder : {})
          }

          if (section.href) {
            return (
              <Link key={section.id} href={section.href} style={{ ...style, textDecoration: 'none' }}>
                {inner}
              </Link>
            )
          }

          return (
            <button key={section.id} type='button' onClick={section.onClick} style={style}>
              {inner}
            </button>
          )
        })}
      </div>

      {activeModal === 'signOut' ? (
        <div style={confirmModalStyles.overlay} onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null) }}>
          <div style={confirmModalStyles.modal}>
            <h2 style={confirmModalStyles.title}>Cerrar sesion</h2>
            <p style={confirmModalStyles.message}>¿Estas seguro de que quieres cerrar sesion? Tendras que iniciar sesion de nuevo para acceder a tus recursos.</p>
            <div style={confirmModalStyles.actionsRow}>
              <button type='button' onClick={() => setActiveModal(null)} style={confirmModalStyles.cancelButton}>Cancelar</button>
              <button type='button' onClick={signOut} style={confirmModalStyles.dangerButton}>Cerrar sesion</button>
            </div>
          </div>
        </div>
      ) : null}

      {activeModal === 'deleteAccount' ? (
        <div style={confirmModalStyles.overlay} onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null) }}>
          <div style={confirmModalStyles.modal}>
            <h2 style={confirmModalStyles.title}>Eliminar cuenta</h2>
            <p style={confirmModalStyles.message}>Esta accion es irreversible. Se eliminaran todos tus recursos, carpetas y datos permanentemente. No podras recuperarlos.</p>
            <div style={confirmModalStyles.actionsRow}>
              <button type='button' onClick={() => setActiveModal(null)} style={confirmModalStyles.cancelButton}>Cancelar</button>
              <button type='button' onClick={deleteAccount} style={confirmModalStyles.dangerButton}>Eliminar cuenta</button>
            </div>
          </div>
        </div>
      ) : null}

      {activeModal === 'changePassword' ? (
        <div style={confirmModalStyles.overlay} onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null) }}>
          <div style={confirmModalStyles.modal}>
            <h2 style={confirmModalStyles.title}>Cambiar contrasena</h2>

            {passwordSuccess ? (
              <>
                <p style={{ ...confirmModalStyles.message, color: '#2e7d32' }}>Contrasena actualizada correctamente.</p>
                <div style={confirmModalStyles.actionsRow}>
                  <button type='button' onClick={() => setActiveModal(null)} style={confirmModalStyles.cancelButton}>Cerrar</button>
                </div>
              </>
            ) : (
              <>
                <p style={confirmModalStyles.message}>Introduce tu nueva contrasena. Debe tener al menos 8 caracteres.</p>
                <div style={{ marginTop: '18px', display: 'grid', gap: '10px' }}>
                  <label style={profileScreenStyles.sectionLabel} htmlFor='new-password'>Nueva contrasena</label>
                  <input
                    id='new-password'
                    type='password'
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setPasswordError('') }}
                    disabled={passwordSaving}
                    style={inputStyle}
                    placeholder='Minimo 8 caracteres'
                  />
                  <label style={profileScreenStyles.sectionLabel} htmlFor='confirm-password'>Confirmar contrasena</label>
                  <input
                    id='confirm-password'
                    type='password'
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError('') }}
                    disabled={passwordSaving}
                    style={inputStyle}
                    placeholder='Repite la contrasena'
                  />
                </div>
                {passwordError ? <p style={confirmModalStyles.message}>{passwordError}</p> : null}
                <div style={confirmModalStyles.actionsRow}>
                  <button type='button' onClick={() => setActiveModal(null)} style={confirmModalStyles.cancelButton} disabled={passwordSaving}>Cancelar</button>
                  <button type='button' onClick={handleChangePassword} disabled={passwordSaving || !newPassword} style={!newPassword || passwordSaving ? { ...confirmModalStyles.dangerButton, opacity: 0.6, cursor: 'not-allowed' } : confirmModalStyles.dangerButton}>
                    {passwordSaving ? 'Guardando...' : 'Cambiar contrasena'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </main>
  )
}