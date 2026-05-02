'use client'

interface AcornLoaderProps {
  label?: string
  size?: number
}

export function AcornLoader({ label = 'Cargando', size = 52 }: AcornLoaderProps) {
  const r = size / 2 - 3
  const C = 2 * Math.PI * r
  const dash = C * 0.72
  const gap = C * 0.28

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        padding: `${size < 44 ? 20 : 40}px 0`,
      }}
    >
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="acorn-loader-spin"
          aria-hidden
          style={{ position: 'absolute', inset: 0 }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#C06E52"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${gap}`}
          />
        </svg>
        <svg
          width={size * 0.45}
          height={size * 0.45}
          viewBox="0 0 26 28"
          fill="none"
          aria-hidden
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <path
            d="M3.56348 13.1575C3.56348 10.4325 5.77253 8.22344 8.49753 8.22344H12.8834H17.2692C19.9942 8.22344 22.2032 10.4325 22.2032 13.1575V19.325C22.2032 20.8963 21.4548 22.3737 20.188 23.3032L17.8885 24.9903L15.1831 27.1959C14.2313 27.9718 12.8796 28.02 11.8749 27.314L8.5686 24.9903L5.86001 23.2771C4.43024 22.3728 3.56348 20.799 3.56348 19.1072L3.56348 13.1575Z"
            fill="#C06E52"
          />
          <path
            d="M12.6816 9.06523C12.472 9.48612 11.8646 9.46523 11.6844 9.03093L10.6343 6.4994C10.5808 6.37025 10.5078 6.25006 10.4178 6.143L9.04289 4.50618C8.40213 3.74337 8.76347 2.57344 9.72279 2.30483L15.5223 0.680968C16.2889 0.466308 16.8828 1.35755 16.3895 1.98241L15.9867 2.49263C15.9282 2.56668 15.8775 2.64656 15.8355 2.73101L12.6816 9.06523Z"
            fill="#C06E52"
          />
          <path
            d="M1.24612e-06 11.1814C1.24612e-06 9.54775 1.32431 8.22344 2.95793 8.22344H22.5347C24.1683 8.22344 25.4926 9.54775 25.4926 11.1814C25.4926 13.3635 23.2106 14.7944 21.2463 13.844L15.7134 11.1668C13.8393 10.2599 11.6533 10.2599 9.77921 11.1668L4.24629 13.844C2.28204 14.7944 1.24612e-06 13.3635 1.24612e-06 11.1814Z"
            fill="#43281C"
          />
        </svg>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          fontFamily: 'Satoshi, sans-serif',
          fontSize: 14,
          fontWeight: 500,
          color: '#48392A',
          letterSpacing: '0.01em',
        }}
      >
        <span>{label}</span>
        <span className="acorn-loader-dot" style={{ animationDelay: '0ms' }}>.</span>
        <span className="acorn-loader-dot" style={{ animationDelay: '180ms' }}>.</span>
        <span className="acorn-loader-dot" style={{ animationDelay: '360ms' }}>.</span>
      </div>
    </div>
  )
}
