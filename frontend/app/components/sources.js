// components/sources.js

export function render() {
    return `
    <div class="flex items-center justify-between mb-5">
        <div>
            <h2 class="font-display font-700 text-lg text-white">Sources configurées</h2>
            <p class="text-xs text-mist mt-0.5" id="source-subtitle">— connecteurs</p>
        </div>
        <button class="btn-primary" id="toggle-form">+ Nouvelle source</button>
    </div>

    <!-- Liste -->
    <div class="rounded-xl p-1 mb-5" style="background:#111118; box-shadow: 0 1px 3px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.04);">
        <div class="px-5" id="source-list">
            <div class="py-12 text-center">
                <p class="text-2xl mb-2">🔌</p>
                <p class="text-sm text-mist">Chargement...</p>
            </div>
        </div>
    </div>

    <!-- Formulaire -->
    <div id="add-form" class="hidden rounded-xl p-6 card-glow" style="background:#111118; box-shadow: 0 0 0 1px rgba(108,99,255,.2), 0 0 30px rgba(108,99,255,.07);">
        <h3 class="font-display font-600 text-base text-white mb-5" id="form-title">Nouvelle source API</h3>
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
                <label>Nom de la source</label>
                <input type="text" id="api_name_source" placeholder="Ex : Stripe API">
            </div>
            <div>
                <label>Méthode</label>
                <select id="method">
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                    <option value="DELETE">DELETE</option>
                </select>
            </div>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
                <label>Type d'authentification</label>
                <select id="authentification_type">
                    <option value="none">Publique (sans auth)</option>
                    <option value="api_key">Clé API (header)</option>
                    <option value="bearer">Bearer Token</option>
                    <option value="oauth2">OAuth 2.0</option>
                    <option value="basic">Basic Auth</option>
                </select>
            </div>
            <div>
                <label>URL de l'endpoint</label>
                <input type="text" id="api_url" placeholder="https://api-exemple.com">
            </div>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
                <label>Clé / Token (si requis)</label>
                <input type="text" id="api_key" placeholder="sk_...">
            </div>
            <div>
                <label>Format de réponse</label>
                <select id="response_format">
                    <option value="json">JSON</option>
                    <option value="csv">CSV</option>
                    <option value="xml">XML</option>
                    <option value="text">Texte brut</option>
                </select>
            </div>
        </div>
        <div id="form-feedback" class="hidden mb-4 px-4 py-3 rounded-lg text-sm"></div>
        <div class="flex gap-3 justify-end">
            <button class="btn-ghost" id="btn-cancel">Annuler</button>
            <button class="btn-primary" id="submit-btn">Tester & Sauvegarder</button>
        </div>
    </div>
    `
}

export async function init() {
    document.getElementById('toggle-form').addEventListener('click', () => {
        document.getElementById('add-form').classList.toggle('hidden')
    })
    document.getElementById('btn-cancel').addEventListener('click', resetForm)
    document.getElementById('submit-btn').addEventListener('click', submitSource)
    await loadSources()
}

// ── API ────────────────────────────────────────────────────────────────────

async function loadSources() {
    const res = await fetch('/api/sources/')
    const sources = res.ok ? await res.json() : []
    renderSources(sources)

    const subtitle = document.getElementById('source-subtitle')
    const active   = sources.filter(s => s.status === 'active').length
    if (subtitle) subtitle.textContent = `${sources.length} connecteurs · ${active} actifs`
    
    const activeCount = document.getElementById('active-count')
    if (activeCount) activeCount.textContent = `${active} active${active > 1 ? 's' : ''}`
}

