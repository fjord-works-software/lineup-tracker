import { useGameState } from './hooks/useGameState'
import LineupSetup from './components/LineupSetup'
import GameView from './components/GameView'

export default function App() {
  const { state, startGame, nextBatter, addOut, removeOut, endInning, resetGame } = useGameState()

  if (state.gamePhase === 'setup') {
    return <LineupSetup onStart={startGame} />
  }

  return (
    <GameView
      state={state}
      nextBatter={nextBatter}
      addOut={addOut}
      removeOut={removeOut}
      endInning={endInning}
      resetGame={resetGame}
    />
  )
}
