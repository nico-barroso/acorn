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

function AcornIcon() {
  return (
    <svg width='14' height='14' viewBox='0 0 26 28' fill='none' aria-hidden>
      <path d='M3.56348 13.1575C3.56348 10.4325 5.77253 8.22344 8.49753 8.22344H12.8834H17.2692C19.9942 8.22344 22.2032 10.4325 22.2032 13.1575V19.325C22.2032 20.8963 21.4548 22.3737 20.188 23.3032L17.8885 24.9903L15.1831 27.1959C14.2313 27.9718 12.8796 28.02 11.8749 27.314L8.5686 24.9903L5.86001 23.2771C4.43024 22.3728 3.56348 20.799 3.56348 19.1072L3.56348 13.1575Z' fill='#A14D36'/>
      <path d='M12.6816 9.06523C12.472 9.48612 11.8646 9.46523 11.6844 9.03093L10.6343 6.4994C10.5808 6.37025 10.5078 6.25006 10.4178 6.143L9.04289 4.50618C8.40213 3.74337 8.76347 2.57344 9.72279 2.30483L15.5223 0.680968C16.2889 0.466308 16.8828 1.35755 16.3895 1.98241L15.9867 2.49263C15.9282 2.56668 15.8775 2.64656 15.8355 2.73101L12.6816 9.06523Z' fill='#A14D36'/>
      <path d='M1.24612e-06 11.1814C1.24612e-06 9.54775 1.32431 8.22344 2.95793 8.22344H22.5347C24.1683 8.22344 25.4926 9.54775 25.4926 11.1814C25.4926 13.3635 23.2106 14.7944 21.2463 13.844L15.7134 11.1668C13.8393 10.2599 11.6533 10.2599 9.77921 11.1668L4.24629 13.844C2.28204 14.7944 1.24612e-06 13.3635 1.24612e-06 11.1814Z' fill='#43281C'/>
    </svg>
  )
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
  const isSmart = (ruleCount ?? 0) > 0

  return (
    <div
      style={{
        ...s.card,
        boxShadow: hovered
          ? '0 8px 28px rgba(67, 40, 28, 0.12)'
          : '0 2px 8px rgba(67, 40, 28, 0.06)',
        transform: hovered ? 'translateY(-2px)' : 'none',
        opacity: isDeleting ? 0.5 : 1
      }}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('.folder-menu-button')) return
        onClick()
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Fila superior */}
      <div style={s.topRow}>
        <div style={s.typeGroup}>
          <AcornIcon />
          <span style={s.typeLabel}>
            {isSmart ? 'Inteligente' : 'Carpeta'}
          </span>
        </div>
        <div style={s.menuWrap}>
          <button
            type='button'
            className='folder-menu-button'
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }}
            style={{
              ...s.menuButton,
              ...(showMenu ? { backgroundColor: `${colors.brown}0A`, color: colors.brownMid } : {})
            }}
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

      {/* Nombre */}
      <h3 style={s.name} title={name}>{name}</h3>

      {/* Descripción */}
      {description ? <p style={s.description}>{description}</p> : null}

      {/* Footer */}
      <div style={s.footer}>
        <span style={s.footerMeta}>
          {isSmart
            ? `${ruleCount} filtro${ruleCount === 1 ? '' : 's'}`
            : 'sin filtros'}
        </span>
        <span style={s.footerDate}>{subtitle}</span>
      </div>
    </div>
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
    border: `1px solid ${colors.brown}18`,
    borderRadius: '12px',
    boxShadow: '0 8px 28px rgba(67, 40, 28, 0.14)',
    padding: '5px',
    zIndex: 50,
    minWidth: '120px'
  }

  const itemStyles: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    border: 'none',
    background: 'none',
    borderRadius: '8px',
    textAlign: 'left',
    cursor: 'pointer',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    color: colors.brown,
    transition: 'background-color 0.12s ease'
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
          Editar
        </button>
        <button
          type='button'
          style={{ ...itemStyles, color: '#8b2a1b' }}
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#8b2a1b0A' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          Eliminar
        </button>
      </div>
      <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={onDismiss} />
    </>
  )
}
