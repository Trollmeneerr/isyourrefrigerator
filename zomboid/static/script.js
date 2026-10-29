/**
 * Project Zomboid dedicated server & live sync checklists
 * Location: /zomboid/static/script.js
 */

'use strict';

const CONFIG = {
  api: '/zomboid/api',
  server: {
    name: 'Project Zomboid',
    subtitle: 'Build 42 • Modded Survival PvE',
    description: "Subzero zombie apocalypse with curated QoL mods, tuned loot respawn rates, and co-op multiplayer. Don't forget your can opener.",
    managedBy: 'BataTheBear',
    address: 'play.isyourrefrigerator.online:16261',
    directIp: '158.101.195.224:16261',
    specs: [
      ['CPU', 'I7-6700k 4 Cores'],
      ['RAM', 'DDR4 16GB'],
      ['GPU', 'GeForce GTX 1080 8GB']
    ]
  },
  statusUrls: ['../static/status.json', '/static/status.json', 'static/status.json'],
  statusKey: 'zomboid'
};

const SESSION_KEY = 'zb-session';
const VOLUME_RANK = { I: 1, II: 2, III: 3, IV: 4, V: 5 };
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

const byId = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

let token = '';
let state = {};   // { books: {id: true}, vhs: {...}, magazines: {...} }
const cards = {}; // per-list DOM handles

/* ---------- Server card ---------- */

function renderServer() {
  const s = CONFIG.server;
  const box = byId('serverBox');
  if (!box) return;

  box.innerHTML = `
    <div class="server-card">
      <div class="server-top">
        <div class="server-icon" title="Project Zomboid Server">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path>
          </svg>
        </div>
        <div class="server-status-pill">
          <span class="indicator-dot" id="srvDot"></span>
          <span id="srvText">Checking...</span>
        </div>
      </div>
      <h3>${esc(s.name)}</h3>
      <div class="server-subtitle">${esc(s.subtitle)}</div>
      <p class="server-desc">${esc(s.description)}</p>
      <p class="managed">Managed by ${esc(s.managedBy)}</p>
      <div class="server-specs">
        ${s.specs.map(([k, v]) => `
          <div class="spec-item">
            <span class="spec-label">${esc(k)}:</span>
            <span class="spec-val">${esc(v)}</span>
          </div>
        `).join('')}
      </div>
      <div class="server-connect-group">
        <div class="server-connect" id="copyAddr" role="button" tabindex="0" title="Click to copy server hostname" aria-label="Copy server hostname: ${esc(s.address)}">
          <span class="ip-display">${esc(s.address)}</span>
        </div>
        <div class="direct-ip-pill" id="copyDirectAddr" role="button" tabindex="0" title="Click to copy direct IP" aria-label="Copy direct IP: ${esc(s.directIp)}">
          <span class="direct-ip-label">Direct IP:</span>
          <span class="direct-ip-val">${esc(s.directIp)}</span>
        </div>
      </div>
    </div>`;

  const setupCopy = (elId, text) => {
    const el = byId(elId);
    if (!el) return;
    const copy = async () => {
      try {
        await navigator.clipboard.writeText(text);
      } catch (_) {}
      el.classList.add('copied');
      const span = el.querySelector('.ip-display, .direct-ip-val');
      const orig = el.dataset.originalText || (span ? span.textContent : text);
      el.dataset.originalText = orig;

      if (span) span.textContent = 'Copied!';
      clearTimeout(el._copyTimeout);
      el._copyTimeout = setTimeout(() => {
        el.classList.remove('copied');
        if (span) span.textContent = orig;
      }, 1800);
    };

    el.addEventListener('click', copy);
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        copy();
      }
    });
  };

  setupCopy('copyAddr', s.address);
  setupCopy('copyDirectAddr', s.directIp);

  refreshStatus();
}

