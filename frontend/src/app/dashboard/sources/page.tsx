'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import SourceForm from '@/components/dashboard/SourceForm'
import { getSources, deleteSource } from '@/lib/api'
import type { ApiSource } from '@/lib/types'

const STATUS_COLOR: Record<string, string> = {
  active: 'badge-ok',
  error:  'badge-error',
  paused: 'badge-warn',
}

function SourcesContent() {
  const searchParams  = useSearchParams()
  const [sources, setSources]       = useState<ApiSource[]>([])
  const [showForm, setShowForm]     = useState(false)
  const [editing, setEditing]       = useState<ApiSource | undefined>()

  const load = useCallback(async () => {
    const data = await getSources()
    setSources(data)
  }, [])

  useEffect(() => {
    load()
    if (searchParams.get('new') === '1') setShowForm(true)
  }, [load, searchParams])

  const active = sources.filter(s => s.status === 'active').length

  function openAdd() {
    setEditing(undefined)
    setShowForm(true)
  }

  function openEdit(s: ApiSource) {
    setEditing(s)
    setShowForm(true)
    setTimeout(() => {
      document.getElementById('source-form')?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  function handleSuccess() {
    setShowForm(false)
    setEditing(undefined)
    load()
  }

  async function handleDelete(s: ApiSource) {
    if (!confirm(`Supprimer "${s.name}" ?`)) return
    try {
      await deleteSource(s.id)
      load()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erreur'
      alert(`Erreur : ${msg}`)
    }
  }

  return (
    <>
      <DashboardHeader activeSources={active} onAddSource={openAdd} />
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Header row */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display font-bold text-lg text-white">Sources configurées</h2>
            <p className="text-xs text-mist mt-0.5">
              {sources.length} connecteurs · {active} actifs
            </p>
          </div>
          <button className="btn-primary" onClick={openAdd}>+ Nouvelle source</button>
        </div>

        {/* Source list */}
        <div className="card rounded-xl p-1 mb-5">
          <div className="px-5">
            {!sources.length ? (
              <div className="py-12 text-center">
                <p className="text-2xl mb-2">🔌</p>
                <p className="text-sm text-mist">Aucune source configurée</p>
                <p className="text-xs text-mist-dim mt-1">
                  Cliquez sur &quot;+ Nouvelle source&quot; pour commencer
                </p>
              </div>
            ) : (
              sources.map(s => (
                <div
                  key={s.id}
                  className="source-row flex items-center gap-4 py-3 border-b"
                  style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{s.name}</p>
                    <p className="text-xs text-mist-dim">
                      {s.method} · {s.auth_type} · {s.response_format}
                    </p>
                    <p className="text-xs text-mist-dim truncate max-w-xs">{s.url}</p>
                  </div>
                  <span className={`${STATUS_COLOR[s.status] || ''} text-xs px-2.5 py-1 rounded-full`}>
                    {s.status}
                  </span>
                  <button className="btn-sm" onClick={() => openEdit(s)}>Modifier</button>
                  <button
                    className="btn-ghost text-xs text-red-400 hover:text-red-300"
                    onClick={() => handleDelete(s)}
                  >
                    Suppr.
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div id="source-form">
            <SourceForm
              source={editing}
              onSuccess={handleSuccess}
              onCancel={() => { setShowForm(false); setEditing(undefined) }}
            />
          </div>
        )}
      </main>
    </>
  )
}

export default function SourcesPage() {
  return (
    <Suspense>
      <SourcesContent />
    </Suspense>
  )
}
