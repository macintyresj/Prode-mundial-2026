import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Prode Mundial 2026',
  description: 'Pronósticos del Mundial 2026 con tu grupo',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ position: 'relative', zIndex: 1 }}>{children}</body>
    </html>
  )
}
