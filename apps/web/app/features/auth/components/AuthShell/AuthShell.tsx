import type { ReactNode } from 'react'
import Link from 'next/link'
import { authShellStyles } from './AuthShell.styles'

type AuthShellProps = {
  badge: string
  title: string
  subtitle: string
  footerLabel: string
  footerLinkHref: string
  footerLinkLabel: string
  children: ReactNode
  errorMessage?: string
}

export function AuthShell({
  badge,
  title,
  subtitle,
  footerLabel,
  footerLinkHref,
  footerLinkLabel,
  children,
  errorMessage
}: AuthShellProps) {
  return (
    <main style={authShellStyles.page}>
      <section style={authShellStyles.card}>
        <span style={authShellStyles.badge}>{badge}</span>
        <h1 style={authShellStyles.title}>{title}</h1>
        <p style={authShellStyles.subtitle}>{subtitle}</p>

        <div style={authShellStyles.body}>{children}</div>

        {errorMessage ? (
          <p style={authShellStyles.error} role='alert' aria-live='assertive'>
            {errorMessage}
          </p>
        ) : null}

        <p style={authShellStyles.footer}>
          {footerLabel}{' '}
          <Link href={footerLinkHref} style={authShellStyles.footerLink}>
            {footerLinkLabel}
          </Link>
        </p>
      </section>
    </main>
  )
}
