/**
 * ISYOURREFRIGERATOR.ONLINE - MODULAR SITE LAYOUT SYSTEM
 * Location: /static/layout.js
 * 
 * Provides customizable, modular headers, footers, and modal layouts for the main portal and game subpages.
 * Includes universal GDPR Privacy & Legal modal popup with contact email fridge@isyourrefrigerator.online.
 */

(function () {
    'use strict';

    const LEGAL_EMAIL = 'fridge@isyourrefrigerator.online';

    const Layout = {
        /**
         * Render Header
         * @param {Object} options
         * @param {'main'|'subpage'} options.type - 'main' for full nav, 'subpage' for subpage back button
         * @param {string} options.backText - Text for subpage back button (default: 'Back to Main Site')
         * @param {string} options.backHref - Link destination for back button (default: '/')
         * @param {boolean} options.showPanel - Whether to show the Server Panel button (default: true)
         */
        renderHeader(options = {}) {
            const type = options.type || 'subpage';
            const backText = options.backText || 'Back to Main Site';
            const backHref = options.backHref || '/';
            const showPanel = options.showPanel !== false;

            if (type === 'main') {
                return `
                    <div class="wrap site-inner">
                        <a href="/" class="brand-link" aria-label="IsYourRefrigerator.online home">
                            <img src="/static/images/isyourrefrigerator.online_logo_small.png" alt="" class="logo-icon">
                            <img src="/static/images/IsYourRefrigerator.online (1).png" alt="" class="logo-wordmark">
                            <img src="/static/images/IsYourRefrigerator.online.png" alt="IsYourRefrigerator.online" class="logo-mobile">
                        </a>

                        <nav class="site-nav" aria-label="Main Navigation">
                            <a href="#overview" class="nav-link">Overview</a>
                            <a href="#servers" class="nav-link">Game Servers</a>
                            <a href="#crew" class="nav-link">Community</a>
                            <a href="#hosting" class="nav-link">Homelab &amp; Infrastructure</a>
                        </nav>

                        <div class="header-actions">

                            <button type="button" class="btn-mobile-menu" id="mobileMenuToggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="mobileNav">
                                <svg class="icon-menu" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <line x1="3" y1="12" x2="21" y2="12"></line>
                                    <line x1="3" y1="18" x2="21" y2="18"></line>
                                </svg>
                                <svg class="icon-close" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>

                            ${showPanel ? `
                            <a href="https://panel.isyourrefrigerator.online" class="btn btn-fill btn-server-panel header-panel-btn" id="serverPanelLink" target="_blank" rel="noopener noreferrer">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="2" y="3" width="20" height="6" rx="1"></rect>
                                    <rect x="2" y="15" width="20" height="6" rx="1"></rect>
                                    <line x1="6" y1="6" x2="6.01" y2="6"></line>
                                    <line x1="6" y1="18" x2="6.01" y2="18"></line>
                                </svg>
                                <span>Server Panel</span>
                            </a>` : ''}
                        </div>
                    </div>

                    <!-- Mobile Navigation Panel -->
                    <nav class="mobile-nav" id="mobileNav" aria-hidden="true" aria-label="Mobile Navigation">
                        <a href="#overview" class="mobile-nav-link nav-link">Overview</a>
                        <a href="#servers" class="mobile-nav-link nav-link">Game Servers</a>
                        <a href="#crew" class="mobile-nav-link nav-link">Community</a>
                        <a href="#hosting" class="mobile-nav-link nav-link">Homelab &amp; Infrastructure</a>
                        <a href="#contact" class="mobile-nav-link nav-link">Contact</a>
                        ${showPanel ? `
                        <a href="https://panel.isyourrefrigerator.online" class="btn btn-fill mobile-nav-btn btn-server-panel" id="serverPanelLinkMobile" target="_blank" rel="noopener noreferrer">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="2" y="3" width="20" height="6" rx="1"></rect>
                                <rect x="2" y="15" width="20" height="6" rx="1"></rect>
                                <line x1="6" y1="6" x2="6.01" y2="6"></line>
                                <line x1="6" y1="18" x2="6.01" y2="18"></line>
                            </svg>
                            <span>Server Panel</span>
                        </a>` : ''}
                        <button type="button" class="btn btn-outline mobile-nav-btn btn-view-servers">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="2" y="3" width="20" height="6" rx="1"></rect>
                                    <rect x="2" y="15" width="20" height="6" rx="1"></rect>
                                    <line x1="6" y1="6" x2="6.01" y2="6"></line>
                                    <line x1="6" y1="18" x2="6.01" y2="18"></line>
                                </svg>
                            <span>View All Servers</span>
                        </button>
                    </nav>`;
            }

            // Subpage header
            return `
                <div class="wrap site-inner">
                    <a href="/" class="brand-link" aria-label="IsYourRefrigerator.online home">
                        <img src="/static/images/isyourrefrigerator.online_logo_small.png" alt="" class="logo-icon">
                        <img src="/static/images/IsYourRefrigerator.online (1).png" alt="" class="logo-wordmark">
                        <img src="/static/images/IsYourRefrigerator.online.png" alt="IsYourRefrigerator.online" class="logo-mobile">
                    </a>

                    <div class="header-actions">
                        <a href="${backHref}" class="btn btn-outline btn-header-back">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                            <span class="back-text-short">Back</span>
                            ${backText === 'Back to Main Site' ? '<span class="back-text-full">&nbsp;to Main Site</span>' : (backText !== 'Back' ? `<span class="back-text-full">&nbsp;${backText.replace(/^Back\s*/i, '')}</span>` : '')}
                        </a>
                        ${showPanel ? `
                        <a href="https://panel.isyourrefrigerator.online" class="btn btn-fill btn-server-panel header-panel-btn" id="serverPanelLink" target="_blank" rel="noopener noreferrer" title="Server Panel">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="2" y="3" width="20" height="6" rx="1"></rect>
                                <rect x="2" y="15" width="20" height="6" rx="1"></rect>
                                <line x1="6" y1="6" x2="6.01" y2="6"></line>
                                <line x1="6" y1="18" x2="6.01" y2="18"></line>
                            </svg>
                            <span>Server Panel</span>
                        </a>` : ''}
                    </div>
                </div>`;
        },

        /**
         * Render Footer
         * @param {Object} options
         * @param {'main'|'subpage'} options.type - 'main' for full navigation footer, 'subpage' for subpage disclaimer/copyright
         * @param {string} options.notice - Specific disclaimer notice text
         * @param {string} options.statusText - Status text indicator (e.g. 'All Systems Operational' or 'Server Online')
         */
        renderFooter(options = {}) {
            const type = options.type || 'subpage';
            const year = new Date().getFullYear();
            const defaultNotice = options.type === 'main'
                ? 'Despite the cold branding, servers run on with standard cooling!'
                : 'Despite the cold branding, servers run on with standard cooling!';
            const notice = options.notice || defaultNotice;
            const statusText = options.statusText || (type === 'main' ? 'All Systems Operational' : 'Server Online');

            if (type === 'main') {
                return `
                    <div class="wrap">
                        <div class="footer-inner">
                            <div class="footer-brand">
                                <a href="/" class="brand-link" aria-label="IsYourRefrigerator.online home">
                                    <img src="/static/images/isyourrefrigerator.online_logo_small.png" alt="" class="logo-icon">
                                    <img src="/static/images/IsYourRefrigerator.online (1).png" alt="" class="logo-wordmark">
                                    <img src="/static/images/IsYourRefrigerator.online.png" alt="IsYourRefrigerator.online" class="logo-mobile">
                                </a>
                                <p class="tagline">Your Freezers. Your Rules.</p>
                            </div>

                            <div class="footer-nav">
                                <a href="#overview">Overview</a>
                                <a href="#servers">Game Servers</a>
                                <a href="https://chess.isyourrefrigerator.online" target="_blank" rel="noopener noreferrer">Chess ↗</a>
                                <a href="#crew">Community</a>
                                <a href="#hosting">Homelab &amp; Infrastructure</a>
                                <a href="#contact">Contact</a>
                                <a href="#privacy" class="footer-nav-link btn-privacy">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                    </svg>
                                    <span>Privacy &amp; Legal</span>
                                </a>
                            </div>
                        </div>

                        <!-- Hardware Disclaimer -->
                        <div class="footer-disclaimer">
                            <div class="disclaimer-badge">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                <span>Hardware Disclaimer</span>
                            </div>
                            <p class="disclaimer-text">
                                <strong>Notice:</strong> ${notice}
                            </p>
                        </div>

                        <div class="footer-bottom">
                            <div>&copy; <span class="current-year">${year}</span> IsYourRefrigerator.online — Hosted with love &amp; electricity.</div>
                            <div>Status: <span id="systemStatusFooter" class="system-status-indicator" style="color: #22c55e;">● ${statusText}</span></div>
                        </div>
                    </div>`;
            }

            // Subpage Footer (Includes logo and Legal Link with Universal Popup)
            return `
                <div class="wrap">
                    <div class="footer-sub-bar">
                        <div class="footer-brand">
                            <a href="/" class="brand-link" aria-label="IsYourRefrigerator.online home">
                                <img src="/static/images/isyourrefrigerator.online_logo_small.png" alt="" class="logo-icon">
                                <img src="/static/images/IsYourRefrigerator.online (1).png" alt="" class="logo-wordmark">
                                <img src="/static/images/IsYourRefrigerator.online.png" alt="IsYourRefrigerator.online" class="logo-mobile">
                            </a>
                        </div>
                        <div class="footer-sub-links">
                            <a href="https://chess.isyourrefrigerator.online" target="_blank" rel="noopener noreferrer">Chess ↗</a>
                            <a href="#privacy" class="footer-nav-link btn-privacy">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                </svg>
                                <span>Privacy &amp; Legal</span>
                            </a>
                        </div>
                    </div>

                    <!-- Hardware Disclaimer -->
                    <div class="footer-disclaimer">
                        <div class="disclaimer-badge">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            <span>Hardware Disclaimer</span>
                        </div>
                        <p class="disclaimer-text">
                            <strong>Notice:</strong> ${notice}
                        </p>
                    </div>

                    <div class="footer-bottom">
                        <div>&copy; <span class="current-year">${year}</span> IsYourRefrigerator.online — Hosted with love &amp; electricity.</div>
                        <div>Status: <span id="systemStatusFooterSub" class="system-status-indicator" style="color: #22c55e;">● ${statusText}</span></div>
                    </div>
                </div>`;
        },

        /**
         * Render Universal Privacy / Legal Modal HTML
         */
        renderLegalModal() {
            return `
                <div class="modal-backdrop" id="privacyModal" aria-hidden="true" role="dialog" aria-labelledby="privacyModalTitle">
                    <div class="modal-card modal-privacy-card">
                        <button type="button" class="modal-close-btn" id="closePrivacyModal" aria-label="Close privacy notice">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        <div class="modal-header">
                            <div class="modal-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                </svg>
                            </div>
                            <h3 id="privacyModalTitle">Privacy Policy &amp; Legal Notice</h3>
                            <p>GDPR Compliance &amp; Data Protection Transparency (EU Regulation 2016/679)</p>
                        </div>

                        <div class="modal-body">
                            <div class="privacy-section">
                                <div class="privacy-badge-pill">● Zero Tracking Policy</div>
                                <h4>1. Controller &amp; Overview</h4>
                                <p>This website (<strong>IsYourRefrigerator.online</strong>) is a non-commercial, personal homelab website operated by <strong>@Trollmeneerr</strong> (Email: <a href="mailto:${LEGAL_EMAIL}" style="color: var(--cyan); text-decoration: underline;">${LEGAL_EMAIL}</a>). We take your digital privacy seriously and follow the principle of complete data minimization (Art. 5(1)(c) GDPR).</p>
                            </div>

                            <div class="privacy-section">
                                <div class="privacy-badge-pill">● 0 Cookies / 0 Telemetry</div>
                                <h4>2. Cookies &amp; Tracking Technologies</h4>
                                <p>We do <strong>not</strong> use tracking cookies, analytics services (e.g. Google Analytics), advertising networks, or fingerprinting scripts. All fonts and assets are hosted locally on our own server to prevent unauthorized third-party data transfers.</p>
                            </div>

                            <div class="privacy-section">
                                <h4>3. Server Logs &amp; Processing (Art. 6(1)(f) GDPR)</h4>
                                <p>When you visit this website or connect to our dedicated game server instances, standard technical connection metadata is temporarily processed in local server log files (such as IP address, date/time stamp, requested resource, and user-agent). This processing is strictly necessary for legitimate interests to ensure network security, prevent DDoS abuse, and maintain service stability. Log entries are automatically purged after 14 days.</p>
                            </div>

                            <div class="privacy-section">
                                <h4>4. Your Rights Under the GDPR (Articles 15–21)</h4>
                                <p>Under the European Union General Data Protection Regulation, you have full statutory rights regarding your personal data:</p>
                                <ul>
                                    <li><strong>Right of Access (Art. 15):</strong> Inquire whether and what personal data is processed.</li>
                                    <li><strong>Right to Rectification &amp; Erasure (Art. 16, 17):</strong> Request correction or deletion of log records.</li>
                                    <li><strong>Right to Restriction &amp; Objection (Art. 18, 21):</strong> Object to processing based on legitimate interests.</li>
                                    <li><strong>Right to Lodge a Complaint:</strong> You have the right to lodge a complaint with your local EU Data Protection Authority (DPA). Contact controller directly at <a href="mailto:${LEGAL_EMAIL}" style="color: var(--cyan); text-decoration: underline;">${LEGAL_EMAIL}</a>.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>`;
        },

        /**
         * Ensure Universal Privacy / Legal Modal exists in DOM and wire up event listeners
         */
        ensureLegalModal() {
            let modal = document.getElementById('privacyModal');
            if (!modal) {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = this.renderLegalModal();
                document.body.appendChild(wrapper.firstElementChild);
                modal = document.getElementById('privacyModal');
            } else {
                // Ensure email address inside existing modal matches fridge@isyourrefrigerator.online
                modal.querySelectorAll('a[href^="mailto:"]').forEach(link => {
                    link.href = `mailto:${LEGAL_EMAIL}`;
                    link.textContent = LEGAL_EMAIL;
                });
            }

            // Universal Open Modal Logic
            const openLegalModal = (e) => {
                if (e) e.preventDefault();
                const m = document.getElementById('privacyModal');
                if (m) {
                    m.classList.add('show');
                    m.setAttribute('aria-hidden', 'false');
                    document.body.style.overflow = 'hidden';
                }
            };

            const closeLegalModal = () => {
                const m = document.getElementById('privacyModal');
                if (m) {
                    m.classList.remove('show');
                    m.setAttribute('aria-hidden', 'true');
                    document.body.style.overflow = '';
                }
            };

            // Bind all .btn-privacy buttons
            document.querySelectorAll('.btn-privacy').forEach(btn => {
                btn.removeEventListener('click', openLegalModal);
                btn.addEventListener('click', openLegalModal);
            });

            // Close button
            const closeBtn = document.getElementById('closePrivacyModal');
            if (closeBtn) {
                closeBtn.removeEventListener('click', closeLegalModal);
                closeBtn.addEventListener('click', closeLegalModal);
            }

            // Backdrop click close
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        closeLegalModal();
                    }
                });
            }

            // Escape key close
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closeLegalModal();
                }
            });
        },

        /**
         * Automatically initialize any containers declared with data-component attributes,
         * or fallback to existing <header class="site"> and <footer class="site"> elements.
         */
        init() {
            // Header mount
            const headerEl = document.querySelector('[data-component="header"]') || document.querySelector('header.site');
            if (headerEl && headerEl.getAttribute('data-mounted') !== 'true') {
                const type = headerEl.getAttribute('data-header-type') || (document.querySelector('main#overview, section#overview') ? 'main' : 'subpage');
                const backText = headerEl.getAttribute('data-back-text') || 'Back to Main Site';
                const backHref = headerEl.getAttribute('data-back-href') || '/';
                const showPanel = headerEl.getAttribute('data-show-panel') !== 'false';

                headerEl.innerHTML = this.renderHeader({ type, backText, backHref, showPanel });
                headerEl.setAttribute('data-mounted', 'true');
            }

            // Footer mount
            const footerEl = document.querySelector('[data-component="footer"]') || document.querySelector('footer.site');
            if (footerEl && footerEl.getAttribute('data-mounted') !== 'true') {
                const type = footerEl.getAttribute('data-footer-type') || (document.querySelector('main#overview, section#overview') ? 'main' : 'subpage');
                const notice = footerEl.getAttribute('data-notice') || '';
                const statusText = footerEl.getAttribute('data-status-text') || '';

                footerEl.innerHTML = this.renderFooter({ type, notice, statusText });
                footerEl.setAttribute('data-mounted', 'true');
            }

            // Universal legal modal setup
            this.ensureLegalModal();

            // Ensure current year is synchronized everywhere
            const year = new Date().getFullYear();
            document.querySelectorAll('.current-year').forEach(el => {
                el.textContent = year;
            });
        }
    };

    // Expose globally
    window.SiteLayout = Layout;
    window.SiteComponents = Layout; // Backwards compatibility

    // Auto-mount when DOM is parsed
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Layout.init());
    } else {
        Layout.init();
    }
})();
