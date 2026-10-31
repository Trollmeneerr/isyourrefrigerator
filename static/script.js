/**
 * ISYOURREFRIGERATOR.ONLINE - CORE INTERACTIVITY & HOMEPAGE LOGIC
 * Location: /static/script.js
 * 
 * Manages native SVG sprite icon rendering, accessible clipboard copy,
 * dynamic freezer card generation, and interactive homelab controls.
 */

'use strict';

// =============================================================================
// 1. Unified SVG Sprite & Icon Loader
// =============================================================================

const SPRITE_FALLBACK = window.SPRITE_FALLBACK || "<svg xmlns=\"http://www.w3.org/2000/svg\" style=\"display:none\" aria-hidden=\"true\"><defs><!-- Freezer Panel Icon --> <symbol id=\"icon-freezer\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <rect x=\"2\" y=\"2\" width=\"20\" height=\"8\" rx=\"2\" ry=\"2\"></rect> <rect x=\"2\" y=\"14\" width=\"20\" height=\"8\" rx=\"2\" ry=\"2\"></rect> <line x1=\"6\" y1=\"6\" x2=\"6.01\" y2=\"6\"></line> <line x1=\"6\" y1=\"18\" x2=\"6.01\" y2=\"18\"></line> </symbol> <!-- Terminal Prompt Icon --> <symbol id=\"icon-terminal-prompt\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <polyline points=\"4 17 10 12 4 7\"></polyline> <line x1=\"12\" y1=\"19\" x2=\"20\" y2=\"19\"></line> </symbol> <symbol id=\"icon-terminal\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <polyline points=\"4 17 10 12 4 7\"></polyline> <line x1=\"12\" y1=\"19\" x2=\"20\" y2=\"19\"></line> </symbol> <!-- Terminal Window Minimize Button --> <symbol id=\"icon-min\" viewBox=\"0 0 10 10\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\"> <line x1=\"1\" y1=\"5\" x2=\"9\" y2=\"5\"></line> </symbol> <!-- Terminal Window Maximize / Expand Button --> <symbol id=\"icon-expand\" viewBox=\"0 0 10 10\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <rect x=\"1.5\" y=\"1.5\" width=\"7\" height=\"7\" rx=\"1\"></rect> </symbol> <!-- Terminal Window Close Button --> <symbol id=\"icon-close\" viewBox=\"0 0 10 10\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\"> <line x1=\"1.5\" y1=\"1.5\" x2=\"8.5\" y2=\"8.5\"></line> <line x1=\"8.5\" y1=\"1.5\" x2=\"1.5\" y2=\"8.5\"></line> </symbol> <!-- Gamepad / Game Freezers Icon --> <symbol id=\"icon-game\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <line x1=\"6\" y1=\"12\" x2=\"10\" y2=\"12\"></line> <line x1=\"8\" y1=\"10\" x2=\"8\" y2=\"14\"></line> <line x1=\"15\" y1=\"13\" x2=\"15.01\" y2=\"13\"></line> <line x1=\"18\" y1=\"11\" x2=\"18.01\" y2=\"11\"></line> <rect x=\"2\" y=\"6\" width=\"20\" height=\"12\" rx=\"2\"></rect> </symbol> <!-- Lightning / Hosting Icon --> <symbol id=\"icon-lightning\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <polygon points=\"13 2 3 14 12 14 11 22 21 10 12 10 13 2\"></polygon> </symbol> <!-- Picture / Screenshot Examples Icon --> <symbol id=\"icon-pic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect> <circle cx=\"8.5\" cy=\"8.5\" r=\"1.5\"></circle> <polyline points=\"21 15 16 10 5 21\"></polyline> </symbol> <!-- Open External Link Icon --> <symbol id=\"icon-open\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"></path> <polyline points=\"15 3 21 3 21 9\"></polyline> <line x1=\"10\" y1=\"14\" x2=\"21\" y2=\"3\"></line> </symbol> <!-- Arrow Up-Right / Open Link Icon --> <symbol id=\"icon-open-link\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <line x1=\"7\" y1=\"17\" x2=\"17\" y2=\"7\"></line> <polyline points=\"7 7 17 7 17 17\"></polyline> </symbol> <symbol id=\"open-link\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <line x1=\"7\" y1=\"17\" x2=\"17\" y2=\"7\"></line> <polyline points=\"7 7 17 7 17 17\"></polyline> </symbol> <!-- Shield / Privacy & Legal Icon --> <symbol id=\"icon-shield\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\"></path> </symbol> <!-- CPU Specification Icon --> <symbol id=\"icon-cpu\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\"></rect> <rect x=\"9\" y=\"9\" width=\"6\" height=\"6\"></rect> <line x1=\"9\" y1=\"1\" x2=\"9\" y2=\"4\"></line> <line x1=\"15\" y1=\"1\" x2=\"15\" y2=\"4\"></line> <line x1=\"9\" y1=\"20\" x2=\"9\" y2=\"23\"></line> <line x1=\"15\" y1=\"20\" x2=\"15\" y2=\"23\"></line> <line x1=\"20\" y1=\"9\" x2=\"23\" y2=\"9\"></line> <line x1=\"20\" y1=\"14\" x2=\"23\" y2=\"14\"></line> <line x1=\"1\" y1=\"9\" x2=\"4\" y2=\"9\"></line> <line x1=\"1\" y1=\"14\" x2=\"4\" y2=\"14\"></line> </symbol> <!-- RAM Specification Icon --> <symbol id=\"icon-ram\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <path d=\"M6 19v-3\"></path> <path d=\"M10 19v-3\"></path> <path d=\"M14 19v-3\"></path> <path d=\"M18 19v-3\"></path> <rect x=\"2\" y=\"5\" width=\"20\" height=\"11\" rx=\"2\"></rect> </symbol> <!-- Panel / Storage Icon --> <symbol id=\"icon-panel\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"></rect> <path d=\"M3 9h18\"></path> <path d=\"M9 21V9\"></path> </symbol> <!-- Minecraft Cube / Block Icon --> <symbol id=\"icon-blocks\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <rect x=\"3\" y=\"3\" width=\"7\" height=\"7\"></rect> <rect x=\"14\" y=\"3\" width=\"7\" height=\"7\"></rect> <rect x=\"14\" y=\"14\" width=\"7\" height=\"7\"></rect> <rect x=\"3\" y=\"14\" width=\"7\" height=\"7\"></rect> </symbol> <!-- Server Management / Document Lines Badge Icon --> <symbol id=\"icon-server-management\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"3\"></rect> <line x1=\"7\" y1=\"8\" x2=\"17\" y2=\"8\"></line> <line x1=\"7\" y1=\"12\" x2=\"17\" y2=\"12\"></line> <line x1=\"7\" y1=\"16\" x2=\"13\" y2=\"16\"></line> </symbol> <!-- CPU Core Icon --> <symbol id=\"icon-cpu-core\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"></rect> <rect x=\"8\" y=\"8\" width=\"8\" height=\"8\" rx=\"1\"></rect> </symbol> <!-- RAM Layers Icon --> <symbol id=\"icon-ram-layers\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <polygon points=\"12 2 2 7 12 12 22 7 12 2\"></polygon> <polyline points=\"2 17 12 22 22 17\"></polyline> <polyline points=\"2 12 12 17 22 12\"></polyline> </symbol> <!-- Backups / Clock History Icon --> <symbol id=\"icon-panel-backups\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <circle cx=\"12\" cy=\"12\" r=\"10\"></circle> <polyline points=\"12 6 12 12 16 14\"></polyline> </symbol> <!-- Referral / User Plus Icon --> <symbol id=\"icon-user-plus\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"></path> <circle cx=\"9\" cy=\"7\" r=\"4\"></circle> <line x1=\"19\" y1=\"8\" x2=\"19\" y2=\"14\"></line> <line x1=\"22\" y1=\"11\" x2=\"16\" y2=\"11\"></line> </symbol> <!-- Discord Icon --> <symbol id=\"icon-discord\" viewBox=\"0 0 24 24\" fill=\"currentColor\"> <path d=\"M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z\"></path> </symbol> <!-- Copy Icon --> <symbol id=\"icon-copy\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"></rect> <path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"></path> </symbol> <!-- Checkmark Icon --> <symbol id=\"icon-check\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <polyline points=\"20 6 9 17 4 12\"></polyline> </symbol> <!-- Navigation Back / Arrow Left Icon --> <symbol id=\"icon-arrow-left\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <line x1=\"19\" y1=\"12\" x2=\"5\" y2=\"12\"></line> <polyline points=\"12 19 5 12 12 5\"></polyline> </symbol> <symbol id=\"icon-back\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <line x1=\"19\" y1=\"12\" x2=\"5\" y2=\"12\"></line> <polyline points=\"12 19 5 12 12 5\"></polyline> </symbol> <!-- Arrow Right / Unlock Icon --> <symbol id=\"icon-arrow-right\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"></line> <polyline points=\"12 5 19 12 12 19\"></polyline> </symbol> <!-- Minecraft Isometric Cube / Server Icon --> <symbol id=\"icon-cube\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <path d=\"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\"></path> <polyline points=\"3.27 6.96 12 12.01 20.73 6.96\"></polyline> <line x1=\"12\" y1=\"22.08\" x2=\"12\" y2=\"12\"></line> </symbol> <symbol id=\"icon-server-cube\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <path d=\"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\"></path> <polyline points=\"3.27 6.96 12 12.01 20.73 6.96\"></polyline> <line x1=\"12\" y1=\"22.08\" x2=\"12\" y2=\"12\"></line> </symbol> <symbol id=\"icon-box\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <path d=\"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\"></path> <polyline points=\"3.27 6.96 12 12.01 20.73 6.96\"></polyline> <line x1=\"12\" y1=\"22.08\" x2=\"12\" y2=\"12\"></line> </symbol> <!-- Download File / Modpack Icon --> <symbol id=\"icon-download\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"></path> <polyline points=\"7 10 12 15 17 10\"></polyline> <line x1=\"12\" y1=\"15\" x2=\"12\" y2=\"3\"></line> </symbol> <!-- Map / Folded Map Icon --> <symbol id=\"icon-map\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <polygon points=\"1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6\"></polygon> <line x1=\"8\" y1=\"2\" x2=\"8\" y2=\"18\"></line> <line x1=\"16\" y1=\"6\" x2=\"16\" y2=\"22\"></line> </symbol> <!-- Fullscreen / Expand Window Icon --> <symbol id=\"icon-fullscreen\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <path d=\"M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3\"></path> </symbol> <!-- Padlock / Security Gate Icon --> <symbol id=\"icon-lock\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" ry=\"2\"></rect> <path d=\"M7 11V7a5 5 0 0 1 10 0v4\"></path> </symbol> <!-- Crosshair / Zomboid Server Icon --> <symbol id=\"icon-crosshair\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <path d=\"M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83\"></path> </symbol> <!-- Search Magnifier Icon --> <symbol id=\"icon-search\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <circle cx=\"11\" cy=\"11\" r=\"8\"></circle> <line x1=\"21\" y1=\"21\" x2=\"16.65\" y2=\"16.65\"></line> </symbol> <!-- Filter / Sliders Icon --> <symbol id=\"icon-filter\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <line x1=\"4\" y1=\"21\" x2=\"4\" y2=\"14\"></line> <line x1=\"4\" y1=\"10\" x2=\"4\" y2=\"3\"></line> <line x1=\"12\" y1=\"21\" x2=\"12\" y2=\"12\"></line> <line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"3\"></line> <line x1=\"20\" y1=\"21\" x2=\"20\" y2=\"16\"></line> <line x1=\"20\" y1=\"12\" x2=\"20\" y2=\"3\"></line> <line x1=\"1\" y1=\"14\" x2=\"7\" y2=\"14\"></line> <line x1=\"9\" y1=\"8\" x2=\"15\" y2=\"8\"></line> <line x1=\"17\" y1=\"16\" x2=\"23\" y2=\"16\"></line> </symbol> <symbol id=\"icon-sliders\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <line x1=\"4\" y1=\"21\" x2=\"4\" y2=\"14\"></line> <line x1=\"4\" y1=\"10\" x2=\"4\" y2=\"3\"></line> <line x1=\"12\" y1=\"21\" x2=\"12\" y2=\"12\"></line> <line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"3\"></line> <line x1=\"20\" y1=\"21\" x2=\"20\" y2=\"16\"></line> <line x1=\"20\" y1=\"12\" x2=\"20\" y2=\"3\"></line> <line x1=\"1\" y1=\"14\" x2=\"7\" y2=\"14\"></line> <line x1=\"9\" y1=\"8\" x2=\"15\" y2=\"8\"></line> <line x1=\"17\" y1=\"16\" x2=\"23\" y2=\"16\"></line> </symbol> <!-- Reset / Rotate Counter-Clockwise Icon --> <symbol id=\"icon-reset\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <polyline points=\"1 4 1 10 7 10\"></polyline> <path d=\"M3.51 15a9 9 0 1 0 2.13-9.36L1 10\"></path> </symbol> <symbol id=\"icon-rotate-ccw\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <polyline points=\"1 4 1 10 7 10\"></polyline> <path d=\"M3.51 15a9 9 0 1 0 2.13-9.36L1 10\"></path> </symbol> <!-- Chevron Down Icon --> <symbol id=\"icon-chevron-down\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <polyline points=\"6 9 12 15 18 9\"></polyline> </symbol> <!-- Close X Icon (24x24) --> <symbol id=\"icon-x\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"></line> <line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"></line> </symbol> <symbol id=\"icon-close-lg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"> <line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"></line> <line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"></line> </symbol></defs></svg>";

