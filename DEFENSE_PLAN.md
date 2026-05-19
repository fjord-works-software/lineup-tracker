# Defense / Pitching Tracking Feature

## Context
The app currently only tracks offense (batting order). The user wants to add a defense side for Kid Pitch leagues: when the user's team is the Home team they start on defense, and the app tracks pitch counts per pitcher. After 3 outs the app switches to the offense screen; after the inning ends on offense it switches back to defense. Guest teams and Coach Pitch lineups remain offense-only (existing behavior unchanged).

## State Changes

**Per-lineup** (in `useGameState.js` → `emptyLineup()`):
- Add `pitchType: 'coach'` — existing saved lineups without this field are treated as `'coach'`

**Game-level** (added by `startGame()`, reset each new game):
- `isHome: boolean` — true only for Kid Pitch + Home selection
- `gameView: 'offense' | 'defense'`
- `currentPitcherIndex: number | null` — index into `activeLineup.players`
- `pitchCounts: { [String(playerIndex)]: number }` — accumulated per pitcher; always keyed as strings

No `STATE_VERSION` bump needed — new fields are game-specific and written fresh by `startGame`.

---

## Implementation Steps

### 1. `useGameState.js` — extend `emptyLineup`
Add `pitchType: 'coach'` to the returned object in `emptyLineup(id)`.

### 2. `useGameState.js` — update `startGame` signature
```js
function startGame(isHome = false) {
  setState(s => {
    const lineup = s.lineups[s.activeLineupId]
    const isKidPitch = lineup.pitchType === 'kid'
    const home = isHome && isKidPitch
    return {
      ...s,
      gamePhase: 'game',
      currentBatterIndex: firstEnabledIndex(lineup.players),
      outCount: 0,
      inning: 1,
      isHome: home,
      gameView: home ? 'defense' : 'offense',
      currentPitcherIndex: null,
      pitchCounts: {},
    }
  })
}
```

### 3. `useGameState.js` — update `endInning`
After incrementing inning, add: `...(s.isHome ? { gameView: 'defense' } : {})`.
`outCount` is already reset to 0 here.

### 4. `useGameState.js` — add four new actions
```js
function switchToOffense() {
  setState(s => ({ ...s, gameView: 'offense', outCount: 0 }))
}
function selectPitcher(index) {
  setState(s => ({ ...s, currentPitcherIndex: index }))
}
function addPitch() {
  setState(s => {
    if (s.currentPitcherIndex === null) return s
    const key = String(s.currentPitcherIndex)
    return { ...s, pitchCounts: { ...s.pitchCounts, [key]: (s.pitchCounts[key] ?? 0) + 1 } }
  })
}
function undoPitch() {
  setState(s => {
    if (s.currentPitcherIndex === null) return s
    const key = String(s.currentPitcherIndex)
    return { ...s, pitchCounts: { ...s.pitchCounts, [key]: Math.max((s.pitchCounts[key] ?? 0) - 1, 0) } }
  })
}
```
Return all four from the hook.

### 5. `LineupSetup.jsx` — add `pitchType` state and toggle UI
- Init: `const [pitchType, setPitchType] = useState(lineup.pitchType ?? 'coach')`
- Add `pitchType` to every `onSave(...)` call (route through `save()` helper)
- Add a Coach Pitch / Kid Pitch segmented toggle below the League input (same card), calling `onSave` on change
- Update `handleConfirmStart(isHome)` to accept and forward `isHome` to `onStart(isHome)`
- Pass `pitchType={pitchType}` to `StartGameModal`

### 6. `StartGameModal.jsx` — add Home/Guest selector for Kid Pitch
- Add `pitchType` prop
- Add `const [isHome, setIsHome] = useState(false)` (default: Guest)
- Render a "Guest (1st) / Home (2nd)" segmented toggle above the action buttons, only when `pitchType === 'kid'`
- Change `onConfirm()` → `onConfirm(pitchType === 'kid' ? isHome : false)`

### 7. `App.jsx` — route `gameView` to DefenseView
- Import `DefenseView`
- Replace the final single `return <GameView ...>` with:
  ```jsx
  if (state.gamePhase === 'game') {
    if (state.gameView === 'defense') return <DefenseView ... />
    return <GameView ... />
  }
  ```
- Pass `selectPitcher`, `addPitch`, `undoPitch`, `switchToOffense` to `DefenseView`

### 8. `GameView.jsx` — update inning label for Home teams
Destructure `isHome` from `state`. Change the inning header label:
```jsx
<div className="text-xs text-slate-400 uppercase tracking-wider">
  {isHome ? 'Bottom' : 'Inning'}
</div>
```

### 9. Create `DefenseView.jsx`
**Props:** `{ state, activeLineup, selectPitcher, addPitch, undoPitch, addOut, removeOut, switchToOffense, endGame }`

**Key destructures:**
```js
const { outCount, inning, currentPitcherIndex, pitchCounts } = state
const pitcher = currentPitcherIndex !== null ? activeLineup.players[currentPitcherIndex] : null
const currentPitchCount = pitchCounts[String(currentPitcherIndex)] ?? 0
const inningEnded = outCount === 3
```

**Layout (top to bottom):**
1. **Header** — "Top of [inning]", team name, "Defense" sublabel, "End Game" button (→ ConfirmModal)
2. When `inningEnded`: amber overlay showing "3 Outs!" (matches GameView amber scheme)
3. **Pitcher card** — if pitcher selected: name, position, pitch count with `−` and `+` buttons. If none selected: prompt "Tap a player below to select the pitcher"
4. **OutCounter** — `<OutCounter outCount={outCount} onAdd={addOut} onRemove={removeOut} />`
5. **Pitcher roster** — `activeLineup.players.map((player, i) => ...)` — skip disabled/unnamed with `return null` to preserve original index `i`. Highlight active pitcher. Show accumulated pitch count per player.
6. **Footer** — when `inningEnded`: "Start Batting →" button calling `switchToOffense()`

**Container bg:** transitions amber-950 when `inningEnded`, slate-900 otherwise.

**Reused components:** `OutCounter` (`onAdd`/`onRemove`), `ConfirmModal`

---

## Critical Files
- `src/hooks/useGameState.js`
- `src/components/LineupSetup.jsx`
- `src/components/StartGameModal.jsx`
- `src/components/GameView.jsx`
- `src/App.jsx`
- `src/components/DefenseView.jsx` ← new

## Key Gotchas
- `pitchCounts` keys are always `String(index)` — JSON round-trips make numeric keys into strings
- Roster loop in `DefenseView` uses `map` + `return null` (never `filter`) to preserve original player indices for pitcher selection
- `endGame()` leaves stale defense fields in state — harmless because `gamePhase !== 'game'` guard prevents them from being read
- Old saved lineups lack `pitchType` — always coerce with `?? 'coach'` at read sites

## Verification
1. `npm run build` — clean
2. Kid Pitch lineup → Start Game → Home/Guest selector appears
3. Guest → offense screen (identical to current)
4. Home → defense screen, inning shows "Top of 1"
5. Select pitcher → pitch count card appears, +/− work
6. Swap pitchers → each retains their accumulated count
7. 3 outs on defense → amber overlay → "Start Batting" → offense screen (inning header "Bottom")
8. End inning on offense → defense screen returns (inning "Top of 2")
9. Coach Pitch lineup → Start Game → no Home/Guest selector, offense directly
