'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { newFolderModalStyles } from '../NewFolderModal/NewFolderModal.styles'

type RenameFolderModalProps = {
  currentName: string
  onClose: () => void
  onRename: (newName: string) => Promise<boolean>
}

export function RenameFolderModal({ currentName, onClose, onRename }: RenameFolderModalProps) {
  const [name, setName] = useState(currentName)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
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

    if (trimmedName === currentName) {
      onClose()
      return
    }

    setIsSaving(true)
    setError('')

    const success = await onRename(trimmedName)

    if (!success) {
      setError('No se pudo renombrar la carpeta')
    }

    setIsSaving(false)
  }, [name, currentName, onRename, onClose])

  return (
    <div style={newFolderModalStyles.overlay}>
      <div ref={modalRef} style={newFolderModalStyles.modal}>
        <h2 style={newFolderModalStyles.title}>Renombrar carpeta</h2>
        <p style={newFolderModalStyles.subtitle}>
          Cambia el nombre de la carpeta.
        </p>

        <div style={newFolderModalStyles.fieldGroup}>
          <label style={newFolderModalStyles.label} htmlFor='rename-folder-name'>
            Nombre *
          </label>
          <input
            ref={inputRef}
            id='rename-folder-name'
            type='text'
            placeholder='Mi carpeta'
            value={name}
            onChange={(e) => { setName(e.target.value); setError('') }}
            disabled={isSaving}
            style={newFolderModalStyles.input}
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
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}