const loadSprite = window.loadSprite || async function() {
  if (document.getElementById('svg-sprite-container')) return;

  const candidatePaths = ['static/icons.svg', '../static/icons.svg', '/static/icons.svg'];
  let svgContent = null;

  for (const p of candidatePaths) {
    try {
      const res = await fetch(p);
      if (res.ok) {
        svgContent = await res.text();
        break;
      }
    } catch (_) {}
  }

  const container = document.createElement('div');
  container.id = 'svg-sprite-container';
  container.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;';
  container.setAttribute('aria-hidden', 'true');
  container.innerHTML = svgContent || SPRITE_FALLBACK;
  if (document.body) document.body.prepend(container);
};

const renderIcons = window.renderIcons || function(root = document) {
  if (!root) return;
  root.querySelectorAll('[data-icon]').forEach(el => {
    const rawName = el.dataset.icon.replace(/^icon-/, '');
    if (el.dataset.renderedIcon === rawName && el.querySelector('svg')) return;

    const symbol = document.getElementById(`icon-${rawName}`) || document.getElementById(rawName);
    if (symbol) {
      const viewBox = symbol.getAttribute('viewBox') || '0 0 24 24';
      const fill = symbol.getAttribute('fill') || 'none';
      const stroke = symbol.getAttribute('stroke') || (fill === 'none' ? 'currentColor' : 'none');
      const strokeWidth = symbol.getAttribute('stroke-width') || (stroke === 'none' ? '0' : '2');
      const strokeLinecap = symbol.getAttribute('stroke-linecap') || 'round';
      const strokeLinejoin = symbol.getAttribute('stroke-linejoin') || 'round';
      el.innerHTML = `<svg viewBox="${viewBox}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="${strokeLinecap}" stroke-linejoin="${strokeLinejoin}" aria-hidden="true">${symbol.innerHTML}</svg>`;
      el.dataset.renderedIcon = rawName;
    } else {
      el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#icon-${rawName}"></use></svg>`;
      el.dataset.renderedIcon = rawName;
    }
  });
};

