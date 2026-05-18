import { useState } from 'react'
import { ArrowRight, Undo2 } from 'lucide-react'
import BatterSpotlight from './BatterSpotlight'
import OutCounter from './OutCounter'
import LineupRoll from './LineupRoll'
import ConfirmModal from './ConfirmModal'
import { onDeckIndex, inHoleIndex } from '../utils/lineup'

export default function GameView({ activeLineup, state, nextBatter, undoBatter, addOut, removeOut, endInning, endGame }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const { currentBatterIndex, outCount, inning } = state
  const players = activeLineup.players

  const atBat = players[currentBatterIndex]
  const onDeck = players[onDeckIndex(players, currentBatterIndex)]
  const inHole = players[inHoleIndex(players, currentBatterIndex)]

  const inningEnded = outCount === 3

  return (
    <div className={`h-screen text-white flex flex-col transition-colors duration-300 ${inningEnded ? 'bg-amber-950' : 'bg-slate-900'}`}>
      <div className={`border-b px-4 py-3 flex items-center justify-between transition-colors duration-300 ${inningEnded ? 'bg-amber-900 border-amber-800' : 'bg-slate-800 border-slate-700'}`}>
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-wider">Inning</div>
          <div className="text-2xl font-bold">{inning}</div>
        </div>
        <div className="text-center">
          <div className="text-base font-bold text-white leading-tight">{activeLineup.teamName || 'Game'}</div>
          {activeLineup.league ? <div className="text-xs text-slate-400">{activeLineup.league}</div> : null}
        </div>
        <button
          onClick={() => setShowConfirm(true)}
          className="text-slate-500 hover:text-red-400 text-sm font-medium transition-colors py-2 px-1 -mr-1"
        >
          End Game
        </button>
      </div>

      {inningEnded ? (
        <div className="px-4 pt-8 pb-4 flex flex-col items-center gap-1 text-center">
          <div className="text-8xl font-black text-amber-300 leading-none">3</div>
          <div className="text-2xl font-bold text-amber-100 uppercase tracking-widest">Outs</div>
          <div className="text-amber-300 mt-3 text-lg">{onDeck?.name} leads off inning {inning + 1}</div>
        </div>
      ) : (
        <div className="px-4 pt-4 space-y-4">
          <BatterSpotlight atBat={atBat} onDeck={onDeck} inHole={inHole} />
          <OutCounter outCount={outCount} onAdd={addOut} onRemove={removeOut} />
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <LineupRoll lineup={players} currentBatterIndex={currentBatterIndex} />
      </div>

      <div className={`px-4 pt-4 pb-safe-4 border-t transition-colors duration-300 ${inningEnded ? 'border-amber-800 bg-amber-950' : 'border-slate-700 bg-slate-900'}`}>
        {inningEnded ? (
          <button
            onClick={endInning}
            className="w-full py-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xl transition-colors"
          >
            <span className="flex items-center justify-center gap-2">Start Inning {inning + 1} <ArrowRight size={20} /></span>
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={undoBatter}
              className="px-5 py-5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xl transition-colors"
              aria-label="Undo last batter"
            >
              <Undo2 size={22} />
            </button>
            <button
              onClick={nextBatter}
              className="flex-1 py-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xl transition-colors"
            >
              <span className="flex items-center justify-center gap-2">Next Batter <ArrowRight size={20} /></span>
            </button>
          </div>
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
