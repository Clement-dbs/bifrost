'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { label: 'Vue d\'ensemble', href: '/dashboard' },
  { label: 'Sources API',     href: '/dashboard/sources' },
  { label: 'Planification',   href: '/dashboard/planning' },
]

interface Props {
  activeSources?: number
  onAddSource?: () => void
}

export default function DashboardHeader({ activeSources = 0, onAddSource }: Props) {
  const pathname = usePathname()

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(10,10,15,.85)',
        backdropFilter: 'blur(16px)',
        borderColor: 'rgba(255,255,255,0.05)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 mr-4 no-underline">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
            style={{ background: 'linear-gradient(135deg,#6C63FF,#38BDF8)' }}
          >
            🌈
          </div>
          <span className="font-display font-bold text-base tracking-tight bifrost-text">
            Bifrost
          </span>
        </Link>

        {/* Nav tabs */}
        <nav className="flex gap-6">
          {tabs.map((tab) => {
            const isActive =
              tab.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(tab.href)
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`nav-link text-sm ${isActive ? 'active' : ''}`}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-jade animate-pulse" />
            <span className="text-xs text-mist">
              {activeSources} active{activeSources > 1 ? 's' : ''}
            </span>
          </div>
          {onAddSource && (
            <button className="btn-primary text-sm px-4 py-1.5" onClick={onAddSource}>
              + Source
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
