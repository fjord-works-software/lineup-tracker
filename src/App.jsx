import { useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
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
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW()
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

  return (
    <>
      {state.gamePhase === 'home' && (
        <>
          <HomeScreen
            lineups={state.lineups}
            newLineup={game.newLineup}
            selectLineup={game.selectLineup}
            deleteLineup={game.deleteLineup}
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
      )}
      {state.gamePhase === 'setup' && (
        <LineupSetup
          lineup={activeLineup}
          onSave={game.saveActiveLineup}
          onStart={game.startGame}
          onBack={game.goHome}
        />
      )}
      {state.gamePhase === 'game' && (
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
      )}
      {needRefresh && (
        <div className="fixed bottom-0 inset-x-0 z-50 p-4">
          <div className="bg-blue-600 rounded-xl px-4 py-3 flex items-center justify-between gap-4 shadow-lg">
            <span className="text-white text-sm font-medium">Update available</span>
            <button
              onClick={() => updateServiceWorker(true)}
              className="text-white font-bold text-sm bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors shrink-0"
            >
              Reload
            </button>
          </div>
        </div>
      )}
    </>
  )
}
