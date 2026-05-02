'use client'

import { useEffect, useRef } from 'react'
import { confirmModalStyles } from './ConfirmModal.styles'

type ConfirmModalProps = {
  title: string
  message: string
  confirmLabel: string
  danger?: boolean
  onConfirm: () => void
  onDismiss: () => void
}

export function ConfirmModal({ title, message, confirmLabel, onConfirm, onDismiss }: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onDismiss])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onDismiss()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onDismiss])

  return (
    <div style={confirmModalStyles.overlay}>
      <div ref={modalRef} style={confirmModalStyles.modal}>
        <h2 style={confirmModalStyles.title}>{title}</h2>
        <p style={confirmModalStyles.message}>{message}</p>
        <div style={confirmModalStyles.actionsRow}>
          <button type='button' onClick={onDismiss} style={confirmModalStyles.cancelButton}>
            Cancelar
          </button>
          <button type='button' onClick={onConfirm} style={confirmModalStyles.dangerButton}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}