async function refreshStatus() {
  if (document.hidden) return;
  const dot = byId('srvDot');
  const text = byId('srvText');
  if (!dot) return;

  let status = 'unknown';
  let label = 'Unknown';

  for (const url of CONFIG.statusUrls) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const online = Boolean(data[CONFIG.statusKey]?.online);
        status = online ? 'online' : 'offline';
        label = online ? 'Online' : 'Offline';
        break;
      }
    } catch (_) {}
  }

  dot.className = `indicator-dot ${status}`;
  if (text) text.textContent = label;
}

/* ---------- Checklists ---------- */

function buildLists() {
  const host = byId('lists');
  if (!host) return;
  const frag = document.createDocumentFragment();

  Object.entries(window.ZOMBOID_LISTS || {}).forEach(([key, list]) => {
    const skills = list.groups || null;
    const names = skills ? skills.flatMap(g => g.items) : (list.items || []);
    const total = names.length;

    const section = document.createElement('section');
    section.className = 'zb-list';
    section.innerHTML = `
      <div class="zb-list-head">
        <div>
          <h2>${esc(list.title)}</h2>
          <p>${esc(list.note || '')}</p>
        </div>
        <div class="zb-list-tools">
          <span class="zb-count">0 / ${total}</span>
          <input type="search" class="zb-search" placeholder="Filter ${esc(list.title)}..." aria-label="Filter ${esc(list.title)}">
        </div>
      </div>
      <div class="zb-bar"><div class="zb-bar-fill"></div></div>
      <div class="${skills ? 'zb-skills' : 'zb-grid'}"></div>`;

    const body = section.lastElementChild;
    const rows = [];
    const skillEls = [];
    const used = new Set();

    const makeRow = (name, className, shown) => {
      let id = slug(name) || 'item', n = 2;
      while (used.has(id)) id = `${slug(name)}-${n++}`;
      used.add(id);

      const label = document.createElement('label');
      label.className = className;
      const box = document.createElement('input');
      box.type = 'checkbox';
      box.dataset.id = id;
      box.setAttribute('aria-label', name);
      const text = document.createElement('span');
      text.textContent = shown;
      label.append(box, text);

      const row = { id, name, label, box };
      rows.push(row);
      return row;
    };

    const items = document.createDocumentFragment();

    if (!total) {
      body.className = '';
      body.innerHTML = '<p class="zb-empty">Nothing here yet. Add items to <code>static/items.js</code>.</p>';
    } else if (skills) {
      skills.forEach(group => {
        if (!group.items.length) return;
        const prefix = `${group.name} `;
        const rank = n => (n.startsWith(prefix) && VOLUME_RANK[n.slice(prefix.length).trim().toUpperCase()]) || 99;

        const el = document.createElement('div');
        el.className = 'zb-skill';
        const title = document.createElement('h3');
        title.textContent = group.name;
        const vols = document.createElement('div');
        vols.className = 'zb-vols';

        const groupRows = [...group.items]
          .sort((a, b) => rank(a) - rank(b) || collator.compare(a, b))
          .map(name => makeRow(name, 'zb-vol', name.startsWith(prefix) ? name.slice(prefix.length) : name));

        vols.append(...groupRows.map(r => r.label));
        el.append(title, vols);
        items.append(el);
        skillEls.push({ el, rows: groupRows });
      });
    } else {
      [...names].sort(collator.compare).forEach(name => items.append(makeRow(name, 'zb-item', name).label));
    }
    body.append(items);

    // One delegated change listener per list
    body.addEventListener('change', e => {
      if (e.target.dataset.id) setChecked(key, e.target.dataset.id, e.target.checked);
    });

    section.querySelector('.zb-search').addEventListener('input', e => {
      const q = e.target.value.trim().toLowerCase();
      rows.forEach(r => (r.label.hidden = Boolean(q && !r.name.toLowerCase().includes(q))));
      skillEls.forEach(s => (s.el.hidden = s.rows.every(r => r.label.hidden)));
    });

    cards[key] = {
      rows,
      total,
      fill: section.querySelector('.zb-bar-fill'),
      count: section.querySelector('.zb-count')
    };
    frag.append(section);
  });

  host.replaceChildren(frag);
}

