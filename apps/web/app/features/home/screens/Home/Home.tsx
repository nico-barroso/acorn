'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import { useToggleRead } from '@/hooks/useToggleRead'
import { useProfile } from '@/features/profile/hooks/useProfile'
import { ResourceCard, type TagItem } from '@/features/shared/components/ResourceCard/ResourceCard'
import { SaveUrlModal } from './components/SaveUrlModal/SaveUrlModal'
import { homeStyles } from './Home.styles'
import { AcornLoader } from '@/features/shared/components/AcornLoader/AcornLoader'
import { usePageLoader } from '@/hooks/usePageLoader'

type ResourceRow = {
  id: string
  title: string | null
  description: string | null
  domain: string | null
  url: string | null
  created_at: string
  is_read: boolean
  tags: string[] | null
  preview_image_url?: string | null
  og_image_url?: string | null
  site_name?: string | null
}

type ResourceCardData = {
  id: string
  title: string
  description: string
  domain: string
  url: string | null
  thumbnailUrl: string | null
  createdAtLabel: string
  isRead: boolean
  tags: TagItem[]
  siteName: string | null
}

type Cursor = {
  createdAt: string
  id: string
}

const PAGE_SIZE = 12

function mapResource(row: ResourceRow, tagColorMap: Map<string, string | null>): ResourceCardData {
  return {
    id: row.id,
    title: row.title?.trim() || row.domain || row.url || 'Recurso sin titulo',
    description: row.description?.trim() || 'Sin descripcion disponible.',
    domain: row.domain || 'Sin dominio',
    url: row.url,
    thumbnailUrl: row.og_image_url || row.preview_image_url || null,
    createdAtLabel: new Date(row.created_at).toLocaleDateString(),
    isRead: Boolean(row.is_read),
    tags: (row.tags ?? []).filter(Boolean).map((name) => ({ name, color_hex: tagColorMap.get(name) ?? tagColorMap.get(name.toLowerCase()) ?? null })),
    siteName: row.site_name || null
  }
}

function getInitials(email: string) {
  const clean = email.trim()
  if (!clean) return 'AC'
  const parts = clean.split('@')[0]?.split(/[._-]/).filter(Boolean) ?? []
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return clean.slice(0, 2).toUpperCase()
}

function HeroDecoration() {
  return (
    <div style={homeStyles.heroGradient} aria-hidden>
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        viewBox="0 0 800 220"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden
      >
        <path d="M-100 10 C 150 130, 650 130, 900 10" stroke="rgba(192,110,82,0.22)" strokeWidth="1.5"/>
        <path d="M-100 55 C 150 175, 650 175, 900 55" stroke="rgba(192,110,82,0.14)" strokeWidth="1.2"/>
        <path d="M-100 100 C 150 210, 650 210, 900 100" stroke="rgba(192,110,82,0.09)" strokeWidth="1"/>
        <path d="M 60 -10 C 280 90, 520 90, 740 -10" stroke="rgba(161,77,54,0.16)" strokeWidth="1"/>
        <path d="M-50 165 C 200 70, 600 70, 850 165" stroke="rgba(192,110,82,0.08)" strokeWidth="1"/>
      </svg>
    </div>
  )
}

function HomeGradient() {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        backgroundImage: [
          'radial-gradient(ellipse 140% 45% at 50% 0%, rgba(192, 110, 82, 0.45) 0%, rgba(248, 237, 232, 0.18) 50%, rgba(255, 252, 251, 0) 100%)',
          'radial-gradient(ellipse 140% 65% at 50% 100%, rgba(192, 110, 82, 0.55) 0%, rgba(248, 237, 232, 0.25) 55%, rgba(255, 252, 251, 0) 100%)'
        ].join(', ')
      }}
    />
  )
}

function getFirstName(email: string) {
  const part = email.split('@')[0]?.split(/[._-]/)[0] ?? ''
  return part.charAt(0).toUpperCase() + part.slice(1)
}

