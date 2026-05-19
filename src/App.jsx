import { useState } from 'react'
import { useGameState } from './hooks/useGameState'
import HomeScreen from './components/HomeScreen'
import LineupSetup from './components/LineupSetup'
import OffenseView from './components/OffenseView'
import DefenseView from './components/DefenseView'
import ImportModal from './components/ImportModal'
import ConfirmModal from './components/ConfirmModal'
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
  const [showEndGameConfirm, setShowEndGameConfirm] = useState(false)

  const existingImportMatch = importData?.sourceId
    ? Object.values(state.lineups).find(l => l.sourceId === importData.sourceId) ?? null
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

  const endGameConfirm = (
    showEndGameConfirm
      ? <ConfirmModal
          message="End game? Your lineup will be saved for next time."
          onConfirm={() => { game.endGame(); setShowEndGameConfirm(false) }}
          onCancel={() => setShowEndGameConfirm(false)}
        />
      : null
  )

  if (state.gameView === 'defense') {
    return (
      <>
        <DefenseView
          state={state}
          activeLineup={activeLineup}
          selectPitcher={game.selectPitcher}
          addPitch={game.addPitch}
          undoPitch={game.undoPitch}
          addOut={game.addOut}
          removeOut={game.removeOut}
          switchToOffense={game.switchToOffense}
          onRequestEndGame={() => setShowEndGameConfirm(true)}
        />
        {endGameConfirm}
      </>
    )
  }

  return (
    <>
      <OffenseView
        state={state}
        activeLineup={activeLineup}
        nextBatter={game.nextBatter}
        undoBatter={game.undoBatter}
        addOut={game.addOut}
        removeOut={game.removeOut}
        endInning={game.endInning}
        onRequestEndGame={() => setShowEndGameConfirm(true)}
      />
      {endGameConfirm}
    </>
  )
}