function renderChecks() {
  Object.entries(cards).forEach(([key, c]) => {
    const data = state[key] || {};
    let done = 0;
    c.rows.forEach(r => {
      const on = data[r.id] === true;
      if (r.box.checked !== on) r.box.checked = on;
      r.label.classList.toggle('done', on);
      if (on) done++;
    });
    c.fill.style.width = c.total ? `${(done / c.total) * 100}%` : '0%';
    c.count.textContent = `${done} / ${c.total}`;
  });
}

function setChecked(list, id, on) {
  state[list] = state[list] || {};
  if (on) state[list][id] = true;
  else delete state[list][id];
  renderChecks();

  fetch(`${CONFIG.api}/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ list, id, checked: on })
  }).then(async r => {
    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      throw new Error(data.error || `HTTP ${r.status}`);
    }
  }).catch(err => {
    console.error('Failed to save checklist item:', err);
    setSync('Could not save', 'offline');
    if (on) delete state[list][id];
    else state[list][id] = true;
    renderChecks();
  });
}

/* ---------- Sync & Password Gate ---------- */

function setSync(text, cls) {
  const syncText = byId('syncText');
  const syncDot = byId('syncDot');
  if (syncText) syncText.textContent = text;
  if (syncDot) syncDot.className = `indicator-dot ${cls}`;
}

async function unlock(password) {
  if (!password || password.length > 200) return 'wrong';
  try {
    const res = await fetch(`${CONFIG.api}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    if (res.status === 401) return 'wrong';
    if (res.status === 429) return 'limited';
    if (!res.ok) return 'error';
    token = (await res.json()).token;
    return 'ok';
  } catch {
    return 'error';
  }
}

function startLive() {
  buildLists();

  const connect = () => {
    const events = new EventSource(`${CONFIG.api}/events?token=${encodeURIComponent(token)}`);
    events.onopen = () => setSync('Live', 'online');
    events.onmessage = e => {
      try {
        state = JSON.parse(e.data);
        renderChecks();
      } catch (_) {}
    };
    events.onerror = () => {
      setSync('Reconnecting...', 'degraded');
      if (events.readyState !== EventSource.CLOSED) return;

      let saved = '';
      try { saved = sessionStorage.getItem(SESSION_KEY) || ''; } catch (_) {}
      const retry = async () => {
        const result = await unlock(saved);
        if (result === 'ok') connect();
        else if (result === 'wrong') location.reload();
        else setTimeout(retry, 5000);
      };
      retry();
    };
  };
  connect();
}

function showApp() {
  const gate = byId('gate');
  const app = byId('app');
  if (gate) gate.hidden = true;
  if (app) app.hidden = false;
  renderServer();
  startLive();
}

document.addEventListener('DOMContentLoaded', async () => {
  const form = byId('gateForm');
  const input = byId('gateInput');
  const msg = byId('gateMsg');
  const btn = byId('gateBtn');
  const say = text => {
    if (!msg) return;
    msg.textContent = text;
    msg.hidden = !text;
  };

  let saved = '';
  try { saved = sessionStorage.getItem(SESSION_KEY) || ''; } catch (_) {}
  if (saved && (await unlock(saved)) === 'ok') {
    showApp();
    return;
  }

  if (input) input.focus();

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      say('');
      if (btn) btn.disabled = true;
      const result = await unlock(input.value);
      if (btn) btn.disabled = false;

      if (result === 'ok') {
        try { sessionStorage.setItem(SESSION_KEY, input.value); } catch (_) {}
        showApp();
      } else if (result === 'wrong') {
        say('Wrong password.');
        if (input) input.select();
      } else if (result === 'limited') {
        say('Too many attempts. Try again in a few minutes.');
      } else {
        say('Could not reach the sync service. Try again in a moment.');
      }
    });
  }

  setInterval(refreshStatus, 60000);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) refreshStatus();
  });
});
