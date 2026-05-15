import { useState } from 'react'
import BatterSpotlight from './BatterSpotlight'
import OutCounter from './OutCounter'
import LineupRoll from './LineupRoll'
import ConfirmModal from './ConfirmModal'
import { onDeckIndex, inHoleIndex } from '../utils/lineup'

export default function GameView({ state, nextBatter, addOut, removeOut, endInning, endGame }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const { lineup, currentBatterIndex, outCount, inning } = state

  const atBat = lineup[currentBatterIndex]
  const onDeck = lineup[onDeckIndex(currentBatterIndex, lineup.length)]
  const inHole = lineup[inHoleIndex(currentBatterIndex, lineup.length)]

  const inningEnded = outCount === 3

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-wider">Inning</div>
          <div className="text-2xl font-bold">{inning}</div>
        </div>
        <h1 className="text-lg font-bold text-slate-300">Lineup Tracker</h1>
        <button
          onClick={() => setShowConfirm(true)}
          className="text-slate-500 hover:text-red-400 text-sm font-medium transition-colors"
        >
          End Game
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <BatterSpotlight atBat={atBat} onDeck={onDeck} inHole={inHole} />
        <OutCounter outCount={outCount} onAdd={addOut} onRemove={removeOut} />
        <LineupRoll lineup={lineup} currentBatterIndex={currentBatterIndex} />
      </div>

      <div className="px-4 py-4 border-t border-slate-700 bg-slate-900">
        {inningEnded ? (
          <div className="space-y-2">
            <div className="text-center text-slate-400 text-sm">
              3 outs — {onDeck?.name} leads off next inning
            </div>
            <button
              onClick={endInning}
              className="w-full py-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xl transition-colors"
            >
              Start Inning {inning + 1} →
            </button>
          </div>
        ) : (
          <button
            onClick={nextBatter}
            className="w-full py-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xl transition-colors"
          >
            Next Batter →
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
