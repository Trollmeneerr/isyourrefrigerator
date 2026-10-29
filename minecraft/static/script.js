/* =========================================================================
   Minecraft dedicated server & live map - isyourrefrigerator.online/minecraft
   ========================================================================= */
'use strict';

const CONFIG = {
    server: {
        name: 'Minecraft 26.3',
        subtitle: 'Paper Survival \u2022 Dedicated PvE',
        description: 'Paper survival freezer running the latest updates. Explore the realm, build together, and track player activity on the live world map.',
        managedBy: 'The Refrigerator',
        address: 'play.isyourrefrigerator.online:25565',
        directIp: '158.101.195.224:25565',
        specs: [
            ['CPU', 'i5-10300H 2 Threads'],
            ['RAM', 'DDR4 4GB'],
            ['DISK', '50GB SSD']
        ]
    },
    statusUrls: ['/static/status.json', '../static/status.json', 'static/status.json'],
    statusKey: 'minecraft'
};

const byId = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- Server card ---------- */

function renderServer() {
    const s = CONFIG.server;
    const box = byId('serverBox');
    if (!box) return;

    if (!box.children.length) {
        box.innerHTML = `
        <div class="server-card">
            <div class="server-top">
                <div class="server-icon" title="Minecraft Server">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
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
                <div class="server-connect" id="copyAddr" role="button" tabindex="0" title="Click to copy server hostname">
                    <span class="ip-display">${esc(s.address)}</span>
                </div>
                <div class="direct-ip-pill" id="copyDirectAddr" role="button" tabindex="0" title="Click to copy direct IP">
                    <span class="direct-ip-label">Direct IP:</span>
                    <span class="direct-ip-val">${esc(s.directIp)}</span>
                </div>
            </div>
        </div>`;
    }

    setupCopyHandlers();
    refreshStatus();
}

function setupCopyHandlers() {
    const setupCopy = (elId, text) => {
        const target = byId(elId);
        if (!target) return;
        const copy = async () => {
            try {
                await navigator.clipboard.writeText(text);
            } catch { /* ignore */ }
            const span = target.querySelector('.ip-display, .direct-ip-val');
            const orig = span ? span.textContent : text;
            if (span) span.textContent = 'Copied!';
            setTimeout(() => { if (span) span.textContent = orig; }, 1800);
        };
        target.addEventListener('click', copy);
        target.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                copy();
            }
        });
    };

    setupCopy('copyAddr', CONFIG.server.address);
    setupCopy('copyDirectAddr', CONFIG.server.directIp);
}

async function refreshStatus() {
    if (document.hidden) return; // Skip polling when tab is hidden
    const dot = byId('srvDot'), text = byId('srvText');
    if (!dot) return;

    let status = 'unknown', label = 'Unknown';
    try {
        let data = null;
        for (const url of CONFIG.statusUrls) {
            try {
                const res = await fetch(url, { cache: 'no-store' });
                if (res.ok) {
                    data = await res.json();
                    break;
                }
            } catch {
                // Try next candidate URL
            }
        }

        if (data) {
            const online = (data[CONFIG.statusKey] || {}).online === true;
            status = online ? 'online' : 'offline';
            label = online ? 'Online' : 'Offline';
        }
    } catch {
        /* leave as unknown */
    }

    dot.className = `indicator-dot ${status}`;
    text.textContent = label;
}

/* ---------- Map Controls ---------- */

function setupMapControls() {
    const fsBtn = byId('btnMapFullscreen');
    const wrapper = byId('mapWrapper');
    if (fsBtn && wrapper) {
        fsBtn.addEventListener('click', () => {
            if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                if (wrapper.requestFullscreen) {
                    wrapper.requestFullscreen().catch(() => {});
                } else if (wrapper.webkitRequestFullscreen) {
                    wrapper.webkitRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen().catch(() => {});
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
        });

        const updateFsBtnText = () => {
            const isFs = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
            const span = fsBtn.querySelector('span');
            if (span) span.textContent = isFs ? 'Exit Fullscreen' : 'Fullscreen';
        };

        document.addEventListener('fullscreenchange', updateFsBtnText);
        document.addEventListener('webkitfullscreenchange', updateFsBtnText);
    }
}

/* ---------- Initialize ---------- */

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.current-year').forEach(el => {
        el.textContent = new Date().getFullYear();
    });

    renderServer();
    setupMapControls();

    // Poll server status periodically
    setInterval(refreshStatus, 60000);
});