window.renderIcons = renderIcons;
window.loadSprite = loadSprite;

// =============================================================================
// 2. Accessible Clipboard Copy System
// =============================================================================

async function copyToClipboard(text, buttonEl, successText = 'Copied!') {
  if (!text || !buttonEl) return;
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.warn('Clipboard write failed:', err);
    return;
  }

  buttonEl.classList.add('copied');
  const textEl = buttonEl.querySelector('.btn-copy-text, .btn-text') || buttonEl;
  const originalText = buttonEl.dataset.originalText || textEl.textContent;
  if (!buttonEl.dataset.originalText) {
    buttonEl.dataset.originalText = originalText;
  }

  textEl.textContent = successText;

  const iconEl = buttonEl.querySelector('.icon');
  if (iconEl) {
    iconEl.setAttribute('data-icon', 'check');
    renderIcons(buttonEl);
  }

  if (window.showCopiedToast) {
    window.showCopiedToast(text);
  }

  clearTimeout(buttonEl._copyTimeout);
  buttonEl._copyTimeout = setTimeout(() => {
    buttonEl.classList.remove('copied');
    textEl.textContent = buttonEl.dataset.originalText;
    if (iconEl) {
      iconEl.setAttribute('data-icon', 'copy');
      renderIcons(buttonEl);
    }
  }, 1800);
}

