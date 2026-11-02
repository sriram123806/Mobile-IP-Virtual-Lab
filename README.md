# Mobile IP Virtual Lab: Home Agent & Foreign Agent Tunneling

An interactive virtual laboratory designed for Data Communication Networks (DCN) and Electronics & Communication Engineering (ECE) students to understand Mobile IPv4 architecture, packet encapsulation, decapsulation, forward tunneling, and failure diagnostics.

## Features

- **Landing Page**: Fullscreen looping video background featuring an anime educational aesthetic with smooth navigation and About Us modal.
- **Video Learning Module**: Central 16:9 video player with custom playback controls, timeline seeking, volume slider, speed adjustment, and fullscreen support.
- **Concepts & Q&A**: 20 technical questions & answers covering Mobile IP entities (MN, CN, HA, FA, CoA), header structures, and lifecycle events with live search and category filtering.
- **Interactive Simulation**: Leaflet-powered South India (Tamil Nadu) network map with selectable nodes (Chennai, Madurai, Coimbatore, Ooty, Salem, Trichy, Tirunelveli, Kanyakumari, Vellore, Thanjavur), real-time animated packet delivery across 6 stages, and live packet inspection.
- **Failure Scenarios (Cases)**: 8 diagnostic failure modes (ARP timeouts, registration relay failures, MTU encapsulation drops, decapsulation header errors, in-flight handoff drops, and wireless dead zones) with interactive mini-flow simulations.

## How to Run / Host Locally

### Option 1: Python HTTP Server (Recommended)
Open a terminal in this directory and run:
```bash
python -m http.server 8080
```
Then visit:
```
http://localhost:8080
```

### Option 2: Node.js (npx serve or http-server)
```bash
npx serve .
```
or
```bash
npx http-server -p 8080
```

### Option 3: VS Code Live Server
Right-click `index.html` in VS Code and select **"Open with Live Server"**.

## Hosting on GitHub Pages
This project is pure client-side HTML5/CSS3/JavaScript with zero build steps required. To enable GitHub Pages:
1. Go to your repository on GitHub.
2. Navigate to **Settings > Pages**.
3. Under **Branch**, select `main` and root `/`.
4. Click **Save**. Your site will be live at `https://<username>.github.io/<repo-name>/`.
