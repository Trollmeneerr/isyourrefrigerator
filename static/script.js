// =============================================================================
// IsYourRefrigerator.online - Lightweight Native SVG Sprite Loader
// =============================================================================

(() => {
    const FALLBACK_SPRITE = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">
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
                <path d="M6 19v-3M10 19v-3M14 19v-3M18 19v-3"></path>
                <rect x="2" y="5" width="20" height="11" rx="2"></rect>
            </symbol>
            <symbol id="icon-panel" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <path d="M3 9h18M9 21V9"></path>
            </symbol>
        </defs>
    </svg>`;

    async function loadSprite() {
        if (document.getElementById('svg-sprite-container')) return;

        let svgText = FALLBACK_SPRITE;
        if (window.location.protocol.startsWith('http')) {
            try {
                const res = await fetch('static/icons.svg');
                if (res.ok) svgText = await res.text();
            } catch (_) {
                // Uses embedded fallback sprite
            }
        }

        const container = document.createElement('div');
        container.id = 'svg-sprite-container';
        container.style.position = 'absolute';
        container.style.width = '0';
        container.style.height = '0';
        container.style.overflow = 'hidden';
        container.setAttribute('aria-hidden', 'true');
        container.innerHTML = svgText;
        document.body.prepend(container);
    }

    function renderIcons(root = document) {
        root.querySelectorAll('[data-icon]').forEach(el => {
            if (el.querySelector('svg')) return;
            const rawName = el.dataset.icon.replace(/^icon-/, '');
            const symbol = document.getElementById(`icon-${rawName}`) || document.getElementById(rawName);
            if (symbol) {
                const viewBox = symbol.getAttribute('viewBox') || '0 0 24 24';
                const strokeWidth = symbol.getAttribute('stroke-width') || '2';
                const strokeLinecap = symbol.getAttribute('stroke-linecap') || 'round';
                const strokeLinejoin = symbol.getAttribute('stroke-linejoin') || 'round';
                el.innerHTML = `<svg viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="${strokeLinecap}" stroke-linejoin="${strokeLinejoin}" aria-hidden="true">${symbol.innerHTML}</svg>`;
            } else {
                el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#icon-${rawName}"></use></svg>`;
            }
        });
    }

    async function init() {
        await loadSprite();
        renderIcons();
    }

    window.renderIcons = renderIcons;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

// =============================================================================
// IsYourRefrigerator.online - Servers Data
// =============================================================================

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
    },
    {
        id: 'chess',
        name: 'Chess',
        link: 'https://chess.isyourrefrigerator.online',
        subtitle: 'Web • Real-time Multiplayer',
        description: 'Casual and competitive chess matches hosted directly on the web. No port or client installation required — play straight from your browser.',
        managedBy: 'The Refrigerator',
        icon: 'chess',
        isWeb: true,
        host: 'chess.isyourrefrigerator.online',
        ip: 'chess.isyourrefrigerator.online',
        status: 'online',
        statusCheck: { type: 'endpoint', url: 'static/status.json', key: 'chess' },
        specs: [
            { label: 'Platform', value: 'Web Browser' },
            { label: 'Protocol', value: 'HTTPS' },
            { label: 'Type', value: 'PvP Multiplayer' }
        ]
    }
];