// =============================================================================
// 3. Homepage Freezers Data & Card Rendering
// =============================================================================

const FREEZERS = [
  {
    id: 'minecraft-26-3',
    name: 'Minecraft 26.3',
    link: '/minecraft/',
    linkLabel: 'Freezer Page & Live Map',
    subtitle: 'Paper Survival • Dedicated PvE',
    description: 'Paper survival freezer running the latest updates. Explore the realm, build together, and track player activity on the live world map.',
    managedBy: 'The Refrigerator',
    ip: 'play.isyourrefrigerator.online:25565',
    status: 'online',
    statusKey: 'minecraft',
    specs: [
      { label: 'CPU', value: 'i5-10300H 2 Threads' },
      { label: 'RAM', value: 'DDR4 4GB' },
      { label: 'DISK', value: '50GB SSD' }
    ]
  },
  {
    id: 'project-zomboid',
    name: 'Project Zomboid',
    link: '/zomboid/',
    linkLabel: 'Freezer Page & Checklists',
    subtitle: 'Build 42 • Modded Survival PvE',
    description: "Subzero zombie apocalypse with curated QoL mods, tuned loot respawn rates, and co-op multiplayer. Don't forget your can opener.",
    managedBy: 'BataTheBear',
    ip: 'play.isyourrefrigerator.online:16261',
    status: 'offline',
    statusKey: 'zomboid',
    specs: [
      { label: 'CPU', value: 'I7-6700k 4 Cores' },
      { label: 'RAM', value: 'DDR4 16GB' },
      { label: 'DISK', value: '512GB SSD' }
    ]
  },
  {
    id: 'valheim',
    name: 'Valheim',
    link: null,
    subtitle: 'Co-op Survival',
    description: 'A brutal exploration and survival game set in a procedurally generated purgatory for Vikings.',
    managedBy: 'The Refrigerator',
    ip: 'play.isyourrefrigerator.online:16287',
    status: 'offline',
    statusKey: 'valheim',
    specs: [
      { label: 'CPU', value: 'i5-10300H 3 Threads' },
      { label: 'RAM', value: 'DDR4 6GB' },
      { label: 'DISK', value: '50GB SSD' }
    ]
  },
  {
    id: 'the-forest',
    name: 'The Forest',
    link: null,
    subtitle: 'Co-op Survival',
    description: 'Build, explore, and survive on a mysterious peninsula filled with dangerous mutants and cannibals.',
    managedBy: 'The Refrigerator',
    ip: 'play.isyourrefrigerator.online:16291',
    status: 'offline',
    statusKey: 'forest',
    specs: [
      { label: 'CPU', value: 'i5-10300H 3 Threads' },
      { label: 'RAM', value: 'DDR4 6GB' },
      { label: 'DISK', value: '50GB SSD' }
    ]
  }
];

