'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getSupabaseBrowserClient } from '../../../../../../lib/supabase'
import { saveUrlStyles } from './SaveUrlModal.styles'

type ExtractedMetadata = {
  title: string | null
  description: string | null
  imageUrl: string | null
  siteName: string | null
  domain: string | null
}

type SaveUrlModalProps = {
  userId: string
  onClose: () => void
  onSaved: () => void
}

type SavePhase = 'idle' | 'inserting' | 'extracting' | 'done' | 'error'

export function SaveUrlModal({ userId, onClose, onSaved }: SaveUrlModalProps) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [phase, setPhase] = useState<SavePhase>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [metadata, setMetadata] = useState<ExtractedMetadata | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

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

  const extractDomain = (rawUrl: string): string => {
    try {
      return new URL(rawUrl).hostname.replace(/^www\./, '')
    } catch {
      return ''
    }
  }

  const handleSave = useCallback(async () => {
    const trimmedUrl = url.trim()
    if (!trimmedUrl) return

    let normalizedUrl = trimmedUrl
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`
    }

    try {
      new URL(normalizedUrl)
    } catch {
      setErrorMessage('La URL no es valida. Asegurate de incluir el dominio.')
      return
    }

    setPhase('inserting')
    setErrorMessage('')
    setMetadata(null)

    const supabase = getSupabaseBrowserClient()

    try {
      const { data: itemData, error: itemError } = await supabase
        .from('items')
        .insert({
          user_id: userId,
          type: 'link',
          title: title.trim() || null,
          description: description.trim() || null,
          is_read: false,
          is_favorite: false,
          visibility: 'private'
        })
        .select('id')
        .single()

      if (itemError || !itemData) {
        setPhase('error')
        setErrorMessage('No se pudo guardar el recurso. Intentalo de nuevo.')
        return
      }

      const itemId = itemData.id
      const domain = extractDomain(normalizedUrl)

      const { error: linkError } = await supabase.from('links').insert({
        id: itemId,
        url: normalizedUrl,
        domain: domain || null
      })

      if (linkError) {
        setPhase('error')
        setErrorMessage('No se pudo guardar el enlace. Intentalo de nuevo.')
        await supabase.from('items').delete().eq('id', itemId)
        return
      }

      setPhase('extracting')

      const { data: funcData, error: funcError } = await supabase.functions.invoke('extract-metadata', {
        body: { item_id: itemId, url: normalizedUrl }
      })

      if (!funcError && funcData) {
        const extracted: ExtractedMetadata = {
          title: funcData.title || null,
          description: null,
          imageUrl: null,
          siteName: funcData.siteName || funcData.domain || null,
          domain: funcData.domain || domain || null
        }
        setMetadata(extracted)
      }

      setPhase('done')
      onSaved()
    } catch {
      setPhase('error')
      setErrorMessage('Ocurrio un error inesperado. Intentalo de nuevo.')
    }
  }, [url, title, description, userId, onSaved])

  const isSaving = phase === 'inserting' || phase === 'extracting'
  const isDone = phase === 'done'

  return (
    <div style={saveUrlStyles.overlay}>
      <div ref={modalRef} style={saveUrlStyles.modal}>
        <h2 style={saveUrlStyles.title}>Guardar enlace</h2>
        <p style={saveUrlStyles.subtitle}>
          Pega la URL del recurso que quieres guardar. Extraeremos el titulo, la descripcion y la imagen automaticamente.
        </p>

        <div style={saveUrlStyles.fieldGroup}>
          <label style={saveUrlStyles.label} htmlFor='save-url-input'>URL</label>
          <input
            id='save-url-input'
            type='url'
            placeholder='https://ejemplo.com/articulo'
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isSaving || isDone}
            style={{ ...saveUrlStyles.input, ...(isSaving || isDone ? { opacity: 0.6 } : {}) }}
            autoFocus
          />

          <label style={saveUrlStyles.label} htmlFor='save-url-title'>Titulo (opcional)</label>
          <input
            id='save-url-title'
            type='text'
            placeholder='Si no indicas uno, se extraera de la URL'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSaving || isDone}
            style={{ ...saveUrlStyles.input, ...(isSaving || isDone ? { opacity: 0.6 } : {}) }}
          />

          <label style={saveUrlStyles.label} htmlFor='save-url-desc'>Descripcion (opcional)</label>
          <textarea
            id='save-url-desc'
            placeholder='Una breve descripcion del recurso'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSaving || isDone}
            style={{ ...saveUrlStyles.textarea, ...(isSaving || isDone ? { opacity: 0.6 } : {}) }}
          />
        </div>

        {phase === 'extracting' || (phase === 'done' && metadata) ? (
          <div style={saveUrlStyles.extractStatusRow}>
            {phase === 'extracting' ? (
              <>
                <div style={saveUrlStyles.extractSpinner} />
                <p style={saveUrlStyles.extractText}>Extrayendo metadatos...</p>
              </>
            ) : null}
            {phase === 'done' && metadata ? (
              <>
                <div style={saveUrlStyles.extractSpinnerDone}>&#10003;</div>
                <p style={saveUrlStyles.extractText}>Metadatos extraidos correctamente.</p>
              </>
            ) : null}
          </div>
        ) : null}

        {phase === 'done' && metadata ? (
          <div style={saveUrlStyles.previewCard}>
            {metadata.imageUrl ? (
              <img src={metadata.imageUrl} alt='' style={saveUrlStyles.previewImage} />
            ) : (
              <div style={saveUrlStyles.previewPlaceholder}>
                {metadata.domain ? metadata.domain[0].toUpperCase() : '?'}
              </div>
            )}
            <div>
              <p style={saveUrlStyles.previewTitle}>{metadata.title || metadata.domain || 'Recurso guardado'}</p>
              {metadata.siteName ? (
                <p style={saveUrlStyles.previewDescription}>{metadata.siteName}</p>
              ) : null}
            </div>
          </div>
        ) : null}

        {errorMessage ? (
          <p style={saveUrlStyles.errorText}>{errorMessage}</p>
        ) : null}

        <div style={saveUrlStyles.actionsRow}>
          <button
            type='button'
            onClick={isDone ? onClose : onClose}
            style={saveUrlStyles.cancelButton}
            disabled={isSaving && phase === 'inserting'}
          >
            {isDone ? 'Cerrar' : 'Cancelar'}
          </button>
          {!isDone ? (
            <button
              type='button'
              onClick={handleSave}
              disabled={isSaving || !url.trim()}
              style={!url.trim() || isSaving ? saveUrlStyles.saveButtonDisabled : saveUrlStyles.saveButton}
            >
              {phase === 'inserting' ? 'Guardando...' : phase === 'extracting' ? 'Extrayendo...' : 'Guardar'}
            </button>
          ) : null}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}