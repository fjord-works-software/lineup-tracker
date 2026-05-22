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
  const [swInstalling, setSwInstalling] = useState(false)
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW({
    onRegistered(r) {
      if (!r) return
      r.addEventListener('updatefound', () => {
        if (!navigator.serviceWorker.controller) return
        const worker = r.installing
        if (!worker) return
        setSwInstalling(true)
        worker.addEventListener('statechange', () => {
          if (worker.state !== 'installing') setSwInstalling(false)
        })
      })
      setInterval(() => r.update(), 60_000)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') r.update()
      })
    },
  })
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
      {(swInstalling || needRefresh) && (
        <div className="fixed bottom-0 inset-x-0 z-50 p-4">
          <div className="bg-slate-800 border border-slate-600 rounded-xl shadow-xl overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between gap-4">
              <span className="text-white text-sm font-medium">
                {needRefresh ? 'Update ready' : 'Downloading update…'}
              </span>
              {needRefresh && (
                <button
                  onClick={() => updateServiceWorker(true)}
                  className="text-white font-bold text-sm bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg transition-colors shrink-0"
                >
                  Reload
                </button>
              )}
            </div>
            <div className="h-1 bg-slate-700 relative overflow-hidden">
              {needRefresh
                ? <div className="absolute inset-0 bg-blue-500" />
                : <div className="absolute inset-y-0 w-1/4 bg-blue-500 rounded-full" style={{ animation: 'sw-indeterminate 1.4s ease-in-out infinite' }} />
              }
            </div>
          </div>
        </div>
      )}
    </>
  )
}