let isAllServersShown = false;

function renderFreezersCards(showAll = false) {
  const container = document.getElementById('freezers-boxes');
  if (!container) return;
  container.innerHTML = '';

  // Online servers first
  const sorted = [...FREEZERS].sort((a, b) => {
    if (a.status === 'online' && b.status !== 'online') return -1;
    if (a.status !== 'online' && b.status === 'online') return 1;
    return 0;
  });

  const toRender = showAll ? sorted : sorted.slice(0, 2);

  toRender.forEach((freezer, index) => {
    const card = document.createElement('article');
    card.className = `freezers-box box server-${index + 1}`;
    const cleanIp = freezer.ip.replace(/^#\s*/, '');

    const subpageAction = freezer.link ? `
      <a href="${freezer.link}" class="freezer-subpage-link" title="Open ${freezer.name} page">
        <span class="icon" data-icon="open-link"></span>
        <span>${freezer.linkLabel || 'View Details'}</span>
      </a>
    ` : '';

    card.innerHTML = `
      <div class="freezer-header">
        <h3 class="freezer-name">${freezer.name}</h3>
        <span class="freezer-status ${freezer.status}">
          <span class="indicator-dot ${freezer.status}"></span>${freezer.status}
        </span>
      </div>
      <div class="freezer-body">
        <h4 class="freezer-subtitle">${freezer.subtitle}</h4>
        <p class="freezer-description">${freezer.description}</p>
        <div class="freezer-managed">Managed by ${freezer.managedBy}</div>
      </div>
      <div class="freezer-specs">
        ${freezer.specs.map(s => `<span>${s.label}: ${s.value}</span>`).join('')}
      </div>
      <div class="freezer-footer">
        ${subpageAction}
        <button type="button" class="freezer-ip" data-copy="${cleanIp}" title="Click to copy server hostname" aria-label="Copy server hostname: ${cleanIp}">
          <span>${cleanIp}</span>
        </button>
      </div>
    `;
    container.appendChild(card);
  });

  // Always show Request card
  const requestCard = document.createElement('article');
  requestCard.className = 'freezers-box box request-box';
  requestCard.innerHTML = `
    <div class="freezer-header">
      <h3 class="freezer-name">Request a Freezer</h3>
      <span class="freezer-status available">
        <span class="indicator-dot available"></span>Available
      </span>
    </div>
    <div class="freezer-body">
      <h4 class="freezer-subtitle">Custom Game Server</h4>
      <p class="freezer-description">Want a specific game or modpack running in the freezer? Contact me to request and spin up a dedicated instance.</p>
      <div class="freezer-managed">Managed by The Refrigerator</div>
    </div>
    <div class="freezer-specs">
      <span>CPU: Ryzen 9 5900X</span>
      <span>RAM: 24GB</span>
      <span>Disk: 512GB SSD</span>
    </div>
    <div class="freezer-footer">
      <a class="freezer-ip" href="#hosting" title="Learn more about hosting options">
        <span>See hosting options &rarr;</span>
      </a>
    </div>
  `;
  container.appendChild(requestCard);

  renderIcons(container);
}

async function updateFreezersStatus() {
  if (!window.SiteLayout) return;
  const statusData = await window.SiteLayout.refreshStatus();
  if (statusData) {
    FREEZERS.forEach(freezer => {
      const key = freezer.statusKey || freezer.id;
      if (statusData[key] !== undefined) {
        freezer.status = statusData[key].online ? 'online' : 'offline';
      }
    });
  }
  renderFreezersCards(isAllServersShown);
}

function updateToggleServersButton() {
  const btn = document.getElementById('btn-view-freezers');
  if (!btn) return;
  const textSpan = btn.querySelector('.btn-text');
  const label = isAllServersShown ? 'Show Less' : 'View All Freezers';

  if (textSpan) {
    textSpan.textContent = label;
  }
  btn.setAttribute('aria-expanded', String(isAllServersShown));
  btn.setAttribute('title', label);
}

function setupToggleServers() {
  const btn = document.getElementById('btn-view-freezers');
  if (!btn || btn.dataset.initialized) return;
  btn.dataset.initialized = 'true';

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    isAllServersShown = !isAllServersShown;
    renderFreezersCards(isAllServersShown);
    updateToggleServersButton();

    if (!isAllServersShown) {
      const section = document.getElementById('freezers');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

function setupHomepageInteractions() {
  // Discord copy button
  const copyDiscordBtn = document.getElementById('btn-copy-discord');
  if (copyDiscordBtn) {
    copyDiscordBtn.addEventListener('click', () => {
      const copyVal = copyDiscordBtn.getAttribute('data-copy') || 'Trollmeneerr';
      copyToClipboard(copyVal, copyDiscordBtn, 'Copied!');
    });
  }

  // Tier selection smooth scroll
  const chooseTierBtn = document.getElementById('btn-choose-tier');
  if (chooseTierBtn) {
    chooseTierBtn.addEventListener('click', (e) => {
      const contactCard = document.getElementById('contact');
      if (contactCard) {
        e.preventDefault();
        contactCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        contactCard.classList.add('highlight-pulse');
        setTimeout(() => contactCard.classList.remove('highlight-pulse'), 1500);
      }
    });
  }

  // Delegated IP copying for freezer cards
  document.addEventListener('click', (e) => {
    const ipBtn = e.target.closest('.freezer-ip');
    if (!ipBtn || ipBtn.tagName === 'A') return;

    const copyText = ipBtn.getAttribute('data-copy') || ipBtn.textContent.trim();
    if (copyText) {
      copyToClipboard(copyText, ipBtn, 'Copied!');
    }
  });
}

// =============================================================================
// 4. App Initialization
// =============================================================================

async function initApp() {
  await loadSprite();
  renderIcons();

  // Run homepage-specific features only when on homepage
  if (document.getElementById('freezers-boxes')) {
    setupToggleServers();
    setupHomepageInteractions();
    await updateFreezersStatus();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
