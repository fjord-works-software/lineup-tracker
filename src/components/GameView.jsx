import { useState } from 'react'
import { ArrowRight, Undo2 } from 'lucide-react'
import BatterSpotlight from './BatterSpotlight'
import OutCounter from './OutCounter'
import RunCounter from './RunCounter'
import LineupRoll from './LineupRoll'
import ConfirmModal from './ConfirmModal'
import { onDeckIndex, inHoleIndex } from '../utils/lineup'

export default function GameView({ activeLineup, state, nextBatter, undoBatter, addOut, removeOut, addRun, removeRun, endInning, endGame }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const { currentBatterIndex, outCount, runsByInning, inning } = state
  const players = activeLineup.players
  const totalRuns = runsByInning.reduce((sum, r) => sum + r, 0)
  const inningRuns = runsByInning[inning - 1]
  const runRule = activeLineup.runRule

  const atBat = players[currentBatterIndex]
  const onDeck = players[onDeckIndex(players, currentBatterIndex)]
  const inHole = players[inHoleIndex(players, currentBatterIndex)]

  // Like 3 outs, reaching the run rule is derived rather than stored, so
  // removing a mis-tapped run on the interstitial resumes the inning.
  const endedByOuts = outCount === 3
  const inningEnded = endedByOuts || (runRule > 0 && inningRuns >= runRule)

  // While the inning-ended interstitial is showing, currentBatterIndex still
  // points at the batter who made the 3rd out (or drove in the final run). The
  // next inning leads off with the on-deck batter, so advance the roll's
  // highlight to match the headline.
  const rollIndex = inningEnded ? onDeckIndex(players, currentBatterIndex) : currentBatterIndex

  return (
    <div className={`h-screen flex flex-col transition-colors duration-300 ${inningEnded ? 'bg-amber-50' : 'bg-slate-50'}`}>
      <div className={`border-b px-4 py-3 flex items-center justify-between transition-colors duration-300 ${inningEnded ? 'bg-amber-800 border-amber-700' : 'bg-slate-900 border-slate-800'}`}>
        <div>
          <div className="text-xs text-slate-300 uppercase tracking-wider">Inning</div>
          <div className="text-2xl font-bold text-white">{inning}</div>
        </div>
        <div className="text-center">
          <div className="text-base font-bold text-white leading-tight">{activeLineup.teamName || 'Game'}</div>
          {activeLineup.league ? <div className="text-xs text-slate-300">{activeLineup.league}</div> : null}
        </div>
        <button
          onClick={() => setShowConfirm(true)}
          className="text-slate-400 hover:text-red-300 text-sm font-medium transition-colors py-2 px-1 -mr-1"
        >
          End Game
        </button>
      </div>

      {inningEnded ? (
        <div className="px-4 pt-8 space-y-4">
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="text-8xl font-black text-amber-600 leading-none">{endedByOuts ? 3 : runRule}</div>
            <div className="text-2xl font-bold text-amber-800 uppercase tracking-widest">{endedByOuts ? 'Outs' : 'Run Rule'}</div>
            <div className="text-amber-700 mt-3 text-lg">{onDeck?.name} leads off inning {inning + 1}</div>
          </div>
          {/* Still adjustable here so a run scored on the final play can be recorded, or a mis-tap undone. */}
          <RunCounter totalRuns={totalRuns} inningRuns={inningRuns} runRule={runRule} onAdd={addRun} onRemove={removeRun} />
        </div>
      ) : (
        <div className="px-4 pt-4 space-y-4">
          <BatterSpotlight atBat={atBat} onDeck={onDeck} inHole={inHole} />
          <OutCounter outCount={outCount} onAdd={addOut} onRemove={removeOut} />
          <RunCounter totalRuns={totalRuns} inningRuns={inningRuns} runRule={runRule} onAdd={addRun} onRemove={removeRun} />
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <LineupRoll lineup={players} currentBatterIndex={rollIndex} />
      </div>

      <div className={`px-4 pt-4 pb-safe-4 border-t transition-colors duration-300 ${inningEnded ? 'border-amber-300 bg-amber-50' : 'border-slate-200 bg-white'}`}>
        {inningEnded ? (
          <button
            onClick={endInning}
            className="w-full py-5 rounded-xl bg-amber-600 hover:bg-amber-500 active:bg-amber-700 active:scale-[0.98] text-white font-bold text-xl transition"
          >
            <span className="flex items-center justify-center gap-2">Start Inning {inning + 1} <ArrowRight size={20} /></span>
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={undoBatter}
              className="px-5 py-5 rounded-xl bg-slate-200 hover:bg-slate-300 active:bg-slate-400 active:scale-95 text-slate-700 font-bold text-xl transition"
              aria-label="Undo last batter"
            >
              <Undo2 size={22} />
            </button>
            <button
              onClick={nextBatter}
              className="flex-1 py-5 rounded-xl bg-blue-700 hover:bg-blue-600 active:bg-blue-800 active:scale-[0.98] text-white font-bold text-xl transition"
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
