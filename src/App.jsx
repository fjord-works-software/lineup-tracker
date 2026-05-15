import { useGameState } from './hooks/useGameState'
import HomeScreen from './components/HomeScreen'
import LineupSetup from './components/LineupSetup'
import GameView from './components/GameView'

export default function App() {
  const game = useGameState()
  const { state, activeLineup } = game

  if (state.gamePhase === 'home') {
    return (
      <HomeScreen
        lineups={state.lineups}
        newLineup={game.newLineup}
        selectLineup={game.selectLineup}
        deleteLineup={game.deleteLineup}
      />
    )
  }

  if (state.gamePhase === 'setup') {
    return (
      <LineupSetup
        lineup={activeLineup}
        onSave={game.saveActiveLineup}
        onStart={game.startGame}
        onBack={game.goHome}
      />
    )
  }

  return (
    <GameView
      state={state}
      activeLineup={activeLineup}
      nextBatter={game.nextBatter}
      addOut={game.addOut}
      removeOut={game.removeOut}
      endInning={game.endInning}
      endGame={game.endGame}
    />
  )
}
