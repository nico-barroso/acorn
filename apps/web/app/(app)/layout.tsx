'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CSSProperties, ReactNode, useState, useCallback, useEffect } from 'react'

import { colors } from '@/theme/colors'
import { fonts } from '@/theme/fonts'
import { Fab } from '@/features/shared/components/Fab/Fab'
import { AddResourceModal } from '@/features/shared/components/AddResourceModal/AddResourceModal'

type AppLayoutProps = {
  children: ReactNode
}

const NAV_ITEMS = [
  { href: '/home', label: 'Home', icon: <HomeIcon /> },
  { href: '/search', label: 'Búsqueda', icon: <SearchIcon /> },
  { href: '/folders', label: 'Carpetas', icon: <FolderIcon /> },
  { href: '/profile', label: 'Perfil', icon: <ProfileIcon /> }
]

function isActiveRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

function HomeIcon() {
  return (
    <svg width='20' height='20' viewBox='4 2 20 21' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M10.126 14.3665C10.5701 16.0917 12.1362 17.3665 14 17.3665C15.8638 17.3665 17.4299 16.0917 17.874 14.3665M13.0177 3.13046L6.23539 8.40558C5.78202 8.75821 5.55534 8.93452 5.39203 9.15532C5.24737 9.3509 5.1396 9.57124 5.07403 9.80551C5 10.07 5 10.3572 5 10.9316V18.1665C5 19.2866 5 19.8466 5.21799 20.2745C5.40973 20.6508 5.71569 20.9568 6.09202 21.1485C6.51984 21.3665 7.07989 21.3665 8.2 21.3665H19.8C20.9201 21.3665 21.4802 21.3665 21.908 21.1485C22.2843 20.9568 22.5903 20.6508 22.782 20.2745C23 19.8466 23 19.2866 23 18.1665V10.9316C23 10.3572 23 10.07 22.926 9.80551C22.8604 9.57124 22.7526 9.3509 22.608 9.15532C22.4447 8.93452 22.218 8.75821 21.7646 8.40559L14.9823 3.13046C14.631 2.85721 14.4553 2.72058 14.2613 2.66806C14.0902 2.62172 13.9098 2.62172 13.7387 2.66806C13.5447 2.72058 13.369 2.85721 13.0177 3.13046Z' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width='20' height='20' viewBox='4 2 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M23 21L18.65 16.65M21 11C21 15.4183 17.4183 19 13 19C8.58172 19 5 15.4183 5 11C5 6.58172 8.58172 3 13 3C17.4183 3 21 6.58172 21 11Z' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  )
}

function FolderIcon() {
  return (
    <svg width='20' height='20' viewBox='0 0 22 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M12 5L10.8845 2.76892C10.5634 2.1268 10.4029 1.80573 10.1634 1.57116C9.9516 1.36373 9.6963 1.20597 9.4161 1.10931C9.0992 1 8.74021 1 8.02229 1H4.2C3.0799 1 2.51984 1 2.09202 1.21799C1.71569 1.40973 1.40973 1.71569 1.21799 2.09202C1 2.51984 1 3.0799 1 4.2V5M1 5H16.2C17.8802 5 18.7202 5 19.362 5.32698C19.9265 5.6146 20.3854 6.07354 20.673 6.63803C21 7.27976 21 8.1198 21 9.8V14.2C21 15.8802 21 16.7202 20.673 17.362C20.3854 17.9265 19.9265 18.3854 19.362 18.673C18.7202 19 17.8802 19 16.2 19H5.8C4.11984 19 3.27976 19 2.63803 18.673C2.07354 18.3854 1.6146 17.9265 1.32698 17.362C1 16.7202 1 15.8802 1 14.2V5Z' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  )
}

function ProfileIcon() {
  return (
    <svg width='20' height='20' viewBox='0 0 21 23' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M10.3774 15C6.82038 15 3.65713 16.7857 1.64325 19.557C1.2098 20.1534 0.993077 20.4516 1.00017 20.8547C1.00564 21.1661 1.1937 21.5589 1.42935 21.7511C1.73435 22 2.15701 22 3.00233 22H17.7525C18.5978 22 19.0205 22 19.3255 21.7511C19.5611 21.5589 19.7492 21.1661 19.7547 20.8547C19.7617 20.4516 19.5451 20.1534 19.1116 19.557C17.0977 16.7857 13.9344 15 10.3774 15Z' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M10.3775 11.5C13.1661 11.5 15.4268 9.14949 15.4268 6.25C15.4268 3.35051 13.1661 1 10.3775 1C7.58877 1 5.32812 3.35051 5.32812 6.25C5.32812 9.14949 7.58877 11.5 10.3775 11.5Z' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  )
}

function HamburgerIcon() {
  return (
    <svg width='22' height='22' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <rect y='4' width='22' height='2' rx='1' fill='currentColor' />
      <rect y='10' width='22' height='2' rx='1' fill='currentColor' />
      <rect y='16' width='22' height='2' rx='1' fill='currentColor' />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M1 1L17 17M17 1L1 17' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
    </svg>
  )
}


export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const [showAddModal, setShowAddModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSaved = useCallback(() => {
    window.location.reload()
  }, [])

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  return (
    <div style={styles.page} className='app-shell'>

      {sidebarOpen && (
        <div
          style={styles.backdrop}
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <aside style={styles.sidebar} className={`app-sidebar${sidebarOpen ? ' sidebar-open' : ''}`}>
        <div style={styles.sidebarHeader}>
          <img src='/acorn-logo.svg' alt='Acorn' style={styles.logo} className='sidebar-logo' />
        </div>

        <nav aria-label='Navegación principal' style={styles.navList}>
          {NAV_ITEMS.map((item) => {
            const active = isActiveRoute(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? 'nav-item active' : 'nav-item'}
                style={{
                  ...styles.navItem,
                  ...(active ? styles.navItemActive : {})
                }}
                aria-current={active ? 'page' : undefined}
              >
                <span className='nav-item-content' style={styles.navItemContent}>
                  {item.icon}
                  <span>{item.label}</span>
                </span>
              </Link>
            )
          })}
        </nav>

      </aside>

      <main style={styles.content} className='app-content'>
        <div className='mobile-topbar' style={styles.mobileTopbar}>
          <img src='/acorn-logo.svg' alt='Acorn' style={styles.mobileLogo} />
          <button
            style={styles.hamburger}
            onClick={() => setSidebarOpen(true)}
            aria-label='Abrir menú'
          >
            <HamburgerIcon />
          </button>
        </div>

        {children}
      </main>

      <Fab onClick={() => setShowAddModal(true)} />

      {showAddModal ? (
        <AddResourceModal
          onClose={() => setShowAddModal(false)}
          onSaved={handleSaved}
        />
      ) : null}

      <style jsx global>{`
        .app-shell {
          display: block;
        }

        .mobile-topbar {
          display: none;
        }

        .app-sidebar .nav-item {
          color: #48392A;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .app-sidebar .nav-item.active {
          color: #A14D36;
        }

        .app-sidebar .nav-item:hover {
          color: #A14D36;
        }

        .app-sidebar .nav-item-content::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #A14D36;
          border-radius: 999px;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .app-sidebar .nav-item:hover .nav-item-content::after {
          width: 60%;
        }

        .app-sidebar .nav-item.active .nav-item-content::after {
          width: 100%;
        }

        @media (max-width: 900px) {
          .app-content {
            margin-left: 0 !important;
          }

          .app-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            height: 100dvh !important;
            width: 280px !important;
            border-radius: 0 !important;
            transform: translateX(-100%);
            transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 50;
            box-shadow: none !important;
          }

          .app-sidebar.sidebar-open {
            transform: translateX(0);
            box-shadow: 4px 0 32px rgba(67, 40, 28, 0.18) !important;
          }

          .sidebar-logo {
            display: none;
          }

          .mobile-topbar {
            display: flex !important;
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
  backdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(67, 40, 28, 0.4)',
    zIndex: 49,
    backdropFilter: 'blur(2px)'
  },
  sidebar: {
    position: 'fixed' as const,
    top: '16px',
    left: '12px',
    width: '256px',
    height: 'calc(100dvh - 48px)',
    overflowY: 'auto' as const,
    borderRadius: '20px',
    border: `1px solid ${colors.brown}22`,
    background: 'radial-gradient(ellipse 140% 55% at 50% 100%, rgba(192, 110, 82, 0.35) 0%, rgba(248, 237, 232, 0.12) 55%, rgba(255, 252, 251, 0) 100%), rgba(255, 248, 243, 0.72)',
    backdropFilter: 'blur(18px) saturate(1.4)',
    WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
    boxShadow: '0 8px 32px rgba(67, 40, 28, 0.12), 0 2px 8px rgba(67, 40, 28, 0.06)',
    padding: '24px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    zIndex: 50
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '14px',
    paddingLeft: '12px'
  },
  logo: {
    width: '100px',
    height: 'auto'
  },
  closeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: colors.brownMid,
    cursor: 'pointer',
    padding: 0
  },
  navList: {
    display: 'grid',
    gap: '6px'
  },
  navItem: {
    textDecoration: 'none',
    borderRadius: '12px',
    border: '1px solid transparent',
    backgroundColor: 'transparent',
    padding: '10px 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontFamily: fonts.family.body,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.medium
  },
  navItemContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    position: 'relative' as const,
    paddingBottom: '4px'
  },
  navItemActive: {},
  saveContentBtn: {
    marginTop: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: colors.salmon,
    color: '#FFFFFF',
    fontFamily: fonts.family.body,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.medium,
    cursor: 'pointer',
    width: '100%',
    boxShadow: '0 6px 20px rgba(161, 77, 54, 0.35)',
    transition: 'background-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease'
  },
  content: {
    marginLeft: '284px',
    padding: '20px 24px 96px'
  },
  mobileTopbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px'
  },
  mobileLogo: {
    width: '90px',
    height: 'auto'
  },
  hamburger: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    border: `1px solid ${colors.brown}20`,
    backgroundColor: '#fff8f3',
    color: colors.brown,
    cursor: 'pointer',
    padding: 0
  }
}
