import { useState, useEffect } from 'react'
import { onDeckIndex } from '../utils/lineup'

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
  return { id, league: '', teamName: '', players: [{name:'',number:'',position:''}, {name:'',number:'',position:''}] }
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

  function startGame() {
    setState(s => ({ ...s, gamePhase: 'game', currentBatterIndex: 0, outCount: 0, inning: 1 }))
  }

  function nextBatter() {
    setState(s => {
      const len = s.lineups[s.activeLineupId].players.length
      return { ...s, currentBatterIndex: (s.currentBatterIndex + 1) % len }
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
      const len = s.lineups[s.activeLineupId].players.length
      return {
        ...s,
        currentBatterIndex: onDeckIndex(s.currentBatterIndex, len),
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
    newLineup,
    selectLineup,
    deleteLineup,
    saveActiveLineup,
    goHome,
    startGame,
    nextBatter,
    addOut,
    removeOut,
    endInning,
    endGame,
  }
}
