import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bifrost — Orchestrateur d\'APIs',
  description: 'Collectez et orchestrez vos données d\'APIs, sans friction.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
