'use client'

import { useState } from 'react'
import type { ApiSource, SourceIn, AuthType, HttpMethod, ResponseFormat } from '@/lib/types'
import { createSource, updateSource } from '@/lib/api'

interface Props {
  source?: ApiSource
  onSuccess: () => void
  onCancel: () => void
}

const AUTH_OPTIONS: { value: AuthType; label: string }[] = [
  { value: 'none',    label: 'Publique (sans auth)' },
  { value: 'api_key', label: 'Clé API (header)' },
  { value: 'bearer',  label: 'Bearer Token' },
  { value: 'oauth2',  label: 'OAuth 2.0' },
  { value: 'basic',   label: 'Basic Auth' },
]

const METHOD_OPTIONS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
const FORMAT_OPTIONS: ResponseFormat[] = ['json', 'csv', 'xml', 'text']

export default function SourceForm({ source, onSuccess, onCancel }: Props) {
  const isEdit = !!source
  const [form, setForm] = useState<SourceIn>({
    name:            source?.name            ?? '',
    url:             source?.url             ?? '',
    method:          source?.method          ?? 'GET',
    auth_type:       source?.auth_type       ?? 'none',
    auth_value:      null,
    response_format: source?.response_format ?? 'json',
  })
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)
  const [loading, setLoading]   = useState(false)

  const set = (k: keyof SourceIn, v: string | null) =>
    setForm(prev => ({ ...prev, [k]: v }))

  async function handleSubmit() {
    setLoading(true)
    setFeedback(null)
    try {
      if (isEdit) {
        await updateSource(source!.id, form)
      } else {
        await createSource(form)
      }
      setFeedback({ type: 'ok', msg: isEdit ? '✓ Source mise à jour.' : '✓ Source créée avec succès.' })
      setTimeout(onSuccess, 800)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erreur inconnue'
      setFeedback({ type: 'err', msg: `✗ ${msg}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="rounded-xl p-6 card-glow"
      style={{ background: '#111118', boxShadow: '0 0 0 1px rgba(108,99,255,.2), 0 0 30px rgba(108,99,255,.07)' }}
    >
      <h3 className="font-display font-semibold text-base text-white mb-5">
        {isEdit ? 'Modifier la source' : 'Nouvelle source API'}
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label>Nom de la source</label>
          <input
            type="text"
            placeholder="Ex : Stripe API"
            value={form.name}
            onChange={e => set('name', e.target.value)}
          />
        </div>
        <div>
          <label>Méthode</label>
          <select value={form.method} onChange={e => set('method', e.target.value as HttpMethod)}>
            {METHOD_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label>Type d'authentification</label>
          <select value={form.auth_type} onChange={e => set('auth_type', e.target.value as AuthType)}>
            {AUTH_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label>URL de l'endpoint</label>
          <input
            type="text"
            placeholder="https://api-exemple.com"
            value={form.url}
            onChange={e => set('url', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label>Clé / Token (si requis)</label>
          <input
            type="text"
            placeholder="sk_..."
            value={form.auth_value ?? ''}
            onChange={e => set('auth_value', e.target.value || null)}
          />
        </div>
        <div>
          <label>Format de réponse</label>
          <select value={form.response_format} onChange={e => set('response_format', e.target.value as ResponseFormat)}>
            {FORMAT_OPTIONS.map(f => <option key={f} value={f}>{f.toUpperCase()}</option>)}
          </select>
        </div>
      </div>

      {feedback && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-sm ${
            feedback.type === 'ok'
              ? 'text-jade bg-jade/10'
              : 'text-red-400 bg-red-400/10'
          }`}
        >
          {feedback.msg}
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <button className="btn-ghost" onClick={onCancel}>Annuler</button>
        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Envoi…' : isEdit ? 'Mettre à jour' : 'Tester & Sauvegarder'}
        </button>
      </div>
    </div>
  )
}
