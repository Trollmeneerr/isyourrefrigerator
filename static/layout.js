/**
 * ISYOURREFRIGERATOR.ONLINE - SITE LAYOUT & STATUS SYSTEM
 * Location: /static/layout.js
 * 
 * Manages universal site status indicators, reachability checks,
 * and layout status reporting across panel and game nodes.
 */

(function () {
    'use strict';

    const Layout = {
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
                    // Check if any sub-service/freezer is online as proxy for node
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
         * Initialize layout & status polling
         */
        init() {
            this.refreshStatus();
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
