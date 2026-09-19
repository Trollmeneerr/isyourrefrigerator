/**
 * isyourrefrigerator.online
 * Core JavaScript Logic & Interactivity
 */

/* =========================================================================
   SERVER DATA
   -------------------------------------------------------------------------
   Add a new server by pushing another object onto this array. Every field
   is optional except id, name and specs — leave out `ip` for servers that
   don't take direct connections, and leave out `liveEndpoint` unless you
   have a status.json (or similar) endpoint to poll for live status.
   ========================================================================= */
const SERVERS = [
    {
        id: 'minecraft-26-2',
        name: 'Minecraft 26.2',
        subtitle: 'Fabric • Modded Survival',
        description: 'Fabric-modded survival world running the latest content. Cozy building, exploration, and a light automation modpack.',
        managedBy: 'The Refrigerator',
        icon: 'minecraft',
        host: 'play.isyourrefrigerator.online',
        port: 25565,
        ip: 'play.isyourrefrigerator.online:25565',
        status: 'unknown', // replaced by a live check on load, see statusCheck below
        // Minecraft's server-list-ping protocol can be queried by a public,
        // CORS-friendly API, so this genuinely pings host:port every refresh.
        statusCheck: { type: 'mcsrvstat' },
        specs: [
            { label: 'CPU', value: 'i5-10300H 2 Cores' },
            { label: 'RAM', value: 'DDR4 8GB' },
            { label: 'DISK', value: '50GB SSD' }
        ]
    },
    {
        id: 'project-zomboid',
        name: 'Project Zomboid',
        subtitle: 'Build 42 • Modded Survival PvE',
        description: "Subzero zombie apocalypse with curated QoL mods, tuned loot respawn rates, and co-op multiplayer. Don't forget your can opener.",
        managedBy: 'BataTheBear',
        icon: 'zomboid',
        host: 'play.isyourrefrigerator.online',
        port: 16261,
        status: 'unknown',
        // Zomboid has no public HTTP API for this, and browsers can't open a
        // raw socket to a custom game port — so this reads a JSON snapshot
        // that a script on the server itself should write after actually
        // querying host:port (e.g. a small cron job using a Steam-query
        // library). Swap `url` for wherever that snapshot lives.
        statusCheck: { type: 'endpoint', url: '/static/status.json' },
        specs: [
            { label: 'CPU', value: 'I7-6700k 4 Cores' },
            { label: 'RAM', value: 'DDR4 16GB' },
            { label: 'GPU', value: 'GeForce GTX 1080 8GB' }
        ]
    }
];

/* Icon library, keyed by the `icon` field above. Add a new key here whenever
   a new server needs an icon that doesn't exist yet. */
const SERVER_ICONS = {
    minecraft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
    </svg>`,
    zomboid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path>
    </svg>`,
    racing: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 6v6l4 2"></path>
    </svg>`,
    default: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"></rect>
    </svg>`
};

/* Update this one line to point "Server Panel" at your actual panel URL
   (e.g. your Pelican/Pterodactyl panel address). Both the header button and
   the mobile-nav button pull from this single constant. */
const SERVER_PANEL_URL = 'https://panel.isyourrefrigerator.online';

/* Human-readable label per status value. */
const STATUS_LABELS = {
    online: 'Online',
    offline: 'Offline',
    unknown: 'Checking...',
    private: 'Private',
    available: 'Available'
};

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
}

/**
 * Renders a single server as a `.server-card` element.
 * `context` namespaces the data-attributes used for live status updates so
 * the same server can render in more than one place (main grid + modal)
 * without id collisions.
 */
