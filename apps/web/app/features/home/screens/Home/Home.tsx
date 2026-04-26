'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '../../../../lib/supabase'
import { useToggleRead } from '../../../../hooks/useToggleRead'
import { homeStyles } from './Home.styles'

type ResourceRow = {
  id: string
  title: string | null
  description: string | null
  domain: string | null
  url: string | null
  created_at: string
  is_read: boolean
  tags: string[] | null
}

type ResourceCard = {
  id: string
  title: string
  description: string
  domain: string
  createdAtLabel: string
  isRead: boolean
}

type Cursor = {
  createdAt: string
  id: string
}

const PAGE_SIZE = 12

function mapResource(row: ResourceRow): ResourceCard {
  return {
    id: row.id,
    title: row.title?.trim() || row.domain || row.url || 'Recurso sin titulo',
    description: row.description?.trim() || 'Sin descripcion disponible.',
    domain: row.domain || 'Sin dominio',
    createdAtLabel: new Date(row.created_at).toLocaleDateString(),
    isRead: Boolean(row.is_read)
  }
}

function getInitials(email: string) {
  const clean = email.trim()

  if (!clean) {
    return 'AC'
  }

  const parts = clean.split('@')[0]?.split(/[._-]/).filter(Boolean) ?? []

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }

  return clean.slice(0, 2).toUpperCase()
}

