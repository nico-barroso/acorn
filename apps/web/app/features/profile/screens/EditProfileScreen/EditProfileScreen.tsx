'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { AcornLoader } from '@/features/shared/components/AcornLoader/AcornLoader'
import { useEditProfile } from '../../hooks/useEditProfile'
import { usePageLoader } from '@/hooks/usePageLoader'
import { editProfileStyles as s } from './EditProfile.styles'

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

export function EditProfileScreen() {
  const { profile, loading, saving, error, success, avatarPreview, save, removeAvatar, setPreviewFromFile } = useEditProfile()
  const [displayName, setDisplayName] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [hoveringAvatar, setHoveringAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isReady = !loading && profile

  if (isReady && displayName === '' && profile) {
    setDisplayName(profile.displayName)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setPreviewFromFile(file)
  }

  const handleSave = async () => {
    if (!isReady) return
    const nameToSave = displayName.trim() || profile!.displayName
    const ok = await save(nameToSave, selectedFile)
    if (ok) {
      setSelectedFile(null)
    }
  }

  const handleRemoveAvatar = async () => {
    const ok = await removeAvatar()
    if (ok) {
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleCancel = () => {
    window.history.back()
  }

  const { showLoader, exiting: loaderExiting } = usePageLoader(loading)

  if (showLoader) {
    return <AcornLoader label="Cargando perfil" fullScreen exiting={loaderExiting} />
  }

  if (!profile) {
    return (
      <main style={s.page}>
        <p style={{ ...s.loading, color: '#8b2a1b' }}>No se pudo cargar tu perfil</p>
      </main>
    )
  }

  const hasChanges = (displayName.trim() !== profile.displayName && displayName.trim() !== '') || selectedFile !== null

  return (
    <main style={s.page} className="page-enter">
      <Link href='/profile' style={s.backLink}>← Volver al perfil</Link>

      <h1 style={s.title}>Editar perfil</h1>
      <p style={s.subtitle}>Actualiza tu foto y tu nombre de usuario</p>

      <div style={s.avatarSection}>
        <div style={s.avatarWrapper}>
          {avatarPreview ? (
            <div style={s.avatarCircle}>
              <img src={avatarPreview} alt='Avatar' style={s.avatarImage} />
            </div>
          ) : (
            <div style={s.avatarCircle}>{getInitials(profile.displayName, profile.email)}</div>
          )}

          <div
            style={{
              ...s.avatarOverlay,
              ...(hoveringAvatar ? s.avatarOverlayHover : {})
            }}
            onMouseEnter={() => setHoveringAvatar(true)}
            onMouseLeave={() => setHoveringAvatar(false)}
            onClick={() => fileInputRef.current?.click()}
          >
            <span style={s.avatarOverlayLabel}>Cambiar foto</span>
          </div>

          <input
            ref={fileInputRef}
            type='file'
            accept='image/jpeg,image/png,image/webp,image/gif'
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
        </div>

        <div style={{ display: 'grid', gridAutoFlow: 'column', gap: '8px' }}>
          <button type='button' style={s.changePhotoButton} onClick={() => fileInputRef.current?.click()}>
            Cambiar foto
          </button>
          {profile.avatarUrl || selectedFile ? (
            <button type='button' style={s.removePhotoButton} onClick={handleRemoveAvatar} disabled={saving}>
              Eliminar foto
            </button>
          ) : null}
        </div>
      </div>

      <div style={s.formSection}>
        <div style={s.fieldGroup}>
          <label style={s.label} htmlFor='display-name'>Nombre de usuario</label>
          <input
            id='display-name'
            type='text'
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder='Tu nombre'
            style={s.input}
            disabled={saving}
            maxLength={50}
          />
        </div>

        <div style={s.fieldGroup}>
          <label style={s.label} htmlFor='email'>Email</label>
          <input
            id='email'
            type='email'
            value={profile.email}
            style={{ ...s.input, ...s.inputDisabled }}
            disabled
          />
        </div>
      </div>

      {error ? <p style={{ ...s.message, ...s.errorText }}>{error}</p> : null}
      {success ? <p style={{ ...s.message, ...s.successText }}>Perfil actualizado correctamente</p> : null}

      <div style={s.actionsRow}>
        <button type='button' onClick={handleCancel} style={s.cancelButton} disabled={saving}>
          Cancelar
        </button>
        <button
          type='button'
          onClick={handleSave}
          disabled={saving || !hasChanges}
          style={saving || !hasChanges ? { ...s.saveButton, ...s.saveButtonDisabled } : s.saveButton}
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </main>
  )
}