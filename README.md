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
- **Homelab Rental & Tiers**: Transparent hardware specifications with quick Discord contact actions.
- **Privacy First & GDPR Compliant**: No cookies, no analytics, no third-party CDNs, locally hosted fonts & assets.
- **Hardware Disclaimer**: Run on actual homelab iron with standard thermal cooling — no real food or refrigerators harmed!

---

## Project Structure

```text
isyourrefrigerator/
├── index.nginx-debian.html   # Main website portal
├── README.md                 # Project documentation
├── static/
│   ├── images/               # Logos, banners, avatars
│   ├── style/
│   │   └── stylesheet.css    # Core responsive stylesheet
│   ├── script.js             # Client interactivity, dynamic servers & clipboard
│   └── status.json           # Local server status ping data
├── zomboid/
│   ├── index.html            # Dedicated Project Zomboid page & checklist gate
│   └── static/               # Zomboid-specific scripts, styles & item data
├── valheim/
│   └── index.html            # Valheim server portal (under construction)
├── minecraft/
│   └── index.html            # Minecraft server portal (under construction)
└── theforest/
    └── index.html            # The Forest server portal (under construction)
```

---

## License

Licensed under the [MIT License](LICENSE).
