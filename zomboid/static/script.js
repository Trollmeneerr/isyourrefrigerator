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

    const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: 'base'
    });

    const volumeOrder = { I: 1, II: 2, III: 3, IV: 4, V: 5 };

    Object.entries(window.ZOMBOID_LISTS || {}).forEach(([key, list]) => {
        const groups = normalise(list);
        const total = groups.reduce((n, group) => n + group.items.length, 0);

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
                    <input type="search" class="zb-search"
                        placeholder="Filter"
                        aria-label="Filter ${esc(list.title)}">
                </div>
            </div>
            <div class="zb-bar">
                <div class="zb-bar-fill"></div>
            </div>
            <div class="zb-body"></div>`;

        const body = section.querySelector('.zb-body');

        if (list.groups) body.classList.add('zb-skills');

        const rows = [];
        const used = new Set();

        if (!total) {
            body.innerHTML =
                '<p class="zb-empty">Nothing here yet. Add names to <code>static/items.js</code>.</p>';
        }

        groups.forEach(group => {
            if (!group.items.length) return;

            const isSkillGroup = Boolean(group.name);
            const wrap = document.createElement('div');
            wrap.className = isSkillGroup ? 'zb-skill' : 'zb-group';

            if (isSkillGroup) {
                const heading = document.createElement('h3');
                heading.textContent = group.name;
                wrap.append(heading);
            }

            const grid = document.createElement('div');
            grid.className = isSkillGroup ? 'zb-vols' : 'zb-grid';

            let leftColumn = null;
            let rightColumn = null;

            if (isSkillGroup) {
                // Keep skill volumes I-V together on one horizontal row.
                Object.assign(grid.style, {
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'nowrap',
                    alignItems: 'center',
                    gap: '4px',
                    flexShrink: '0'
                });
            } else {
                // Two vertical flex columns.
                Object.assign(grid.style, {
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'stretch',
                    gap: '8px',
                    minWidth: '0'
                });

                leftColumn = document.createElement('div');
                rightColumn = document.createElement('div');

                [leftColumn, rightColumn].forEach(column => {
                    Object.assign(column.style, {
                        display: 'flex',
                        flexDirection: 'column',
                        flex: '1 1 0',
                        minWidth: '0',
                        gap: '8px'
                    });
                });

                grid.append(leftColumn, rightColumn);

                // Stack columns on narrow screens.
                const mobileLayout =
                    window.matchMedia('(max-width: 480px)');

                const updateColumnLayout = () => {
                    grid.style.flexDirection =
                        mobileLayout.matches ? 'column' : 'row';

                    [leftColumn, rightColumn].forEach(column => {
                        column.style.flex =
                            mobileLayout.matches ? '0 0 auto' : '1 1 0';

                        column.style.width =
                            mobileLayout.matches ? '100%' : 'auto';
                    });
                };

                updateColumnLayout();

                if (mobileLayout.addEventListener) {
                    mobileLayout.addEventListener(
                        'change',
                        updateColumnLayout
                    );
                } else if (mobileLayout.addListener) {
                    mobileLayout.addListener(updateColumnLayout);
                }
            }

            wrap.append(grid);

            const itemNames = group.items.slice();

            if (isSkillGroup) {
                // Sort recognized volumes in Roman numeral order.
                itemNames.sort((a, b) => {
                    const getRank = name => {
                        if (!name.startsWith(group.name + ' ')) return 99;

                        const volume = name
                            .slice(group.name.length + 1)
                            .trim()
                            .toUpperCase();

                        return volumeOrder[volume] || 99;
                    };

                    return getRank(a) - getRank(b)
                        || collator.compare(a, b);
                });
            } else {
                // Sort all regular items alphabetically.
                itemNames.sort((a, b) => collator.compare(a, b));
            }

            const groupRows = [];

            itemNames.forEach(name => {
                let id = slug(name) || 'item';
                let n = 2;

                while (used.has(id)) {
                    id = `${slug(name)}-${n++}`;
                }

                used.add(id);

                const label = document.createElement('label');
                label.className = isSkillGroup ? 'zb-vol' : 'zb-item';

                const box = document.createElement('input');
                box.type = 'checkbox';
                box.setAttribute('aria-label', name);

                box.addEventListener('change', () => {
                    setChecked(key, id, box.checked);
                });

                const text = document.createElement('span');

                text.textContent =
                    isSkillGroup && name.startsWith(group.name + ' ')
                        ? name.slice(group.name.length + 1)
                        : name;

                label.append(box, text);

                if (isSkillGroup) {
                    // Volumes stay together in one horizontal flex row.
                    grid.append(label);
                } else {
                    const firstLetter =
                        (name.trim().match(/[A-Za-z]/) || [''])[0]
                            .toUpperCase();

                    // First column A-I; second column J-Z.
                    const belongsInLeftColumn =
                        !firstLetter || firstLetter <= 'I';

                    (belongsInLeftColumn ? leftColumn : rightColumn)
                        .append(label);
                }

                const row = { id, name, label, box };
                rows.push(row);
                groupRows.push(row);
            });

            body.append(wrap);
            group.rows = groupRows;
            group.el = wrap;
            group.columns = isSkillGroup
                ? null
                : [leftColumn, rightColumn];
        });

        // Filter items and hide empty columns.
        section.querySelector('.zb-search').addEventListener(
            'input',
            e => {
                const q = e.target.value.trim().toLowerCase();

                groups.forEach(group => {
                    if (!group.rows) return;

                    let any = false;

                    group.rows.forEach(row => {
                        const hit =
                            !q || row.name.toLowerCase().includes(q);

                        row.label.hidden = !hit;
                        if (hit) any = true;
                    });

                    if (group.columns) {
                        group.columns.forEach(column => {
                            const hasVisibleItems =
                                Array.from(column.children)
                                    .some(label => !label.hidden);

                            column.hidden = !hasVisibleItems;
                        });
                    }

                    group.el.hidden = !any;
                });
            }
        );

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
