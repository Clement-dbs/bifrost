# Bifrost — Frontend Next.js

## Structure du projet

```
bifrost-next/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (fonts, metadata)
│   │   ├── globals.css             # Design tokens, composants CSS globaux
│   │   ├── page.tsx                # Landing page (/)
│   │   └── dashboard/
│   │       ├── layout.tsx          # Layout dashboard (aurora bg, grid)
│   │       ├── page.tsx            # Vue d'ensemble (/dashboard)
│   │       ├── sources/
│   │       │   └── page.tsx        # Sources API (/dashboard/sources)
│   │       └── planning/
│   │           └── page.tsx        # Planification (/dashboard/planning)
│   ├── components/
│   │   ├── AuroraBackground.tsx    # Blobs d'arrière-plan animés
│   │   └── dashboard/
│   │       ├── DashboardHeader.tsx # Header/nav partagé du dashboard
│   │       └── SourceForm.tsx      # Formulaire création/édition source
│   └── lib/
│       ├── api.ts                  # Toutes les fonctions fetch vers FastAPI
│       └── types.ts                # Types TypeScript partagés
├── next.config.js                  # Proxy /api/* → http://localhost:8000
├── tailwind.config.ts
└── package.json
```

## Installation

```bash
cd bifrost-next
npm install
npm run dev
```

Le frontend démarre sur **http://localhost:3000**.

## Proxy API

`next.config.js` redirige automatiquement tous les appels `/api/*` vers
`http://localhost:8000/api/*` (ton backend FastAPI). Lance les deux en parallèle :

```bash
# Terminal 1 — backend
uvicorn app.main:app --reload

# Terminal 2 — frontend
cd bifrost-next && npm run dev
```

## Routes

| URL | Description |
|-----|-------------|
| `/` | Landing page marketing |
| `/dashboard` | Vue d'ensemble (métriques) |
| `/dashboard/sources` | Gestion des sources API |
| `/dashboard/sources?new=1` | Ouvre directement le formulaire |
| `/dashboard/planning` | Planification des collectes |

## Prochaines étapes pour le SaaS

1. **Auth** — Ajouter Supabase Auth (`@supabase/ssr`) avec middleware Next.js pour protéger `/dashboard`
2. **Base de données** — Migrer SQLite → Supabase Postgres
3. **Paiement** — Intégrer Stripe avec un webhook pour gérer les abonnements
4. **Déploiement** — `vercel --prod` (zéro config, détecte Next.js automatiquement)
