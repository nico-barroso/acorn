'use client'

import { useState } from 'react'
import { fabStyles } from './Fab.styles'

type FabProps = {
  onClick: () => void
  ariaLabel?: string
}

export function Fab({ onClick, ariaLabel = 'Anadir recurso' }: FabProps) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  const mergedStyle = {
    ...fabStyles.button,
    ...(hovered && !pressed ? fabStyles.buttonHover : {}),
    ...(pressed ? fabStyles.buttonActive : {})
  }

  return (
    <>
      <button
        type='button'
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setPressed(false) }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        style={mergedStyle}
        aria-label={ariaLabel}
        className='fab-button'
      >
        +
      </button>
      <style jsx>{`
        @media (min-width: 901px) {
          .fab-button {
            bottom: 28px !important;
          }
        }
      `}</style>
    </>
  )
}