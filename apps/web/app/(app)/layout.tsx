'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CSSProperties, ReactNode } from 'react'

import { colors } from '../theme/colors'
import { fonts } from '../theme/fonts'

type AppLayoutProps = {
  children: ReactNode
}

const NAV_ITEMS = [
  { href: '/home', label: 'Home' },
  { href: '/search', label: 'Busqueda' },
  { href: '/folders', label: 'Carpetas' },
  { href: '/profile', label: 'Perfil' }
]

function isActiveRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()

  return (
    <div style={styles.page} className='app-shell'>
      <aside style={styles.sidebar} className='app-sidebar'>
        <div style={styles.brandRow}>
          <p style={styles.brandTitle}>Acorn</p>
          <p style={styles.brandSubtitle}>Panel principal</p>
        </div>

        <nav aria-label='Navegacion principal' style={styles.navList}>
          {NAV_ITEMS.map((item) => {
            const active = isActiveRoute(pathname, item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  ...styles.navItem,
                  ...(active ? styles.navItemActive : {})
                }}
                aria-current={active ? 'page' : undefined}
              >
                <span>{item.label}</span>
                {active ? <span style={styles.activeDot} aria-hidden /> : null}
              </Link>
            )
          })}
        </nav>
      </aside>

      <main style={styles.content}>{children}</main>

      <nav aria-label='Navegacion inferior' style={styles.bottomNav} className='app-bottom-nav'>
        {NAV_ITEMS.map((item) => {
          const active = isActiveRoute(pathname, item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                ...styles.bottomNavItem,
                ...(active ? styles.bottomNavItemActive : {})
              }}
              aria-current={active ? 'page' : undefined}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <style jsx>{`
        .app-shell {
          grid-template-columns: 280px 1fr;
        }

        @media (max-width: 900px) {
          .app-shell {
            grid-template-columns: 1fr;
          }

          .app-sidebar {
            display: none;
          }
        }

        @media (min-width: 901px) {
          .app-bottom-nav {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100dvh',
    display: 'grid',
    background: 'linear-gradient(180deg, #fffaf7 0%, #fffcfb 100%)',
    color: colors.black
  },
  sidebar: {
    borderRight: `1px solid ${colors.brown}26`,
    backgroundColor: '#fff8f3',
    padding: '24px 18px'
  },
  brandRow: {
    marginBottom: '22px'
  },
  brandTitle: {
    margin: 0,
    fontFamily: fonts.family.primary,
    fontWeight: fonts.weight.bold,
    fontSize: '24px',
    color: colors.brown
  },
  brandSubtitle: {
    margin: '6px 0 0',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.sm,
    color: colors.brownMid
  },
  navList: {
    display: 'grid',
    gap: '10px'
  },
  navItem: {
    textDecoration: 'none',
    color: colors.brownMid,
    borderRadius: '12px',
    border: `1px solid transparent`,
    backgroundColor: 'transparent',
    padding: '10px 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.medium
  },
  navItemActive: {
    color: colors.brown,
    border: `1px solid ${colors.salmon}44`,
    backgroundColor: `${colors.salmon}12`
  },
  activeDot: {
    width: '8px',
    height: '8px',
    borderRadius: '999px',
    backgroundColor: colors.salmon
  },
  content: {
    padding: '20px 24px 88px'
  },
  bottomNav: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    borderTop: `1px solid ${colors.brown}22`,
    backgroundColor: '#fff8f3',
    padding: '8px 8px calc(8px + env(safe-area-inset-bottom, 0px))',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: '6px'
  },
  bottomNavItem: {
    textDecoration: 'none',
    color: colors.brownMid,
    fontFamily: fonts.family.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.medium,
    textAlign: 'center',
    borderRadius: '10px',
    padding: '9px 6px',
    border: `1px solid transparent`
  },
  bottomNavItemActive: {
    color: colors.brown,
    backgroundColor: `${colors.salmon}14`,
    border: `1px solid ${colors.salmon}44`
  }
}