export function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [resources, setResources] = useState<ResourceCard[]>([])
  const [page, setPage] = useState(1)
  const [cursor, setCursor] = useState<Cursor | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const { toggleRead } = useToggleRead()

  const initialPageRef = useRef<number | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const currentPage = useMemo(() => page, [page])
  const readCount = useMemo(() => resources.filter((resource) => resource.isRead).length, [resources])
  const unreadCount = resources.length - readCount

  const fetchResourcesPage = async (currentCursor: Cursor | null) => {
    const supabase = getSupabaseBrowserClient()

    let query = supabase
      .from('items_with_links')
      .select('id,title,description,domain,url,created_at,is_read,tags')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .limit(PAGE_SIZE)

    if (currentCursor) {
      query = query.or(
        `created_at.lt.${currentCursor.createdAt},and(created_at.eq.${currentCursor.createdAt},id.lt.${currentCursor.id})`
      )
    }

    const { data, error: queryError } = await query

    if (queryError) {
      throw queryError
    }

    const rows = (data ?? []) as ResourceRow[]
    const mapped = rows.map(mapResource)
    const lastRow = rows[rows.length - 1]

    return {
      resources: mapped,
      nextCursor: lastRow
        ? {
            createdAt: lastRow.created_at,
            id: lastRow.id
          }
        : null,
      hasMore: rows.length === PAGE_SIZE
    }
  }

  useEffect(() => {
    let active = true

    const loadInitialState = async () => {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase.auth.getUser()

      if (!active) {
        return
      }

      if (error || !data.user) {
        router.replace('/login')
        return
      }

      setEmail(data.user.email ?? 'usuario')
      setError('')

      if (initialPageRef.current === null) {
        const rawPage = Number(new URLSearchParams(window.location.search).get('page') || '1')
        initialPageRef.current = Number.isFinite(rawPage) && rawPage > 1 ? Math.floor(rawPage) : 1
      }

      const targetPage = initialPageRef.current ?? 1
      let localCursor: Cursor | null = null
      let localResources: ResourceCard[] = []
      let localHasMore = true

      for (let i = 1; i <= targetPage; i += 1) {
        const pagePayload = await fetchResourcesPage(localCursor)
        localResources = [...localResources, ...pagePayload.resources]
        localCursor = pagePayload.nextCursor
        localHasMore = pagePayload.hasMore

        if (!localHasMore) {
          break
        }
      }

      if (!active) {
        return
      }

      setResources(localResources)
      setCursor(localCursor)
      setHasMore(localHasMore)
      setPage(targetPage)
      setLoading(false)
    }

    loadInitialState().catch(() => {
      if (!active) {
        return
      }

      setError('No se pudieron cargar tus recursos. Intenta refrescar la pagina.')
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [router])

  const handleLoadMore = useCallback(async () => {
    if (!hasMore || loadingMore || loading) {
      return
    }

    setLoadingMore(true)
    setError('')

    try {
      const pagePayload = await fetchResourcesPage(cursor)
      setResources((current) => [...current, ...pagePayload.resources])
      setCursor(pagePayload.nextCursor)
      setHasMore(pagePayload.hasMore)

      const nextPage = page + 1
      setPage(nextPage)
      router.push(`/home?page=${nextPage}`)
    } catch {
      setError('No se pudo cargar la siguiente pagina. Intentalo de nuevo.')
    } finally {
      setLoadingMore(false)
    }
  }, [cursor, hasMore, loading, loadingMore, page, router])

  useEffect(() => {
    const target = sentinelRef.current

    if (!target) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        if (entry?.isIntersecting) {
          void handleLoadMore()
        }
      },
      {
        rootMargin: '240px 0px'
      }
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [handleLoadMore])

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.replace('/login')
  }

  const handleToggleRead = useCallback(async (itemId: string, currentIsRead: boolean) => {
    setResources((current) =>
      current.map((r) => (r.id === itemId ? { ...r, isRead: !currentIsRead } : r))
    )

    const success = await toggleRead(itemId, currentIsRead)

    if (!success) {
      setResources((current) =>
        current.map((r) => (r.id === itemId ? { ...r, isRead: currentIsRead } : r))
      )
    }
  }, [toggleRead])

  if (loading) {
    return (
      <main style={homeStyles.page}>
        <p style={homeStyles.loading}>Cargando tu espacio privado...</p>
      </main>
    )
  }

  return (
    <main style={homeStyles.page}>
      <header style={homeStyles.hero}>
        <div style={homeStyles.heroTopRow}>
          <div style={homeStyles.userPill}>
            <span style={homeStyles.userPillAvatar}>{getInitials(email)}</span>
            <p style={homeStyles.userPillText}>Sesion activa</p>
          </div>

          <button type='button' style={homeStyles.signOutButton} onClick={handleSignOut}>
            Cerrar sesion
          </button>
        </div>

        <h1 style={homeStyles.heroTitle}>Tu biblioteca de recursos</h1>
        <p style={homeStyles.heroSubtitle}>
          Bienvenida, {email}. Explora tus enlaces guardados, continua donde lo dejaste y carga mas contenido sin
          recargar la pagina.
        </p>

        <div style={homeStyles.metricsRow}>
          <article style={homeStyles.metricCard}>
            <p style={homeStyles.metricLabel}>Total</p>
            <p style={homeStyles.metricValue}>{resources.length}</p>
          </article>
          <article style={homeStyles.metricCard}>
            <p style={homeStyles.metricLabel}>No vistos</p>
            <p style={homeStyles.metricValue}>{unreadCount}</p>
          </article>
          <article style={homeStyles.metricCard}>
            <p style={homeStyles.metricLabel}>Pagina</p>
            <p style={homeStyles.metricValue}>{currentPage}</p>
          </article>
        </div>
      </header>

      <div style={homeStyles.sectionHeader}>
        <h2 style={homeStyles.sectionTitle}>Listado</h2>
        <p style={homeStyles.sectionMeta}>Leidos: {readCount}</p>
      </div>

      {resources.length === 0 && !error ? (
        <section style={homeStyles.emptyState}>
          <h2 style={homeStyles.emptyTitle}>Aún no tienes recursos</h2>
          <p style={homeStyles.emptyText}>Guarda tu primer enlace para empezar a construir tu biblioteca.</p>
        </section>
      ) : null}

      {error ? <p style={homeStyles.errorText}>{error}</p> : null}

      <section style={homeStyles.list} className='home-resource-grid'>
        {resources.map((resource) => (
          <article key={resource.id} style={homeStyles.resourceCard}>
            <div style={homeStyles.cardTopRow}>
              <h2 style={homeStyles.resourceTitle}>{resource.title}</h2>
              <span style={homeStyles.domainPill}>{resource.domain}</span>
            </div>
            <p style={homeStyles.resourceMeta}>
              Guardado {resource.createdAtLabel}
            </p>
            <p style={homeStyles.resourceSnippet}>{resource.description}</p>
            <button
              type='button'
              onClick={() => void handleToggleRead(resource.id, resource.isRead)}
              style={resource.isRead ? homeStyles.statusBadgeRead : homeStyles.statusBadge}
              aria-label={resource.isRead ? 'Marcar como no visto' : 'Marcar como visto'}
            >
              {resource.isRead ? 'Visto' : 'No visto'}
            </button>
          </article>
        ))}
      </section>

      {loadingMore ? (
        <section style={homeStyles.list} className='home-resource-grid' aria-label='Cargando siguiente pagina'>
          {Array.from({ length: 3 }).map((_, index) => (
            <article key={`skeleton-${index}`} style={homeStyles.skeletonCard}>
              <div style={{ ...homeStyles.skeletonLine, ...homeStyles.skeletonLineLong }} />
              <div style={{ ...homeStyles.skeletonLine, ...homeStyles.skeletonLineMedium }} />
              <div style={{ ...homeStyles.skeletonLine, ...homeStyles.skeletonLineShort }} />
            </article>
          ))}
        </section>
      ) : null}

      <section style={homeStyles.bottomArea}>
        {hasMore ? (
          <button type='button' style={homeStyles.loadMoreButton} onClick={() => void handleLoadMore()}>
            Cargar mas
          </button>
        ) : null}

        <div ref={sentinelRef} style={homeStyles.observerSentinel} aria-hidden />

        {!hasMore && resources.length > 0 ? <p style={homeStyles.endText}>Has llegado al final del listado.</p> : null}
      </section>

      <style jsx>{`
        @media (max-width: 900px) {
          .home-resource-grid {
            grid-template-columns: 1fr;
          }
        }

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
