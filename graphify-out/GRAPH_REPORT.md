# Graph Report - lineup-tracker  (2026-09-30)

## Corpus Check
- 26 files · ~14,986 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 207 nodes · 273 edges · 19 communities (14 shown, 5 thin omitted)
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 35 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `82db0140`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Build & Dependency Config|Build & Dependency Config]]
- [[_COMMUNITY_App Shell & Lineup Setup|App Shell & Lineup Setup]]
- [[_COMMUNITY_Docs, Sharing & Deploy|Docs, Sharing & Deploy]]
- [[_COMMUNITY_Live Game & Batting Order|Live Game & Batting Order]]
- [[_COMMUNITY_Sharing Codec & Validation|Sharing Codec & Validation]]
- [[_COMMUNITY_Hero Image Branding|Hero Image Branding]]
- [[_COMMUNITY_PWA App Shell|PWA App Shell]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_PWA App Icons|PWA App Icons]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]

## God Nodes (most connected - your core abstractions)
1. `decodeLineup()` - 12 edges
2. `GameView()` - 12 edges
3. `Matchup Mode: Lineup Swap & Pitch Count` - 12 edges
4. `onDeckIndex()` - 11 edges
5. `useGameState()` - 10 edges
6. `Lineup Sharing Feature` - 9 edges
7. `App Component` - 8 edges
8. `inHoleIndex()` - 7 edges
9. `step()` - 6 edges
10. `Baseball Lineup Tracker` - 6 edges

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

## Communities (19 total, 5 thin omitted)

### Community 0 - "Build & Dependency Config"
Cohesion: 0.07
Nodes (29): dependencies, lucide-react, qr-scanner, qrcode, react, react-dom, devDependencies, eslint (+21 more)

### Community 1 - "App Shell & Lineup Setup"
Cohesion: 0.18
Nodes (13): App Component, handleImportAdd, handleImportUpdate, readImportHash, ImportModal(), emptyPlayer(), LineupSetup(), POSITIONS (+5 more)

### Community 2 - "Docs, Sharing & Deploy"
Cohesion: 0.11
Nodes (23): Batting Order Logic (disabled-player skipping), localStorage State Persistence, CLAUDE.md Project Guidance, PWA Configuration (vite-plugin-pwa), Tailwind CSS v4 Styling, Three-Phase Game Flow, App Favicon / Logo (purple lightning bolt), Social Icon SVG Sprite Sheet (+15 more)

### Community 3 - "Live Game & Batting Order"
Cohesion: 0.15
Nodes (18): BatterSpotlight(), PlayerCard(), VARIANTS, ConfirmModal(), GameView(), LineupRoll(), OutCounter(), endInning (+10 more)

### Community 4 - "Sharing Codec & Validation"
Cohesion: 0.15
Nodes (18): HomeScreen(), QRModal(), QRScanModal(), importLineup, qr-scanner dependency, qrcode dependency, base64ToJson(), buildShareUrl() (+10 more)

### Community 5 - "Hero Image Branding"
Cohesion: 0.32
Nodes (8): Rounded Card UI Metaphor, Floating Layered Card Motif, Lineup Tracker Hero Image, Isometric 3D Perspective, Minimalist App Branding Concept, Outlined Translucent Top Card, Purple Gradient Edge Accent, Solid White Bottom Card

### Community 6 - "PWA App Shell"
Cohesion: 0.25
Nodes (8): Content Security Policy, index.html App Shell, main.jsx entry, tailwindcss dependency, vite-plugin-pwa dependency, PWA Web App Manifest, VITE_BASE env base path, VitePWA PWA Configuration

### Community 13 - "Community 13"
Cohesion: 0.14
Nodes (13): Component Details, Context, Data Encoding, Files to Create, Files to Modify, Hash detection in `App.jsx`, `importLineup` action in `useGameState`, `ImportModal.jsx` (+5 more)

### Community 14 - "Community 14"
Cohesion: 0.29
Nodes (6): Baseball Lineup Tracker, Deployment, Development, Features, Project layout, Tech stack

### Community 15 - "Community 15"
Cohesion: 0.40
Nodes (3): Architecture, Commands, graphify

### Community 18 - "Community 18"
Cohesion: 0.11
Nodes (17): Component details, Context, Data model, Domain concepts, Files to create, Files to modify, `GameView.jsx`, Hook actions (`useGameState`) (+9 more)

### Community 19 - "Community 19"
Cohesion: 0.24
Nodes (10): buildGame(), defaultPitcherIdx(), defaultState, emptyLineup(), loadState(), migrateState(), newId(), startGame (+2 more)

## Knowledge Gaps
- **88 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+83 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useGameState()` connect `App Shell & Lineup Setup` to `Community 19`, `Live Game & Batting Order`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `GameView()` connect `Live Game & Batting Order` to `App Shell & Lineup Setup`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `decodeLineup()` connect `Sharing Codec & Validation` to `App Shell & Lineup Setup`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `GameView()` (e.g. with `OutCounter()` and `endInning`) actually correct?**
  _`GameView()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `onDeckIndex()` (e.g. with `BatterSpotlight()` and `nextIndex()`) actually correct?**
  _`onDeckIndex()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _91 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Build & Dependency Config` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._