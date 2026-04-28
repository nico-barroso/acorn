'use client'

import Link from 'next/link'
import { useFolderDetail } from '../../hooks/useFolderDetail'
import { ResourceCard } from '@/features/shared/components/ResourceCard/ResourceCard'
import { useToggleRead } from '@/hooks/useToggleRead'
import { useCallback } from 'react'
import { folderDetailStyles } from './FolderDetailScreen.styles'

type FolderDetailScreenProps = {
  folderId: string
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
    // Optimistic update not needed here since we don't modify local state
    await toggleRead(itemId, currentIsRead)
  }, [toggleRead])

  if (loading) {
    return (
      <main style={folderDetailStyles.page}>
        <p style={folderDetailStyles.loading}>Cargando carpeta...</p>
      </main>
    )
  }

  if (error || !folder) {
    return (
      <main style={folderDetailStyles.page}>
        <p style={folderDetailStyles.errorText}>{error || 'No se encontro la carpeta'}</p>
      </main>
    )
  }

  const isSmartFolder = folder.rules.length > 0

  const filterButtons = [
    { key: 'all' as const, label: `Todos (${totalResources})` },
    { key: 'unread' as const, label: `No leidos (${unreadCount})` },
    { key: 'recent' as const, label: 'Recientes' }
  ]

  return (
    <main style={folderDetailStyles.page}>
      <header style={folderDetailStyles.header}>
        <Link href='/folders' style={folderDetailStyles.backButton}>
          ← Carpetas
        </Link>
        <div style={folderDetailStyles.titleSection}>
          <h1 style={folderDetailStyles.title}>
            {folder.name}
            {isSmartFolder ? <span style={folderDetailStyles.smartBadge}>Inteligente</span> : null}
          </h1>
          <p style={folderDetailStyles.subtitle}>
            {isSmartFolder
              ? `${folder.rules.length} regla${folder.rules.length === 1 ? '' : 's'} de filtrado`
              : 'Carpeta normal'}
          </p>
        </div>
      </header>

      {folder.description ? (
        <p style={folderDetailStyles.description}>{folder.description}</p>
      ) : null}

      <div style={folderDetailStyles.metricsRow}>
        <span style={folderDetailStyles.metricItem}>
          Total: <span style={folderDetailStyles.metricValue}>{totalResources}</span>
        </span>
        <span style={folderDetailStyles.metricItem}>
          Leidos: <span style={folderDetailStyles.metricValue}>{readCount}</span>
        </span>
        <span style={folderDetailStyles.metricItem}>
          No leidos: <span style={folderDetailStyles.metricValue}>{unreadCount}</span>
        </span>
      </div>

      {totalResources > 0 ? (
        <div style={folderDetailStyles.filterRow}>
          {filterButtons.map((btn) => (
            <button
              key={btn.key}
              type='button'
              onClick={() => setActiveFilter(btn.key)}
              style={activeFilter === btn.key ? folderDetailStyles.filterButtonActive : folderDetailStyles.filterButton}
            >
              {btn.label}
            </button>
          ))}
        </div>
      ) : null}

      {resources.length === 0 && !error ? (
        <section style={folderDetailStyles.emptyState}>
          <h2 style={folderDetailStyles.emptyTitle}>
            {totalResources === 0 ? 'No hay recursos en esta carpeta' : 'Sin resultados'}
          </h2>
          <p style={folderDetailStyles.emptyText}>
            {totalResources === 0
              ? isSmartFolder
                ? 'Ningun recurso cumple con las reglas definidas. Prueba a modificar las reglas.'
                : 'Guarda recursos en Acorn para verlos aqui.'
              : 'Prueba con otro filtro.'}
          </p>
        </section>
      ) : (
        <section style={folderDetailStyles.list} className='folder-resource-grid'>
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
        @media (max-width: 900px) {
          .folder-resource-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  )
}