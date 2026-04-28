// Tab switching
function switchTab(id, el) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
  document.getElementById('section-' + id).classList.add('active');
  el.classList.add('active');
}

// Bar chart
const vals = [52, 78, 60, 110, 95, 120, 127];
const max = Math.max(...vals);
const bc = document.getElementById('bar-chart');
vals.forEach((v, i) => {
  const b = document.createElement('div');
  b.className = 'bar flex-1';
  b.style.height = Math.round((v / max) * 100) + '%';
  if (i === 6) b.style.background = '#6C63FF';
  b.title = v + ' collectes';
  bc.appendChild(b);
});

// Logs
const logs = [
  { t: '14:32', msg: 'OpenWeatherMap — 48 enregistrements → CSV', cls: 'log-ok' },
  { t: '14:30', msg: 'IoT Gateway — 312 points → S3', cls: 'log-ok' },
  { t: '14:15', msg: 'API Logistique — erreur 401 Unauthorized', cls: 'log-err' },
  { t: '14:00', msg: 'OpenWeatherMap — 48 enregistrements → CSV', cls: 'log-ok' },
  { t: '13:55', msg: 'CRM interne — délai élevé (4.2s)', cls: 'log-warn' },
  { t: '08:00', msg: 'Alpha Vantage — 25 symboles → S3', cls: 'log-ok' },
];
const lc = document.getElementById('log-container');
logs.forEach(l => {
  lc.innerHTML += `<div class="flex gap-3 text-xs font-mono py-1.5 border-b border-white/5">
    <span class="text-mist-dim shrink-0">${l.t}</span>
    <span class="${l.cls}">${l.msg}</span>
  </div>`;
});