function renderSources(sources) {
    const container = document.getElementById('source-list')
    if (!sources.length) {
        container.innerHTML = `
            <div class="py-12 text-center">
                <p class="text-2xl mb-2">🔌</p>
                <p class="text-sm text-mist">Aucune source configurée</p>
                <p class="text-xs text-mist-dim mt-1">Cliquez sur "+ Nouvelle source" pour commencer</p>
            </div>`
        return
    }

    const STATUS_COLOR = { active: 'badge-ok', error: 'badge-error', paused: 'badge-warn' }
    container.innerHTML = sources.map(s => `
        <div class="source-row flex items-center gap-4 py-3 border-b border-white/5">
            <div class="flex-1">
                <p class="text-sm font-500 text-white">${s.name}</p>
                <p class="text-xs text-mist-dim">${s.method} · ${s.auth_type} · ${s.response_format}</p>
                <p class="text-xs text-mist-dim truncate max-w-xs">${s.url}</p>
            </div>
            <span class="${STATUS_COLOR[s.status] || ''} text-xs px-2.5 py-1 rounded-full">${s.status}</span>
            <button class="btn-sm" onclick='openEdit(${JSON.stringify(s)})'>Modifier</button>
            <button class="btn-ghost text-xs text-red-400 hover:text-red-300" onclick="confirmDelete(${s.id}, '${s.name}')">Suppr.</button>
        </div>
    `).join('')
}

async function submitSource() {
    const body = {
        name:            document.getElementById('api_name_source').value.trim(),
        url:             document.getElementById('api_url').value.trim(),
        method:          document.getElementById('method').value,
        auth_type:       document.getElementById('authentification_type').value,
        auth_value:      document.getElementById('api_key').value || null,
        response_format: document.getElementById('response_format').value,
    }

    const editingId = document.getElementById('submit-btn').dataset.editingId
    const isEdit    = !!editingId

    const res = await fetch(
        isEdit ? `/api/sources/${editingId}` : '/api/sources/',
        {
            method:  isEdit ? 'PATCH' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(body),
        }
    )

    const feedback = document.getElementById('form-feedback')
    if (res.ok) {
        feedback.className   = 'mb-4 px-4 py-3 rounded-lg text-sm text-jade bg-jade/10'
        feedback.textContent = isEdit ? '✓ Source mise à jour.' : '✓ Source créée avec succès.'
        feedback.classList.remove('hidden')
        setTimeout(() => { resetForm(); loadSources() }, 800)
    } else {
        const err = await res.json()
        feedback.className   = 'mb-4 px-4 py-3 rounded-lg text-sm text-red-400 bg-red-400/10'
        feedback.textContent = `✗ ${err.detail}`
        feedback.classList.remove('hidden')
    }
}

async function confirmDelete(id, name) {
    if (!confirm(`Supprimer "${name}" ?`)) return
    const res = await fetch(`/api/sources/${id}`, { method: 'DELETE' })
    if (res.status === 204) {
        loadSources()
    } else {
        const err = await res.json()
        alert(`Erreur : ${err.detail}`)
    }
}

function openEdit(s) {
    document.getElementById('form-title').textContent              = 'Modifier la source'
    document.getElementById('api_name_source').value              = s.name
    document.getElementById('api_url').value                      = s.url
    document.getElementById('method').value                       = s.method
    document.getElementById('authentification_type').value        = s.auth_type
    document.getElementById('api_key').value                      = ''
    document.getElementById('response_format').value              = s.response_format
    document.getElementById('submit-btn').textContent             = 'Mettre à jour'
    document.getElementById('submit-btn').dataset.editingId       = s.id
    document.getElementById('add-form').classList.remove('hidden')
    document.getElementById('add-form').scrollIntoView({ behavior: 'smooth' })
}

function resetForm() {
    document.getElementById('form-title').textContent       = 'Nouvelle source API'
    document.getElementById('api_name_source').value        = ''
    document.getElementById('api_url').value                = ''
    document.getElementById('api_key').value                = ''
    document.getElementById('authentification_type').value  = 'none'
    document.getElementById('response_format').value        = 'json'
    document.getElementById('method').value                 = 'GET'
    document.getElementById('form-feedback').classList.add('hidden')
    document.getElementById('submit-btn').textContent       = 'Tester & Sauvegarder'
    delete document.getElementById('submit-btn').dataset.editingId
    document.getElementById('add-form').classList.add('hidden')
}

// Exposé globalement pour les onclick inline
window.confirmDelete = confirmDelete
window.openEdit      = openEdit