'use client'

import { useState } from 'react'
import { folderCardStyles } from './FolderCard.styles'

type FolderCardProps = {
  id: string
  name: string
  subtitle: string
  description?: string | null
  isDeleting?: boolean
  ruleCount?: number
  onClick: () => void
  onRename: () => void
  onDelete: () => void
}

export function FolderCard({
  name,
  subtitle,
  description,
  isDeleting,
  ruleCount,
  onClick,
  onRename,
  onDelete
}: FolderCardProps) {
  const [hovered, setHovered] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const cardStyle = {
    ...folderCardStyles.card,
    ...(hovered ? folderCardStyles.cardHover : {}),
    ...(isDeleting ? { opacity: 0.6 } : {})
  }

  return (
    <div
      style={cardStyle}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('.folder-menu-button')) return
        onClick()
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={folderCardStyles.header}>
        <div style={folderCardStyles.iconAndName}>
          <div style={folderCardStyles.icon}>📁</div>
          <div style={folderCardStyles.nameSection}>
            <h3 style={folderCardStyles.name} title={name}>
              {name}
            </h3>
            <p style={folderCardStyles.subtitle}>{subtitle}</p>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <button
            type='button'
            className='folder-menu-button'
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            style={folderCardStyles.menuButton}
            aria-label='Opciones de carpeta'
          >
            ⋮
          </button>

          {showMenu ? (
            <FolderOptionsMenu
              onRename={() => { setShowMenu(false); onRename() }}
              onDelete={() => { setShowMenu(false); onDelete() }}
              onDismiss={() => setShowMenu(false)}
            />
          ) : null}
        </div>
      </div>

      {description ? (
        <p style={folderCardStyles.description}>{description}</p>
      ) : null}

      <div style={folderCardStyles.footer}>
        <span style={folderCardStyles.meta}>
          {ruleCount && ruleCount > 0 ? `${ruleCount} regla${ruleCount === 1 ? '' : 's'}` : 'Carpeta normal'}
        </span>
        {ruleCount && ruleCount > 0 ? (
          <span style={folderCardStyles.badge}>Inteligente</span>
        ) : null}
      </div>
    </div>
  )
}

// Inline menu component to avoid file proliferation
type FolderOptionsMenuProps = {
  onRename: () => void
  onDelete: () => void
  onDismiss: () => void
}

function FolderOptionsMenu({ onRename, onDelete, onDismiss }: FolderOptionsMenuProps) {
  const menuStyles: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '4px',
    backgroundColor: colors.white,
    border: `1px solid ${colors.brown}20`,
    borderRadius: '10px',
    boxShadow: '0 8px 24px rgba(67, 40, 28, 0.15)',
    padding: '6px',
    zIndex: 50,
    minWidth: '120px'
  }

  const itemStyles: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    border: 'none',
    background: 'none',
    borderRadius: '6px',
    textAlign: 'left',
    cursor: 'pointer',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    color: colors.brown,
    transition: 'background-color 0.15s ease'
  }

  const deleteItemStyles: React.CSSProperties = {
    ...itemStyles,
    color: '#8b2a1b'
  }

  return (
    <>
      <div style={menuStyles}>
        <button
          type='button'
          style={itemStyles}
          onClick={(e) => { e.stopPropagation(); onRename() }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${colors.brown}08` }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          Renombrar
        </button>
        <button
          type='button'
          style={deleteItemStyles}
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#8b2a1b10' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          Eliminar
        </button>
      </div>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40
        }}
        onClick={onDismiss}
      />
    </>
  )
}

// Import for inline component
import { colors } from '@/theme/colors'
import { fonts } from '@/theme/fonts'