import Link from 'next/link'
import AuroraBackground from '@/components/AuroraBackground'

const FEATURES = [
  {
    icon: '🔌',
    title: 'Multi-auth',
    desc: 'API Key, Bearer, OAuth 2.0, Basic Auth — tous les standards supportés nativement.',
  },
  {
    icon: '⏱',
    title: 'Planification',
    desc: 'Collectes automatiques de 5 min à hebdomadaire, sans écrire une ligne de cron.',
  },
  {
    icon: '🗄',
    title: 'Multi-stockage',
    desc: 'CSV, JSON, SQLite, PostgreSQL, S3, BigQuery — choisissez votre destination.',
  },
  {
    icon: '🔔',
    title: 'Alertes',
    desc: 'Notifications webhook ou email dès qu\'une collecte échoue ou se dégrade.',
  },
]

const STEPS = [
  { n: '01', title: 'Connectez une source', desc: 'URL, auth, format — configuré en moins d\'une minute.' },
  { n: '02', title: 'Planifiez', desc: 'Définissez la fréquence et la destination de stockage.' },
  { n: '03', title: 'Récupérez', desc: 'Données fraîches dans votre stockage, sans intervention.' },
  { n: '04', title: 'Surveillez', desc: 'Métriques en temps réel et alertes automatiques.' },
]

