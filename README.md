# IsYourRefrigerator.online

> **Your Freezers. Your Rules.**  
> Self-hosted game servers, homelab infrastructure, and live services managed by The Refrigerator.

---

## ❄️ Overview

**IsYourRefrigerator.online** is a fast, lightweight, and modern web hub for self-hosted dedicated game servers ("Freezers") and homelab infrastructure. It features live server reachability status, dedicated instance dashboards, interactive checklists for Project Zomboid, a live dynamic world map for Minecraft, and direct Pelican Panel integration.

---

## ⚡ Key Highlights & Architecture

- **Zero-CLS Component Architecture**: Pre-rendered semantic header and footer elements ensure instant rendering with zero Cumulative Layout Shift (CLS), enhanced dynamically by `layout.js`.
- **Modern CSS Custom Properties (`:root`)**: Standardized design system tokens for colors, typography, elevations, transitions, and breakpoints.
- **Shared Component Styling**: Subpages (`/minecraft`, `/zomboid`) inherit shared server cards, connection buttons, and status indicators directly from `/static/style/stylesheet.css`, eliminating hundreds of lines of duplicate CSS.
- **Visibility-Aware Polling**: Periodic status polling automatically pauses when the browser tab is hidden to conserve network bandwidth and client battery life.
- **Accessible & Responsive**: Fully keyboard-accessible controls (`Tab`, `Enter`, `Space`) with visual and screen-reader copy confirmations (`aria-live="polite"`), fluid typography (`clamp()`), and adaptive mobile breakpoints.
- **Lightweight & Native**: Zero build tools or heavy framework dependencies required. Built with clean, modern HTML5, CSS3, and vanilla JavaScript (ES2022+).

---

## 📁 Repository Structure

```text
isyourrefrigerator/
├── index.html                  # Main homepage (Overview, Principles, Freezers, Crew, Hosting)
├── privacy.html                # Standalone Privacy & Hosting Policy page
├── components/
│   ├── header.html             # Modular site header component template
│   ├── footer.html             # Modular site footer component template
│   └── privacy.html            # Privacy & Hosting modal popup component template
├── static/
│   ├── font/
│   │   └── league-spartan.bold.otf # Custom headline font
│   ├── icons.svg               # Optimized SVG symbol sprite library
│   ├── images/                 # Optimized brand logos, avatars, and media assets
│   ├── layout.js               # Global layout controller, nav logic, and status monitor
│   ├── script.js               # Homepage interactivity, sprite loader, and dynamic cards
│   ├── status.json             # Live service reachability data endpoint
│   └── style/
│       ├── stylesheet.css      # Core site stylesheet and shared design system
│       ├── header.css          # Modular header styles
│       └── footer.css          # Modular footer styles
├── minecraft/
│   ├── index.html              # Dedicated Minecraft freezer page
│   └── static/
│       ├── script.js           # Server address copy & interactive live map controls
│       └── stylesheet.css      # Map container and iframe styles
└── zomboid/
    ├── index.html              # Dedicated Project Zomboid freezer page
    └── static/
        ├── items.js            # Build 42 checklist item definitions
        ├── script.js           # Password gate auth, EventSource live sync, and filters
        └── stylesheet.css      # Password gate modal and checklist column layouts
```

---

## 🚀 Running Locally

Because the project is built with standard web technologies, it can be served using any local static file server:

### Using Python:
```bash
python -m http.server 8080
```

### Using Node.js:
```bash
npx serve .
```

Open [http://localhost:8080](http://localhost:8080) in your web browser.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
