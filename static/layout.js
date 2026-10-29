/**
 * ISYOURREFRIGERATOR.ONLINE - SITE LAYOUT & COMPONENT SYSTEM
 * Location: /static/style/../static/layout.js (/static/layout.js)
 * 
 * Manages modular header & footer component enhancements,
 * zero-CLS navigation management, dynamic copyright year,
 * and unified reachability status monitoring.
 */

(function () {
  'use strict';

  const FALLBACK_HEADER = `<div class="header-section">
    <a href="/" class="brand-link">
      <img class="brand-pic" src="static/images/isyourrefrigerator.online_logo_small.png" alt="IsYourRefrigerator Logo" width="44" height="44">
      <h1 class="brand-logo">IsYourRefrigerator<span class="text-ice-blue">.online</span></h1>
    </a>
  </div>
  <div class="header-section" style="gap: 12px;">
    <a href="/" id="btn-header-back" class="btn btn-gray btn-header-back" title="Back to Main Site">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
      <span>Back to Main Site</span>
    </a>
    <a href="https://panel.isyourrefrigerator.online" target="_blank" rel="noopener noreferrer" id="btn-freezer-panel" class="btn btn-blue transition-fast">
      <span class="icon" data-icon="freezer"></span>
      <span>Freezer Panel</span>
    </a>
  </div>`;

  const FALLBACK_FOOTER = `<section class="footer-header">
    <div class="footer-logo-slogan">
      <a href="/" class="brand-link">
        <h1 class="brand-logo">IsYourRefrigerator<span class="text-ice-blue">.online</span></h1>
      </a>
      <p class="text-gray">Your Freezers. Your Rules</p>
    </div>
    <a href="/#hosting" id="link-privacy" class="footer-privacy-link">
      <span class="icon" data-icon="shield"></span>
      <span>Privacy &amp; Hosting</span>
    </a>
  </section>
  <span class="underline"></span>
  <section id="copyright" class="footer-copyright">
    <p class="text-gray">&copy; <span class="current-year">2026</span> IsYourRefrigerator.online &mdash; Hosted with love &amp; electricity.</p>
    <p class="text-gray">status <span id="status" class="status-indicator" role="status" aria-live="polite"></span></p>
  </section>`;

  /**
   * Determine whether current page is root homepage or subpage
   */
  function isSubpage() {
    const path = (window.location.pathname || '').replace(/\\/g, '/');
    return path.includes('/zomboid') ||
           path.includes('/minecraft') ||
           path.includes('/valheim') ||
           path.includes('/theforest');
  }

  /**
   * Candidate relative paths for fetching status.json or components
   */
  function getCandidatePaths(fileName) {
    if (isSubpage()) {
      return [`../${fileName}`, `/${fileName}`, fileName];
    }
    return [fileName, `/${fileName}`, `../${fileName}`];
  }

  async function fetchFile(relativeName) {
    const paths = getCandidatePaths(relativeName);
    for (const p of paths) {
      try {
        const res = await fetch(p, { cache: 'no-cache' });
        if (res.ok) return await res.text();
      } catch (_) {
        // try next candidate
      }
    }
    return null;
  }

  const Layout = {
    /**
     * Updates back button visibility in header
     */
    updateHeaderNavigation(headerEl) {
      const root = headerEl || document;
      const backBtn = root.querySelector('#btn-header-back, .btn-header-back');
      if (!backBtn) return;

      if (!isSubpage()) {
        backBtn.style.display = 'none';
      } else {
        backBtn.style.display = 'inline-flex';
        // Ensure relative navigation works in static file previews
        if (!backBtn.getAttribute('href') || backBtn.getAttribute('href') === '/') {
          backBtn.setAttribute('href', '../index.html');
        }
      }
    },

    /**
     * Fix asset paths for images inside injected components
     */
    fixComponentAssets(rootEl) {
      if (!rootEl) return;
      const prefix = isSubpage() ? '../' : '';

      rootEl.querySelectorAll('img.brand-pic').forEach(img => {
        const src = img.getAttribute('src');
        if (src && src.startsWith('/') && !src.startsWith('//')) {
          img.src = prefix + src.replace(/^\/+/, '');
        }
        img.addEventListener('error', function onLogoError() {
          img.removeEventListener('error', onLogoError);
          img.src = prefix + 'static/images/isyourrefrigerator.online_logo_small.png';
        }, { once: true });
      });
    },

    /**
     * Initialize Header
     */
    async loadHeader() {
      const headerEl = document.getElementById('header') || document.querySelector('header.site-header');
      if (!headerEl) return;

      // If header is empty, populate it
      if (!headerEl.children.length) {
        let html = await fetchFile('components/header.html');
        if (!html) html = FALLBACK_HEADER;

        const trimmed = html.trim();
        let innerHtml = trimmed;
        if (trimmed.startsWith('<header') && trimmed.endsWith('</header>')) {
          const temp = document.createElement('div');
          temp.innerHTML = trimmed;
          const child = temp.querySelector('header');
          if (child) innerHtml = child.innerHTML;
        }
        headerEl.innerHTML = innerHtml;
      }

      this.updateHeaderNavigation(headerEl);
      this.fixComponentAssets(headerEl);

      if (window.renderIcons) window.renderIcons(headerEl);
    },

    /**
     * Initialize Footer
     */
    async loadFooter() {
      const footerEl = document.getElementById('footer') || document.querySelector('footer.site-footer');
      if (!footerEl) return;

      // If footer is empty, populate it
      if (!footerEl.children.length) {
        let html = await fetchFile('components/footer.html');
        if (!html) html = FALLBACK_FOOTER;

        const trimmed = html.trim();
        let innerHtml = trimmed;
        if (trimmed.startsWith('<footer') && trimmed.endsWith('</footer>')) {
          const temp = document.createElement('div');
          temp.innerHTML = trimmed;
          const child = temp.querySelector('footer');
          if (child) innerHtml = child.innerHTML;
        }
        footerEl.innerHTML = innerHtml;
      }

      const currentYear = new Date().getFullYear();
      footerEl.querySelectorAll('.current-year').forEach(el => {
        el.textContent = currentYear;
      });

      this.fixComponentAssets(footerEl);
      if (window.renderIcons) window.renderIcons(footerEl);
    },

    /**
     * Unified Status Indicator Calculation
     */
    updateStatusBar(statusJson) {
      const statusEls = document.querySelectorAll('#status, .status-indicator');
      if (!statusEls.length) return;

      let isPanelReachable = false;
      let totalServices = 0;
      let onlineServices = 0;

      if (statusJson) {
        const p = statusJson.panel;
        isPanelReachable = Boolean(p && (typeof p === 'object' ? p.online === true : p === true));

        for (const [key, val] of Object.entries(statusJson)) {
          if (key === 'panel') continue;
          totalServices++;
          if (val && val.online === true) onlineServices++;
        }
      }

      let statusText = 'All Systems Operational';
      let statusClass = 'online';
      let statusTitle = 'All systems operational: Freezers and Panel online';

      if (!isPanelReachable && onlineServices === 0) {
        statusText = 'Service Down';
        statusClass = 'offline';
        statusTitle = 'All services currently unreachable';
      } else if (!isPanelReachable || onlineServices < totalServices) {
        statusText = 'Degraded Service';
        statusClass = 'degraded';
        statusTitle = !isPanelReachable
          ? 'Management Panel unreachable'
          : `${onlineServices}/${totalServices} freezers online`;
      }

      statusEls.forEach(el => {
        el.className = `status-indicator ${statusClass}`;
        el.setAttribute('title', statusTitle);
        el.setAttribute('aria-label', `Site status: ${statusText}. ${statusTitle}`);
        el.innerHTML = `<span class="indicator-dot ${statusClass}" aria-hidden="true"></span><span>${statusText}</span>`;
      });
    },

    /**
     * Fetch status.json and update indicators
     */
    async refreshStatus() {
      if (document.hidden) return; // Save network/battery when tab is in background

      const paths = getCandidatePaths('static/status.json');
      let data = null;

      for (const p of paths) {
        try {
          const res = await fetch(p, { cache: 'no-store' });
          if (res.ok) {
            data = await res.json();
            break;
          }
        } catch (_) {
          // try next
        }
      }

      if (data) {
        this.updateStatusBar(data);
        return data;
      }

      // Offline / network failure handling
      if (window.location.protocol === 'file:') {
        this.updateStatusBar({ panel: { online: true }, minecraft: { online: true } });
      } else {
        this.updateStatusBar(null);
      }
      return null;
    },

    /**
     * Start background polling and event listeners
     */
    async init() {
      await Promise.all([this.loadHeader(), this.loadFooter()]);
      this.setupPrivacyModal();
      await this.refreshStatus();

      if (!this._pollInterval) {
        this._pollInterval = setInterval(() => this.refreshStatus(), 60000);

        // Immediate check when tab becomes active again
        document.addEventListener('visibilitychange', () => {
          if (!document.hidden) this.refreshStatus();
        });
      }
    },

    /**
     * Privacy & Hosting Popup Modal Handler
     */
    async openPrivacyModal(triggerEl) {
      this._lastFocusedEl = triggerEl || document.activeElement;
      let modal = document.getElementById('privacyModal');

      if (!modal) {
        const html = await fetchFile('components/privacy.html');
        if (html) {
          const wrapper = document.createElement('div');
          wrapper.innerHTML = html.trim();
          modal = wrapper.firstElementChild;
          document.body.appendChild(modal);

          if (window.renderIcons) window.renderIcons(modal);

          // Close event listeners
          const closeBtn = modal.querySelector('#closePrivacyModal');
          const ackBtn = modal.querySelector('#btnAcknowledgePrivacy');
          const backdrop = modal.querySelector('#privacyBackdrop');

          if (closeBtn) closeBtn.addEventListener('click', () => this.closePrivacyModal());
          if (ackBtn) ackBtn.addEventListener('click', () => this.closePrivacyModal());
          if (backdrop) backdrop.addEventListener('click', () => this.closePrivacyModal());
        }
      }

      if (modal) {
        modal.hidden = false;
        document.body.style.overflow = 'hidden';

        const focusTarget = modal.querySelector('#closePrivacyModal, #btnAcknowledgePrivacy');
        if (focusTarget) focusTarget.focus();

        if (!this._escListenerBound) {
          this._escListener = (e) => {
            if (e.key === 'Escape' && modal && !modal.hidden) {
              this.closePrivacyModal();
            }
          };
          document.addEventListener('keydown', this._escListener);
          this._escListenerBound = true;
        }
      }
    },

    closePrivacyModal() {
      const modal = document.getElementById('privacyModal');
      if (modal) {
        modal.hidden = true;
        document.body.style.overflow = '';
      }
      if (this._lastFocusedEl && typeof this._lastFocusedEl.focus === 'function') {
        this._lastFocusedEl.focus();
      }
    },

    setupPrivacyModal() {
      document.addEventListener('click', (e) => {
        const link = e.target.closest('#link-privacy, [data-action="privacy"], a[href*="privacy.html"]');
        if (!link) return;

        // If on standalone privacy.html page, allow normal link or anchor behavior
        const path = (window.location.pathname || '').replace(/\\/g, '/');
        if (path.endsWith('/privacy.html')) return;

        e.preventDefault();
        this.openPrivacyModal(link);
      });
    }
  };

  // Expose globally
  window.SiteLayout = Layout;
  window.SiteComponents = Layout;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Layout.init());
  } else {
    Layout.init();
  }
})();
