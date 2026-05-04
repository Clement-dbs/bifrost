async function loadSources() {

    const res = await fetch("http://localhost:8000/api/sources");
    const sources = await res.json();
    renderSources(sources);
    
}

function renderSources(sources) {
    const container = document.getElementById("source-list")
    container.innerHTML = sources.map(s => `
        <div class="source-row">
            <div class="flex-1">
                <p class="text-sm font-500 text-white">${s.name}</p>
                <p class="text-xs text-mist-dim">${s.auth_type} · ${s.format}</p>
            </div>
            <span class="badge-ok text-xs px-2.5 py-1 rounded-full">${s.status}</span>
            <button class="btn-sm" onclick='editSource(${JSON.stringify(s)})'>Modifier</button>
            <button class="btn" onclick="deleteSource('${s.name}')">Suppr.</button>
        </div>
    `).join("");
}


async function submitSource(event) {
    const formData = new FormData();
    formData.append("api_name_source",       document.getElementById("api_name_source").value);
    formData.append("authentification_type", document.getElementById("authentification_type").value);
    formData.append("api_url",               document.getElementById("api_url").value);
    formData.append("api_key",               document.getElementById("api_key").value || "");
    formData.append("response_format",       document.getElementById("response_format").value);
    formData.append("header_params",         document.getElementById("header_params").value || "");
    await fetch("http://localhost:8000/api/form", { method: "POST", body: formData });
    loadSources(); 
}

document.addEventListener("DOMContentLoaded", loadSources);

// Suppression
async function deleteSource(name) {
    if (!confirm(`Supprimer "${name}" ?`)) return;
    await fetch(`http://localhost:8000/api/sources/${encodeURIComponent(name)}`, { 
        method: "DELETE" 
    });
    loadSources();
}

// Édition — ouvre le formulaire pré-rempli
function editSource(s) {
    document.getElementById("api_name_source").value      = s.name;
    document.getElementById("authentification_type").value = s.auth_type;
    document.getElementById("api_url").value              = s.url;
    document.getElementById("api_key").value              = s.api_key || "";
    document.getElementById("response_format").value      = s.format;
    document.getElementById("header_params").value        = s.headers || "";

    // Passer en mode édition
    document.getElementById("submit-btn").textContent  = "Mettre à jour";
    document.getElementById("submit-btn").onclick      = () => updateSource(s.name);
    document.getElementById("add-form").classList.remove("hidden");
}

async function updateSource(name) {
    const body = {
        auth_type: document.getElementById("authentification_type").value,
        url:       document.getElementById("api_url").value,
        api_key:   document.getElementById("api_key").value,
        format:    document.getElementById("response_format").value,
        headers:   document.getElementById("header_params").value,
    };
    await fetch(`http://localhost:8000/api/sources/${encodeURIComponent(name)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    resetForm();
    loadSources();
}