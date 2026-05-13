// components/planning.js

export function render() {
    return `
    <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="rounded-xl p-5" style="background:#111118; box-shadow: 0 1px 3px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.04);">
            <p class="text-xs font-mono text-mist uppercase tracking-widest mb-4">Tâches planifiées</p>
            <div class="space-y-3" id="planning-list">
                <p class="text-xs text-mist-dim">Aucune tâche planifiée</p>
            </div>
        </div>
        <div class="rounded-xl p-5" style="background:#111118; box-shadow: 0 1px 3px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.04);">
            <p class="text-xs font-mono text-mist uppercase tracking-widest mb-4">Nouvelle tâche</p>
            <div class="space-y-3">
                <div>
                    <label>Source</label>
                    <select id="planning-source">
                        <option value="">— Sélectionner une source —</option>
                    </select>
                </div>
                <div>
                    <label>Fréquence</label>
                    <select id="planning-frequency">
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
                    <select id="planning-dest">
                        <option value="csv">CSV local</option>
                        <option value="json">JSON local</option>
                        <option value="sqlite">SQLite</option>
                        <option value="postgresql">PostgreSQL</option>
                        <option value="s3">S3 / Object Storage</option>
                        <option value="bigquery">BigQuery</option>
                    </select>
                </div>
                <button class="btn-primary w-full mt-2" id="btn-plan">Planifier la collecte</button>
            </div>
        </div>
    </div>

    <div class="rounded-xl p-5" style="background:#111118; box-shadow: 0 1px 3px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.04);">
        <p class="text-xs font-mono text-mist uppercase tracking-widest mb-4">Alertes & conditions</p>
        <div class="grid grid-cols-3 gap-4 items-end">
            <div>
                <label>Échecs consécutifs avant alerte</label>
                <input type="number" id="fail-threshold" value="3" min="1" max="10">
            </div>
            <div>
                <label>Action automatique</label>
                <select id="fail-action">
                    <option value="email">Envoyer un email</option>
                    <option value="webhook">Notification webhook</option>
                    <option value="pause">Mettre en pause la source</option>
                    <option value="retry">Retry automatique</option>
                </select>
            </div>
            <div class="flex gap-2">
                <button class="btn-primary flex-1" id="btn-save-alerts">Sauvegarder</button>
            </div>
        </div>
    </div>
    `
}

export async function init() {
    await loadSourcesIntoSelect()
    document.getElementById('btn-plan').addEventListener('click', scheduleCollection)
    document.getElementById('btn-save-alerts').addEventListener('click', saveAlerts)
}

async function loadSourcesIntoSelect() {
    const res     = await fetch('/api/sources/')
    const sources = res.ok ? await res.json() : []
    const select  = document.getElementById('planning-source')

    sources.forEach(s => {
        const opt   = document.createElement('option')
        opt.value   = s.id
        opt.textContent = `${s.name} — ${s.method} ${s.url.slice(0, 40)}`
        select.appendChild(opt)
    })
}

async function scheduleCollection() {
    const sourceId = document.getElementById('planning-source').value
    if (!sourceId) {
        alert('Sélectionnez une source.')
        return
    }
    // TODO: POST /api/schedules/ quand le router schedules sera branché
    alert('Planification bientôt disponible — backend schedules en cours.')
}

function saveAlerts() {
    // TODO: PATCH /api/schedules/:id avec fail_threshold et fail_action
    alert('Alertes sauvegardées (bientôt persistées en base).')
}