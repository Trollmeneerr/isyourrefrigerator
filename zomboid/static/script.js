/* =========================================================================
   Project Zomboid checklists - isyourrefrigerator.online/zomboid
   Live sync talks to the small local service in zomboid-sync/ (see INSTALL.md).
   Checklist contents live in items.js. The password is checked by that service.
   ========================================================================= */
'use strict';

const CONFIG = {
    api: 'api',   // resolves to /zomboid/api, proxied by nginx to the local sync service
    server: {
        name: 'Project Zomboid',
        subtitle: 'Build 42 \u2022 Modded Survival PvE',
        description: "Subzero zombie apocalypse with curated QoL mods, tuned loot respawn rates, and co-op multiplayer. Don't forget your can opener.",
        managedBy: 'BataTheBear',
        address: 'play.isyourrefrigerator.online:16261',
        specs: [['CPU', 'I7-6700k 4 Cores'], ['RAM', 'DDR4 16GB'], ['GPU', 'GeForce GTX 1080 8GB']]
    },
    // Reuses the status file the main site already updates.
    statusUrl: '/static/status.json',
    statusKey: 'zomboid'
};

const SESSION_KEY = 'zb-session';
const byId = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

let token = '';
let state = {};          // { books: {id: true}, vhs: {...}, magazines: {...} }
const cards = {};        // per-list DOM handles

/* ---------- Server card (same markup as the main site) ---------- */

function renderServer() {
    const s = CONFIG.server;
    byId('serverBox').innerHTML = `
        <div class="server-card">
            <div class="server-top">
                <div class="server-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path></svg></div>
                <div class="server-status-pill"><span class="indicator-dot" id="srvDot"></span><span id="srvText">Checking...</span></div>
            </div>
            <h3>${esc(s.name)}</h3>
            <div class="server-subtitle">${esc(s.subtitle)}</div>
            <p class="server-desc">${esc(s.description)}</p>
            <p class="managed">Managed by ${esc(s.managedBy)}</p>
            <div class="server-specs">${s.specs.map(([k, v]) => `<div class="spec-item"><span class="spec-label">${esc(k)}:</span><span class="spec-val">${esc(v)}</span></div>`).join('')}</div>
            <div class="server-connect" id="copyAddr" role="button" tabindex="0" title="Click to copy server address"><span class="ip-display">${esc(s.address)}</span></div>
        </div>`;

    const box = byId('copyAddr');
    const copy = async () => {
        const label = box.querySelector('.ip-display');
        try { await navigator.clipboard.writeText(s.address); label.textContent = 'Copied!'; }
        catch { label.textContent = 'Press Ctrl+C to copy'; getSelection().selectAllChildren(label); }
        setTimeout(() => (label.textContent = s.address), 1800);
    };
    box.addEventListener('click', copy);
    box.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copy(); } });
    refreshStatus();
    setInterval(refreshStatus, 60000);
}

async function refreshStatus() {
    const dot = byId('srvDot'), text = byId('srvText');
    if (!dot) return;
    let status = 'unknown', label = 'Unknown';
    try {
        const res = await fetch(CONFIG.statusUrl, { cache: 'no-store' });
        const data = await res.json();
        const online = (data[CONFIG.statusKey] || {}).online === true;
        status = online ? 'online' : 'offline';
        label = online ? 'Online' : 'Offline';
    } catch { /* leave as unknown */ }
    dot.className = `indicator-dot ${status}`;
    text.textContent = label;
}

/* ---------- Checklists ---------- */

function normalise(list) {
    // Accept either { items: [...] } or { groups: [{ name, items }] }
    return list.groups ? list.groups : [{ name: '', items: list.items || [] }];
}

