/**
 * Minecraft dedicated server & live map
 * Location: /minecraft/static/script.js
 */

'use strict';

const CONFIG = {
  server: {
    address: 'play.isyourrefrigerator.online:25565',
    directIp: '158.101.195.224:25565'
  },
  statusUrls: ['../static/status.json', '/static/status.json', 'static/status.json'],
  statusKey: 'minecraft'
};

const byId = id => document.getElementById(id);

/* ---------- Copy Interaction ---------- */

function setupCopyHandlers() {
  const setupCopy = (elId, text) => {
    const target = byId(elId);
    if (!target) return;

    const copy = async () => {
      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        console.warn('Clipboard write failed:', err);
        return;
      }
      target.classList.add('copied');
      const span = target.querySelector('.ip-display, .direct-ip-val');
      const orig = target.dataset.originalText || (span ? span.textContent : text);
      target.dataset.originalText = orig;

      if (span) span.textContent = 'Copied!';
      clearTimeout(target._copyTimeout);
      target._copyTimeout = setTimeout(() => {
        target.classList.remove('copied');
        if (span) span.textContent = orig;
      }, 1800);
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

/* ---------- Status Polling ---------- */

async function refreshStatus() {
  if (document.hidden) return; // Skip polling when tab is inactive
  const dot = byId('srvDot');
  const text = byId('srvText');
  if (!dot) return;

  let status = 'unknown';
  let label = 'Unknown';

  for (const url of CONFIG.statusUrls) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const online = Boolean(data[CONFIG.statusKey]?.online);
        status = online ? 'online' : 'offline';
        label = online ? 'Online' : 'Offline';
        break;
      }
    } catch (_) {}
  }

  dot.className = `indicator-dot ${status}`;
  if (text) text.textContent = label;
}

/* ---------- Map Fullscreen Controls ---------- */

function setupMapControls() {
  const fsBtn = byId('btnMapFullscreen');
  const wrapper = byId('mapWrapper');
  if (!fsBtn || !wrapper) return;

  fsBtn.addEventListener('click', () => {
    const isFullscreen = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
    if (!isFullscreen) {
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

/* ---------- Initialize ---------- */

document.addEventListener('DOMContentLoaded', () => {
  setupCopyHandlers();
  setupMapControls();
  refreshStatus();

  setInterval(refreshStatus, 60000);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) refreshStatus();
  });
});
