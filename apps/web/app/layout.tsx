import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Acorn',
  description: 'Tu biblioteca personal de recursos',
  icons: { icon: '/acorn-logo.svg', shortcut: '/acorn-logo.svg' },
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='es'>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
