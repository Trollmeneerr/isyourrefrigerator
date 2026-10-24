// =============================================================================
// IsYourRefrigerator.online - Dynamic SVG Icon Loader & Interactive Scripts
// =============================================================================

(function () {
    const iconCache = new Map();
    let iconsLoaded = false;
    let fetchPromise = null;

    // Embedded fallback sprite so icons load reliably even when opened via file:// protocol
    const FALLBACK_SPRITE = `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
        <defs>
            <symbol id="icon-server" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                <line x1="6" y1="6" x2="6.01" y2="6"></line>
                <line x1="6" y1="18" x2="6.01" y2="18"></line>
            </symbol>
            <symbol id="icon-terminal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="4 17 10 12 4 7"></polyline>
                <line x1="12" y1="19" x2="20" y2="19"></line>
            </symbol>
            <symbol id="icon-terminal-prompt" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="4 17 10 12 4 7"></polyline>
                <line x1="12" y1="19" x2="20" y2="19"></line>
            </symbol>
            <symbol id="icon-min" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
                <line x1="1" y1="5" x2="9" y2="5"></line>
            </symbol>
            <symbol id="icon-expand" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1.5" y="1.5" width="7" height="7" rx="1"></rect>
            </symbol>
            <symbol id="icon-close" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
                <line x1="1.5" y1="1.5" x2="8.5" y2="8.5"></line>
                <line x1="8.5" y1="1.5" x2="1.5" y2="8.5"></line>
            </symbol>
            <symbol id="icon-game" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="6" y1="12" x2="10" y2="12"></line>
                <line x1="8" y1="10" x2="8" y2="14"></line>
                <line x1="15" y1="13" x2="15.01" y2="13"></line>
                <line x1="18" y1="11" x2="18.01" y2="11"></line>
                <rect x="2" y="6" width="20" height="12" rx="2"></rect>
            </symbol>
            <symbol id="icon-lightning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </symbol>
            <symbol id="icon-pic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
            </symbol>
            <symbol id="icon-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
            </symbol>
            <symbol id="icon-open-link" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
            </symbol>
            <symbol id="open-link" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
            </symbol>
            <symbol id="icon-shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </symbol>
            <symbol id="icon-cpu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="4" y="4" width="16" height="16" rx="2"></rect>
                <rect x="9" y="9" width="6" height="6"></rect>
                <line x1="9" y1="1" x2="9" y2="4"></line>
                <line x1="15" y1="1" x2="15" y2="4"></line>
                <line x1="9" y1="20" x2="9" y2="23"></line>
                <line x1="15" y1="20" x2="15" y2="23"></line>
                <line x1="20" y1="9" x2="23" y2="9"></line>
                <line x1="20" y1="14" x2="23" y2="14"></line>
                <line x1="1" y1="9" x2="4" y2="9"></line>
                <line x1="1" y1="14" x2="4" y2="14"></line>
            </symbol>
            <symbol id="icon-ram" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 19v-3"></path>
                <path d="M10 19v-3"></path>
                <path d="M14 19v-3"></path>
                <path d="M18 19v-3"></path>
                <rect x="2" y="5" width="20" height="11" rx="2"></rect>
            </symbol>
            <symbol id="icon-panel" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <path d="M3 9h18"></path>
                <path d="M9 21V9"></path>
            </symbol>
        </defs>
    </svg>`;

    /**
     * Populate cache from SVG XML text.
     */
    function parseAndCacheSymbols(svgText) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const symbols = xmlDoc.querySelectorAll('symbol, [id]');

        symbols.forEach(symbol => {
            const id = symbol.id;
            if (!id) return;

            // Raw ID
            iconCache.set(id, symbol);

            // Normalized short ID without 'icon-' prefix
            if (id.startsWith('icon-')) {
                iconCache.set(id.substring(5), symbol);
            } else {
                iconCache.set(`icon-${id}`, symbol);
            }
        });

        // Also inject into DOM once if not already present
        if (!document.getElementById('svg-sprite-container')) {
            const spriteContainer = document.createElement('div');
            spriteContainer.id = 'svg-sprite-container';
            spriteContainer.style.display = 'none';
            spriteContainer.setAttribute('aria-hidden', 'true');
            spriteContainer.innerHTML = svgText;
            document.body.insertBefore(spriteContainer, document.body.firstChild);
        }

        iconsLoaded = true;
    }

    /**
     * Fetch the central SVG sprite file or fall back to embedded sprite.
     */
    async function fetchIconSprite() {
        if (fetchPromise) return fetchPromise;

        const candidatePaths = [
            'static/icons.svg',
            '/static/icons.svg',
            '../static/icons.svg'
        ];

        fetchPromise = (async () => {
            let svgText = null;

            // Only attempt fetch if running over HTTP/HTTPS
            if (window.location.protocol.startsWith('http')) {
                for (const path of candidatePaths) {
                    try {
                        const response = await fetch(path);
                        if (response.ok) {
                            svgText = await response.text();
                            break;
                        }
                    } catch (_) {
                        // Candidate failed, proceed to next
                    }
                }
            }

            // Fallback for file:// protocol or offline environments
            if (!svgText) {
                svgText = FALLBACK_SPRITE;
            }

            parseAndCacheSymbols(svgText);
            renderIcons();
        })();

        return fetchPromise;
    }

    /**
     * Create an inline <svg> clone element from a cached <symbol>.
     */
    function createSvgFromSymbol(symbol) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', symbol.getAttribute('viewBox') || '0 0 24 24');

        const inheritedAttributes = [
            'fill',
            'stroke',
            'stroke-width',
            'stroke-linecap',
            'stroke-linejoin'
        ];

        inheritedAttributes.forEach(attr => {
            if (symbol.hasAttribute(attr)) {
                svg.setAttribute(attr, symbol.getAttribute(attr));
            }
        });

        svg.innerHTML = symbol.innerHTML;
        return svg;
    }

    /**
     * Resolve icon key from an element via data-icon, data-svg, id, or icon-* class.
     */
    function resolveIconKey(el) {
        if (el.dataset.icon) return el.dataset.icon;
        if (el.dataset.svg) return el.dataset.svg;

        // Check if element's id directly matches an icon
        if (el.id && iconCache.has(el.id)) {
            return el.id;
        }

        // Check classes like 'icon-game', 'server-icon', etc.
        for (const cls of el.classList) {
            if (cls.startsWith('icon-') && iconCache.has(cls)) {
                return cls;
            }
            if (iconCache.has(cls)) {
                return cls;
            }
        }

        return null;
    }

    /**
     * Scan DOM and render SVGs into all requesting elements.
     */
    function renderIcons(root = document) {
        if (!iconsLoaded) return;

        const targets = root.querySelectorAll('[data-icon], [data-svg], .icon, .terminal-btn, .terminal-title-icon');

        targets.forEach(el => {
            if (el.querySelector('svg') || (el.tagName.toLowerCase() === 'svg' && el.innerHTML.trim().length > 0)) {
                return;
            }

            const iconKey = resolveIconKey(el);
            if (!iconKey) return;

            const symbol = iconCache.get(iconKey);
            if (!symbol) return;

            if (el.tagName.toLowerCase() === 'svg') {
                el.setAttribute('viewBox', symbol.getAttribute('viewBox') || '0 0 24 24');
                ['fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin'].forEach(attr => {
                    if (symbol.hasAttribute(attr)) el.setAttribute(attr, symbol.getAttribute(attr));
                });
                el.innerHTML = symbol.innerHTML;
            } else {
                el.innerHTML = '';
                el.appendChild(createSvgFromSymbol(symbol));
            }
        });
    }

    // Expose global APIs
    window.renderIcons = renderIcons;
    window.loadIcons = fetchIconSprite;

    // Initialize on DOM load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fetchIconSprite);
    } else {
        fetchIconSprite();
    }
})();
