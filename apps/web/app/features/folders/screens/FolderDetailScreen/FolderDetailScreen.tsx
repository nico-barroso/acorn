'use client'

import Link from 'next/link'
import { AcornLoader } from '@/features/shared/components/AcornLoader/AcornLoader'
import { useFolderDetail } from '../../hooks/useFolderDetail'
import { ResourceCard } from '@/features/shared/components/ResourceCard/ResourceCard'
import { useToggleRead } from '@/hooks/useToggleRead'
import { useCallback } from 'react'
import { folderDetailStyles as s } from './FolderDetailScreen.styles'

type FolderDetailScreenProps = {
  folderId: string
}

function FolderIcon() {
  return (
    <svg width="64" height="48" viewBox="0 0 50 37" fill="none" aria-hidden="true">
      <path
        d="M4.80222 4.74994C4.44377 2.24307 6.38893 0 8.92129 0H17.5821C18.5893 0 19.5624 0.365362 20.3207 1.0283L22.0975 2.58155C22.8523 3.24146 23.8201 3.60661 24.8227 3.60982L39.9136 3.65822C42.6412 3.66696 44.6229 6.25379 43.9212 8.88964L38.7932 28.1514C38.308 29.9737 36.658 31.2419 34.7723 31.2419H12.1985C10.128 31.2419 8.37253 29.7196 8.07945 27.6699L4.80222 4.74994Z"
        fill="white"
        fillOpacity="0.28"
      />
      <path
        d="M0.563534 7.11115C0.263893 4.6331 2.19831 2.45068 4.69441 2.45068H14.6949C15.7118 2.45068 16.6934 2.82302 17.4545 3.49736L19.5591 5.36226C20.3202 6.0366 21.3018 6.40894 22.3186 6.40894H45.2035C47.6564 6.40894 49.5771 8.51992 49.346 10.9619L47.2618 32.9866C47.0596 35.1232 45.2655 36.7555 43.1193 36.7555H7.83621C5.73136 36.7555 3.95801 35.1837 3.70533 33.0941L0.563534 7.11115Z"
        fill="white"
        fillOpacity="0.88"
      />
      <path
        d="M0.563534 7.11115C0.263893 4.6331 2.19831 2.45068 4.69441 2.45068H14.6949C15.7118 2.45068 16.6934 2.82302 17.4545 3.49736L19.5591 5.36226C20.3202 6.0366 21.3018 6.40894 22.3186 6.40894H45.2035C47.6564 6.40894 49.5771 8.51992 49.346 10.9619L47.2618 32.9866C47.0596 35.1232 45.2655 36.7555 43.1193 36.7555H7.83621C5.73136 36.7555 3.95801 35.1837 3.70533 33.0941L0.563534 7.11115Z"
        fill="white"
        fillOpacity="0.10"
      />
      <path
        d="M4.69434 2.95068H14.6953C15.5898 2.95077 16.4535 3.27835 17.123 3.87158L19.2275 5.73682C20.0799 6.49204 21.1795 6.90863 22.3184 6.90869H45.2031C47.3612 6.90869 49.0518 8.76613 48.8486 10.9146L46.7637 32.9399C46.5855 34.8196 45.0073 36.2554 43.1191 36.2554H7.83594C5.98413 36.2552 4.42445 34.8721 4.20215 33.0337L1.05957 7.05127C0.795938 4.87101 2.49821 2.95073 4.69434 2.95068Z"
        stroke="white"
        strokeOpacity="0.30"
        fill="none"
      />
    </svg>
  )
}

export function FolderDetailScreen({ folderId }: FolderDetailScreenProps) {
  const {
    folder,
    resources,
    totalResources,
    readCount,
    unreadCount,
    loading,
    error,
    activeFilter,
    setActiveFilter
  } = useFolderDetail(folderId)

  const { toggleRead } = useToggleRead()

  const handleToggleRead = useCallback(async (itemId: string, currentIsRead: boolean) => {
    await toggleRead(itemId, currentIsRead)
  }, [toggleRead])

  if (loading) {
    return (
      <main style={s.page}>
        <AcornLoader label="Cargando carpeta" />
      </main>
    )
  }

  if (error || !folder) {
    return (
      <main style={s.page}>
        <p style={s.errorText}>{error || 'No se encontró la carpeta'}</p>
      </main>
    )
  }

  const isSmartFolder = folder.rules.length > 0

  const filterButtons = [
    { key: 'all' as const, label: `Todos (${totalResources})` },
    { key: 'unread' as const, label: `No leídos (${unreadCount})` },
    { key: 'recent' as const, label: 'Recientes' }
  ]

  return (
    <main style={s.page}>
      {/* ── Hero ── */}
      <div style={s.hero}>
        <div style={s.heroGlow} />
        <Link href="/folders" style={s.backButton}>
          ← Carpetas
        </Link>
        <div style={s.heroContent}>
          <div style={s.heroIcon}>
            <FolderIcon />
          </div>
          <h1 style={s.heroTitle}>{folder.name}</h1>
          {folder.description ? (
            <p style={s.heroDescription}>{folder.description}</p>
          ) : null}
          {isSmartFolder && <span style={s.smartBadge}>Inteligente</span>}
          <p style={s.heroSubtitle}>
            {isSmartFolder
              ? `${folder.rules.length} regla${folder.rules.length === 1 ? '' : 's'} de filtrado`
              : 'Carpeta manual'}
          </p>
        </div>
      </div>

      {/* ── Metrics ── */}
      <div style={s.metricsWrapper}>
        <div style={s.metricsRow}>
          <div style={s.metricCard}>
            <span style={s.metricNumber}>{totalResources}</span>
            <span style={s.metricLabel}>Total</span>
          </div>
          <div style={{ ...s.metricCard, ...s.metricCardBorder }}>
            <span style={s.metricNumber}>{readCount}</span>
            <span style={s.metricLabel}>Leídos</span>
          </div>
          <div style={{ ...s.metricCard, ...s.metricCardBorder }}>
            <span style={s.metricNumberAccent}>{unreadCount}</span>
            <span style={s.metricLabel}>No leídos</span>
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      {totalResources > 0 ? (
        <div style={s.filterRow}>
          {filterButtons.map((btn) => (
            <button
              key={btn.key}
              type="button"
              onClick={() => setActiveFilter(btn.key)}
              style={activeFilter === btn.key ? s.filterButtonActive : s.filterButton}
            >
              {btn.label}
            </button>
          ))}
        </div>
      ) : null}

      {/* ── Content ── */}
      {resources.length === 0 && !error ? (
        <section style={s.emptyState}>
          <div style={s.emptyIcon}>📂</div>
          <h2 style={s.emptyTitle}>
            {totalResources === 0 ? 'Sin recursos' : 'Sin resultados'}
          </h2>
          <p style={s.emptyText}>
            {totalResources === 0
              ? isSmartFolder
                ? 'Ningún recurso cumple con las reglas definidas. Prueba a modificarlas.'
                : 'Guarda contenido en Acorn para verlo aquí.'
              : 'Prueba con otro filtro.'}
          </p>
        </section>
      ) : (
        <section style={s.list} className="fd-grid">
          {resources.map((resource) => (
            <Link key={resource.id} href={`/item/${resource.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
      )}

      <style jsx>{`
        @media (min-width: 600px) {
          .fd-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
          }
        }
      `}</style>
    </main>
  )
}
