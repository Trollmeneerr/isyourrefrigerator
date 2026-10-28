/**
 * ISYOURREFRIGERATOR.ONLINE - SITE LAYOUT & COMPONENT SYSTEM
 * Location: /static/layout.js
 * 
 * Manages modular header and footer component injection,
 * automatic subpage back-navigation, status indicators,
 * and reachability checks across panel and game nodes.
 */

(function () {
    'use strict';

    const FALLBACK_HEADER = `<div class="header-section">
        <a href="/" class="brand-link">
            <img class="brand-pic" src="/static/images/isyourrefrigerator.online_logo_small.png"
                alt="IsYourRefrigerator Logo">
            <h1 class="brand-logo">
                IsYourRefrigerator<span class="text-ice-blue">.online</span>
            </h1>
        </a>
    </div>
    <div class="header-section" style="gap: 12px;">
        <a href="/" id="btn-header-back" class="btn btn-gray btn-header-back" title="Back to Main Site">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Back to Main Site</span>
        </a>
        <a href="https://panel.isyourrefrigerator.online" target="_blank" rel="noopener noreferrer"
            id="btn-freezer-panel" class="btn btn-blue transition-fast">
            <span class="icon" data-icon="freezer"></span>
            <span>Freezer Panel</span>
        </a>
    </div>`;

    const FALLBACK_FOOTER = `<section class="footer-header">
        <div class="footer-logo-slogan">
            <a href="/" class="brand-link">
                <h1 class="brand-logo">
                    IsYourRefrigerator<span class="text-ice-blue">.online</span>
                </h1>
            </a>
            <p class="text-gray">Your Freezers. Your Rules</p>
        </div>
        <a href="/#privacy" id="link-privacy" class="footer-privacy-link">
            <span class="icon" data-icon="shield"></span>
            <span>Privacy & legal</span>
        </a>
    </section>
    <span class="underline"></span>
    <section id="copyright" class="footer-copyright">
        <p class="text-gray">© <span class="current-year">2026</span> IsYourRefrigerator.online — Hosted with love &amp; electricity.</p>
        <p class="text-gray">status <span id="status" class="status-indicator"></span></p>
    </section>`;

    async function fetchComponent(name) {
        const candidatePaths = [
            `components/${name}.html`,
            `/components/${name}.html`,
            `../components/${name}.html`,
            `../../components/${name}.html`
        ];
        for (const p of candidatePaths) {
            try {
                const res = await fetch(p, { cache: 'no-cache' });
                if (res.ok) {
                    const text = await res.text();
                    if (text && text.trim()) return text;
                }
            } catch (_) {
                // Continue trying candidate paths
            }
        }
        return null;
    }

    const Layout = {
        /**
         * Update back-button visibility in header:
         * Hidden on the main homepage, visible when on subpages (e.g. /zomboid)
         */
        updateHeaderNavigation(headerEl) {
            const root = headerEl || document;
            const backBtn = root.querySelector('#btn-header-back, .btn-header-back');
            if (!backBtn) return;

            const path = (window.location.pathname || '').replace(/\\/g, '/');
            const isRoot = path === '' ||
                           path === '/' ||
                           (path.endsWith('/index.html') &&
                            !path.includes('/zomboid') &&
                            !path.includes('/minecraft') &&
                            !path.includes('/valheim') &&
                            !path.includes('/theforest'));

            if (isRoot) {
                backBtn.style.display = 'none';
            } else {
                backBtn.style.display = 'inline-flex';
            }
        },

        /**
         * Ensure image assets resolve across relative root and subdirectory pages
         */
        fixComponentAssets(rootEl) {
            if (!rootEl) return;
            const path = (window.location.pathname || '').replace(/\\/g, '/');
            const isSubdir = path.includes('/zomboid') ||
                             path.includes('/minecraft') ||
                             path.includes('/valheim') ||
                             path.includes('/theforest');
            const prefix = isSubdir ? '../' : '';

            const logoImgs = rootEl.querySelectorAll('.brand-pic');
            logoImgs.forEach(img => {
                img.addEventListener('error', function onLogoError() {
                    img.removeEventListener('error', onLogoError);
                    img.src = prefix + 'static/images/isyourrefrigerator.online_logo_small.png';
                }, { once: true });
            });
        },

        /**
         * Load and inject the header component
         */
        async loadHeader() {
            const headerEl = document.getElementById('header') ||
                             document.querySelector('header.site-header') ||
                             document.querySelector('[data-component="header"]');
            if (!headerEl) return;

            const needsContent = !headerEl.children.length || headerEl.getAttribute('data-load') === 'true';
            if (needsContent) {
                let html = await fetchComponent('header');
                if (!html) html = FALLBACK_HEADER;

                const trimmed = html.trim();
                let innerHtml = trimmed;
                if (trimmed.startsWith('<header') && trimmed.endsWith('</header>')) {
                    const temp = document.createElement('div');
                    temp.innerHTML = trimmed;
                    const childHeader = temp.querySelector('header');
                    if (childHeader) {
                        innerHtml = childHeader.innerHTML;
                    }
                }

                headerEl.innerHTML = innerHtml;
                headerEl.classList.add('site-header');
            }

            this.updateHeaderNavigation(headerEl);
            this.fixComponentAssets(headerEl);

            if (window.renderIcons) window.renderIcons(headerEl);
            if (window.truncateOverflowButtons) window.truncateOverflowButtons();
        },

        /**
         * Load and inject the footer component
         */
        async loadFooter() {
            const footerEl = document.getElementById('footer') ||
                             document.querySelector('footer.site-footer') ||
                             document.querySelector('footer.site') ||
                             document.querySelector('[data-component="footer"]');
            if (!footerEl) return;

            const needsContent = !footerEl.children.length || footerEl.getAttribute('data-load') === 'true';
            if (needsContent) {
                let html = await fetchComponent('footer');
                if (!html) html = FALLBACK_FOOTER;

                const trimmed = html.trim();
                let innerHtml = trimmed;
                if (trimmed.startsWith('<footer') && trimmed.endsWith('</footer>')) {
                    const temp = document.createElement('div');
                    temp.innerHTML = trimmed;
                    const childFooter = temp.querySelector('footer');
                    if (childFooter) {
                        innerHtml = childFooter.innerHTML;
                    }
                }

                footerEl.innerHTML = innerHtml;
                footerEl.classList.add('site-footer');
            }

            const currentYear = new Date().getFullYear();
            footerEl.querySelectorAll('.current-year').forEach(el => {
                el.textContent = currentYear;
            });

            this.fixComponentAssets(footerEl);

            if (window.renderIcons) window.renderIcons(footerEl);
            this.refreshStatus();
        },

        /**
         * Load all layout components (header and footer)
         */
        async loadComponents() {
            await Promise.all([this.loadHeader(), this.loadFooter()]);
        },

        /**
         * Update status indicator based on panel and node reachability:
         * - If both unreachable (or network down): "Service Down" (offline/red)
         * - If either unreachable: "Degraded Service" (degraded/yellow)
         * - If both reachable: "All Systems Operational" (online/green)
         */
        updateStatusBar(statusJson) {
            const statusEls = document.querySelectorAll('#status, .status-indicator');
            if (!statusEls.length) return;

            let isPanelReachable = false;
            let isNodeReachable = false;

            if (statusJson) {
                const p = statusJson.panel;
                isPanelReachable = Boolean(p && (typeof p === 'object' ? p.online === true : p === true));

                const n = statusJson.node;
                if (n !== undefined) {
                    isNodeReachable = Boolean(typeof n === 'object' ? n.online === true : n === true);
                } else if (statusJson.online !== undefined) {
                    isNodeReachable = Boolean(statusJson.online);
                } else {
                    isNodeReachable = Boolean(
                        statusJson.minecraft?.online ||
                        statusJson.valheim?.online ||
                        statusJson.forest?.online ||
                        statusJson.zomboid?.online ||
                        statusJson.chess?.online
                    );
                }
            }

            let statusText = 'All Systems Operational';
            let statusClass = 'online';
            let statusTitle = 'All Systems Operational: Panel and Node online';

            if (!isPanelReachable && !isNodeReachable) {
                statusText = 'Service Down';
                statusClass = 'offline';
                statusTitle = 'Service Down: Neither the panel nor the node is reachable';
            } else if (!isPanelReachable || !isNodeReachable) {
                statusText = 'Degraded Service';
                statusClass = 'degraded';
                statusTitle = !isPanelReachable
                    ? 'Degraded Service: Panel unreachable'
                    : 'Degraded Service: Node unreachable';
            }

            statusEls.forEach(el => {
                el.className = `status-indicator ${statusClass}`;
                el.title = statusTitle;
                el.innerHTML = `<span class="indicator-dot ${statusClass}"></span>${statusText}`;
            });
        },

        /**
         * Fetch current status and update UI
         */
        async refreshStatus() {
            try {
                let res;
                try {
                    res = await fetch('/static/status.json', { cache: 'no-store' });
                    if (!res.ok) {
                        res = await fetch('static/status.json', { cache: 'no-store' });
                    }
                } catch (_) {
                    res = await fetch('static/status.json', { cache: 'no-store' });
                }

                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                Layout.updateStatusBar(data);
                return data;
            } catch (_) {
                if (window.location.protocol === 'file:') {
                    Layout.updateStatusBar({ panel: { online: true }, node: { online: true } });
                } else {
                    Layout.updateStatusBar({ panel: { online: false }, node: { online: false } });
                }
                return null;
            }
        },

        /**
         * Initialize components & status polling
         */
        async init() {
            await this.loadComponents();
            await this.refreshStatus();
            if (typeof window !== 'undefined' && !this._pollInterval) {
                this._pollInterval = setInterval(() => this.refreshStatus(), 60000);
            }
        }
    };

    // Expose globally
    window.SiteLayout = Layout;
    window.SiteComponents = Layout; // Backwards compatibility

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Layout.init());
    } else {
        Layout.init();
    }
})();
