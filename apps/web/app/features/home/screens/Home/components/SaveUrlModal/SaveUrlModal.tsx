'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase'
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
  const [folders, setFolders] = useState<{ id: string; name: string }[]>([])
  const [selectedFolderIds, setSelectedFolderIds] = useState<string[]>([])
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

  useEffect(() => {
    let active = true

    const loadFolders = async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        const { data } = await supabase
          .from('smart_folders')
          .select('id, name')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (!active) return
        setFolders((data || []).map((row) => ({ id: row.id, name: row.name || 'Carpeta sin nombre' })))
      } catch {
        if (active) setFolders([])
      }
    }

    loadFolders()
    return () => { active = false }
  }, [userId])

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

      if (selectedFolderIds.length > 0) {
        const rows = selectedFolderIds.map(folderId => ({
          user_id: userId,
          item_id: itemId,
          folder_id: folderId
        }))
        const { error: folderError } = await supabase.from('item_folders').insert(rows)
        if (folderError) {
          console.error('Error inserting folders:', folderError)
          setErrorMessage('El enlace se guardo, pero no se pudo asignar a la carpeta seleccionada.')
        }
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
  }, [url, title, description, userId, selectedFolderIds, onSaved])

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

          <label style={saveUrlStyles.label}>Carpetas (opcional)</label>
          <div style={{ display: 'grid', gap: '8px' }}>
            {folders.length === 0 ? (
              <p style={saveUrlStyles.helperText}>No tienes carpetas creadas.</p>
            ) : (
              <div style={{ display: 'grid', gap: '6px' }}>
                {folders.map((folder) => {
                  const checked = selectedFolderIds.includes(folder.id)
                  return (
                    <label key={folder.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type='checkbox'
                        checked={checked}
                        onChange={() => {
                          setSelectedFolderIds((prev) =>
                            prev.includes(folder.id)
                              ? prev.filter((id) => id !== folder.id)
                              : [...prev, folder.id]
                          )
                        }}
                        disabled={isSaving || isDone}
                      />
                      <span style={saveUrlStyles.helperText}>{folder.name}</span>
                    </label>
                  )
                })}
              </div>
            )}
          </div>
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
