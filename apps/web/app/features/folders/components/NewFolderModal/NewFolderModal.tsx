'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { FolderFormData } from '../../hooks/useFolders'
import { newFolderModalStyles } from './NewFolderModal.styles'

type NewFolderModalProps = {
  onClose: () => void
  onCreate: (data: FolderFormData) => Promise<boolean>
}

export function NewFolderModal({ onClose, onCreate }: NewFolderModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const handleSave = useCallback(async () => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('El nombre es obligatorio')
      return
    }

    setIsSaving(true)
    setError('')

    const success = await onCreate({
      name: trimmedName,
      description: description.trim() || undefined
    })

    if (!success) {
      setError('No se pudo crear la carpeta')
    }

    setIsSaving(false)
  }, [name, description, onCreate])

  return (
    <div style={newFolderModalStyles.overlay}>
      <div ref={modalRef} style={newFolderModalStyles.modal}>
        <h2 style={newFolderModalStyles.title}>Nueva carpeta</h2>
        <p style={newFolderModalStyles.subtitle}>
          Crea una carpeta para organizar tus recursos.
        </p>

        <div style={newFolderModalStyles.fieldGroup}>
          <label style={newFolderModalStyles.label} htmlFor='folder-name'>
            Nombre *
          </label>
          <input
            ref={inputRef}
            id='folder-name'
            type='text'
            placeholder='Mi carpeta'
            value={name}
            onChange={(e) => { setName(e.target.value); setError('') }}
            disabled={isSaving}
            style={newFolderModalStyles.input}
          />

          <label style={newFolderModalStyles.label} htmlFor='folder-description'>
            Descripcion (opcional)
          </label>
          <textarea
            id='folder-description'
            placeholder='Descripcion breve de la carpeta'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSaving}
            style={newFolderModalStyles.textarea}
          />
        </div>

        {error ? <p style={newFolderModalStyles.errorText}>{error}</p> : null}

        <div style={newFolderModalStyles.actionsRow}>
          <button
            type='button'
            onClick={onClose}
            style={newFolderModalStyles.cancelButton}
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            type='button'
            onClick={handleSave}
            disabled={isSaving || !name.trim()}
            style={!name.trim() || isSaving ? newFolderModalStyles.saveButtonDisabled : newFolderModalStyles.saveButton}
          >
            {isSaving ? 'Creando...' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  )
}