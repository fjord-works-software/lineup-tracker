import { useGameState } from './hooks/useGameState'
import LineupSetup from './components/LineupSetup'
import GameView from './components/GameView'

export default function App() {
  const { state, startGame, nextBatter, addOut, removeOut, endInning, endGame } = useGameState()

  if (state.gamePhase === 'setup') {
    return <LineupSetup onStart={startGame} savedLineup={state.lineup} />
  }

  return (
    <GameView
      state={state}
      nextBatter={nextBatter}
      addOut={addOut}
      removeOut={removeOut}
      endInning={endInning}
      endGame={endGame}
    />
  )
}