const PLANS = [
  {
    name: 'Starter',
    price: '0€',
    period: '/mois',
    desc: 'Pour explorer et tester',
    features: ['3 sources API', 'Collecte horaire', 'Stockage JSON/CSV'],
    featured: false,
    cta: 'Démarrer',
  },
  {
    name: 'Pro',
    price: '29€',
    period: '/mois',
    desc: 'Pour les équipes data',
    features: ['Sources illimitées', 'Collecte toutes les 5 min', 'S3, PostgreSQL, BigQuery', 'Alertes webhook'],
    featured: true,
    cta: 'Essai 14 jours',
  },
  {
    name: 'Enterprise',
    price: 'Sur devis',
    period: '',
    desc: 'Pour les grandes organisations',
    features: ['SSO & SAML', 'SLA garanti', 'Support dédié'],
    featured: false,
    cta: 'Nous contacter',
  },
]

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
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                style={{ background: 'linear-gradient(135deg,#6C63FF,#38BDF8)' }}
              >
                🌈
              </div>
              <span className="font-display font-bold text-base tracking-tight bifrost-text">Bifrost</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="nav-link text-sm">Fonctionnalités</a>
              <a href="#pricing"  className="nav-link text-sm">Tarifs</a>
              <a href="#docs"     className="nav-link text-sm">Documentation</a>
              <Link href="/dashboard" className="btn-primary text-sm px-4 py-2">
                Accéder au dashboard →
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
          <div
            className="inline-flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full mb-8"
            style={{ background: 'rgba(108,99,255,0.12)', color: '#9B95FF', border: '1px solid rgba(108,99,255,0.2)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-jade animate-pulse" />
            Bêta ouverte — accès gratuit
          </div>

          <h1 className="font-display font-bold text-5xl md:text-6xl text-white mb-6 leading-tight">
            Orchestrez vos APIs.
            <br />
            <span style={{ background: 'linear-gradient(135deg,#6C63FF,#38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Sans friction.
            </span>
          </h1>

          <p className="text-lg text-mist max-w-xl mx-auto mb-10 leading-relaxed">
            Bifrost connecte, planifie et stocke les données de vos APIs externes.
            Zéro infra à gérer, zéro code à écrire.
          </p>

          <div className="flex items-center justify-center gap-4 mb-12">
            <Link href="/dashboard" className="btn-primary px-6 py-3 text-base">
              Commencer gratuitement
            </Link>
            <button className="btn-ghost px-6 py-3 text-base">Voir la démo</button>
          </div>

          <div
            className="inline-flex items-center gap-3 font-mono text-sm px-5 py-3 rounded-xl"
            style={{ background: '#12121E', border: '1px solid rgba(255,255,255,0.07)', color: '#38BDF8' }}
          >
            <span style={{ color: 'rgba(232,232,240,0.3)' }}>$</span>
            pip install bifrost-cli &amp;&amp; bifrost init
          </div>
        </section>

        {/* Metrics band */}
        <div
          className="border-y"
          style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
        >
          <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-3 gap-8 text-center">
            {[
              { num: '50+',    label: 'Connecteurs supportés' },
              { num: '99.9%',  label: 'Uptime garanti' },
              { num: '< 1min', label: 'Pour brancher une API' },
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
            Fonctionnalités
          </p>
          <h2 className="font-display font-bold text-3xl text-white mb-3">
            Tout ce qu&apos;il faut pour gérer vos flux
          </h2>
          <p className="text-mist max-w-lg mb-12">
            De la configuration à la planification, Bifrost prend en charge l&apos;ensemble du cycle de vie de vos collectes.
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
              Comment ça marche
            </p>
            <h2 className="font-display font-bold text-3xl text-white mb-12">
              Opérationnel en 4 étapes
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {STEPS.map((s, i) => (
                <div key={s.n}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs mb-5"
                    style={{ background: '#12121E', border: '1px solid rgba(255,255,255,0.07)', color: '#9B95FF' }}
                  >
                    {s.n}
                  </div>
                  <h3 className="font-display font-semibold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-mist">{s.desc}</p>
                  {i < STEPS.length - 1 && (
                    <div
                      className="hidden md:block absolute"
                      style={{ top: '20px', right: '-20px', color: 'rgba(255,255,255,0.1)', fontSize: '20px' }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="max-w-6xl mx-auto px-6 py-20">
          <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: '#6C63FF' }}>
            Tarifs
          </p>
          <h2 className="font-display font-bold text-3xl text-white mb-3">Simple et prévisible</h2>
          <p className="text-mist mb-12">Commencez gratuitement, évoluez selon vos besoins.</p>
          <div className="grid grid-cols-3 gap-6">
            {PLANS.map(p => (
              <div
                key={p.name}
                className="rounded-xl p-6"
                style={{
                  background: '#111118',
                  border: p.featured ? '1px solid rgba(108,99,255,0.5)' : '1px solid rgba(255,255,255,0.07)',
                  boxShadow: p.featured ? '0 0 30px rgba(108,99,255,0.1)' : undefined,
                }}
              >
                {p.featured && (
                  <span
                    className="inline-block text-xs font-mono px-3 py-1 rounded-full mb-4"
                    style={{ background: 'rgba(108,99,255,0.15)', color: '#9B95FF' }}
                  >
                    Populaire
                  </span>
                )}
                <h3 className="font-display font-semibold text-white mb-1">{p.name}</h3>
                <div className="mb-1">
                  <span className="font-display font-bold text-3xl text-white">{p.price}</span>
                  {p.period && <span className="text-sm text-mist ml-1">{p.period}</span>}
                </div>
                <p className="text-sm text-mist mb-5">{p.desc}</p>
                <ul className="space-y-2 mb-6">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-mist">
                      <span className="text-jade text-xs">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/dashboard"
                  className={p.featured ? 'btn-primary block text-center py-2.5' : 'btn-ghost block text-center py-2.5'}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          className="border-t py-20 text-center"
          style={{ borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="font-display font-bold text-3xl text-white mb-4">
              Prêt à connecter vos APIs ?
            </h2>
            <p className="text-mist mb-8">
              Rejoignez les premières équipes qui utilisent Bifrost pour orchestrer leurs données.
            </p>
            <div className="flex items-center justify-center gap-3">
              <input
                type="email"
                placeholder="votre@email.com"
                className="px-4 py-3 rounded-lg text-sm w-64"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text)', outline: 'none' }}
              />
              <button className="btn-primary px-6 py-3">Rejoindre la bêta</button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          className="border-t py-8"
          style={{ borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
            <span className="font-display font-bold text-sm bifrost-text">Bifrost</span>
            <div className="flex gap-6">
              {['Documentation', 'GitHub', 'Mentions légales', 'Contact'].map(l => (
                <a key={l} href="#" className="text-xs text-mist-dim hover:text-mist transition-colors">
                  {l}
                </a>
              ))}
            </div>
            <span className="text-xs text-mist-dim">© 2026 Bifrost</span>
          </div>
        </footer>

      </div>
    </div>
  )
}
