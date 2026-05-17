'use client'

import { useEffect, useState } from 'react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { getSources } from '@/lib/api'
import type { ApiSource } from '@/lib/types'

export default function PlanningPage() {
  const [sources, setSources]   = useState<ApiSource[]>([])
  const [sourceId, setSourceId] = useState('')
  const [frequency, setFreq]    = useState('1h')
  const [dest, setDest]         = useState('json')
  const [failCount, setFail]    = useState('3')
  const [failAction, setAction] = useState('email')

  useEffect(() => { getSources().then(setSources) }, [])

  const active = sources.filter(s => s.status === 'active').length

  function handleSchedule() {
    if (!sourceId) { alert('Sélectionnez une source.'); return }
    alert('Planification bientôt disponible — backend schedules en cours.')
  }

  function handleSaveAlerts() {
    alert('Alertes sauvegardées (bientôt persistées en base).')
  }

  return (
    <>
      <DashboardHeader activeSources={active} />
      <main className="max-w-7xl mx-auto px-6 py-8">

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Scheduled tasks list */}
          <div className="card rounded-xl p-5">
            <p className="text-xs font-mono text-mist uppercase tracking-widest mb-4">
              Tâches planifiées
            </p>
            <div className="space-y-3">
              <p className="text-xs text-mist-dim">Aucune tâche planifiée</p>
            </div>
          </div>

          {/* New task form */}
          <div className="card rounded-xl p-5">
            <p className="text-xs font-mono text-mist uppercase tracking-widest mb-4">
              Nouvelle tâche
            </p>
            <div className="space-y-3">
              <div>
                <label>Source</label>
                <select value={sourceId} onChange={e => setSourceId(e.target.value)}>
                  <option value="">— Sélectionner une source —</option>
                  {sources.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.method} {s.url.slice(0, 40)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Fréquence</label>
                <select value={frequency} onChange={e => setFreq(e.target.value)}>
                  <option value="5min">Toutes les 5 min</option>
                  <option value="15min">Toutes les 15 min</option>
                  <option value="30min">Toutes les 30 min</option>
                  <option value="1h">Toutes les heures</option>
                  <option value="daily">Quotidien</option>
                  <option value="weekly">Hebdomadaire</option>
                </select>
              </div>
              <div>
                <label>Destination de stockage</label>
                <select value={dest} onChange={e => setDest(e.target.value)}>
                  <option value="csv">CSV local</option>
                  <option value="json">JSON local</option>
                  <option value="sqlite">SQLite</option>
                  <option value="postgresql">PostgreSQL</option>
                  <option value="s3">S3 / Object Storage</option>
                  <option value="bigquery">BigQuery</option>
                </select>
              </div>
              <button className="btn-primary w-full mt-2" onClick={handleSchedule}>
                Planifier la collecte
              </button>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="card rounded-xl p-5">
          <p className="text-xs font-mono text-mist uppercase tracking-widest mb-4">
            Alertes &amp; conditions
          </p>
          <div className="grid grid-cols-3 gap-4 items-end">
            <div>
              <label>Échecs consécutifs avant alerte</label>
              <input
                type="number"
                value={failCount}
                min={1} max={10}
                onChange={e => setFail(e.target.value)}
              />
            </div>
            <div>
              <label>Action automatique</label>
              <select value={failAction} onChange={e => setAction(e.target.value)}>
                <option value="email">Envoyer un email</option>
                <option value="webhook">Notification webhook</option>
                <option value="pause">Mettre en pause la source</option>
                <option value="retry">Retry automatique</option>
              </select>
            </div>
            <div>
              <button className="btn-primary w-full" onClick={handleSaveAlerts}>
                Sauvegarder
              </button>
            </div>
          </div>
        </div>

      </main>
    </>
  )
}
