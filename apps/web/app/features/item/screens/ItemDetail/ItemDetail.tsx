'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import { useToggleRead } from '@/hooks/useToggleRead'
import { s } from './ItemDetail.styles'

// ── Types ─────────────────────────────────────────────────────────────────────

type ItemData = {
  id: string
  title: string | null
  description: string | null
  type: string
  url: string | null
  domain: string | null
  favicon_url: string | null
  preview_image_url: string | null
  og_title: string | null
  og_description: string | null
  og_image_url: string | null
  site_name: string | null
  read_time_minutes: number | null
  is_read: boolean
  is_favorite: boolean
  created_at: string
  updated_at: string
  tags: string[] | null
}

type UserTag = {
  id: string
  name: string
  slug: string | null
  color_hex: string | null
}

const TAG_COLORS = [
  '#A14D36', '#C0392B', '#E67E22', '#D4AC0D',
  '#27AE60', '#16A085', '#2980B9', '#8E44AD',
  '#6D6875', '#2C3E50',
]

function slugify(name: string): string {
  return name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-')
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── TagPanel ──────────────────────────────────────────────────────────────────

function TagPanel({
  userTags,
  assignedTagIds,
  onToggle,
  onCreate,
  onUpdate,
  onClose,
}: {
  userTags: UserTag[]
  assignedTagIds: Set<string>
  onToggle: (tag: UserTag) => void
  onCreate: (name: string, color: string) => Promise<void>
  onUpdate: (tag: UserTag, name: string, color: string) => Promise<void>
  onClose: () => void
}) {
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(TAG_COLORS[0])
  const [saving, setSaving] = useState(false)
  const [editingTagId, setEditingTagId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState(TAG_COLORS[0])
  const [editSaving, setEditSaving] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => { searchRef.current?.focus() }, [])

  const filtered = userTags.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  )
  const hasExact = userTags.some(t =>
    t.name.toLowerCase() === search.trim().toLowerCase()
  )

  const handleCreate = async () => {
    const name = newName.trim()
    if (!name || saving) return
    setSaving(true)
    await onCreate(name, newColor)
    setNewName('')
    setShowCreate(false)
    setSearch('')
    setSaving(false)
  }

  const startEdit = (tag: UserTag, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingTagId(tag.id)
    setEditName(tag.name)
    setEditColor(tag.color_hex ?? TAG_COLORS[0])
    setShowCreate(false)
  }

  const handleUpdate = async (tag: UserTag) => {
    const name = editName.trim()
    if (!name || editSaving) return
    setEditSaving(true)
    await onUpdate(tag, name, editColor)
    setEditingTagId(null)
    setEditSaving(false)
  }

  return (
    <div style={s.tagPanel}>
      <div style={s.tagPanelSearchRow}>
        <input
          ref={searchRef}
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar etiqueta..."
          style={s.tagPanelSearchInput}
        />
      </div>

      <div style={s.tagPanelList}>
        {filtered.map(tag => {
          const assigned = assignedTagIds.has(tag.id)
          const color = tag.color_hex ?? '#A14D36'
          const isEditing = editingTagId === tag.id

          if (isEditing) {
            return (
              <div key={tag.id} style={s.tagEditForm}>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleUpdate(tag)
                    if (e.key === 'Escape') setEditingTagId(null)
                  }}
                  style={s.tagCreateInput}
                  autoFocus
                />
                <div style={s.tagColorGrid}>
                  {TAG_COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setEditColor(c)}
                      aria-label={`Color ${c}`}
                      style={{
                        ...s.tagColorBtn,
                        backgroundColor: c,
                        outline: editColor === c ? `2px solid ${c}` : 'none',
                        outlineOffset: '2px',
                        transform: editColor === c ? 'scale(1.2)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>
                <div style={s.tagCreateRow}>
                  <button type="button" onClick={() => setEditingTagId(null)} style={s.tagCreateCancel}>
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdate(tag)}
                    disabled={!editName.trim() || editSaving}
                    style={{
                      ...s.tagCreateSave,
                      backgroundColor: editColor,
                      opacity: !editName.trim() || editSaving ? 0.5 : 1,
                    }}
                  >
                    {editSaving ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>
            )
          }

          return (
            <div
              key={tag.id}
              style={{
                ...s.tagPanelItemRow,
                backgroundColor: assigned ? `${color}18` : 'transparent',
              }}
            >
              <button
                type="button"
                onClick={() => onToggle(tag)}
                style={s.tagPanelItemBtn}
              >
                <span style={{ ...s.tagPanelItemDot, backgroundColor: color }} />
                <span style={s.tagPanelItemName}>{tag.name}</span>
                {assigned && <span style={s.tagPanelItemCheck}>✓</span>}
              </button>
              <button
                type="button"
                onClick={e => startEdit(tag, e)}
                style={s.tagEditBtn}
                aria-label={`Editar etiqueta ${tag.name}`}
              >
                ✎
              </button>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <p style={s.tagPanelEmpty}>
            {search ? `Sin resultados para "${search}"` : 'No tienes etiquetas aún'}
          </p>
        )}
      </div>

      {!showCreate ? (
        <button
          type="button"
          onClick={() => { setShowCreate(true); setNewName(search) }}
          style={s.tagPanelCreateTrigger}
        >
          + {search && !hasExact ? `Crear "${search}"` : 'Nueva etiqueta'}
        </button>
      ) : (
        <div style={s.tagCreateForm}>
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            placeholder="Nombre de la etiqueta"
            style={s.tagCreateInput}
            autoFocus
          />
          <div style={s.tagColorGrid}>
            {TAG_COLORS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setNewColor(color)}
                aria-label={`Color ${color}`}
                style={{
                  ...s.tagColorBtn,
                  backgroundColor: color,
                  outline: newColor === color ? `2px solid ${color}` : 'none',
                  outlineOffset: '2px',
                  transform: newColor === color ? 'scale(1.2)' : 'scale(1)',
                }}
              />
            ))}
          </div>
          <div style={s.tagCreateRow}>
            <button type="button" onClick={() => setShowCreate(false)} style={s.tagCreateCancel}>
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={!newName.trim() || saving}
              style={{
                ...s.tagCreateSave,
                backgroundColor: newColor,
                opacity: !newName.trim() || saving ? 0.5 : 1,
              }}
            >
              {saving ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── ItemDetail ────────────────────────────────────────────────────────────────

export function ItemDetail({ itemId }: { itemId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [item, setItem] = useState<ItemData | null>(null)
  const [userTags, setUserTags] = useState<UserTag[]>([])
  const [assignedTagIds, setAssignedTagIds] = useState<Set<string>>(new Set())
  const [showTagPanel, setShowTagPanel] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showCopyToast, setShowCopyToast] = useState(false)
  const [faviconError, setFaviconError] = useState(false)
  const { toggleRead } = useToggleRead()

  useEffect(() => {
    let active = true

    const load = async () => {
      const supabase = getSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !active) return

      const [itemRes, tagsRes, itemTagsRes] = await Promise.all([
        supabase.from('items_with_links').select('*').eq('id', itemId).single(),
        supabase.from('tags').select('id, name, slug, color_hex').eq('user_id', user.id).order('name'),
        supabase.from('item_tags').select('tag_id').eq('item_id', itemId),
      ])

      if (!active) return

      if (itemRes.error || !itemRes.data) {
        setError('No se pudo cargar el recurso.')
        setLoading(false)
        return
      }

      setItem(itemRes.data as ItemData)
      setUserTags(tagsRes.data ?? [])
      setAssignedTagIds(new Set((itemTagsRes.data ?? []).map((t: { tag_id: string }) => t.tag_id)))
      setLoading(false)
    }

    load()
    return () => { active = false }
  }, [itemId])

  const handleToggleRead = useCallback(async () => {
    if (!item) return
    const newRead = !item.is_read
    setItem(prev => prev ? { ...prev, is_read: newRead } : prev)
    const ok = await toggleRead(item.id, item.is_read)
    if (!ok) setItem(prev => prev ? { ...prev, is_read: item.is_read } : prev)
  }, [item, toggleRead])

  const handleCopyUrl = useCallback(() => {
    if (!item?.url) return
    navigator.clipboard.writeText(item.url).then(() => {
      setShowCopyToast(true)
      setTimeout(() => setShowCopyToast(false), 2000)
    })
  }, [item])

  const handleDelete = useCallback(async () => {
    if (!item) return
    setDeleting(true)
    const supabase = getSupabaseBrowserClient()
    const { error: err } = await supabase.from('items').delete().eq('id', item.id)
    if (err) { setDeleting(false); return }
    router.replace('/home')
  }, [item, router])

  const handleTagToggle = useCallback(async (tag: UserTag) => {
    const isAssigned = assignedTagIds.has(tag.id)
    const supabase = getSupabaseBrowserClient()

    setAssignedTagIds(prev => {
      const next = new Set(prev)
      isAssigned ? next.delete(tag.id) : next.add(tag.id)
      return next
    })

    if (isAssigned) {
      await supabase.from('item_tags').delete().eq('item_id', itemId).eq('tag_id', tag.id)
    } else {
      await supabase.from('item_tags').upsert(
        { item_id: itemId, tag_id: tag.id },
        { onConflict: 'item_id,tag_id' }
      )
    }
  }, [assignedTagIds, itemId])

  const handleTagCreate = useCallback(async (name: string, color: string) => {
    const supabase = getSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const slug = slugify(name)

    const { data: existing } = await supabase
      .from('tags')
      .select('id')
      .eq('user_id', user.id)
      .eq('slug', slug)
      .maybeSingle()

    let tagId: string

    if (existing) {
      tagId = existing.id
    } else {
      const { data: created } = await supabase
        .from('tags')
        .insert({ user_id: user.id, name, slug, color_hex: color })
        .select('id')
        .single()
      if (!created) return
      tagId = created.id
      const newTag: UserTag = { id: tagId, name, slug, color_hex: color }
      setUserTags(prev => [...prev, newTag].sort((a, b) => a.name.localeCompare(b.name)))
    }

    await supabase.from('item_tags').upsert(
      { item_id: itemId, tag_id: tagId },
      { onConflict: 'item_id,tag_id' }
    )
    setAssignedTagIds(prev => new Set([...prev, tagId]))
  }, [itemId])

  const handleTagUpdate = useCallback(async (tag: UserTag, name: string, color: string) => {
    const slug = slugify(name)
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase
      .from('tags')
      .update({ name, slug, color_hex: color })
      .eq('id', tag.id)
    if (error) return
    setUserTags(prev =>
      prev.map(t => t.id === tag.id ? { ...t, name, slug, color_hex: color } : t)
        .sort((a, b) => a.name.localeCompare(b.name))
    )
  }, [])

  // ── Loading ──

  if (loading) {
    return (
      <main style={s.page}>
        <div style={s.skeletonBack} />
        <div style={s.skeletonCard}>
          <div style={s.skeletonImage} />
          <div style={s.skeletonContent}>
            <div style={{ ...s.skeletonLine, width: '35%', height: '12px' }} />
            <div style={{ ...s.skeletonLine, width: '88%', height: '26px', marginTop: '8px' }} />
            <div style={{ ...s.skeletonLine, width: '55%', height: '12px', marginTop: '6px' }} />
            <div style={{ ...s.skeletonLine, width: '100%', height: '12px', marginTop: '20px' }} />
            <div style={{ ...s.skeletonLine, width: '75%', height: '12px', marginTop: '8px' }} />
          </div>
        </div>
        <style jsx>{`
          @keyframes shimmer {
            0%   { background-position: -500px 0; }
            100% { background-position: 500px 0; }
          }
        `}</style>
      </main>
    )
  }

  if (error || !item) {
    return (
      <main style={s.page}>
        <button type="button" onClick={() => router.back()} style={s.backButton}>← Volver</button>
        <p style={s.errorText}>{error ?? 'Recurso no encontrado.'}</p>
      </main>
    )
  }

  const title = item.og_title || item.title || item.domain || 'Recurso sin título'
  const description = item.og_description || item.description || null
  const thumbnail = item.og_image_url || item.preview_image_url || null
  const domain = item.domain ?? ''
  const faviconSrc = domain && !faviconError
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
    : null

  const assignedTags = userTags.filter(t => assignedTagIds.has(t.id))

  return (
    <main style={s.page}>

      <button type="button" onClick={() => router.back()} style={s.backButton}>← Volver</button>

      <div style={s.card}>

        {/* ── Imagen / cabecera ── */}
        {thumbnail ? (
          <div style={s.imageContainer}>
            <img src={thumbnail} alt={title} style={s.image} />
          </div>
        ) : (
          <div style={s.gradientHeader}>
            <div style={s.gradientHeaderInner} />
          </div>
        )}

        <div style={s.cardContent}>

          {/* ── Fuente ── */}
          <div style={s.sourceRow}>
            {faviconSrc && (
              <img src={faviconSrc} alt="" style={s.favicon} onError={() => setFaviconError(true)} />
            )}
            {domain && <span style={s.domainText}>{domain}</span>}
            {domain && <span style={s.sourceDot}>·</span>}
            <span style={s.dateText}>{formatDate(item.created_at)}</span>
          </div>

          {/* ── Título ── */}
          <h1 style={s.title}>{title}</h1>

          {/* ── Badge leído ── */}
          <button
            type="button"
            onClick={handleToggleRead}
            style={{
              ...s.readBadge,
              backgroundColor: item.is_read ? '#e8f5e920' : '#A14D3614',
              color: item.is_read ? '#2e7d32' : '#A14D36',
              borderColor: item.is_read ? '#2e7d3240' : '#A14D3640',
            }}
          >
            {item.is_read ? '✓ Leído' : '◯ Sin leer'}
          </button>

          {/* ── Descripción ── */}
          {description && (
            <>
              <div style={s.divider} />
              <div style={s.section}>
                <p style={s.sectionLabel}>Descripción</p>
                <p style={s.descriptionText}>{description}</p>
              </div>
            </>
          )}

          <div style={s.divider} />

          {/* ── Etiquetas ── */}
          <div style={s.section}>
            <div style={s.tagsHeader}>
              <p style={s.sectionLabel}>Etiquetas</p>
              <button
                type="button"
                onClick={() => setShowTagPanel(v => !v)}
                style={{
                  ...s.addTagButton,
                  backgroundColor: showTagPanel ? '#A14D3614' : 'transparent',
                }}
              >
                {showTagPanel ? '✕ Cerrar' : '+ Gestionar'}
              </button>
            </div>

            <div style={s.tagsRow}>
              {assignedTags.length === 0 && !showTagPanel && (
                <span style={s.tagsEmpty}>Sin etiquetas</span>
              )}
              {assignedTags.map(tag => {
                const color = tag.color_hex ?? '#A14D36'
                return (
                  <span
                    key={tag.id}
                    style={{
                      ...s.tagPill,
                      backgroundColor: `${color}18`,
                      borderColor: `${color}40`,
                    }}
                  >
                    <span style={{ ...s.tagDot, backgroundColor: color }} />
                    {tag.name}
                  </span>
                )
              })}
            </div>

            {showTagPanel && (
              <TagPanel
                userTags={userTags}
                assignedTagIds={assignedTagIds}
                onToggle={handleTagToggle}
                onCreate={handleTagCreate}
                onUpdate={handleTagUpdate}
                onClose={() => setShowTagPanel(false)}
              />
            )}
          </div>

          <div style={s.divider} />

          {/* ── Meta ── */}
          <div style={s.metaGrid}>
            <div style={s.metaItem}>
              <span style={s.metaLabel}>Tipo</span>
              <span style={s.metaValue}>{item.type === 'link' ? 'Enlace' : 'Archivo'}</span>
            </div>
            {item.read_time_minutes ? (
              <div style={s.metaItem}>
                <span style={s.metaLabel}>Lectura</span>
                <span style={s.metaValue}>{item.read_time_minutes} min</span>
              </div>
            ) : null}
            {item.site_name ? (
              <div style={s.metaItem}>
                <span style={s.metaLabel}>Fuente</span>
                <span style={s.metaValue}>{item.site_name}</span>
              </div>
            ) : null}
            <div style={s.metaItem}>
              <span style={s.metaLabel}>Guardado</span>
              <span style={s.metaValue}>{formatDate(item.created_at)}</span>
            </div>
          </div>

          <div style={s.divider} />

          {/* ── Acciones ── */}
          <div style={s.actionsCol}>
            {item.url && (
              <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
                <button type="button" style={s.actionPrimary}>
                  Abrir enlace ↗
                </button>
              </a>
            )}
            <div style={s.actionsRow}>
              {item.url && (
                <button type="button" onClick={handleCopyUrl} style={s.actionSecondary}>
                  Copiar URL
                </button>
              )}
              <button type="button" onClick={handleToggleRead} style={s.actionSecondary}>
                {item.is_read ? 'Marcar no leído' : 'Marcar leído'}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(v => !v)}
              style={s.actionDanger}
            >
              Eliminar recurso
            </button>

            {showDeleteConfirm && (
              <div style={s.deleteCard}>
                <p style={s.deleteText}>¿Seguro? Esta acción no se puede deshacer.</p>
                <div style={s.deleteRow}>
                  <button type="button" onClick={() => setShowDeleteConfirm(false)} style={s.actionSecondary}>
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    style={{ ...s.actionDeleteConfirm, opacity: deleting ? 0.6 : 1 }}
                  >
                    {deleting ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── Toast ── */}
      {showCopyToast && <div style={s.toast}>URL copiada</div>}

      <style jsx>{`
        @keyframes shimmer {
          0%   { background-position: -500px 0; }
          100% { background-position:  500px 0; }
        }
      `}</style>
    </main>
  )
}
