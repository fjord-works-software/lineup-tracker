import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import OutCounter from './OutCounter'
import ConfirmModal from './ConfirmModal'

export default function DefenseView({
  state, activeLineup,
  selectPitcher, addPitch, undoPitch,
  addOut, removeOut,
  switchToOffense, endGame,
}) {
  const [showConfirm, setShowConfirm] = useState(false)
  const { outCount, inning, currentPitcherIndex, pitchCounts, isHome } = state
  const pitcher = currentPitcherIndex !== null ? activeLineup.players[currentPitcherIndex] : null
  const currentPitchCount = currentPitcherIndex !== null ? (pitchCounts[String(currentPitcherIndex)] ?? 0) : 0
  const inningEnded = outCount === 3

  return (
    <div className={`h-screen text-white flex flex-col transition-colors duration-300 ${inningEnded ? 'bg-amber-950' : 'bg-slate-900'}`}>
      <div className={`border-b px-4 py-3 flex items-center justify-between transition-colors duration-300 ${inningEnded ? 'bg-amber-900 border-amber-800' : 'bg-slate-800 border-slate-700'}`}>
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-wider">{isHome ? 'Top of' : 'Bottom of'}</div>
          <div className="text-2xl font-bold">{inning}</div>
        </div>
        <div className="text-center">
          <div className="text-base font-bold text-white leading-tight">{activeLineup.teamName || 'Game'}</div>
          {activeLineup.league ? <div className="text-xs text-slate-400">{activeLineup.league}</div> : null}
          <div className="text-xs text-slate-500 mt-0.5">Defense</div>
        </div>
        <button
          onClick={() => setShowConfirm(true)}
          className="text-slate-500 hover:text-red-400 text-sm font-medium transition-colors py-2 px-1 -mr-1"
        >
          End Game
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {inningEnded ? (
          <div className="flex flex-col items-center gap-1 text-center pt-6">
            <div className="text-8xl font-black text-amber-300 leading-none">3</div>
            <div className="text-2xl font-bold text-amber-100 uppercase tracking-widest">Outs</div>
            <div className="text-amber-300/70 text-sm mt-2">Head to the dugout!</div>
          </div>
        ) : (
          <>
            {pitcher ? (
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Pitching</div>
                <div className="text-white font-bold text-xl">{pitcher.name}</div>
                {pitcher.position && <div className="text-slate-400 text-sm">{pitcher.position}</div>}
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={undoPitch}
                    disabled={currentPitchCount === 0}
                    className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white font-bold text-xl transition-colors"
                  >
                    −
                  </button>
                  <div className="text-center">
                    <div className="text-5xl font-black text-white">{currentPitchCount}</div>
                    <div className="text-slate-400 text-xs mt-1">pitches</div>
                  </div>
                  <button
                    onClick={addPitch}
                    className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xl transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 text-center">
                <div className="text-slate-400 text-sm">Tap a player below to select the pitcher</div>
              </div>
            )}

            <OutCounter outCount={outCount} onAdd={addOut} onRemove={removeOut} />
          </>
        )}

        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-4 py-2 border-b border-slate-700">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Pitchers</span>
          </div>
          <div className="divide-y divide-slate-700/50">
            {activeLineup.players.map((player, i) => {
              if (player.enabled === false || !player.name.trim()) return null
              const isActive = i === currentPitcherIndex
              const count = pitchCounts[String(i)] ?? 0
              return (
                <button
                  key={i}
                  onClick={() => selectPitcher(i)}
                  className={`w-full px-4 py-3 flex items-center gap-3 text-sm text-left transition-colors ${
                    isActive ? 'bg-blue-600/20' : 'hover:bg-slate-700/50'
                  }`}
                >
                  <span className={`font-medium flex-1 ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {player.name}
                  </span>
                  {player.position && (
                    <span className="text-slate-500 text-xs w-8 text-right">{player.position}</span>
                  )}
                  <span className={`text-sm font-bold w-8 text-right ${isActive ? 'text-blue-300' : 'text-slate-400'}`}>
                    {count > 0 ? count : '—'}
                  </span>
                  {isActive && (
                    <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold">P</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className={`px-4 pt-4 pb-safe-4 border-t transition-colors duration-300 ${inningEnded ? 'border-amber-800 bg-amber-950' : 'border-slate-700 bg-slate-900'}`}>
        {inningEnded && (
          <button
            onClick={switchToOffense}
            className="w-full py-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xl transition-colors flex items-center justify-center gap-2"
          >
            {isHome ? 'Start Batting' : `Start Inning ${inning + 1}`} <ArrowRight size={20} />
          </button>
        )}
      </div>

      {showConfirm && (
        <ConfirmModal
          message="End game? Your lineup will be saved for next time."
          onConfirm={() => { endGame(); setShowConfirm(false) }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  )
}
