// router.js
import * as overview  from './components/overview.js'
import * as sources   from './components/sources.js'
import * as planning  from './components/planning.js'

const routes = { overview, sources, planning }

async function navigate(tab) {
    const app = document.getElementById('app')

    document.querySelectorAll('.nav-link').forEach(l => {
        l.classList.toggle('active', l.dataset.tab === tab)
    })

    const mod = routes[tab]
    app.innerHTML = mod.render()
    await mod.init()
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navigate(link.dataset.tab))
})

document.getElementById('btn-add-source').addEventListener('click', () => {
    navigate('sources').then(() => {
        document.getElementById('add-form')?.classList.remove('hidden')
    })
})

navigate('overview')