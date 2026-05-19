import { useState, useEffect } from 'react'
import { onDeckIndex, nextIndex, prevIndex, firstEnabledIndex } from '../utils/lineup'

const STORAGE_KEY = 'lineup_game_state'
const STATE_VERSION = 2

const defaultState = {
  version: STATE_VERSION,
  gamePhase: 'home',
  activeLineupId: null,
  lineups: {},
  currentBatterIndex: 0,
  outCount: 0,
  inning: 1,
}

function newId() {
  return Math.random().toString(36).slice(2, 9)
}

function emptyLineup(id) {
  return {
    id,
    league: '',
    teamName: '',
    pitchType: 'coach',
    players: [
      { name: '', number: '', position: '', enabled: true },
      { name: '', number: '', position: '', enabled: true },
    ],
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState
    const parsed = JSON.parse(raw)
    if (parsed.version !== STATE_VERSION) return defaultState
    return parsed
  } catch {
    return defaultState
  }
}

export function useGameState() {
  const [state, setState] = useState(loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const activeLineup = state.activeLineupId ? state.lineups[state.activeLineupId] : null

  function newLineup() {
    const id = newId()
    setState(s => ({
      ...s,
      activeLineupId: id,
      gamePhase: 'setup',
      lineups: { ...s.lineups, [id]: emptyLineup(id) },
    }))
  }

  function selectLineup(id) {
    setState(s => ({ ...s, activeLineupId: id, gamePhase: 'setup' }))
  }

  function deleteLineup(id) {
    setState(s => {
      const lineups = { ...s.lineups }
      delete lineups[id]
      return { ...s, lineups }
    })
  }

  function saveActiveLineup(patch) {
    setState(s => ({
      ...s,
      lineups: {
        ...s.lineups,
        [s.activeLineupId]: { ...s.lineups[s.activeLineupId], ...patch },
      },
    }))
  }

  function goHome() {
    setState(s => {
      const lineup = s.lineups[s.activeLineupId]
      const hasContent = lineup && (lineup.teamName.trim() || lineup.players.some(p => p.name.trim()))
      if (hasContent) {
        return { ...s, gamePhase: 'home', activeLineupId: null }
      }
      const lineups = { ...s.lineups }
      delete lineups[s.activeLineupId]
      return { ...s, gamePhase: 'home', activeLineupId: null, lineups }
    })
  }

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

  function restoreBackup(backupLineups) {
    setState(s => ({ ...s, lineups: { ...s.lineups, ...backupLineups } }))
  }

  function importLineup(lineup, existingId = null) {
    if (existingId) {
      setState(s => ({
        ...s,
        lineups: {
          ...s.lineups,
          [existingId]: {
            ...s.lineups[existingId],
            teamName: lineup.teamName,
            league: lineup.league,
            players: lineup.players,
          },
        },
      }))
    } else {
      const id = newId()
      setState(s => ({
        ...s,
        lineups: { ...s.lineups, [id]: { ...lineup, id, sourceId: lineup.sourceId } },
      }))
    }
  }

  function nextBatter() {
    setState(s => {
      const players = s.lineups[s.activeLineupId].players
      return { ...s, currentBatterIndex: nextIndex(players, s.currentBatterIndex) }
    })
  }

  function undoBatter() {
    setState(s => {
      const players = s.lineups[s.activeLineupId].players
      return { ...s, currentBatterIndex: prevIndex(players, s.currentBatterIndex) }
    })
  }

  function addOut() {
    setState(s => ({ ...s, outCount: Math.min(s.outCount + 1, 3) }))
  }

  function removeOut() {
    setState(s => ({ ...s, outCount: Math.max(s.outCount - 1, 0) }))
  }

  function endInning() {
    setState(s => {
      const players = s.lineups[s.activeLineupId].players
      const lineup = s.lineups[s.activeLineupId]
      const isGuestKidPitch = !s.isHome && lineup.pitchType === 'kid'
      return {
        ...s,
        currentBatterIndex: onDeckIndex(players, s.currentBatterIndex),
        outCount: 0,
        // Guest Kid Pitch: switch to defense but hold the inning number — it increments on switchToOffense
        // Home Kid Pitch: increment inning and switch to defense
        // Coach Pitch: just increment inning (offense only)
        ...(isGuestKidPitch
          ? { gameView: 'defense' }
          : { inning: s.inning + 1, ...(s.isHome ? { gameView: 'defense' } : {}) }
        ),
      }
    })
  }

  function switchToOffense() {
    // For Guest teams, the inning increments when switching from defense back to offense
    setState(s => ({
      ...s,
      gameView: 'offense',
      outCount: 0,
      ...(!s.isHome ? { inning: s.inning + 1 } : {}),
    }))
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

  function endGame() {
    setState(s => ({
      ...s,
      gamePhase: 'home',
      activeLineupId: null,
      currentBatterIndex: 0,
      outCount: 0,
      inning: 1,
    }))
  }

  return {
    state,
    activeLineup,
    importLineup,
    restoreBackup,
    newLineup,
    selectLineup,
    deleteLineup,
    saveActiveLineup,
    goHome,
    startGame,
    switchToOffense,
    selectPitcher,
    addPitch,
    undoPitch,
    nextBatter,
    undoBatter,
    addOut,
    removeOut,
    endInning,
    endGame,
  }
}
