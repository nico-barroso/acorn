'use client'

import { useState } from 'react'
import { colors } from '@/theme/colors'
import { fonts } from '@/theme/fonts'
import { folderCardStyles as s } from './FolderCard.styles'

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

  return (
    <div
      style={{
        ...s.card,
        boxShadow: hovered
          ? '0 18px 44px rgba(161, 77, 54, 0.26)'
          : '0 4px 18px rgba(161, 77, 54, 0.14)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        opacity: isDeleting ? 0.6 : 1
      }}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('.folder-menu-button')) return
        onClick()
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Left gradient panel */}
      <div style={s.left} className="folder-left">
        <div style={s.leftGlow} />
        <FolderIcon />

      </div>

      {/* Right content */}
      <div style={s.right}>
        <div>
          <div style={s.top}>
            <h3 style={s.name} title={name}>{name}</h3>
            <div style={s.menuWrap}>
              <button
                type='button'
                className='folder-menu-button'
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }}
                style={s.menuButton}
                aria-label='Opciones de carpeta'
              >
                ⋮
              </button>
              {showMenu && (
                <FolderOptionsMenu
                  onRename={() => { setShowMenu(false); onRename() }}
                  onDelete={() => { setShowMenu(false); onDelete() }}
                  onDismiss={() => setShowMenu(false)}
                />
              )}
            </div>
          </div>
          {description && <p style={s.description}>{description}</p>}
        </div>

        <div style={s.footer}>
          <span style={s.footerMeta}>
            {(ruleCount ?? 0) > 0
              ? `${ruleCount} regla${ruleCount === 1 ? '' : 's'}`
              : 'Sin reglas'}
          </span>
          <span style={s.footerDate}>{subtitle}</span>
        </div>
      </div>
    </div>
  )
}

function FolderIcon() {
  return (
    <svg width='56' height='42' viewBox='0 0 50 37' fill='none' aria-hidden='true'>
      {/* Back tab */}
      <path
        d='M4.80222 4.74994C4.44377 2.24307 6.38893 0 8.92129 0H17.5821C18.5893 0 19.5624 0.365362 20.3207 1.0283L22.0975 2.58155C22.8523 3.24146 23.8201 3.60661 24.8227 3.60982L39.9136 3.65822C42.6412 3.66696 44.6229 6.25379 43.9212 8.88964L38.7932 28.1514C38.308 29.9737 36.658 31.2419 34.7723 31.2419H12.1985C10.128 31.2419 8.37253 29.7196 8.07945 27.6699L4.80222 4.74994Z'
        fill='white'
        fillOpacity='0.28'
      />
      {/* Front body */}
      <path
        d='M0.563534 7.11115C0.263893 4.6331 2.19831 2.45068 4.69441 2.45068H14.6949C15.7118 2.45068 16.6934 2.82302 17.4545 3.49736L19.5591 5.36226C20.3202 6.0366 21.3018 6.40894 22.3186 6.40894H45.2035C47.6564 6.40894 49.5771 8.51992 49.346 10.9619L47.2618 32.9866C47.0596 35.1232 45.2655 36.7555 43.1193 36.7555H7.83621C5.73136 36.7555 3.95801 35.1837 3.70533 33.0941L0.563534 7.11115Z'
        fill='white'
        fillOpacity='0.88'
      />
      {/* Subtle inner gradient overlay */}
      <path
        d='M0.563534 7.11115C0.263893 4.6331 2.19831 2.45068 4.69441 2.45068H14.6949C15.7118 2.45068 16.6934 2.82302 17.4545 3.49736L19.5591 5.36226C20.3202 6.0366 21.3018 6.40894 22.3186 6.40894H45.2035C47.6564 6.40894 49.5771 8.51992 49.346 10.9619L47.2618 32.9866C47.0596 35.1232 45.2655 36.7555 43.1193 36.7555H7.83621C5.73136 36.7555 3.95801 35.1837 3.70533 33.0941L0.563534 7.11115Z'
        fill='white'
        fillOpacity='0.10'
      />
      {/* Stroke */}
      <path
        d='M4.69434 2.95068H14.6953C15.5898 2.95077 16.4535 3.27835 17.123 3.87158L19.2275 5.73682C20.0799 6.49204 21.1795 6.90863 22.3184 6.90869H45.2031C47.3612 6.90869 49.0518 8.76613 48.8486 10.9146L46.7637 32.9399C46.5855 34.8196 45.0073 36.2554 43.1191 36.2554H7.83594C5.98413 36.2552 4.42445 34.8721 4.20215 33.0337L1.05957 7.05127C0.795938 4.87101 2.49821 2.95073 4.69434 2.95068Z'
        stroke='white'
        strokeOpacity='0.30'
        fill='none'
      />
    </svg>
  )
}

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
    minWidth: '130px'
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
          style={{ ...itemStyles, color: '#8b2a1b' }}
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#8b2a1b10' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          Eliminar
        </button>
      </div>
      <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={onDismiss} />
    </>
  )
}
