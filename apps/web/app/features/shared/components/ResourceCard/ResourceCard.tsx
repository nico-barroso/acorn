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
  const [copied, setCopied] = useState(false)

  const domainInitial = domain && domain !== 'Sin dominio' ? domain[0].toUpperCase() : '?'

  const handleToggleRead = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleRead?.(id, isRead)
  }

  const handleCopyUrl = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (url) {
      onCopyUrl?.(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
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
      <div style={resourceCardStyles.mainRow}>
        <div style={resourceCardStyles.thumbnail}>
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt='' style={resourceCardStyles.thumbnailImage} />
          ) : (
            <span style={resourceCardStyles.thumbnailPlaceholder}>{domainInitial}</span>
          )}
        </div>

        <div style={resourceCardStyles.textArea}>
          <h2 style={resourceCardStyles.title}>{highlightedParts ?? title}</h2>
          <div style={resourceCardStyles.sourceRow}>
            <span style={resourceCardStyles.sourceEmoji}>🔗</span>
            <span style={resourceCardStyles.source}>{siteName ?? domain}</span>
          </div>
          {tags && tags.length > 0 ? (
            <div style={resourceCardStyles.tagsRow}>
              {tags.map((tag) => (
                <span key={tag} style={resourceCardStyles.tagPill}>{tag}</span>
              ))}
            </div>
          ) : null}
        </div>

        <span style={expanded ? resourceCardStyles.chevronUp : resourceCardStyles.chevron} aria-hidden>
          ›
        </span>
      </div>

      {expanded ? (
        <div style={resourceCardStyles.expandedSection}>
          <div style={resourceCardStyles.expandedDivider} />

          {description ? (
            <p style={resourceCardStyles.description}>
              {descriptionHighlighted ?? description}
            </p>
          ) : null}

          <div style={resourceCardStyles.metaRow}>
            <span style={resourceCardStyles.metaLabel}>Estado:</span>
            <span style={isRead ? resourceCardStyles.statusBadgeRead : resourceCardStyles.statusBadge}>
              {isRead ? 'Visto' : 'No visto'} 👁
            </span>
            {onToggleRead ? (
              <button
                type='button'
                onClick={handleToggleRead}
                style={resourceCardStyles.readToggleButton}
              >
                {isRead ? 'Marcar como no visto' : 'Marcar como visto'}
              </button>
            ) : null}
          </div>

          {tags && tags.length > 0 ? (
            <div style={resourceCardStyles.tagsSection}>
              <span style={resourceCardStyles.metaLabel}>Etiquetas</span>
              {tags.map((tag) => (
                <span key={tag} style={resourceCardStyles.tagPill}>{tag}</span>
              ))}
            </div>
          ) : null}

          <div style={resourceCardStyles.metaRow}>
            <span style={resourceCardStyles.metaLabel}>Guardado:</span>
            <span style={resourceCardStyles.metaValue}>{createdAtLabel}</span>
            {url ? (
              <button
                type='button'
                onClick={handleCopyUrl}
                style={resourceCardStyles.copyUrlButton}
              >
                {copied ? '¡Enlace copiado!' : 'Copiar URL'}
              </button>
            ) : null}
          </div>

          {url ? (
            <a href={url} target='_blank' rel='noopener noreferrer' style={{ textDecoration: 'none', cursor: 'pointer' }}>
              <button type='button' style={resourceCardStyles.primaryButton}>
                Abrir enlace original
              </button>
            </a>
          ) : null}
        </div>
      ) : null}
    </article>
  )
}