function renderServerCard(server, context) {
    const icon = SERVER_ICONS[server.icon] || SERVER_ICONS.default;
    const status = server.status || 'unknown';
    const statusText = STATUS_LABELS[status] || status;

    const specsHtml = (server.specs || []).map(spec => `
                <div class="spec-item">
                    <span class="spec-label">${escapeHtml(spec.label)}:</span>
                    <span class="spec-val">${escapeHtml(spec.value)}</span>
                </div>`).join('');

    // Always show an IP/address on the card.
    // Uses the server IP when available, otherwise the public server address.
    const displayIp = server.ip || 'play.isyourrefrigerator.online:25565';

    const connectHtml = `
            <div class="server-connect">
                <span class="ip-display">${escapeHtml(displayIp)}</span>
                <button type="button" class="btn-copy-ip"
                    data-ip="${escapeHtml(displayIp)}"
                    aria-label="Copy ${escapeHtml(server.name)} address">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <span>Join</span>
                </button>
            </div>`;

    return `
        <div class="server-card" data-server-id="${escapeHtml(server.id)}">
            <div class="server-top">
                <div class="server-icon">${icon}</div>
                <div class="server-status-pill">
                    <span class="indicator-dot ${escapeHtml(status)}"
                        data-status-dot="${escapeHtml(server.id)}"
                        data-status-context="${context}"></span>
                    <span data-status-text="${escapeHtml(server.id)}"
                        data-status-context="${context}">
                        ${escapeHtml(statusText)}
                    </span>
                </div>
            </div>

            <h3>${escapeHtml(server.name)}</h3>
            ${server.subtitle ? `<div class="server-subtitle">${escapeHtml(server.subtitle)}</div>` : ''}
            <p class="server-desc">${escapeHtml(server.description || '')}</p>
            <p class="managed">Managed by ${escapeHtml(server.managedBy || 'The Refrigerator')}</p>

            <div class="server-specs">${specsHtml}
            </div>

            ${connectHtml}
        </div>`;
}

/** Renders every server in SERVERS into a target container. */
function renderServerList(container, context) {
    if (!container) return;
    container.innerHTML = SERVERS.map(server => renderServerCard(server, context)).join('');
}

/**
 * Polls a server's `statusCheck` config (if any) and patches every status
 * pill for that server id in place — both the main grid card and the All
 * Servers modal card update together since they share the same server id.
 *
 * Supported statusCheck.type values:
 *   'mcsrvstat' — actually pings server.host:server.port using the public,
 *                 CORS-enabled api.mcsrvstat.us Minecraft status API.
 *   'endpoint'  — fetches a JSON file/URL (statusCheck.url) with an
 *                 `online` boolean, for servers a browser can't query
 *                 directly (e.g. non-Minecraft game protocols).
 */
async function refreshLiveStatus(server) {
    const check = server.statusCheck;
    if (!check) return;

    const dots = document.querySelectorAll(`[data-status-dot="${server.id}"]`);
    const texts = document.querySelectorAll(`[data-status-text="${server.id}"]`);

    const applyStatus = (status, label) => {
        dots.forEach(dot => {
            dot.classList.remove('online', 'offline', 'unknown', 'private', 'available');
            dot.classList.add(status);
        });
        texts.forEach(text => { text.textContent = label; });
    };

    try {
        if (check.type === 'mcsrvstat') {
            const host = check.host || server.host;
            const port = check.port || server.port;
            if (!host || !port) throw new Error('missing host/port for mcsrvstat check');

            const res = await fetch(`https://api.mcsrvstat.us/3/${encodeURIComponent(host)}:${port}`, { cache: 'no-store' });
            const data = await res.json();
            applyStatus(data.online ? 'online' : 'offline', data.online ? 'Online' : 'Offline');
        } else if (check.type === 'endpoint') {
            const res = await fetch(check.url, { cache: 'no-store' });
            const data = await res.json();
            applyStatus(data.online ? 'online' : 'offline', data.online ? 'Online' : 'Offline');
        }
    } catch (err) {
        applyStatus('unknown', 'Unknown');
    }
}

function refreshAllLiveStatuses() {
    SERVERS.filter(s => s.statusCheck).forEach(refreshLiveStatus);
}

