'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import { s } from './AddResourceModal.styles'

// ── Utilities ──────────────────────────────────────────────────────────────


function isValidUrl(value: string): boolean {
  let normalized = value.trim()
  if (!normalized) return false
  if (!/^https?:\/\//i.test(normalized)) normalized = `https://${normalized}`
  try {
    const parsed = new URL(normalized)
    return Boolean(parsed.hostname && parsed.hostname.includes('.'))
  } catch {
    return false
  }
}

function normalizeUrl(value: string): string {
  const trimmed = value.trim()
  if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`
  return trimmed
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

function formatBytes(size: number): string {
  if (!size) return 'Tamaño desconocido'
  const units = ['B', 'KB', 'MB', 'GB']
  let value = size
  let i = 0
  while (value >= 1024 && i < units.length - 1) { value /= 1024; i++ }
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}


// ── Link Mode ──────────────────────────────────────────────────────────────

type LinkPhase = 'idle' | 'saving' | 'done' | 'error'

function LinkMode({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [urlError, setUrlError] = useState('')
  const [phase, setPhase] = useState<LinkPhase>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [editExpanded, setEditExpanded] = useState(false)
  const [faviconError, setFaviconError] = useState(false)

  const urlValid = isValidUrl(url)
  const domain = urlValid ? extractDomain(normalizeUrl(url)) : ''
  const faviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : null
  const previewTitle = title.trim() || domain

  const isSaving = phase === 'saving'
  const isDone = phase === 'done'

  useEffect(() => {
    if (!urlValid) {
      setEditExpanded(false)
      setFaviconError(false)
    }
  }, [urlValid])

  const handleSave = useCallback(async () => {
    if (!urlValid) { setUrlError('Introduce una URL válida (https://...).'); return }
    setUrlError('')
    setPhase('saving')
    setErrorMsg('')

    const normalized = normalizeUrl(url)
    const supabase = getSupabaseBrowserClient()

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) { setPhase('error'); setErrorMsg('No se pudo verificar tu sesión.'); return }

      const itemDomain = extractDomain(normalized)

      const { data: itemData, error: itemError } = await supabase
        .from('items')
        .insert({ user_id: user.id, type: 'link', is_read: false, is_favorite: false, visibility: 'private' })
        .select('id')
        .single()

      if (itemError || !itemData) { setPhase('error'); setErrorMsg('No se pudo guardar el recurso.'); return }

      const itemId = itemData.id

      const { error: linkError } = await supabase.from('links').insert({
        id: itemId,
        url: normalized,
        domain: itemDomain || null,
      })

      if (linkError) {
        await supabase.from('items').delete().eq('id', itemId)
        setPhase('error')
        setErrorMsg('No se pudo guardar el enlace.')
        return
      }

      void supabase.functions.invoke('extract-metadata', {
        body: {
          item_id: itemId,
          url: normalized,
          ...(title.trim() ? { og_title: title.trim() } : {}),
        },
      })

      setPhase('done')
      onSaved()
    } catch {
      setPhase('error')
      setErrorMsg('Ocurrió un error inesperado.')
    }
  }, [url, urlValid, title, notes, onSaved])

  return (
    <>
      <p style={s.subtitle}>Pega la URL del recurso que quieres guardar.</p>

      <div style={s.fieldGroup}>
        <label style={s.label}>URL</label>
        <input
          type="url"
          placeholder="https://ejemplo.com/articulo"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setUrlError('') }}
          disabled={isSaving || isDone}
          style={{ ...s.input, ...(urlError ? s.inputError : {}), ...(isSaving || isDone ? { opacity: 0.6 } : {}) }}
          autoFocus
        />
        {urlError ? <p style={s.errorText}>{urlError}</p> : null}
      </div>

      {urlValid && (
        <div style={s.previewCard}>
          <div style={s.previewThumbnail}>
            {faviconUrl && !faviconError ? (
              <img
                src={faviconUrl}
                alt=""
                style={s.previewThumbnailIcon}
                onError={() => setFaviconError(true)}
              />
            ) : (
              <span style={s.previewThumbnailFallback}>{domain[0]?.toUpperCase() ?? '?'}</span>
            )}
          </div>
          <div style={s.previewTextLayout}>
            <p style={s.previewTitle}>{previewTitle}</p>
            <p style={s.previewSource}>🔗 {domain}</p>
          </div>
        </div>
      )}

      {urlValid && (
        <button type="button" style={s.editToggle} onClick={() => setEditExpanded((v) => !v)}>
          {editExpanded ? 'Ocultar' : 'Editar'}
        </button>
      )}

      {editExpanded && (
        <div style={s.editFields}>
          <div style={s.fieldGroup}>
            <label style={s.label}>Título</label>
            <input
              type="text"
              placeholder="Título del recurso (opcional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSaving}
              style={s.input}
            />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Notas</label>
            <textarea
              placeholder="Añade notas o descripción (opcional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isSaving}
              style={s.textarea}
              rows={3}
            />
          </div>
        </div>
      )}

      {errorMsg ? <p style={s.errorText}>{errorMsg}</p> : null}

      <div style={s.buttons}>
        <button type="button" onClick={onClose} style={s.cancelButton}>
          {isDone ? 'Cerrar' : 'Cancelar'}
        </button>
        {!isDone && (
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !urlValid}
            style={!urlValid || isSaving ? s.saveButtonDisabled : s.saveButton}
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        )}
      </div>
    </>
  )
}

// ── File Mode ──────────────────────────────────────────────────────────────

type FilePhase = 'idle' | 'uploading' | 'done' | 'error'

function FileMode({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [editedName, setEditedName] = useState('')
  const [phase, setPhase] = useState<FilePhase>('idle')
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isUploading = phase === 'uploading'
  const isDone = phase === 'done'

  const handleFileSelect = (selected: File) => {
    setFile(selected)
    setEditedName(selected.name.replace(/\.[^.]+$/, ''))
    setErrorMsg('')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) handleFileSelect(dropped)
  }

  const handleSave = async () => {
    if (!file) return
    setPhase('uploading')
    setProgress(0)
    setErrorMsg('')

    const supabase = getSupabaseBrowserClient()

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) { setPhase('error'); setErrorMsg('No se pudo verificar tu sesión.'); return }

      const finalName = (editedName.trim() || file.name)
      const ext = file.name.includes('.') ? `.${file.name.split('.').pop()}` : ''
      const fileName = finalName.endsWith(ext) ? finalName : `${finalName}${ext}`
      const sanitized = fileName.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9._-]/g, '_')
      const storagePath = `${user.id}/${Date.now()}_${sanitized}`

      const { error: uploadError } = await supabase.storage
        .from('user-files')
        .upload(storagePath, file, { contentType: file.type, upsert: false })

      if (uploadError) { setPhase('error'); setErrorMsg('No se pudo subir el archivo.'); return }
      setProgress(40)

      const { data: urlData } = supabase.storage.from('user-files').getPublicUrl(storagePath)
      const publicUrl = urlData.publicUrl
      setProgress(60)

      const { data: item, error: itemError } = await supabase
        .from('items')
        .insert({ user_id: user.id, type: 'file', title: fileName, is_read: false, is_favorite: false, visibility: 'private' })
        .select('id')
        .single()

      if (itemError || !item) { setPhase('error'); setErrorMsg('No se pudo crear el recurso.'); return }
      setProgress(75)

      const { error: fileDbError } = await supabase
        .from('files')
        .insert({ id: item.id, storage_path: storagePath, file_name: fileName, content_type: file.type, size_bytes: file.size })

      if (fileDbError) { setPhase('error'); setErrorMsg('No se pudo registrar el archivo.'); return }
      setProgress(90)

      await supabase.from('links').insert({ id: item.id, url: publicUrl, domain: null })

      setProgress(100)
      setPhase('done')
      onSaved()
    } catch {
      setPhase('error')
      setErrorMsg('Ocurrió un error inesperado.')
    }
  }

  return (
    <>
      <p style={s.subtitle}>Selecciona un archivo de tu dispositivo para guardarlo.</p>

      <div
        style={{ ...s.dropZone, ...(isDragging ? s.dropZoneDragging : {}) }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isUploading && !isDone && fileInputRef.current?.click()}
      >
        <span style={s.dropZoneText}>{file ? 'Cambiar archivo' : 'Seleccionar archivo'}</span>
        {!file && <span style={s.dropZoneHint}>o arrastra aquí</span>}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
      />

      {file && (
        <>
          <div style={s.previewCard}>
            <div style={s.previewThumbnail}>
              <span style={s.fileIconEmoji}>📄</span>
            </div>
            <div style={s.previewTextLayout}>
              <p style={s.previewTitle}>{editedName || file.name}</p>
              <p style={s.previewSource}>📄 {formatBytes(file.size)}</p>
            </div>
          </div>

          <div style={s.fieldGroup}>
            <label style={s.label}>Nombre</label>
            <input
              type="text"
              placeholder="Nombre del archivo"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              disabled={isUploading || isDone}
              style={{ ...s.input, ...(isUploading || isDone ? { opacity: 0.6 } : {}) }}
            />
          </div>
        </>
      )}

      {isUploading && (
        <div style={s.progressRow}>
          <div style={{ ...s.progressBar, width: `${progress}%` }} />
          <p style={s.progressText}>Subiendo... {progress}%</p>
        </div>
      )}
      {errorMsg ? <p style={s.errorText}>{errorMsg}</p> : null}

      <div style={s.buttons}>
        <button type="button" onClick={onClose} style={s.cancelButton}>
          {isDone ? 'Cerrar' : 'Cancelar'}
        </button>
        {!isDone && (
          <button
            type="button"
            onClick={handleSave}
            disabled={!file || isUploading}
            style={!file || isUploading ? s.saveButtonDisabled : s.saveButton}
          >
            {isUploading ? 'Subiendo...' : 'Guardar'}
          </button>
        )}
      </div>
    </>
  )
}

// ── Main Modal ─────────────────────────────────────────────────────────────

type Mode = 'link' | 'file'

type AddResourceModalProps = {
  onClose: () => void
  onSaved: () => void
}

export function AddResourceModal({ onClose, onSaved }: AddResourceModalProps) {
  const [mode, setMode] = useState<Mode>('link')
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <div style={s.overlay}>
      <div ref={modalRef} style={s.modal}>
        <h2 style={s.title}>Guardar recurso</h2>

        <div style={s.modeToggle}>
          <button
            type="button"
            style={{ ...s.modeTab, ...(mode === 'link' ? s.modeTabActive : {}) }}
            onClick={() => setMode('link')}
          >
            <span style={{ ...s.modeTabText, ...(mode === 'link' ? s.modeTabTextActive : {}) }}>Enlace</span>
          </button>
          <button
            type="button"
            style={{ ...s.modeTab, ...(mode === 'file' ? s.modeTabActive : {}) }}
            onClick={() => setMode('file')}
          >
            <span style={{ ...s.modeTabText, ...(mode === 'file' ? s.modeTabTextActive : {}) }}>Archivo</span>
          </button>
        </div>

        {mode === 'link' && <LinkMode key="link" onClose={onClose} onSaved={onSaved} />}
        {mode === 'file' && <FileMode key="file" onClose={onClose} onSaved={onSaved} />}
      </div>
    </div>
  )
}
