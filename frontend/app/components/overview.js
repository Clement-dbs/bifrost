// components/overview.js

export function render() {
    return `
    <div class="grid grid-cols-4 gap-4 mb-6">
        <div class="rounded-xl p-5 card-glow" style="background:#111118; box-shadow: 0 1px 3px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.04);">
            <p class="text-xs font-mono text-mist mb-2 uppercase tracking-widest">Sources actives</p>
            <p class="text-3xl font-display font-800 text-white" id="metric-active">—</p>
            <p class="text-xs text-mist-dim mt-1" id="metric-total">sur — configurées</p>
        </div>
        <div class="rounded-xl p-5" style="background:#111118; box-shadow: 0 1px 3px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.04);">
            <p class="text-xs font-mono text-mist mb-2 uppercase tracking-widest">Collectes aujourd'hui</p>
            <p class="text-3xl font-display font-800 text-white" id="metric-collections">—</p>
            <p class="text-xs text-mist-dim mt-1" id="metric-collections-diff"></p>
        </div>
        <div class="rounded-xl p-5" style="background:#111118; box-shadow: 0 1px 3px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.04);">
            <p class="text-xs font-mono text-mist mb-2 uppercase tracking-widest">Taux de succès</p>
            <p class="text-3xl font-display font-800 text-white" id="metric-success">—</p>
            <p class="text-xs text-mist-dim mt-1" id="metric-errors"></p>
        </div>
        <div class="rounded-xl p-5" style="background:#111118; box-shadow: 0 1px 3px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.04);">
            <p class="text-xs font-mono text-mist mb-2 uppercase tracking-widest">Sources en erreur</p>
            <p class="text-3xl font-display font-800 text-white" id="metric-error-count">—</p>
            <p class="text-xs text-mist-dim mt-1">statut error</p>
        </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
        <div class="rounded-xl p-5" style="background:#111118; box-shadow: 0 1px 3px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.04);">
            <p class="text-xs font-mono text-mist uppercase tracking-widest mb-4">Activité — 7 jours</p>
            <div class="flex items-end gap-1.5 h-28" id="bar-chart"></div>
            <div class="flex justify-between mt-2">
                <span class="text-xs text-mist-dim">Lun</span>
                <span class="text-xs text-mist-dim">Mar</span>
                <span class="text-xs text-mist-dim">Mer</span>
                <span class="text-xs text-mist-dim">Jeu</span>
                <span class="text-xs text-mist-dim">Ven</span>
                <span class="text-xs text-mist-dim">Sam</span>
                <span class="text-xs text-mist-dim font-500">Auj.</span>
            </div>
        </div>
        <div class="rounded-xl p-5" style="background:#111118; box-shadow: 0 1px 3px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.04);">
            <p class="text-xs font-mono text-mist uppercase tracking-widest mb-4">Sources récentes</p>
            <div class="space-y-2" id="recent-sources"></div>
        </div>
    </div>
    `
}

export async function init() {
    await loadMetrics()
    renderBarChart()
}

async function loadMetrics() {
    const res = await fetch('/api/sources/')
    const sources = res.ok ? await res.json() : []

    const active = sources.filter(s => s.status === 'active').length
    const errors = sources.filter(s => s.status === 'error').length
    const total  = sources.length

    document.getElementById('metric-active').textContent      = active
    document.getElementById('metric-total').textContent       = `sur ${total} configurées`
    document.getElementById('metric-error-count').textContent = errors
    document.getElementById('metric-success').textContent     = total
        ? `${Math.round((active / total) * 100)}%`
        : '—'
    document.getElementById('metric-errors').textContent = `${errors} erreur${errors > 1 ? 's' : ''} / ${total}`

    // Active count header
    document.getElementById('active-count').textContent = `${active} active${active > 1 ? 's' : ''}`

    // Sources récentes
    const container = document.getElementById('recent-sources')
    if (!sources.length) {
        container.innerHTML = '<p class="text-xs text-mist-dim">Aucune source configurée</p>'
        return
    }
    const STATUS_COLOR = { active: 'text-jade', error: 'text-red-400', paused: 'text-yellow-400' }
    container.innerHTML = sources.slice(-5).reverse().map(s => `
        <div class="flex items-center justify-between py-1.5 border-b border-white/5">
            <div>
                <p class="text-sm text-white">${s.name}</p>
                <p class="text-xs text-mist-dim">${s.method} · ${s.url.slice(0, 40)}…</p>
            </div>
            <span class="text-xs ${STATUS_COLOR[s.status] || 'text-mist'}">${s.status}</span>
        </div>
    `).join('')
}

function renderBarChart() {
    const chart = document.getElementById('bar-chart')
    if (!chart) return
    const data = [42, 78, 55, 91, 63, 88, 127]
    const max  = Math.max(...data)
    chart.innerHTML = data.map((v, i) => `
        <div class="flex-1 flex flex-col items-center gap-1">
            <div class="w-full rounded-sm" style="
                height: ${Math.round((v / max) * 100)}%;
                background: ${i === 6 ? 'linear-gradient(180deg,#6C63FF,#38BDF8)' : 'rgba(255,255,255,0.08)'};
            "></div>
        </div>
    `).join('')
}