// Mobile nav close helper, defined at top level so both the DOMContentLoaded
// handler and the anchor-click handler below can call it safely.
function closeMobileNav() {
    const mobileNav = document.getElementById('mobileNav');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    if (!mobileNav || !mobileMenuToggle) return;
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    mobileMenuToggle.classList.remove('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
}

document.addEventListener('DOMContentLoaded', () => {
    // Console Easter Egg & Privacy Confirmation
    console.log(
        '%c❄️ isyourrefrigerator.online%c\nPrivacy-First Homelab: Zero cookies, zero third-party trackers, 100% chilled.',
        'color: #38bdf8; font-size: 16px; font-weight: bold; font-family: monospace;',
        'color: #94a3b8; font-size: 12px;'
    );

    // Wire up the Server Panel link(s) from the single SERVER_PANEL_URL constant
    document.querySelectorAll('#serverPanelLink, #serverPanelLinkMobile').forEach(link => {
        link.href = SERVER_PANEL_URL;
    });

    // Render the modular server cards into the main grid and the "All Servers" modal
    renderServerList(document.getElementById('dynamicServerCards'), 'grid');
    renderServerList(document.getElementById('allServersList'), 'modal');
    refreshAllLiveStatuses();
    setInterval(refreshAllLiveStatuses, 60000); // refresh every minute

    // Active Navigation Highlight on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });

        // If at top of page, remove active states
        if (scrollY < 200) {
            navLinks.forEach(link => link.classList.remove('active'));
        }
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // Smooth Scrolling for internal anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            closeMobileNav();

            if (targetId === '#' || !targetId || targetId === '#contact' || targetId === '#privacy') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Copy to Clipboard (Server IP & Discord handle) — event delegation so this
    // also covers server cards that get injected into the DOM after page load.
    const toast = document.getElementById('toastNotice');

    function showToast(message) {
        if (!toast) return;
        toast.querySelector('.toast-text').textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2600);
    }

    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('.btn-copy-ip');
        if (!btn) return;

        const val = btn.getAttribute('data-ip');
        if (!val) return;

        try {
            await navigator.clipboard.writeText(val);
            const originalHtml = btn.innerHTML;
            btn.classList.add('copied');
            btn.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Copied!</span>
            `;
            showToast(`Copied ${val} to clipboard!`);

            setTimeout(() => {
                btn.classList.remove('copied');
                btn.innerHTML = originalHtml;
            }, 2200);
        } catch (err) {
            prompt("Copy to clipboard:", val);
        }
    });

    // Modal Helper Functions
    function openModalById(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function closeAllModals() {
        document.querySelectorAll('.modal-backdrop').forEach(modal => {
            closeModal(modal);
        });
    }

    // Say Hi / Discord Modal Triggers
    document.querySelectorAll('.btn-say-hi').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModalById('contactModal');
        });
    });

    const closeContactBtn = document.getElementById('closeContactModal');
    if (closeContactBtn) {
        closeContactBtn.addEventListener('click', () => {
            closeModal(document.getElementById('contactModal'));
        });
    }

    // Privacy & Legal Modal Triggers
    document.querySelectorAll('.btn-privacy').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModalById('privacyModal');
        });
    });

    const closePrivacyBtn = document.getElementById('closePrivacyModal');
    if (closePrivacyBtn) {
        closePrivacyBtn.addEventListener('click', () => {
            closeModal(document.getElementById('privacyModal'));
        });
    }

    // All Servers Modal Triggers (any button with .btn-view-servers, incl. mobile nav)
    document.querySelectorAll('.btn-view-servers').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            closeMobileNav();
            openModalById('allServersModal');
        });
    });

    const closeAllServersBtn = document.getElementById('closeAllServersModal');
    if (closeAllServersBtn) {
        closeAllServersBtn.addEventListener('click', () => {
            closeModal(document.getElementById('allServersModal'));
        });
    }

    // Backdrop Click Dismiss for all Modals
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                closeModal(backdrop);
            }
        });
    });

    // Escape Key to Close Modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
            closeMobileNav();
        }
    });

    // Mobile Navigation Menu
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');

    function toggleMobileNav() {
        if (!mobileNav || !mobileMenuToggle) return;
        const isOpen = mobileNav.classList.toggle('open');
        mobileMenuToggle.classList.toggle('active', isOpen);
        mobileNav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        mobileMenuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileNav);
    }

    // Close the mobile menu automatically if the viewport grows back to desktop size
    window.addEventListener('resize', () => {
        if (window.innerWidth > 960) {
            closeMobileNav();
        }
    });

    // Dynamic current year in footer
    const currentYearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    currentYearElements.forEach(el => {
        el.textContent = currentYear;
    });
});
