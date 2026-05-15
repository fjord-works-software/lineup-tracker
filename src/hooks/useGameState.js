import { useState, useEffect } from 'react'
import { onDeckIndex } from '../utils/lineup'

const STORAGE_KEY = 'lineup_game_state'

const defaultState = {
  gamePhase: 'setup',
  lineup: [],
  currentBatterIndex: 0,
  outCount: 0,
  inning: 1,
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : defaultState
  } catch {
    return defaultState
  }
}

export function useGameState() {
  const [state, setState] = useState(loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  function startGame(lineup) {
    setState({
      gamePhase: 'game',
      lineup,
      currentBatterIndex: 0,
      outCount: 0,
      inning: 1,
    })
  }

  function nextBatter() {
    setState(s => ({
      ...s,
      currentBatterIndex: (s.currentBatterIndex + 1) % s.lineup.length,
    }))
  }

  function addOut() {
    setState(s => ({ ...s, outCount: Math.min(s.outCount + 1, 3) }))
  }

  function removeOut() {
    setState(s => ({ ...s, outCount: Math.max(s.outCount - 1, 0) }))
  }

  function endInning() {
    setState(s => ({
      ...s,
      currentBatterIndex: onDeckIndex(s.currentBatterIndex, s.lineup.length),
      outCount: 0,
      inning: s.inning + 1,
    }))
  }

  function resetGame() {
    setState(defaultState)
  }

  return { state, startGame, nextBatter, addOut, removeOut, endInning, resetGame }
}
