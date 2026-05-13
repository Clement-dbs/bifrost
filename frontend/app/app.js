async function loadSources() {
    const res = await fetch("http://localhost:8000/api/sources/");
    if (!res.ok) {
        renderSources([]);
        return;
    }
    const sources = await res.json();
    renderSources(Array.isArray(sources) ? sources : []);
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
            <button class="btn" onclick="deleteSource('${s.id}')">Suppr.</button>
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
async function deleteSource(id) {
    if (!confirm(`Supprimer la source #${id} ?`)) return;
    const res = await fetch(`http://localhost:8000/api/sources/${id}`, {
        method: "DELETE"
    });
    if (res.status === 204) {
        loadSources();
    } else {
        const err = await res.json();
        alert(`Erreur : ${err.detail}`);
    }
}

// Édition — ouvre le formulaire pré-rempli
function editSource(s) {
    document.getElementById("api_name_source").value       = s.name;
    document.getElementById("authentification_type").value = s.auth_type;
    document.getElementById("api_url").value               = s.url;
    document.getElementById("api_key").value               = s.api_key || "";
    document.getElementById("response_format").value       = s.format;
    document.getElementById("header_params").value         = s.headers || "";

    document.getElementById("submit-btn").textContent = "Mettre à jour";
    document.getElementById("submit-btn").onclick     = () => updateSource(s.id); // ← s.id au lieu de s.name
    document.getElementById("add-form").classList.remove("hidden");
}

async function updateSource(id) { // ← id entier
    const body = {
        auth_type: document.getElementById("authentification_type").value,
        url:       document.getElementById("api_url").value,
        api_key:   document.getElementById("api_key").value || null,
        format:    document.getElementById("response_format").value,
        headers:   document.getElementById("header_params").value || null,
    };

    const feedback = document.getElementById("form-feedback");

    const res = await fetch(`http://localhost:8000/api/sources/${id}`, { // ← id numérique, pas encodeURIComponent
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (res.ok) {
        feedback.className = "mb-4 px-4 py-3 rounded-lg text-sm text-jade bg-jade/10";
        feedback.textContent = "✓ Source mise à jour avec succès.";
        feedback.classList.remove("hidden");
        setTimeout(() => {
            resetForm();
            loadSources();
        }, 1000);
    } else {
        const err = await res.json();
        feedback.className = "mb-4 px-4 py-3 rounded-lg text-sm text-red-400 bg-red-400/10";
        feedback.textContent = `✗ ${err.detail}`;
        feedback.classList.remove("hidden");
    }
}

async function submitSource() {
    const body = {
        name:            document.getElementById("api_name_source").value,
        url:             document.getElementById("api_url").value,
        method:          document.getElementById("method").value,
        auth_type:       mapAuthType(document.getElementById("authentification_type").value),
        auth_value:      document.getElementById("api_key").value || null,
        response_format: document.getElementById("response_format").value.toLowerCase(),
    };

    const feedback = document.getElementById("form-feedback");

    const res = await fetch("http://localhost:8000/api/sources/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (res.ok) {
        feedback.className = "mb-4 px-4 py-3 rounded-lg text-sm text-jade bg-jade/10";
        feedback.textContent = "✓ Source créée avec succès.";
        feedback.classList.remove("hidden");
        setTimeout(() => {
            resetForm();
            loadSources();
        }, 1000);
    } else {
        const err = await res.json();
        feedback.className = "mb-4 px-4 py-3 rounded-lg text-sm text-red-400 bg-red-400/10";
        feedback.textContent = `✗ ${err.detail}`;
        feedback.classList.remove("hidden");
    }
}

function mapAuthType(label) {
    const map = {
        "Publique (sans auth)": "none",
        "Clé API (header)":     "api_key",
        "Bearer Token":         "bearer",
        "OAuth 2.0":            "oauth2",
        "Basic Auth":           "basic",
    };
    return map[label] || "none";
}

function resetForm() {
    document.getElementById("api_name_source").value = "";
    document.getElementById("api_url").value = "";
    document.getElementById("api_key").value = "";
    document.getElementById("authentification_type").selectedIndex = 0;
    document.getElementById("response_format").selectedIndex = 0;
    document.getElementById("form-feedback").classList.add("hidden");
    document.getElementById("submit-btn").textContent = "Tester & Sauvegarder";
    document.getElementById("add-form").classList.add("hidden");
}