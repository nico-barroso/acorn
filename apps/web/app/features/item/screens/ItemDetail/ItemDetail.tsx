'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import { useToggleRead } from '@/hooks/useToggleRead'
import { detailStyles } from './ItemDetail.styles'

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

export function ItemDetail({ itemId }: { itemId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [item, setItem] = useState<ItemData | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showCopyToast, setShowCopyToast] = useState(false)
  const { toggleRead } = useToggleRead()

  useEffect(() => {
    let active = true

    const fetchItem = async () => {
      const supabase = getSupabaseBrowserClient()
      const { data, error: fetchError } = await supabase
        .from('items_with_links')
        .select('*')
        .eq('id', itemId)
        .single()

      if (!active) return

      if (fetchError || !data) {
        setError('No se pudo cargar el recurso. Puede que haya sido eliminado.')
        setLoading(false)
        return
      }

      setItem(data as ItemData)
      setLoading(false)
    }

    fetchItem()

    return () => {
      active = false
    }
  }, [itemId])

  const handleToggleRead = useCallback(async () => {
    if (!item) return
    const newRead = !item.is_read
    setItem((prev) => (prev ? { ...prev, is_read: newRead } : prev))
    const success = await toggleRead(item.id, item.is_read)
    if (!success) {
      setItem((prev) => (prev ? { ...prev, is_read: item.is_read } : prev))
    }
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
    const { error: deleteError } = await supabase.from('items').delete().eq('id', item.id)

    if (deleteError) {
      setDeleting(false)
      setError('No se pudo eliminar el recurso. Intentalo de nuevo.')
      return
    }

    router.replace('/home')
  }, [item, router])

  if (loading) {
    return (
      <main style={detailStyles.page}>
        <div style={detailStyles.skeletonCard}>
          <div style={{ ...detailStyles.skeletonLine, ...detailStyles.skeletonLineLong }} />
          <div style={{ ...detailStyles.skeletonLine, ...detailStyles.skeletonLineMedium }} />
          <div style={{ ...detailStyles.skeletonLine, ...detailStyles.skeletonLineShort }} />
        </div>
      </main>
    )
  }

  if (error || !item) {
    return (
      <main style={detailStyles.page}>
        <button type='button' onClick={() => router.back()} style={detailStyles.backButton}>
          <span style={detailStyles.backArrow}>&#8592;</span> Volver
        </button>
        <p style={detailStyles.errorText}>{error || 'Recurso no encontrado.'}</p>
      </main>
    )
  }

  const displayTitle = item.og_title || item.title || item.domain || 'Recurso sin titulo'
  const displayDescription = item.og_description || item.description || null
  const thumbnailUrl = item.og_image_url || item.preview_image_url || null
  const createdLabel = new Date(item.created_at).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  const updatedLabel = new Date(item.updated_at).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  const tags = item.tags?.filter(Boolean) ?? []

  return (
    <main style={detailStyles.page}>
      <button type='button' onClick={() => router.back()} style={detailStyles.backButton}>
        <span style={detailStyles.backArrow}>&#8592;</span> Volver
      </button>

      <article style={detailStyles.card}>
        <div style={detailStyles.metaRow}>
          <span style={detailStyles.domainPill}>{item.domain || 'Sin dominio'}</span>
          <button
            type='button'
            onClick={handleToggleRead}
            style={{
              ...detailStyles.readBadge,
              ...(item.is_read ? detailStyles.readBadgeRead : detailStyles.readBadgeUnread)
            }}
            aria-label={item.is_read ? 'Marcar como no visto' : 'Marcar como visto'}
          >
            {item.is_read ? 'Visto' : 'No visto'}
          </button>
        </div>

        <h1 style={detailStyles.title}>{displayTitle}</h1>

        <p style={detailStyles.dateText}>
          Guardado el {createdLabel}
          {updatedLabel !== createdLabel ? ` · Actualizado el ${updatedLabel}` : ''}
        </p>

        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={displayTitle} style={detailStyles.thumbnail} />
        ) : null}

        {displayDescription ? (
          <>
            <h2 style={detailStyles.descriptionTitle}>Descripcion</h2>
            <p style={detailStyles.descriptionText}>{displayDescription}</p>
          </>
        ) : null}

        {tags.length > 0 ? (
          <div style={detailStyles.tagsSection}>
            <p style={detailStyles.tagsLabel}>Etiquetas</p>
            <div style={detailStyles.tagsRow}>
              {tags.map((tag) => (
                <span key={tag} style={detailStyles.tagPill}>{tag}</span>
              ))}
            </div>
          </div>
        ) : null}

        <div style={detailStyles.metaSection}>
          {item.site_name ? (
            <div style={detailStyles.metaCard}>
              <p style={detailStyles.metaLabel}>Fuente</p>
              <p style={detailStyles.metaValue}>{item.site_name}</p>
            </div>
          ) : null}
          {item.read_time_minutes ? (
            <div style={detailStyles.metaCard}>
              <p style={detailStyles.metaLabel}>Tiempo de lectura</p>
              <p style={detailStyles.metaValue}>{item.read_time_minutes} min</p>
            </div>
          ) : null}
          <div style={detailStyles.metaCard}>
            <p style={detailStyles.metaLabel}>Tipo</p>
            <p style={detailStyles.metaValue}>{item.type === 'link' ? 'Enlace' : 'Archivo'}</p>
          </div>
          <div style={detailStyles.metaCard}>
            <p style={detailStyles.metaLabel}>Estado</p>
            <p style={detailStyles.metaValue}>{item.is_read ? 'Visto' : 'No visto'}</p>
          </div>
        </div>

        <div style={detailStyles.actionsRow}>
          {item.url ? (
            <>
              <a href={item.url} target='_blank' rel='noopener noreferrer' style={{ textDecoration: 'none' }}>
                <button type='button' style={detailStyles.actionButtonPrimary}>
                  Abrir enlace
                </button>
              </a>
              <button type='button' onClick={handleCopyUrl} style={detailStyles.actionButton}>
                  Copiar URL
              </button>
            </>
          ) : null}
          <button type='button' onClick={handleToggleRead} style={detailStyles.actionButton}>
            {item.is_read ? 'Marcar como no visto' : 'Marcar como visto'}
          </button>
          <button type='button' onClick={() => setShowDeleteConfirm(true)} style={detailStyles.actionButtonDanger}>
            Eliminar
          </button>
        </div>

        {showDeleteConfirm ? (
          <div style={detailStyles.deleteConfirmCard}>
            <p style={detailStyles.deleteConfirmText}>
              Seguro que quieres eliminar este recurso? Esta accion no se puede deshacer.
            </p>
            <div style={detailStyles.deleteConfirmRow}>
              <button
                type='button'
                onClick={() => setShowDeleteConfirm(false)}
                style={detailStyles.actionButton}
              >
                Cancelar
              </button>
              <button
                type='button'
                onClick={handleDelete}
                disabled={deleting}
                style={detailStyles.actionButtonDanger}
              >
                {deleting ? 'Eliminando...' : 'Eliminar definitivamente'}
              </button>
            </div>
          </div>
        ) : null}
      </article>

      {showCopyToast ? (
        <div style={detailStyles.copyToast}>URL copiada al portapapeles</div>
      ) : null}

      <style jsx>{`
        @keyframes skeletonPulse {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </main>
  )
}