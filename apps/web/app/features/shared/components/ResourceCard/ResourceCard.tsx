'use client'

import { useState } from 'react'
import { resourceCardStyles } from './ResourceCard.styles'

type ResourceCardProps = {
  id: string
  title: string
  description: string
  domain: string
  url?: string | null
  thumbnailUrl?: string | null
  createdAtLabel: string
  isRead: boolean
  tags?: string[]
  siteName?: string | null
  onToggleRead?: (id: string, currentIsRead: boolean) => void
  onCopyUrl?: (url: string) => void
  highlightedParts?: React.ReactNode[]
  descriptionHighlighted?: React.ReactNode[]
}

export function ResourceCard({
  id,
  title,
  description,
  domain,
  url,
  thumbnailUrl,
  createdAtLabel,
  isRead,
  tags,
  siteName,
  onToggleRead,
  onCopyUrl,
  highlightedParts,
  descriptionHighlighted
}: ResourceCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [hovered, setHovered] = useState(false)

  const domainInitial = domain && domain !== 'Sin dominio' ? domain[0].toUpperCase() : '?'

  const handleToggleRead = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleRead?.(id, isRead)
  }

  const handleCopyUrl = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (url) onCopyUrl?.(url)
  }

  const handleExpand = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) return
    setExpanded(!expanded)
  }

  const cardStyle = expanded
    ? resourceCardStyles.cardExpanded
    : { ...resourceCardStyles.card, ...(hovered ? resourceCardStyles.cardHover : {}) }

  return (
    <article
      style={cardStyle}
      onClick={handleExpand}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt='' style={resourceCardStyles.thumbnail} />
        ) : (
          <div style={resourceCardStyles.thumbnailPlaceholder}>{domainInitial}</div>
        )}

        <div style={resourceCardStyles.textArea}>
          <div style={resourceCardStyles.titleRow}>
            <h2 style={resourceCardStyles.title}>{highlightedParts ?? title}</h2>
            <span style={resourceCardStyles.domainPill}>{domain}</span>
          </div>

          {siteName ? <p style={resourceCardStyles.source}>{siteName}</p> : null}

          {tags && tags.length > 0 ? (
            <div style={resourceCardStyles.tagsRow}>
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} style={resourceCardStyles.tagPill}>{tag}</span>
              ))}
            </div>
          ) : null}
        </div>

        <span style={expanded ? resourceCardStyles.chevronUp : resourceCardStyles.chevron} aria-hidden>&#8964;</span>
      </div>

      {!expanded && description ? (
        <p style={{ ...resourceCardStyles.description, marginTop: '8px' }}>
          {descriptionHighlighted ?? description}
        </p>
      ) : null}

      {!expanded ? (
        <button
          type='button'
          onClick={handleToggleRead}
          style={isRead ? resourceCardStyles.statusBadgeRead : resourceCardStyles.statusBadge}
          aria-label={isRead ? 'Marcar como no visto' : 'Marcar como visto'}
        >
          {isRead ? 'Visto' : 'No visto'}
        </button>
      ) : null}

      {expanded ? (
        <div style={resourceCardStyles.expandedSection}>
          <p style={resourceCardStyles.description}>
            {descriptionHighlighted ?? description}
          </p>

          <div style={resourceCardStyles.metaRow}>
            <span style={resourceCardStyles.metaLabel}>Guardado</span>
            <span style={resourceCardStyles.metaValue}>{createdAtLabel}</span>
          </div>

          <div style={resourceCardStyles.metaRow}>
            <span style={resourceCardStyles.metaLabel}>Estado</span>
            <button
              type='button'
              onClick={handleToggleRead}
              style={isRead ? resourceCardStyles.statusBadgeRead : resourceCardStyles.statusBadge}
              aria-label={isRead ? 'Marcar como no visto' : 'Marcar como visto'}
            >
              {isRead ? 'Visto' : 'No visto'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
            {url ? (
              <a href={url} target='_blank' rel='noopener noreferrer' style={{ textDecoration: 'none' }}>
                <button type='button' style={resourceCardStyles.primaryButton}>
                  Abrir enlace
                </button>
              </a>
            ) : null}
            {url ? (
              <button type='button' onClick={handleCopyUrl} style={resourceCardStyles.actionButton}>
                Copiar URL
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  )
}