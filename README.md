# IsYourRefrigerator.online ❄️

> **Your Freezers. Your Rules.**  
> A privacy-first, community-driven homelab portal for hosting dedicated game servers and services.

---

## Overview

**IsYourRefrigerator.online** is a personal homelab project hosting dedicated game server instances (Project Zomboid, Valheim, Minecraft, The Forest, etc.) and utilities with zero trackers, zero telemetry, and 100% chilled vibes.

- **Stack**: Vanilla HTML5, CSS3, JavaScript
- **Control Panel**: Powered by [Pelican Server Manager](https://pelican.dev)
- **Deployment**: Debian Linux with Nginx reverse proxy & separate server for Docker containerized game servers

---

## Features

- **Live Server Grid**: Status monitoring, specs display, 1-click IP copying, and direct links to dedicated sub-pages.
- **Pelican Showcase & Examples**: Interactive preview modal showcasing the official Pelican web interface.
- **Homelab Infrastructure & Starter Tier**: Integrated Pelican Server Manager spotlight side-by-side with the Free Starter Tier card, plus direct Discord contact.
- **Live System Status Monitoring**: Dynamic real-time probing of game ports and Pelican control panel health, reporting "All Systems Operational", "Degraded Service" (e.g. when the panel is offline), or "Systems Offline".
- **Privacy First & GDPR Compliant**: No cookies, no analytics, no third-party CDNs, locally hosted fonts & assets.
- **Hardware Disclaimer**: Run on actual homelab iron with standard thermal cooling — no real food or refrigerators harmed!

---

## Navigation & Section Flow

1. **01 // Overview** (`#overview`) — Story, feature tags, terminal daemon, quick actions.
2. **02 // Game Servers** (`#servers`) — Live server status cards and specs.
3. **03 // Community** (`#crew`) — The chill community and friends shelf.
4. **04 // Homelab & Infrastructure** (`#hosting`) — Pelican Manager + Starter Tier side-by-side.
5. **Contact** (`#contact`) — Referral note and 1-click Discord handle copy card.

---

## Server Connection & Network Configuration

- **Primary Hostname:** `play.isyourrefrigerator.online`
- **Direct Server IPv4:** `158.101.195.224`
- **Control Panel:** `https://panel.isyourrefrigerator.online`
- **Offline Network Documentation:** See [`NETWORK_INFO.md`](NETWORK_INFO.md) for local hosts configuration, port tables, and direct offline connection steps.

> [!NOTE]
> **Authoritative Server Address**: The active server IP is `158.101.195.224` (or `play.isyourrefrigerator.online`). Any older or prior IP addresses have been retired and are permanently offline.

---

## Project Structure

```text
isyourrefrigerator/
├── index.html                # Main website portal
├── README.md                 # Project documentation & network guide
├── NETWORK_INFO.md           # Offline server IP & port allocation reference
├── llms.txt                  # LLM & AI Search discovery standard (GEO)
├── llms-full.txt             # Comprehensive AI knowledge base
├── robots.txt                # Search engine & AI bot crawler rules
├── sitemap.xml               # Canonical XML sitemap
├── static/
│   ├── images/               # Logos, banners, avatars
│   ├── style/
│   │   ├── stylesheet.css    # Core responsive stylesheet
│   │   ├── header.css        # Modular site header & navigation stylesheet
│   │   ├── footer.css        # Modular site footer & legal links stylesheet
│   │   ├── gate.css          # Access gate & password screen styling
│   │   └── zomboid.css       # Project Zomboid checklist styling
│   ├── layout.js             # Modular site layout (header, footer & legal modal) system
│   ├── script.js             # Client interactivity, dynamic servers & clipboard
│   └── status.json           # Local server status ping data
├── zomboid/
│   ├── index.html            # Dedicated Project Zomboid page & checklist gate
│   └── static/               # Zomboid-specific scripts & item list data (items.js, script.js)
├── valheim/
│   └── index.html            # Valheim server portal
├── minecraft/
│   └── index.html            # Minecraft server portal
└── theforest/
    └── index.html            # The Forest server portal
```

---

## License

Licensed under the [MIT License](LICENSE).
