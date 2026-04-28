'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProfile } from '../../hooks/useProfile'
import { ConfirmModal } from '../../components/ConfirmModal/ConfirmModal'
import { profileScreenStyles } from './ProfileScreen.styles'

type ModalType = 'signOut' | 'deleteAccount' | null

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
  const router = useRouter()
  const { profile, loading, error, signOut, deleteAccount } = useProfile()
  const [activeModal, setActiveModal] = useState<ModalType>(null)

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
      id: 'edit-profile',
      icon: '👤',
      iconStyle: profileScreenStyles.sectionIconUser,
      label: 'Mi perfil',
      onClick: () => {} // TODO: navigate to edit profile
    },
    {
      id: 'change-password',
      icon: '🔒',
      iconStyle: profileScreenStyles.sectionIconPassword,
      label: 'Cambiar contrasena',
      onClick: () => router.push('/auth/reset-password')
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
        {sections.map((section, index) => (
          <button
            key={section.id}
            type='button'
            onClick={section.onClick}
            style={{
              ...profileScreenStyles.sectionItem,
              ...(index < sections.length - 1 ? profileScreenStyles.sectionItemBorder : {})
            }}
          >
            <div style={{ ...profileScreenStyles.sectionIcon, ...section.iconStyle }}>
              {section.icon}
            </div>
            <span style={{ ...profileScreenStyles.sectionLabel, ...(section.labelStyle || {}) }}>
              {section.label}
            </span>
            <span style={profileScreenStyles.sectionChevron}>›</span>
          </button>
        ))}
      </div>

      {activeModal === 'signOut' ? (
        <ConfirmModal
          title='Cerrar sesion'
          message='¿Estas seguro de que quieres cerrar sesion? Tendras que iniciar sesion de nuevo para acceder a tus recursos.'
          confirmLabel='Cerrar sesion'
          onConfirm={signOut}
          onDismiss={() => setActiveModal(null)}
        />
      ) : null}

      {activeModal === 'deleteAccount' ? (
        <ConfirmModal
          title='Eliminar cuenta'
          message='Esta accion es irreversible. Se eliminaran todos tus recursos, carpetas y datos permanentemente. No podras recuperarlos.'
          confirmLabel='Eliminar cuenta'
          danger
          onConfirm={deleteAccount}
          onDismiss={() => setActiveModal(null)}
        />
      ) : null}
    </main>
  )
}