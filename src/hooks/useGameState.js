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
    if (parsed.version !== STATE_VERSION) {
      localStorage.removeItem(STORAGE_KEY)
      return defaultState
    }
    return parsed
  } catch {
    localStorage.removeItem(STORAGE_KEY)
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

  function startGame() {
    setState(s => {
      const players = s.lineups[s.activeLineupId].players
      return {
        ...s,
        gamePhase: 'game',
        currentBatterIndex: firstEnabledIndex(players),
        outCount: 0,
        inning: 1,
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
      return {
        ...s,
        currentBatterIndex: onDeckIndex(players, s.currentBatterIndex),
        outCount: 0,
        inning: s.inning + 1,
      }
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
    nextBatter,
    undoBatter,
    addOut,
    removeOut,
    endInning,
    endGame,
  }
}
