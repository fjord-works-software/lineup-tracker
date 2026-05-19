import { useState } from 'react'
import { useGameState } from './hooks/useGameState'
import HomeScreen from './components/HomeScreen'
import LineupSetup from './components/LineupSetup'
import GameView from './components/GameView'
import ImportModal from './components/ImportModal'
import { decodeLineup } from './utils/share'

function readImportHash() {
  try {
    const hash = window.location.hash
    if (!hash.startsWith('#import=')) return null
    const lineup = decodeLineup(hash.slice('#import='.length))
    history.replaceState(null, '', window.location.pathname)
    return lineup
  } catch {
    history.replaceState(null, '', window.location.pathname)
    return null
  }
}

export default function App() {
  const game = useGameState()
  const { state, activeLineup } = game
  const [importData, setImportData] = useState(readImportHash)

  const existingImportMatch = importData?.sourceId
    ? Object.values(state.lineups).find(
        l => l.id === importData.sourceId || l.sourceId === importData.sourceId
      ) ?? null
    : null

  function handleImportAdd() {
    game.importLineup(importData)
    setImportData(null)
  }

  function handleImportUpdate() {
    game.importLineup(importData, existingImportMatch.id)
    setImportData(null)
  }

  if (state.gamePhase === 'home') {
    return (
      <>
        <HomeScreen
          lineups={state.lineups}
          newLineup={game.newLineup}
          selectLineup={game.selectLineup}
          deleteLineup={game.deleteLineup}
          restoreBackup={game.restoreBackup}
          onImportLineupCode={setImportData}
        />
        {importData && (
          <ImportModal
            lineup={importData}
            existingLineup={existingImportMatch}
            onAdd={handleImportAdd}
            onUpdate={handleImportUpdate}
            onCancel={() => setImportData(null)}
          />
        )}
      </>
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
      undoBatter={game.undoBatter}
      addOut={game.addOut}
      removeOut={game.removeOut}
      endInning={game.endInning}
      endGame={game.endGame}
    />
  )
}
