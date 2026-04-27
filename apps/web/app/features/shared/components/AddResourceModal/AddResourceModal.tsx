'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import { addResourceStyles } from './AddResourceModal.styles'

type ExtractedMetadata = {
  title: string | null
  description: string | null
  imageUrl: string | null
  siteName: string | null
  domain: string | null
}

type AddResourceModalProps = {
  onClose: () => void
  onSaved: () => void
}

type SavePhase = 'idle' | 'inserting' | 'extracting' | 'tagging' | 'done' | 'error'

function slugifyTag(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function isValidUrl(value: string): boolean {
  let normalized = value.trim()
  if (!normalized) return false
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`
  }
  try {
    const parsed = new URL(normalized)
    return Boolean(parsed.hostname && parsed.hostname.includes('.'))
  } catch {
    return false
  }
}

function extractDomain(rawUrl: string): string {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

export function AddResourceModal({ onClose, onSaved }: AddResourceModalProps) {
  const [url, setUrl] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [phase, setPhase] = useState<SavePhase>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [metadata, setMetadata] = useState<ExtractedMetadata | null>(null)
  const [urlError, setUrlError] = useState('')
  const modalRef = useRef<HTMLDivElement>(null)
  const tagInputRef = useRef<HTMLInputElement>(null)

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

  const addTag = useCallback((raw: string) => {
    const trimmed = raw.trim().toLowerCase()
    if (!trimmed) return
    const slug = slugifyTag(trimmed)
    if (!slug) return
    setTags((prev) => {
      if (prev.some((t) => slugifyTag(t) === slug)) return prev
      return [...prev, trimmed]
    })
  }, [])

  const removeTag = useCallback((index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleTagKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const value = tagInput.trim()
      if (value) {
        addTag(value)
        setTagInput('')
      }
    }
    if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }, [tagInput, tags.length, addTag, removeTag])

  const handleSave = useCallback(async () => {
    const trimmedUrl = url.trim()
    if (!trimmedUrl) return

    let normalizedUrl = trimmedUrl
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`
    }

    if (!isValidUrl(trimmedUrl)) {
      setUrlError('La URL no es valida. Asegurate de incluir el dominio.')
      return
    }

    setUrlError('')
    setPhase('inserting')
    setErrorMessage('')
    setMetadata(null)

    const supabase = getSupabaseBrowserClient()

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        setPhase('error')
        setErrorMessage('No se pudo verificar tu sesion. Vuelve a iniciar sesion.')
        return
      }

      const domain = extractDomain(normalizedUrl)

      const { data: itemData, error: itemError } = await supabase
        .from('items')
        .insert({
          user_id: user.id,
          type: 'link',
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

      const extracted: ExtractedMetadata | null = !funcError && funcData
        ? {
            title: funcData.title || null,
            description: null,
            imageUrl: null,
            siteName: funcData.siteName || funcData.domain || null,
            domain: funcData.domain || domain || null
          }
        : null

      if (extracted) {
        setMetadata(extracted)
      }

      if (tags.length > 0) {
        setPhase('tagging')

        for (const tagName of tags) {
          const slug = slugifyTag(tagName)
          if (!slug) continue

          await supabase
            .from('tags')
            .upsert(
              { user_id: user.id, name: tagName, slug },
              { onConflict: 'user_id,slug' }
            )

          const { data: tagData } = await supabase
            .from('tags')
            .select('id')
            .eq('user_id', user.id)
            .eq('slug', slug)
            .single()

          if (tagData) {
            await supabase.from('item_tags').insert({
              item_id: itemId,
              tag_id: tagData.id
            })
          }
        }
      }

      setPhase('done')
      onSaved()
    } catch {
      setPhase('error')
      setErrorMessage('Ocurrio un error inesperado. Intentalo de nuevo.')
    }
  }, [url, tags, onSaved])

  const isSaving = phase === 'inserting' || phase === 'extracting' || phase === 'tagging'
  const isDone = phase === 'done'

  const getPhaseLabel = () => {
    if (phase === 'inserting') return 'Guardando...'
    if (phase === 'extracting') return 'Extrayendo metadatos...'
    if (phase === 'tagging') return 'Asignando etiquetas...'
    if (isDone) return 'Guardar'
    return 'Guardar'
  }

  return (
    <div style={addResourceStyles.overlay}>
      <div ref={modalRef} style={addResourceStyles.modal}>
        <h2 style={addResourceStyles.title}>Anadir recurso</h2>
        <p style={addResourceStyles.subtitle}>
          Pega la URL del recurso que quieres guardar. Extraeremos el titulo y la imagen automaticamente.
        </p>

        <div style={addResourceStyles.fieldGroup}>
          <label style={addResourceStyles.label} htmlFor='add-url-input'>URL</label>
          <input
            id='add-url-input'
            type='url'
            placeholder='https://ejemplo.com/articulo'
            value={url}
            onChange={(e) => { setUrl(e.target.value); setUrlError('') }}
            disabled={isSaving || isDone}
            style={{
              ...addResourceStyles.input,
              ...(urlError ? addResourceStyles.inputError : {}),
              ...(isSaving || isDone ? { opacity: 0.6 } : {})
            }}
            autoFocus
          />
          {urlError ? <p style={addResourceStyles.errorText}>{urlError}</p> : null}

          <label style={addResourceStyles.label} htmlFor='add-tags-input'>Etiquetas (opcional)</label>
          <div style={addResourceStyles.tagsInputWrapper} onClick={() => tagInputRef.current?.focus()}>
            {tags.map((tag, index) => (
              <span key={`${tag}-${index}`} style={addResourceStyles.tagPill}>
                {tag}
                <button
                  type='button'
                  onClick={() => removeTag(index)}
                  style={addResourceStyles.tagRemove}
                  aria-label={`Eliminar etiqueta ${tag}`}
                >
                  x
                </button>
              </span>
            ))}
            <input
              ref={tagInputRef}
              id='add-tags-input'
              type='text'
              placeholder={tags.length === 0 ? 'Escribe y pulsa Enter para anadir' : ''}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              disabled={isSaving || isDone}
              style={addResourceStyles.tagInput}
            />
          </div>
        </div>

        {phase === 'extracting' || (phase === 'done' && metadata) ? (
          <div style={addResourceStyles.extractStatusRow}>
            {phase === 'extracting' ? (
              <>
                <div style={addResourceStyles.extractSpinner} />
                <p style={addResourceStyles.extractText}>Extrayendo metadatos...</p>
              </>
            ) : null}
            {phase === 'done' && metadata ? (
              <>
                <div style={addResourceStyles.extractSpinnerDone}>&#10003;</div>
                <p style={addResourceStyles.extractText}>Metadatos extraidos correctamente.</p>
              </>
            ) : null}
          </div>
        ) : null}

        {phase === 'done' && metadata ? (
          <div style={addResourceStyles.previewCard}>
            {metadata.imageUrl ? (
              <img src={metadata.imageUrl} alt='' style={addResourceStyles.previewImage} />
            ) : (
              <div style={addResourceStyles.previewPlaceholder}>
                {metadata.domain ? metadata.domain[0].toUpperCase() : '?'}
              </div>
            )}
            <div>
              <p style={addResourceStyles.previewTitle}>{metadata.title || metadata.domain || 'Recurso guardado'}</p>
              {metadata.siteName ? (
                <p style={addResourceStyles.previewDescription}>{metadata.siteName}</p>
              ) : null}
            </div>
          </div>
        ) : null}

        {errorMessage ? (
          <p style={addResourceStyles.errorText}>{errorMessage}</p>
        ) : null}

        <div style={addResourceStyles.actionsRow}>
          <button
            type='button'
            onClick={onClose}
            style={addResourceStyles.cancelButton}
            disabled={isSaving && phase === 'inserting'}
          >
            {isDone ? 'Cerrar' : 'Cancelar'}
          </button>
          {!isDone ? (
            <button
              type='button'
              onClick={handleSave}
              disabled={isSaving || !url.trim()}
              style={!url.trim() || isSaving ? addResourceStyles.saveButtonDisabled : addResourceStyles.saveButton}
            >
              {getPhaseLabel()}
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