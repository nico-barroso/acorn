'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useProfile } from '../../hooks/useProfile'
import { confirmModalStyles } from '../../components/ConfirmModal/ConfirmModal.styles'
import { profileScreenStyles } from './ProfileScreen.styles'

type ModalType = 'signOut' | null

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

function IconUser() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 15.5H7.5C6.10444 15.5 5.40665 15.5 4.83886 15.6722C3.56045 16.06 2.56004 17.0605 2.17224 18.3389C2 18.9067 2 19.6044 2 21M19 21V15M16 18H22M14.5 7.5C14.5 9.98528 12.4853 12 10 12C7.51472 12 5.5 9.98528 5.5 7.5C5.5 5.01472 7.51472 3 10 3C12.4853 3 14.5 5.01472 14.5 7.5Z" stroke="#43281C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconLock() {
  return (
    <svg width="20" height="20" viewBox="0 0 18 20" fill="none">
      <path d="M14 8V6C14 3.23858 11.7614 1 9 1C6.23858 1 4 3.23858 4 6V8M9 12.5V14.5M5.8 19H12.2C13.8802 19 14.7202 19 15.362 18.673C15.9265 18.3854 16.3854 17.9265 16.673 17.362C17 16.7202 17 15.8802 17 14.2V12.8C17 11.1198 17 10.2798 16.673 9.638C16.3854 9.0735 15.9265 8.6146 15.362 8.327C14.7202 8 13.8802 8 12.2 8H5.8C4.11984 8 3.27976 8 2.63803 8.327C2.07354 8.6146 1.6146 9.0735 1.32698 9.638C1 10.2798 1 11.1198 1 12.8V14.2C1 15.8802 1 16.7202 1.32698 17.362C1.6146 17.9265 2.07354 18.3854 2.63803 18.673C3.27976 19 4.11984 19 5.8 19Z" stroke="#43281C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconLogOut() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 20" fill="none">
      <path d="M17 6L21 10M21 10L17 14M21 10H8M14 2.20404C12.7252 1.43827 11.2452 1 9.6667 1C4.8802 1 1 5.02944 1 10C1 14.9706 4.8802 19 9.6667 19C11.2452 19 12.7252 18.5617 14 17.796" stroke="#43281C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconWarning() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 16a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1zm9.94 2.47-8.05-14a2.24 2.24 0 0 0-3.78 0l-8 14A2.25 2.25 0 0 0 4.05 22h15.9a2.25 2.25 0 0 0 1.99-3.53zM12 8a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1z" fill="#8b2a1b"/>
    </svg>
  )
}

function IconChevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M9 18L15 12L9 6" stroke="#43281C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function SectionRow({
  icon,
  label,
  danger,
  onClick,
  href,
  border
}: {
  icon: React.ReactNode
  label: string
  danger?: boolean
  onClick?: () => void
  href?: string
  border?: boolean
}) {
  const inner = (
    <>
      <div className="profile-icon" style={profileScreenStyles.sectionIcon}>{icon}</div>
      <span style={{ ...profileScreenStyles.sectionLabel, ...(danger ? profileScreenStyles.sectionLabelDanger : {}) }}>
        {label}
      </span>
      <span className="profile-chevron-anim" style={profileScreenStyles.sectionChevron}><IconChevron /></span>
    </>
  )

  const style = {
    ...profileScreenStyles.sectionItem,
    ...(border ? profileScreenStyles.sectionItemBorder : {})
  }

  if (href) {
    return (
      <Link href={href} className="profile-row" style={style}>
        {inner}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className="profile-row" style={style}>
      {inner}
    </button>
  )
}

function ProfileSkeleton() {
  return (
    <main style={profileScreenStyles.page}>
      <div style={profileScreenStyles.heroGradient} aria-hidden />
      <div style={profileScreenStyles.inner}>
        <div className="profile-header" style={profileScreenStyles.header}>
          <div
            className="profile-skeleton"
            style={{ width: '84px', height: '84px', borderRadius: '50%', marginBottom: '14px', flexShrink: 0 }}
          />
          <div className="profile-skeleton" style={{ width: '140px', height: '28px', borderRadius: '8px' }} />
          <div className="profile-skeleton" style={{ width: '180px', height: '16px', borderRadius: '6px', marginTop: '8px', opacity: 0.6 }} />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className={`profile-section-${i}`} style={profileScreenStyles.section}>
            <div className="profile-skeleton" style={{ width: '70px', height: '16px', borderRadius: '6px' }} />
            <div style={{ ...profileScreenStyles.sectionCard, padding: '14px 16px', display: 'grid', gap: '12px' }}>
              <div className="profile-skeleton" style={{ height: '20px', borderRadius: '6px' }} />
              {i === 1 && <div className="profile-skeleton" style={{ height: '20px', borderRadius: '6px', opacity: 0.7 }} />}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export function ProfileScreen() {
  const { profile, loading, error, signOut } = useProfile()
  const [activeModal, setActiveModal] = useState<ModalType>(null)

  if (loading) return <ProfileSkeleton />

  if (error || !profile) {
    return (
      <main style={profileScreenStyles.page}>
        <p style={profileScreenStyles.errorText}>{error || 'No se pudo cargar tu perfil'}</p>
      </main>
    )
  }

  return (
    <main style={profileScreenStyles.page}>
      {/* Radial de fondo full-bleed */}
      <div style={profileScreenStyles.heroGradient} aria-hidden />

      <div style={profileScreenStyles.inner}>
        {/* Header sin card */}
        <header className="profile-header" style={profileScreenStyles.header}>
          <Link href="/profile/edit" className="profile-avatar-wrap" style={profileScreenStyles.avatar}>
            <img
              src={profile.avatarUrl || '/squirrel-avatar.png'}
              alt="Avatar"
              style={profileScreenStyles.avatarImage}
            />
          </Link>
          <h1 style={profileScreenStyles.displayName}>{profile.displayName}</h1>
          <p style={profileScreenStyles.email}>{profile.email}</p>
        </header>

        {/* Cuenta */}
        <div className="profile-section-1" style={profileScreenStyles.section}>
          <h2 style={profileScreenStyles.sectionTitle}>Cuenta</h2>
          <div style={profileScreenStyles.sectionCard}>
            <SectionRow icon={<IconUser />} label="Mi perfil" href="/profile/edit" border />
            <SectionRow
              icon={<IconLock />}
              label="Cambiar contraseña"
              href="/profile/change-password"
            />
          </div>
        </div>

        {/* Sesión */}
        <div className="profile-section-2" style={profileScreenStyles.section}>
          <h2 style={profileScreenStyles.sectionTitle}>Sesión</h2>
          <div style={profileScreenStyles.sectionCard}>
            <SectionRow icon={<IconLogOut />} label="Cerrar sesión" onClick={() => setActiveModal('signOut')} />
          </div>
        </div>

        {/* Eliminar cuenta */}
        <div className="profile-section-3" style={profileScreenStyles.section}>
          <div style={profileScreenStyles.sectionCard}>
            <SectionRow
              icon={<IconWarning />}
              label="Eliminar cuenta"
              danger
              href="/profile/delete"
            />
          </div>
        </div>
      </div>

      {/* Modal: cerrar sesión */}
      {activeModal === 'signOut' && (
        <div style={confirmModalStyles.overlay} onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null) }}>
          <div style={confirmModalStyles.modal}>
            <h2 style={confirmModalStyles.title}>Cerrar sesión</h2>
            <p style={confirmModalStyles.message}>¿Estás seguro de que quieres cerrar sesión? Tendrás que iniciar sesión de nuevo para acceder a tus recursos.</p>
            <div style={confirmModalStyles.actionsRow}>
              <button type="button" onClick={() => setActiveModal(null)} style={confirmModalStyles.cancelButton}>Cancelar</button>
              <button type="button" onClick={signOut} style={confirmModalStyles.dangerButton}>Cerrar sesión</button>
            </div>
          </div>
        </div>
      )}

    </main>
  )
}
