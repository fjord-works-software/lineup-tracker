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
  runsByInning: [0],
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
    runRule: null,
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
    // State saved before run tracking existed (possibly mid-game) has no
    // runsByInning; backfill it rather than bumping the version and losing lineups.
    if (!Array.isArray(parsed.runsByInning)) {
      parsed.runsByInning = Array(parsed.inning).fill(0)
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

  function editLineup(id) {
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

  function startGame(id) {
    setState(s => {
      const lineup = s.lineups[id]
      const players = lineup.players.filter(p => p.name.trim())
      return {
        ...s,
        gamePhase: 'game',
        activeLineupId: id,
        lineups: { ...s.lineups, [id]: { ...lineup, players } },
        currentBatterIndex: firstEnabledIndex(players),
        outCount: 0,
        runsByInning: [0],
        inning: 1,
      }
    })
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
            runRule: lineup.runRule,
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

  function addRun() {
    setState(s => ({
      ...s,
      runsByInning: s.runsByInning.map((r, i) => i === s.inning - 1 ? r + 1 : r),
    }))
  }

  function removeRun() {
    setState(s => ({
      ...s,
      runsByInning: s.runsByInning.map((r, i) => i === s.inning - 1 ? Math.max(r - 1, 0) : r),
    }))
  }

  function endInning() {
    setState(s => {
      const players = s.lineups[s.activeLineupId].players
      return {
        ...s,
        currentBatterIndex: onDeckIndex(players, s.currentBatterIndex),
        outCount: 0,
        runsByInning: [...s.runsByInning, 0],
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
      runsByInning: [0],
      inning: 1,
    }))
  }

  return {
    state,
    activeLineup,
    importLineup,
    newLineup,
    editLineup,
    deleteLineup,
    saveActiveLineup,
    goHome,
    startGame,
    nextBatter,
    undoBatter,
    addOut,
    removeOut,
    addRun,
    removeRun,
    endInning,
    endGame,
  }
}
