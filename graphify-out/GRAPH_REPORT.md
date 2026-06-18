# Graph Report - .  (2026-06-17)

## Corpus Check
- Corpus is ~13,902 words - fits in a single context window. You may not need a graph.

## Summary
- 151 nodes · 227 edges · 13 communities (11 shown, 2 thin omitted)
- Extraction: 83% EXTRACTED · 17% INFERRED · 0% AMBIGUOUS · INFERRED: 39 edges (avg confidence: 0.79)
- Token cost: 126,065 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Build & Dependency Config|Build & Dependency Config]]
- [[_COMMUNITY_App Shell & Lineup Setup|App Shell & Lineup Setup]]
- [[_COMMUNITY_Docs, Sharing & Deploy|Docs, Sharing & Deploy]]
- [[_COMMUNITY_Live Game & Batting Order|Live Game & Batting Order]]
- [[_COMMUNITY_Sharing Codec & Validation|Sharing Codec & Validation]]
- [[_COMMUNITY_Hero Image Branding|Hero Image Branding]]
- [[_COMMUNITY_PWA App Shell|PWA App Shell]]
- [[_COMMUNITY_Game Start Flow|Game Start Flow]]
- [[_COMMUNITY_QR Code Generation|QR Code Generation]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_PWA App Icons|PWA App Icons]]

## God Nodes (most connected - your core abstractions)
1. `decodeLineup()` - 13 edges
2. `GameView()` - 12 edges
3. `onDeckIndex()` - 11 edges
4. `useGameState()` - 10 edges
5. `App Component` - 8 edges
6. `inHoleIndex()` - 7 edges
7. `step()` - 6 edges
8. `decodeBackup()` - 6 edges
9. `Lineup Tracker Hero Image` - 6 edges
10. `scripts` - 5 edges

## Surprising Connections (you probably didn't know these)
- `QRModal()` --semantically_similar_to--> `qr-scanner dependency`  [INFERRED] [semantically similar]
  src/components/QRModal.jsx → package.json
- `VitePWA PWA Configuration` --conceptually_related_to--> `index.html App Shell`  [INFERRED]
  vite.config.js → index.html
- `PWA Configuration (vite-plugin-pwa)` --references--> `App Favicon / Logo (purple lightning bolt)`  [INFERRED]
  CLAUDE.md → public/favicon.svg
- `index.html App Shell` --references--> `main.jsx entry`  [EXTRACTED]
  index.html → src/main.jsx
- `GameView()` --references--> `lucide-react dependency`  [EXTRACTED]
  src/components/GameView.jsx → package.json

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Lineup Import/Decode Flow** — components_qrscanmodal_qrscanmodal, components_lineupcodemodal_lineupcodemodal, app_readimporthash, utils_share_decodelineup, components_importmodal_importmodal [INFERRED 0.85]
- **Batting Order Index Navigation** — utils_lineup_step, utils_lineup_nextindex, utils_lineup_ondeckindex, utils_lineup_inholeindex, utils_lineup_firstenabledindex [EXTRACTED 1.00]
- **Share Encode/Decode Codec** — utils_share_jsontobase64, utils_share_base64tojson, utils_share_encodelineup, utils_share_decodelineup, utils_share_validateplayers [INFERRED 0.80]
- **Batting Order Navigation Flow** — hooks_usegamestate_nextbatter, hooks_usegamestate_undobatter, utils_lineup_nextindex, utils_lineup_previndex, components_gameview_gameview [INFERRED 0.85]
- **On-Deck / In-Hole Batter Highlighting** — utils_lineup_ondeckindex, utils_lineup_inholeindex, components_gameview_gameview, components_lineuproll_lineuproll [INFERRED 0.85]
- **PWA Installability Configuration** — vite_config_vitepwa, vite_config_manifest, index_html_root, package_vite_plugin_pwa [INFERRED 0.85]
- **Lineup Sharing and Import Flow** — share_plan_encode_decode_lineup, share_plan_hash_detection_on_mount, share_plan_import_modal, share_plan_import_lineup_action [EXTRACTED 1.00]
- **GitHub Pages CI/CD Deployment** — workflows_deploy_github_pages_deploy, workflows_deploy_build_job, workflows_deploy_deploy_job, workflows_deploy_vite_base_env [EXTRACTED 1.00]

## Communities (13 total, 2 thin omitted)

### Community 0 - "Build & Dependency Config"
Cohesion: 0.07
Nodes (29): dependencies, lucide-react, qr-scanner, qrcode, react, react-dom, devDependencies, eslint (+21 more)

### Community 1 - "App Shell & Lineup Setup"
Cohesion: 0.13
Nodes (18): App Component, handleImportAdd, handleImportUpdate, readImportHash, ImportModal(), emptyPlayer(), LineupSetup(), POSITIONS (+10 more)

### Community 2 - "Docs, Sharing & Deploy"
Cohesion: 0.11
Nodes (23): Batting Order Logic (disabled-player skipping), localStorage State Persistence, CLAUDE.md Project Guidance, PWA Configuration (vite-plugin-pwa), Tailwind CSS v4 Styling, Three-Phase Game Flow, App Favicon / Logo (purple lightning bolt), Social Icon SVG Sprite Sheet (+15 more)

### Community 3 - "Live Game & Batting Order"
Cohesion: 0.19
Nodes (17): BatterSpotlight(), PlayerCard(), VARIANTS, GameView(), LineupRoll(), OutCounter(), endInning, nextBatter (+9 more)

### Community 4 - "Sharing Codec & Validation"
Cohesion: 0.23
Nodes (15): BackupModal(), HomeScreen(), LineupCodeModal(), QRScanModal(), base64ToJson(), buildShareUrl(), decodeBackup(), decodeLineup() (+7 more)

### Community 5 - "Hero Image Branding"
Cohesion: 0.32
Nodes (8): Rounded Card UI Metaphor, Floating Layered Card Motif, Lineup Tracker Hero Image, Isometric 3D Perspective, Minimalist App Branding Concept, Outlined Translucent Top Card, Purple Gradient Edge Accent, Solid White Bottom Card

### Community 6 - "PWA App Shell"
Cohesion: 0.25
Nodes (8): Content Security Policy, index.html App Shell, main.jsx entry, tailwindcss dependency, vite-plugin-pwa dependency, PWA Web App Manifest, VITE_BASE env base path, VitePWA PWA Configuration

### Community 7 - "Game Start Flow"
Cohesion: 0.33
Nodes (4): ConfirmModal(), StartGameModal(), startGame, firstEnabledIndex()

### Community 8 - "QR Code Generation"
Cohesion: 0.40
Nodes (4): QRModal(), importLineup, qr-scanner dependency, qrcode dependency

## Knowledge Gaps
- **49 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+44 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useGameState()` connect `App Shell & Lineup Setup` to `Live Game & Batting Order`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `GameView()` connect `Live Game & Batting Order` to `App Shell & Lineup Setup`, `Game Start Flow`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `decodeLineup()` connect `Sharing Codec & Validation` to `App Shell & Lineup Setup`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `GameView()` (e.g. with `LineupRoll()` and `OutCounter()`) actually correct?**
  _`GameView()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `onDeckIndex()` (e.g. with `BatterSpotlight()` and `nextIndex()`) actually correct?**
  _`onDeckIndex()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `useGameState()` (e.g. with `handleImportAdd` and `handleImportUpdate`) actually correct?**
  _`useGameState()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._