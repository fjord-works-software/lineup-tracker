# Baseball Lineup Tracker

A single-page React PWA for managing baseball batting orders and tracking a live game from your phone. Works offline, installs to the home screen, and stores everything locally — no account, no backend.

## Features

- **Multiple lineups** — create, edit, and delete teams, each with its own name, league, and batting order.
- **Batting order management** — set each player's name, number, and position; enable/disable players, who are then skipped in the rotation.
- **Live game view** — current batter spotlight, on-deck / in-the-hole indicators, out counter, and inning tracking, with undo.
- **Share a lineup** — hand a lineup to another phone via a shareable link or a scannable QR code; importing detects re-shares of the same lineup and offers to update in place.
- **Installable & offline** — a service worker precaches the app; an in-app banner prompts to reload when an update is available.

## Tech stack

- **React 19** + **Vite** (`@vitejs/plugin-react`)
- **Tailwind CSS v4** via `@tailwindcss/vite` (no `tailwind.config.js`)
- **vite-plugin-pwa** for the service worker and web app manifest
- **lucide-react** (icons), **qrcode** / **qr-scanner** (lineup sharing)

State lives entirely in a single hook (`src/hooks/useGameState.js`) and is persisted to `localStorage`. There is no router and no server.

## Development

```bash
npm install
npm run dev       # start dev server at localhost:5173
npm run build     # production build (outputs to dist/)
npm run preview   # preview the production build locally
npm run lint      # run ESLint
```

There are no tests configured.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the app and publishes `dist/` to GitHub Pages. The workflow sets `VITE_BASE=/<repo-name>/` so the app and PWA manifest resolve correctly under the Pages subpath. To deploy elsewhere at the domain root, the default `VITE_BASE=/` is used.

## Project layout

```
src/
  App.jsx              top-level view switch (home / setup / game) + import-hash handling
  hooks/useGameState.js  all state, persistence, and actions
  utils/lineup.js      batting-order navigation (skips disabled players)
  utils/share.js       base64 encode/decode + validation for lineup sharing
  components/          screens (HomeScreen, LineupSetup, GameView) and modals
```

See [CLAUDE.md](./CLAUDE.md) for a deeper architecture overview.
```
