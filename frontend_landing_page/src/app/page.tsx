'use client'

import { useState } from 'react'
import AuroraBackground from '@/components/AuroraBackground'

const FEATURES = [
  {
    icon: '🔌',
    title: 'Multi-auth',
    desc: 'API Key, Bearer, OAuth 2.0, Basic Auth — all major standards supported natively.',
  },
  {
    icon: '⏱',
    title: 'Scheduling',
    desc: 'Automatic collection from every 5 minutes to weekly, without writing a single cron.',
  },
  {
    icon: '🗄',
    title: 'Multi-storage',
    desc: 'CSV, JSON, SQLite, PostgreSQL, S3, BigQuery — choose your destination.',
  },
  {
    icon: '🔔',
    title: 'Alerts',
    desc: 'Webhook or email notifications as soon as a collection fails or degrades.',
  },
]

const STEPS = [
  { n: '01', title: 'Connect a source', desc: 'URL, auth, format — configured in under a minute.' },
  { n: '02', title: 'Schedule', desc: 'Set the frequency and storage destination.' },
  { n: '03', title: 'Retrieve', desc: 'Fresh data in your storage, hands-free.' },
  { n: '04', title: 'Monitor', desc: 'Real-time metrics and automatic alerts.' },
]

function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.detail ?? 'Something went wrong')
      }
      setStatus('success')
      setEmail('')
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-2 py-4">
        <span className="text-2xl">🎉</span>
        <p className="font-display font-semibold text-jade">You&apos;re on the list!</p>
        <p className="text-sm text-mist">We&apos;ll reach out as soon as early access opens.</p>
      </div>
    )
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="email"
          required
          placeholder="you@company.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle') }}
          className="flex-1 px-4 py-3 rounded-lg text-sm"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', color: '#fff', outline: 'none' }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary px-6 py-3 whitespace-nowrap disabled:opacity-60"
        >
          {status === 'loading' ? 'Sending…' : 'Join the beta'}
        </button>
      </form>
      {status === 'error' && <p className="mt-2 text-sm text-rose">{errorMsg}</p>}
      <p className="mt-3 text-xs text-mist-dim">No spam. Unsubscribe anytime.</p>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="grid-bg min-h-screen relative">
      <AuroraBackground />
      <div className="relative z-10">

        {/* Nav */}
        <nav
          className="sticky top-0 z-50 border-b"
          style={{ background: 'rgba(10,10,15,.85)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <span className="font-display font-bold text-2xl tracking-tight bifrost-text">Bifrost</span>
            <a
              href="#waitlist"
              className="btn-primary text-sm px-4 py-2"
            >
              Waitlist →
            </a>
          </div>
        </nav>

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        
          <h1 className="font-display font-bold text-5xl md:text-6xl text-white mb-6 leading-tight">
            Orchestrate your APIs.
            <br />
            <span style={{ background: 'linear-gradient(135deg,#6C63FF,#38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Without friction.
            </span>
          </h1>

          <p className="text-lg text-mist max-w-xl mx-auto mb-10 leading-relaxed">
            Bifrost connects, schedules, and stores data from your external APIs.
            Zero infrastructure to manage, zero code to write.
          </p>

          {/* Waitlist form — hero */}
          <div id="waitlist" className="max-w-md mx-auto">
            <WaitlistForm />
          </div>
        </section>

        {/* Metrics band */}
        <div
          className="border-y"
          style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
        >
          <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-3 gap-8 text-center">
            {[
              { num: '50+',    label: 'Supported connectors' },
              { num: '99.9%',  label: 'Guaranteed uptime' },
              { num: '< 1min', label: 'To plug in an API' },
            ].map(m => (
              <div key={m.label}>
                <p className="font-display font-bold text-3xl text-white mb-1">{m.num}</p>
                <p className="text-sm text-mist-dim">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <section id="features" className="max-w-6xl mx-auto px-6 py-20">
          <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: '#6C63FF' }}>
            Features
          </p>
          <h2 className="font-display font-bold text-3xl text-white mb-3">
            Everything you need to manage your data flows
          </h2>
          <p className="text-mist max-w-lg mb-12">
            From setup to scheduling, Bifrost handles the entire lifecycle of your collections.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURES.map(f => (
              <div key={f.title} className="card rounded-xl p-6 hover:shadow-aurora transition-shadow duration-300">
                <span className="text-2xl mb-4 block">{f.icon}</span>
                <h3 className="font-display font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-mist leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section
          className="border-y py-20"
          style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}
        >
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: '#6C63FF' }}>
              How it works
            </p>
            <h2 className="font-display font-bold text-3xl text-white mb-12">
              Up and running in 4 steps
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {STEPS.map((s) => (
                <div key={s.n}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs mb-5"
                    style={{ background: '#12121E', border: '1px solid rgba(255,255,255,0.07)', color: '#9B95FF' }}
                  >
                    {s.n}
                  </div>
                  <h3 className="font-display font-semibold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-mist">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA footer */}
        <section
          className="border-t py-20 text-center"
          style={{ borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <div className="max-w-lg mx-auto px-6">
            <h2 className="font-display font-bold text-3xl text-white mb-4">
              Ready to connect your APIs?
            </h2>
            <p className="text-mist mb-8">
              Join the first teams using Bifrost to orchestrate their data.
            </p>
            <WaitlistForm />
          </div>
        </section>

        {/* Footer */}
        <footer
          className="border-t py-8"
          style={{ borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <div className="max-w-6xl mx-auto px-6 flex items-center justify-center">
            <span className="text-sm text-mist-dim">© 2026 Bifrost</span>
          </div>
        </footer>

      </div>
    </div>
  )
}