export function Home() {
  const router = useRouter()
  const { profile } = useProfile()
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [resources, setResources] = useState<ResourceCardData[]>([])
  const [page, setPage] = useState(1)
  const [cursor, setCursor] = useState<Cursor | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [userId, setUserId] = useState('')
  const { toggleRead } = useToggleRead()

  const initialPageRef = useRef<number | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const tagColorMapRef = useRef<Map<string, string | null>>(new Map())

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'read'>('all')

  const currentPage = useMemo(() => page, [page])
  const readCount = useMemo(() => resources.filter((resource) => resource.isRead).length, [resources])
  const unreadCount = resources.length - readCount

  const filteredResources = useMemo(() => {
    if (activeFilter === 'unread') return resources.filter((r) => !r.isRead)
    if (activeFilter === 'read') return resources.filter((r) => r.isRead)
    return resources
  }, [resources, activeFilter])

  const fetchResourcesPage = async (currentCursor: Cursor | null, uid?: string) => {
    const supabase = getSupabaseBrowserClient()

    let excludedIds: string[] = []
    const currentUserId = uid || userId
    if (currentUserId) {
      const { data: folderItems } = await supabase
        .from('item_folders')
        .select('item_id')
        .eq('user_id', currentUserId)
      
      if (folderItems && folderItems.length > 0) {
        excludedIds = folderItems.map((row: { item_id: string }) => row.item_id)
      }
    }

    let query = supabase
      .from('items_with_links')
      .select('id,title,description,domain,url,created_at,is_read,tags,preview_image_url,og_image_url,site_name')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .limit(PAGE_SIZE)

    if (excludedIds.length > 0) {
      const formattedIds = excludedIds.map((id) => `"${id}"`).join(',')
      query = query.not('id', 'in', `(${formattedIds})`)
    }

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
    const mapped = rows.map((row) => mapResource(row, tagColorMapRef.current))
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
      setUserId(data.user.id)
      setError('')

      const { data: tagData } = await supabase
        .from('tags')
        .select('name,slug,color_hex')
        .eq('user_id', data.user.id)
      const map = new Map<string, string | null>()
      ;(tagData ?? []).forEach((t: { name: string; slug: string | null; color_hex: string | null }) => {
        map.set(t.name, t.color_hex)
        if (t.slug) map.set(t.slug, t.color_hex)
        map.set(t.name.toLowerCase(), t.color_hex)
      })
      tagColorMapRef.current = map

      if (initialPageRef.current === null) {
        const rawPage = Number(new URLSearchParams(window.location.search).get('page') || '1')
        initialPageRef.current = Number.isFinite(rawPage) && rawPage > 1 ? Math.floor(rawPage) : 1
      }

      const targetPage = initialPageRef.current ?? 1
      let localCursor: Cursor | null = null
      let localResources: ResourceCardData[] = []
      let localHasMore = true

      for (let i = 1; i <= targetPage; i += 1) {
        const pagePayload = await fetchResourcesPage(localCursor, data.user.id)
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

  const handleSaved = useCallback(() => {
    fetchResourcesPage(null, userId).then((pagePayload) => {
      setResources(pagePayload.resources)
      setCursor(pagePayload.nextCursor)
      setHasMore(pagePayload.hasMore)
      setPage(1)
    }).catch(() => {})
  }, [userId])

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

  const { showLoader, exiting: loaderExiting } = usePageLoader(loading)

  if (showLoader) {
    return <AcornLoader fullScreen exiting={loaderExiting} />
  }

  return (
    <main style={homeStyles.page} className="page-enter">

      <HomeGradient />
      <HeroDecoration />

      <div style={{ ...homeStyles.avatar, animation: 'fadeInScale 0.4s cubic-bezier(0.34,1.56,0.64,1) both' }}>
        {profile?.avatarUrl ? (
          <img src={profile.avatarUrl} alt={getInitials(email)} style={homeStyles.avatarImg} />
        ) : (
          getInitials(email)
        )}
      </div>

      <div style={homeStyles.inner} className='home-inner'>

        <header style={homeStyles.header}>
          <div style={{ ...homeStyles.greeting, animation: 'fadeInUp 0.45s ease both' }}>
            <h1 style={homeStyles.greetingTitle}>Hola, {getFirstName(email)}</h1>
            <p style={homeStyles.greetingWelcome}>¡Qué alegría verte!</p>
            <p style={homeStyles.greetingSubtitle}>
              {unreadCount > 0
                ? `Tienes ${unreadCount} recurso${unreadCount !== 1 ? 's' : ''} sin leer`
                : 'Estás al día con todos tus recursos'}
            </p>
          </div>
        </header>

        <div style={{ ...homeStyles.metricsRow, animation: 'fadeInUp 0.45s 100ms ease both' }}>
          <div style={homeStyles.metricPill}>
            <p style={homeStyles.metricValue}>{resources.length}</p>
            <p style={homeStyles.metricLabel}>guardados</p>
          </div>
          {unreadCount > 0 ? (
            <div style={homeStyles.metricPill}>
              <span style={{ ...homeStyles.metricDot, animation: 'microPulse 2.5s ease-in-out infinite' }} />
              <p style={homeStyles.metricValue}>{unreadCount}</p>
              <p style={homeStyles.metricLabel}>sin leer</p>
            </div>
          ) : null}
        </div>

        {resources.length > 0 ? (
          <div style={{ ...homeStyles.filterRow, animation: 'fadeInUp 0.45s 180ms ease both' }}>
            {([
              { key: 'all',    label: `Todos (${resources.length})` },
              { key: 'unread', label: `Sin leer (${unreadCount})` },
              { key: 'read',   label: `Leídos (${readCount})` }
            ] as const).map((btn) => (
              <button
                key={btn.key}
                type="button"
                onClick={() => setActiveFilter(btn.key)}
                className='home-filter-btn'
                style={activeFilter === btn.key ? homeStyles.filterButtonActive : homeStyles.filterButton}
              >
                {btn.label}
              </button>
            ))}
          </div>
        ) : null}

        {resources.length === 0 && !error ? (
          <section style={{ ...homeStyles.emptyState, animation: 'fadeInUp 0.4s ease both' }}>
            <h2 style={homeStyles.emptyTitle}>Aún no tienes recursos</h2>
            <p style={homeStyles.emptyText}>
              Guarda tu primer enlace para empezar a construir tu biblioteca personal.
            </p>
            <button type='button' onClick={() => setShowSaveModal(true)} className='home-empty-cta' style={homeStyles.emptyCtaButton}>
              Guardar mi primer enlace
            </button>
          </section>
        ) : null}

        {error ? <p style={homeStyles.errorText}>{error}</p> : null}

        {filteredResources.length === 0 && resources.length > 0 ? (
          <section style={{ ...homeStyles.emptyState, animation: 'fadeInUp 0.4s ease both' }}>
            <p style={homeStyles.emptyText}>
              {activeFilter === 'unread' ? 'No tienes recursos sin leer. ¡Buen trabajo!' : 'No tienes recursos leídos todavía.'}
            </p>
          </section>
        ) : null}

        <section key={activeFilter} style={homeStyles.list} className='home-resource-grid'>
          {filteredResources.map((resource, index) => (
            <Link key={resource.id} href={`/item/${resource.id}`} style={{ textDecoration: 'none', color: 'inherit', animation: `fadeInUp 0.4s ease ${Math.min(index, 8) * 40}ms both` }}>
              <ResourceCard
                id={resource.id}
                title={resource.title}
                description={resource.description}
                domain={resource.domain}
                url={resource.url}
                thumbnailUrl={resource.thumbnailUrl}
                createdAtLabel={resource.createdAtLabel}
                isRead={resource.isRead}
                tags={resource.tags}
                siteName={resource.siteName}
                onToggleRead={(id, current) => void handleToggleRead(id, current)}
                onCopyUrl={(url) => { navigator.clipboard.writeText(url) }}
              />
            </Link>
          ))}
        </section>

        {loadingMore ? (
          <section style={homeStyles.list} className='home-resource-grid' aria-label='Cargando más recursos'>
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
            <button type='button' className='home-load-more' style={homeStyles.loadMoreButton} onClick={() => void handleLoadMore()}>
              Cargar más
            </button>
          ) : null}
          <div ref={sentinelRef} style={homeStyles.observerSentinel} aria-hidden />
          {!hasMore && resources.length > 0 ? (
            <p style={homeStyles.endText}>Has visto todos tus recursos.</p>
          ) : null}
        </section>

      </div>

      {showSaveModal && userId ? (
        <SaveUrlModal userId={userId} onClose={() => setShowSaveModal(false)} onSaved={handleSaved} />
      ) : null}

      <style jsx>{`
        @media (max-width: 900px) {
          .home-resource-grid {
            grid-template-columns: 1fr;
          }

          .home-inner {
            padding-top: 20px !important;
          }
        }

        @keyframes skeletonPulse {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.82); }
          to   { opacity: 1; transform: scale(1); }
        }

        @keyframes microPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }

        .home-filter-btn {
          transition: background-color 0.15s ease, border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
        }
        .home-filter-btn:hover {
          background-color: rgba(161,77,54,0.06) !important;
          border-color: rgba(161,77,54,0.22) !important;
          transform: translateY(-1px);
        }
        .home-filter-btn:active {
          transform: translateY(0) scale(0.96);
        }

        .home-load-more {
          transition: background-color 0.15s ease, transform 0.18s ease, box-shadow 0.18s ease;
        }
        .home-load-more:hover {
          background-color: rgba(161,77,54,0.04) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(72,57,42,0.1);
        }
        .home-load-more:active {
          transform: translateY(0) scale(0.98);
        }

        .home-empty-cta {
          transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease;
        }
        .home-empty-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(161,77,54,0.32);
        }
        .home-empty-cta:active {
          transform: translateY(0) scale(0.97);
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-delay: 0ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  )
}
