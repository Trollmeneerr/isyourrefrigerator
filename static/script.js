/**
 * isyourrefrigerator.online
 * Core JavaScript Logic & Interactivity
 * Overhauled with Steam-style Media Popup & Streamlined Homelab Controls
 */

/* =========================================================================
   SERVER DATA
   ========================================================================= */
const SERVERS = [
    {
        id: 'project-zomboid',
        name: 'Project Zomboid',
        link: '/zomboid',
        subtitle: 'Build 42 • Modded Survival PvE',
        description: "Subzero zombie apocalypse with curated QoL mods, tuned loot respawn rates, and co-op multiplayer. Don't forget your can opener.",
        managedBy: 'BataTheBear',
        icon: 'zomboid',
        host: 'play.isyourrefrigerator.online',
        port: 16261,
        ip: 'play.isyourrefrigerator.online:16261',
        directIp: '158.101.195.224:16261',
        status: 'unknown',
        statusCheck: { type: 'endpoint', url: 'static/status.json', key: 'zomboid' },
        specs: [
            { label: 'CPU', value: 'I7-6700k 4 Cores' },
            { label: 'RAM', value: 'DDR4 16GB' },
            { label: 'GPU', value: '512GB SSD' }
        ]
    },
    {
        id: 'valheim',
        name: 'Valheim',
        link: '/valheim',
        subtitle: 'Co-op Survival',
        description: 'A brutal exploration and survival game set in a procedurally generated purgatory.',
        managedBy: 'The Refrigerator',
        icon: 'default',
        host: 'play.isyourrefrigerator.online',
        port: 16271,
        ip: 'play.isyourrefrigerator.online:16287',
        directIp: '158.101.195.224:16287',
        status: 'unknown',
        statusCheck: { type: 'endpoint', url: 'static/status.json', key: 'valheim' },
        specs: [
            { label: 'CPU', value: 'i5-10300H 3 Threads' },
            { label: 'RAM', value: 'DDR4 6GB' },
            { label: 'DISK', value: '50GB SSD' }
        ]
    },
    {
        id: 'minecraft-26-2',
        name: 'Minecraft 26.2',
        link: '/minecraft',
        subtitle: 'Fabric • Modded Survival',
        description: 'Fabric-modded survival world running the latest content. Cozy building, exploration, and a light automation modpack.',
        managedBy: 'The Refrigerator',
        icon: 'minecraft',
        host: 'play.isyourrefrigerator.online',
        port: 25565,
        ip: 'play.isyourrefrigerator.online:25565',
        directIp: '158.101.195.224:25565',
        status: 'unknown',
        statusCheck: { type: 'endpoint', url: 'static/status.json', key: 'minecraft' },
        specs: [
            { label: 'CPU', value: 'i5-10300H 2 Threads' },
            { label: 'RAM', value: 'DDR4 4GB' },
            { label: 'DISK', value: '50GB SSD' }
        ]
    },
    {
        id: 'the-forest',
        name: 'The Forest',
        link: '/theforest',
        subtitle: 'Co-op Survival',
        description: 'Build, explore, and survive on a mysterious peninsula filled with dangerous mutants.',
        managedBy: 'The Refrigerator',
        icon: 'forest',
        host: 'play.isyourrefrigerator.online',
        port: 27015,
        ip: 'play.isyourrefrigerator.online:16291',
        directIp: '158.101.195.224:16291',
        status: 'unknown',
        statusCheck: { type: 'endpoint', url: 'static/status.json', key: 'forest' },
        specs: [
            { label: 'CPU', value: 'i5-10300H 3 Threads' },
            { label: 'RAM', value: 'DDR4 6GB' },
            { label: 'DISK', value: '50GB SSD' }
        ]
    }
];

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
    forest: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2L4 15h5l-3 6h12l-3-6h5L12 2z"></path>
    </svg>`,
    racing: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 6v6l4 2"></path>
    </svg>`,
    default: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"></rect>
    </svg>`
};

const SERVER_PANEL_URL = 'https://panel.isyourrefrigerator.online';

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

function renderServerCard(server, context) {
    const icon = SERVER_ICONS[server.icon] || SERVER_ICONS.default;
    const status = server.status || 'unknown';
    const statusText = STATUS_LABELS[status] || status;

    // Original specs styling structure
    const specsHtml = (server.specs || []).map(spec => `
        <div class="spec-item">
            <span class="spec-label">${escapeHtml(spec.label)}:</span>
            <span class="spec-val">${escapeHtml(spec.value)}</span>
        </div>`).join('');

    const displayIp = server.ip || 'play.isyourrefrigerator.online:25565';
    const directIp = server.directIp || (server.port ? `158.101.195.224:${server.port}` : '158.101.195.224');

    // Clean IP display with primary host and direct IP sub-pill (1-click copy)
    const connectHtml = `
        <div class="server-connect-group">
            <div class="server-connect btn-copy-ip" data-ip="${escapeHtml(displayIp)}" title="Click to copy host address (${escapeHtml(displayIp)})" role="button" tabindex="0">
                <span class="ip-display">${escapeHtml(displayIp)}</span>
            </div>
            <div class="direct-ip-pill btn-copy-ip" data-ip="${escapeHtml(directIp)}" title="Click to copy direct IP (${escapeHtml(directIp)})" role="button" tabindex="0">
                <span class="direct-ip-label">Direct IP:</span>
                <span class="direct-ip-val">${escapeHtml(directIp)}</span>
            </div>
        </div>`;

    const serverLink = server.link ? escapeHtml(server.link) : '';
    const hasLink = Boolean(serverLink);

    return `
        <article class="server-card ${hasLink ? 'is-clickable' : ''}" data-server-id="${escapeHtml(server.id)}" ${hasLink ? `data-server-link="${serverLink}" tabindex="0" role="link"` : ''} aria-label="${escapeHtml(server.name)} server">
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

            <h3 class="server-title">
                ${hasLink ? `<a href="${serverLink}" class="server-title-link">${escapeHtml(server.name)} <span class="server-link-icon" aria-hidden="true">↗</span></a>` : escapeHtml(server.name)}
            </h3>
            ${server.subtitle ? `<div class="server-subtitle">${escapeHtml(server.subtitle)}</div>` : ''}
            <p class="server-desc">${escapeHtml(server.description || '')}</p>
            <p class="managed">Managed by ${escapeHtml(server.managedBy || 'The Refrigerator')}</p>

            <div class="server-specs">${specsHtml}</div>

            ${connectHtml}
        </article>`;
}

function renderRequestCard(context) {
    const id = context === 'modal' ? 'modalRequestServerCard' : 'requestServerCard';
    return `
        <article class="server-card request-card" id="${id}">
            <div class="server-top">
                <div class="server-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </div>

                <div class="server-status-pill">
                    <span class="indicator-dot available"></span>
                    <span>Available</span>
                </div>
            </div>

            <h3>Request a Server</h3>

            <div class="server-subtitle">Have a game you want hosted?</div>

            <p class="server-desc">
                Minecraft, Palworld, Valheim, Factorio, or CS2?
                If we have the RAM headroom and you have the crew,
                let's spin up a container.
            </p>

            <p class="managed">Managed by The Refrigerator</p>

            <div class="server-specs">
                <div class="spec-item">
                    <span class="spec-label">CPU:</span>
                    <span class="spec-val">i5-10300H</span>
                </div>

                <div class="spec-item">
                    <span class="spec-label">RAM:</span>
                    <span class="spec-val">DDR4 16GB</span>
                </div>

                <div class="spec-item">
                    <span class="spec-label">Disk:</span>
                    <span class="spec-val">100GB SSD</span>
                </div>
            </div>

            <div class="server-connect request-server-connect">
                <span class="ip-display">panel.isyourrefrigerator.online</span>
            </div>
        </article>`;
}

function renderServerList(container, context, limit, includeRequestCard) {
    if (!container) return;
    const serversToRender = limit ? SERVERS.slice(0, limit) : SERVERS;
    let html = serversToRender.map(server => renderServerCard(server, context)).join('');
    if (includeRequestCard) {
        html += renderRequestCard(context);
    }
    container.innerHTML = html;
}

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

            const targetData = check.key ? data[check.key] : data;
            const isOnline = targetData && targetData.online === true;

            applyStatus(isOnline ? 'online' : 'offline', isOnline ? 'Online' : 'Offline');
        }
    } catch (err) {
        applyStatus('unknown', 'Unknown');
    }
}

function refreshAllLiveStatuses() {
    SERVERS.filter(s => s.statusCheck).forEach(refreshLiveStatus);
}

function closeMobileNav() {
    const mobileNav = document.getElementById('mobileNav');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    if (!mobileNav || !mobileMenuToggle) return;
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    mobileMenuToggle.classList.remove('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
}

/* =========================================================================
   OFFICIAL PELICAN IMAGE GALLERY (Steam Store Media Popup Modal)
   ========================================================================= */
const GALLERY_SLIDES = [
    {
        src: 'https://peli.nyc3.digitaloceanspaces.com/docs/serverconsoled.gif',
        chip: 'Slide 01',
        title: 'Client Area & Real-time Console',
        sub: 'Live server logs, interactive terminal commands, start / restart / kill controls.'
    },
    {
        src: 'https://peli.nyc3.digitaloceanspaces.com/docs/panelsettingsd.gif',
        chip: 'Slide 02',
        title: 'Panel Settings & Configuration',
        sub: 'Granular Docker environments, server memory allocation, automated schedules & backups.'
    },
    {
        src: 'https://peli.nyc3.digitaloceanspaces.com/docs/createserverd.gif',
        chip: 'Slide 03',
        title: 'Create Server & 1-Click Eggs',
        sub: 'Deploy Minecraft, Valheim, Palworld, Zomboid, or custom containers instantly.'
    }
];

let currentGalleryIndex = 0;

function updateGallerySlide(index) {
    if (index < 0) index = GALLERY_SLIDES.length - 1;
    if (index >= GALLERY_SLIDES.length) index = 0;
    currentGalleryIndex = index;

    const slide = GALLERY_SLIDES[currentGalleryIndex];
    const mainImg = document.getElementById('galleryMainImg');
    const captionEl = document.getElementById('galleryCaption');
    const counterEl = document.getElementById('galCounter');
    const thumbBtns = document.querySelectorAll('.gallery-thumb-btn');

    if (mainImg) {
        mainImg.style.opacity = '0.35';
        setTimeout(() => {
            mainImg.src = slide.src;
            mainImg.alt = slide.title;
            mainImg.style.opacity = '1';
        }, 120);
    }

    if (captionEl) {
        captionEl.innerHTML = `
            <span class="caption-chip">${escapeHtml(slide.chip)}</span>
            <span class="caption-title">${escapeHtml(slide.title)}</span>
            <span class="caption-sub">${escapeHtml(slide.sub)}</span>
        `;
    }

    if (counterEl) {
        counterEl.textContent = `${currentGalleryIndex + 1} / ${GALLERY_SLIDES.length}`;
    }

    thumbBtns.forEach((btn, idx) => {
        if (idx === currentGalleryIndex) {
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
        } else {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        }
    });
}

function initGallery() {
    const prevBtn = document.getElementById('galPrevBtn');
    const nextBtn = document.getElementById('galNextBtn');
    const thumbBtns = document.querySelectorAll('.gallery-thumb-btn');

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            updateGallerySlide(currentGalleryIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            updateGallerySlide(currentGalleryIndex + 1);
        });
    }

    thumbBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const slideIndex = parseInt(btn.getAttribute('data-slide'), 10);
            if (!isNaN(slideIndex)) {
                updateGallerySlide(slideIndex);
            }
        });
    });
}

/* =========================================================================
   DOM CONTENT LOADED INITIALIZATION
   ========================================================================= */
document.addEventListener('DOMContentLoaded', () => {
    // Ensure layout (header & footer) is mounted first if SiteLayout / SiteComponents is available
    const layout = window.SiteLayout || window.SiteComponents;
    if (layout && typeof layout.init === 'function') {
        layout.init();
    }

    // Console Easter Egg
    console.log(
        '%c❄️ isyourrefrigerator.online%c\nPrivacy-First Homelab: Zero cookies, zero third-party trackers, 100% chilled.',
        'color: #38bdf8; font-size: 16px; font-weight: bold; font-family: monospace;',
        'color: #94a3b8; font-size: 12px;'
    );

    // Wire up Server Panel Links
    document.querySelectorAll('#serverPanelLink, #serverPanelLinkMobile').forEach(link => {
        link.href = SERVER_PANEL_URL;
    });

    // Render Servers:
    // On the main page, render 2 servers so Request a Server is #3 in the 3-column row
    renderServerList(document.getElementById('dynamicServerCards'), 'grid', 2);
    // In All Servers Modal, render all servers AND include Request a Server next to them as well
    renderServerList(document.getElementById('allServersList'), 'modal', null, true);

    refreshAllLiveStatuses();
    setInterval(refreshAllLiveStatuses, 60000);

    // Initialize the official Pelican Gallery
    initGallery();

    // =========================================================================
    // Cross-Platform Overflow Scroll Progress & Floating Quick-Scroll
    // =========================================================================
    const scrollProgressBar = document.getElementById('scrollProgressBar');
    const scrollProgressContainer = document.getElementById('scrollProgressContainer');
    const btnBackToTop = document.getElementById('btnBackToTop');
    const progressRingFill = document.getElementById('progressRingFill');
    const ringCircumference = 2 * Math.PI * 20; // 125.66px

    function updateScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;

        if (scrollProgressBar) {
            scrollProgressBar.style.width = `${progress}%`;
        }
        if (scrollProgressContainer) {
            scrollProgressContainer.setAttribute('aria-valuenow', Math.round(progress));
        }

        if (btnBackToTop) {
            if (scrollTop > 280) {
                btnBackToTop.classList.add('visible');
            } else {
                btnBackToTop.classList.remove('visible');
            }
        }

        if (progressRingFill) {
            const offset = ringCircumference - (progress / 100) * ringCircumference;
            progressRingFill.style.strokeDashoffset = offset;
        }
    }

    if (scrollProgressContainer) {
        scrollProgressContainer.addEventListener('click', (e) => {
            const rect = scrollProgressContainer.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            window.scrollTo({
                top: ratio * docHeight,
                behavior: 'smooth'
            });
        });
    }

    if (btnBackToTop) {
        btnBackToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Scroll Active Links
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 130;
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

        if (scrollY < 180) {
            navLinks.forEach(link => link.classList.remove('active'));
        }
    }

    window.addEventListener('scroll', () => {
        updateActiveNav();
        updateScrollProgress();
    }, { passive: true });

    window.addEventListener('resize', updateScrollProgress, { passive: true });
    updateScrollProgress();

    // Smooth Scrolling & Close Modals on Internal Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            closeMobileNav();

            if (targetId === '#' || !targetId || targetId === '#contact' || targetId === '#privacy') return;

            // If inside a modal, close all modals before scrolling
            if (this.closest('.modal-backdrop')) {
                closeAllModals();
            }

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

    // Global click delegate for any Request a Server card (main grid or modal) to smoothly scroll to #hosting
    document.addEventListener('click', (e) => {
        const reqCard = e.target.closest('.request-card');
        if (!reqCard) return;

        closeAllModals();
        closeMobileNav();

        const hostingSection = document.getElementById('hosting');
        if (hostingSection) {
            hostingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    // Copy IP & Notifications
    const toast = document.getElementById('toastNotice');

    function showToast(message) {
        if (!toast) return;
        toast.querySelector('.toast-text').textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2600);
    }

    // Robust clipboard copy with fallback for non-secure / HTTP contexts
    async function copyText(text) {
        if (!text) return false;
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (err) {}
        }
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            textArea.style.top = '-9999px';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            if (success) return true;
        } catch (err) {}
        return false;
    }

    // Unified click handler for copying IP / Discord
    document.addEventListener('click', async (e) => {
        const copyBtn = e.target.closest('.btn-copy-ip, .btn-copy-discord, [data-ip]');
        if (!copyBtn) return;

        // Prevent triggering parent link or card navigation
        e.stopPropagation();

        const val = copyBtn.getAttribute('data-ip') || copyBtn.textContent.trim();
        if (!val) return;

        const isDiscord = val.includes('@') || copyBtn.classList.contains('btn-copy-discord');
        const success = await copyText(val);

        if (success) {
            copyBtn.classList.add('copied');
            const message = isDiscord ? `Copied Discord tag ${val} to clipboard!` : `Copied ${val} to clipboard!`;
            showToast(message);

            const span = copyBtn.querySelector('span');
            const originalSpanText = span ? span.textContent : null;
            if (span && !copyBtn.classList.contains('server-connect')) {
                span.textContent = 'Copied!';
            }

            setTimeout(() => {
                copyBtn.classList.remove('copied');
                if (span && originalSpanText) {
                    span.textContent = originalSpanText;
                }
            }, 2200);
        } else {
            prompt('Copy to clipboard:', val);
        }
    });

    // Keyboard support for copy buttons
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const connectBtn = document.activeElement;
            if (connectBtn && connectBtn.classList.contains('btn-copy-ip')) {
                e.preventDefault();
                connectBtn.click();
            }
        }
    });

    // Server card click handler: clicking on a server section links to its page (e.g. /zomboid or /minecraft)
    document.addEventListener('click', (e) => {
        // If user clicked inside copy IP or Discord button, do not navigate
        if (e.target.closest('.server-connect, .btn-copy-ip, .btn-copy-discord, [data-ip]')) {
            return;
        }
        // If user clicked an anchor tag directly, let normal navigation happen
        if (e.target.closest('a')) {
            return;
        }
        const card = e.target.closest('.server-card.is-clickable');
        if (!card) return;
        const link = card.getAttribute('data-server-link');
        if (link) {
            window.location.href = link;
        }
    });

    // Accessible keyboard navigation for server cards
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const card = document.activeElement;
            if (card && card.classList.contains('server-card') && card.classList.contains('is-clickable')) {
                const link = card.getAttribute('data-server-link');
                if (link) {
                    window.location.href = link;
                }
            }
        }
    });

    // Modal Generic Logic
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

    // Modal Triggers: Contact Modal
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

    // Modal Triggers: Pelican Panel Gallery Modal
    document.querySelectorAll('.btn-open-panel-gallery').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModalById('panelGalleryModal');
        });
    });

    const closePanelGalleryBtn = document.getElementById('closePanelGalleryModal');
    if (closePanelGalleryBtn) {
        closePanelGalleryBtn.addEventListener('click', () => {
            closeModal(document.getElementById('panelGalleryModal'));
        });
    }

    // Privacy Modal
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

    // All Servers Modal
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

    // Backdrop clicks close modal
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                closeModal(backdrop);
            }
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
            closeMobileNav();
        }
        const panelModal = document.getElementById('panelGalleryModal');
        if (panelModal && panelModal.classList.contains('show')) {
            if (e.key === 'ArrowLeft') {
                updateGallerySlide(currentGalleryIndex - 1);
            }
            if (e.key === 'ArrowRight') {
                updateGallerySlide(currentGalleryIndex + 1);
            }
        }
    });

    // Mobile Nav Toggle
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

    window.addEventListener('resize', () => {
        if (window.innerWidth > 960) {
            closeMobileNav();
        }
    });

    const currentYearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    currentYearElements.forEach(el => {
        el.textContent = currentYear;
    });
});