function buildLists() {
    const host = byId('lists');
    host.innerHTML = '';

    Object.entries(window.ZOMBOID_LISTS || {}).forEach(([key, list]) => {
        const groups = normalise(list);
        const total = groups.reduce((n, g) => n + g.items.length, 0);

        const section = document.createElement('section');
        section.className = 'zb-list';
        section.innerHTML = `
            <div class="zb-list-head">
                <div><h2>${esc(list.title)}</h2><p>${esc(list.note || '')}</p></div>
                <div class="zb-list-tools">
                    <span class="zb-count">0 / ${total}</span>
                    <input type="search" class="zb-search" placeholder="Filter" aria-label="Filter ${esc(list.title)}">
                </div>
            </div>
            <div class="zb-bar"><div class="zb-bar-fill"></div></div>
            <div class="zb-body"></div>`;

        const body = section.querySelector('.zb-body');
        if (list.groups) body.classList.add('zb-skills');
        const rows = [];

        if (!total) {
            body.innerHTML = '<p class="zb-empty">Nothing here yet. Add names to <code>static/items.js</code>.</p>';
        }

        const used = new Set();

        groups.forEach(group => {
            if (!group.items.length) return;

            const wrap = document.createElement('div');
            wrap.className = group.name ? 'zb-skill' : 'zb-group';
            if (group.name) wrap.innerHTML = `<h3>${esc(group.name)}</h3>`;

            const grid = document.createElement('div');
            grid.className = group.name ? 'zb-vols' : 'zb-grid';

            // Two columns, filled vertically from top to bottom.
            grid.style.display = 'grid';
            grid.style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
            grid.style.gridAutoFlow = 'column';
            grid.style.gridTemplateRows = `repeat(${Math.ceil(group.items.length / 2)}, auto)`;

            wrap.append(grid);

            const groupRows = group.items.map(name => {
                let id = slug(name) || 'item', n = 2;
                while (used.has(id)) id = `${slug(name)}-${n++}`;
                used.add(id);

                const label = document.createElement('label');
                label.className = group.name ? 'zb-vol' : 'zb-item';

                const box = document.createElement('input');
                box.type = 'checkbox';
                box.setAttribute('aria-label', name);
                box.addEventListener('change', () => setChecked(key, id, box.checked));

                const text = document.createElement('span');
                text.textContent =
                    group.name && name.startsWith(group.name + ' ')
                        ? name.slice(group.name.length + 1)
                        : name;

                label.append(box, text);
                grid.append(label);

                const row = { id, name, label, box };
                rows.push(row);
                return row;
            });

            body.append(wrap);
            group.rows = groupRows;
            group.el = wrap;
        });

        section.querySelector('.zb-search').addEventListener('input', e => {
            const q = e.target.value.trim().toLowerCase();

            groups.forEach(g => {
                if (!g.rows) return;

                let any = false;
                g.rows.forEach(r => {
                    const hit = !q || r.name.toLowerCase().includes(q);
                    r.label.hidden = !hit;
                    any = any || hit;
                });

                g.el.hidden = !any;
            });
        });

        cards[key] = {
            rows,
            total,
            fill: section.querySelector('.zb-bar-fill'),
            count: section.querySelector('.zb-count')
        };

        host.append(section);
    });
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
    // Update locally right away; the server then pushes the real state to everyone.
    state[list] = state[list] || {};
    if (on) state[list][id] = true; else delete state[list][id];

    fetch(`${CONFIG.api}/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ list, id, checked: on })
    }).then(r => { if (!r.ok) throw new Error(r.status); })
        .catch(() => setSync('Could not save', 'offline'));
}

/* ---------- Sync + password ---------- */

function setSync(text, cls) {
    byId('syncText').textContent = text;
    byId('syncDot').className = `indicator-dot ${cls}`;
}

// Resolves 'ok', 'wrong', 'limited' (too many attempts) or 'error' (service unreachable).
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
        events.onmessage = e => { state = JSON.parse(e.data); renderChecks(); };
        events.onerror = () => {
            setSync('Reconnecting...', 'unknown');
            if (events.readyState !== EventSource.CLOSED) return;   // the browser retries by itself

            // The service rejected the connection (restart, new password): log in again.
            let saved = '';
            try { saved = sessionStorage.getItem(SESSION_KEY) || ''; } catch { /* ignore */ }
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
    byId('gate').hidden = true;
    byId('app').hidden = false;
    renderServer();
    startLive();
}

document.addEventListener('DOMContentLoaded', async () => {
    document.querySelectorAll('.current-year').forEach(el => (el.textContent = new Date().getFullYear()));

    const form = byId('gateForm'), input = byId('gateInput'), msg = byId('gateMsg'), btn = byId('gateBtn');
    const say = text => { msg.textContent = text; msg.hidden = !text; };

    // Remembered for this tab only; closing the tab asks again.
    let saved = '';
    try { saved = sessionStorage.getItem(SESSION_KEY) || ''; } catch { /* storage blocked */ }
    if (saved && (await unlock(saved)) === 'ok') { showApp(); return; }

    input.focus();
    form.addEventListener('submit', async e => {
        e.preventDefault();
        say('');
        btn.disabled = true;
        const result = await unlock(input.value);
        btn.disabled = false;

        if (result === 'ok') {
            try { sessionStorage.setItem(SESSION_KEY, input.value); } catch { /* ignore */ }
            showApp();
        } else if (result === 'wrong') {
            say('Wrong password.');
            input.select();
        } else if (result === 'limited') {
            say('Too many attempts. Try again in a few minutes.');
        } else {
            say('Could not reach the sync service. Try again in a moment.');
        }
    });
});
