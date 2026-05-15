# Lineup Sharing Feature

## Context

Coaches need to hand off a lineup to another coach who also uses the app. The app is fully local (localStorage only, no backend). The sharing mechanism is a **QR code**: encode the lineup as base64 JSON in a URL hash, display a QR code the other coach scans with their phone camera. The link auto-imports the lineup on the receiving end. A "Copy Link" fallback sits below the QR code for non-camera scenarios.

No backend, no account system, works offline on the recipient's side once the link is opened.

---

## User Flow

**Sharing side (HomeScreen):**
1. Coach taps a share icon on a lineup card
2. App encodes the lineup and builds: `<origin>/#import=<base64>`
3. `navigator.share()` opens the OS share sheet (SMS, AirDrop, email, etc.)
4. Fallback: copy URL to clipboard + show a "Link copied!" toast

**Receiving side:**
1. Recipient opens the link in their browser
2. App loads → `App.jsx` reads `window.location.hash` on mount
3. If `#import=...` is present: decode, show `ImportModal` with team name, league, and player list preview
4. Recipient taps **"Add to My Lineups"** → lineup is saved with a fresh ID
5. Hash is cleared from the URL via `history.replaceState`
6. If decoding fails: silently ignore, clear hash

---

## Data Encoding

Only the lineup content is encoded — not the internal `id`:

```js
// src/utils/share.js
export function encodeLineup(lineup) {
  const { teamName, league, players } = lineup
  return btoa(JSON.stringify({ teamName, league, players }))
}

export function decodeLineup(str) {
  const { teamName, league, players } = JSON.parse(atob(str))
  if (!Array.isArray(players) || players.length === 0) throw new Error('invalid')
  return { teamName: teamName ?? '', league: league ?? '', players }
}
```

A 15-player lineup encodes to ~1,300 characters — well within URL limits.

---

## Files to Create

| File | Purpose |
|---|---|
| `src/utils/share.js` | `encodeLineup`, `decodeLineup` |
| `src/components/ImportModal.jsx` | Preview + confirm import |

## Files to Modify

| File | Change |
|---|---|
| `src/components/HomeScreen.jsx` | Add share icon button per card; toast state for "Link copied" |
| `src/hooks/useGameState.js` | Add `importLineup(lineup)` action (saves as new lineup, stays on home phase) |
| `src/App.jsx` | Read hash on mount; pass `importData` + `clearImport` state down |

---

## Component Details

### `ImportModal.jsx`
Props: `lineup`, `onConfirm`, `onCancel`
- Shows team name, league, and a scrollable player list (name + number + position)
- "Add to My Lineups" (confirm) / "Cancel" buttons
- Reuses existing `ConfirmModal` styling patterns but is its own component (more content than a simple confirm)

### Share button in `HomeScreen`
- Small icon button (e.g., `⤴` or `↗`) in the card row alongside the existing trash button
- On click: build URL → try `navigator.share()` → catch and fallback to `navigator.clipboard.writeText()` → set toast message → auto-clear after 2s

### `importLineup` action in `useGameState`
```js
function importLineup(lineup) {
  const id = newId()
  setState(s => ({
    ...s,
    lineups: { ...s.lineups, [id]: { ...lineup, id } },
  }))
}
```

### Hash detection in `App.jsx`
```js
const [importData, setImportData] = useState(() => {
  try {
    const hash = window.location.hash
    if (!hash.startsWith('#import=')) return null
    return decodeLineup(hash.slice('#import='.length))
  } catch { return null }
})
```
After import or cancel: `history.replaceState(null, '', window.location.pathname)` + `setImportData(null)`.

`ImportModal` is rendered at the top level in `App.jsx` (above phase switching) so it appears regardless of which phase is active when the link is opened.

---

## Note on Deployment

The share URL uses `window.location.origin`, so sharing only works across devices once the app is deployed to a public URL. In dev (`localhost:5173`), the generated link is only usable on the same machine.

---

## Verification

- Tap share on a lineup card → OS share sheet appears (or "Link copied" toast on unsupported browsers)
- Open the copied URL in a new tab → `ImportModal` appears with correct team/player data
- Confirm import → lineup appears in home screen with a new ID
- Cancel import → modal dismisses, hash cleared, no lineup added
- Corrupt/missing hash → no modal, no crash
- Imported lineup with disabled players → `enabled` flag preserved
