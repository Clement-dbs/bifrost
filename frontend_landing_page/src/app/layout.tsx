import type { Metadata } from 'next'
import { Syne, DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
})

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bifrost.sh'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Bifrost — Unified API data collection, automated',
    template: '%s | Bifrost',
  },
  description:
    'Bifrost centralises your API data sources and automates scheduled collection. Stop writing scrapers. Start shipping.',
  keywords: [
    'API aggregation',
    'data collection',
    'no-code ETL',
    'API scheduling',
    'data pipeline',
    'SaaS',
  ],
  authors: [{ name: 'Bifrost' }],
  creator: 'Bifrost',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Bifrost',
    title: 'Bifrost — Unified API data collection, automated',
    description:
      'Bifrost centralises your API data sources and automates scheduled collection.',
    images: [
      {
        url: '/og-image.png', // 1200×630 à créer dans /public
        width: 1200,
        height: 630,
        alt: 'Bifrost — API data collection platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bifrost — Unified API data collection, automated',
    description:
      'Bifrost centralises your API data sources and automates scheduled collection.',
    images: ['/og-image.png'],
    // creator: '@tonhandle',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body className="font-body bg-night text-white antialiased">
        {children}
      </body>
    </html>
  )
}
