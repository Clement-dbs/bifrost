'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { getSources } from '@/lib/api'
import type { ApiSource } from '@/lib/types'

const MOCK_ACTIVITY = [42, 78, 55, 91, 63, 88, 127]
const DAY_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Auj.']

const STATUS_COLOR: Record<string, string> = {
  active: 'text-jade',
  error:  'text-red-400',
  paused: 'text-yellow-400',
}

export default function OverviewPage() {
  const [sources, setSources] = useState<ApiSource[]>([])
  const router = useRouter()

  useEffect(() => {
    getSources().then(setSources)
  }, [])

  const active  = sources.filter(s => s.status === 'active').length
  const errors  = sources.filter(s => s.status === 'error').length
  const total   = sources.length
  const maxBar  = Math.max(...MOCK_ACTIVITY)

  return (
    <>
      <DashboardHeader
        activeSources={active}
        onAddSource={() => router.push('/dashboard/sources?new=1')}
      />
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Metrics row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            {
              label: 'Sources actives',
              value: active,
              sub: `sur ${total} configurées`,
            },
            {
              label: 'Collectes aujourd\'hui',
              value: MOCK_ACTIVITY[6],
              sub: '+12 vs hier',
            },
            {
              label: 'Taux de succès',
              value: total ? `${Math.round((active / total) * 100)}%` : '—',
              sub: `${errors} erreur${errors !== 1 ? 's' : ''} / ${total}`,
            },
            {
              label: 'Sources en erreur',
              value: errors,
              sub: 'statut error',
            },
          ].map((m) => (
            <div key={m.label} className="card rounded-xl p-5">
              <p className="text-xs font-mono text-mist mb-2 uppercase tracking-widest">{m.label}</p>
              <p className="text-3xl font-display font-bold text-white">{m.value}</p>
              <p className="text-xs text-mist-dim mt-1">{m.sub}</p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Bar chart */}
          <div className="card rounded-xl p-5">
            <p className="text-xs font-mono text-mist uppercase tracking-widest mb-4">
              Activité — 7 jours
            </p>
            <div className="flex items-end gap-1.5 h-28">
              {MOCK_ACTIVITY.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full">
                  <div
                    className="w-full rounded-sm"
                    style={{
                      height: `${Math.round((v / maxBar) * 100)}%`,
                      background:
                        i === 6
                          ? 'linear-gradient(180deg,#6C63FF,#38BDF8)'
                          : 'rgba(255,255,255,0.08)',
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {DAY_LABELS.map((d, i) => (
                <span
                  key={d}
                  className={`text-xs ${i === 6 ? 'text-mist font-medium' : 'text-mist-dim'}`}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* Recent sources */}
          <div className="card rounded-xl p-5">
            <p className="text-xs font-mono text-mist uppercase tracking-widest mb-4">
              Sources récentes
            </p>
            <div className="space-y-2">
              {!sources.length ? (
                <p className="text-xs text-mist-dim">Aucune source configurée</p>
              ) : (
                [...sources].reverse().slice(0, 5).map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between py-1.5 border-b"
                    style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                  >
                    <div>
                      <p className="text-sm text-white">{s.name}</p>
                      <p className="text-xs text-mist-dim">
                        {s.method} · {s.url.slice(0, 40)}…
                      </p>
                    </div>
                    <span className={`text-xs ${STATUS_COLOR[s.status] || 'text-mist'}`}>
                      {s.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
