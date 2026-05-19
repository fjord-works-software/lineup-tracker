import { useState } from 'react'

export default function StartGameModal({ players, teamName, pitchType, onConfirm, onCancel }) {
  const [isHome, setIsHome] = useState(false)
  const battingOrder = players.filter(p => p.name.trim() && p.enabled !== false)

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50">
      <div className="bg-slate-800 rounded-t-2xl sm:rounded-2xl border border-slate-600 w-full max-w-sm max-h-[80vh] flex flex-col">
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-white font-bold text-lg">{teamName || 'Lineup'}</h2>
          <p className="text-slate-400 text-sm mt-0.5">Review batting order before starting</p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-2">
          {battingOrder.map((player, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-slate-500 text-sm font-bold w-5 text-right">{i + 1}</span>
              <div className="flex-1 flex items-center justify-between bg-slate-700 rounded-lg px-3 py-2">
                <span className="text-white font-medium text-sm">{player.name}</span>
                <div className="flex items-center gap-2">
                  {player.number && <span className="text-slate-400 text-xs">#{player.number}</span>}
                  {player.position && (
                    <span className="text-slate-400 text-xs bg-slate-600 px-1.5 py-0.5 rounded">{player.position}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {pitchType === 'kid' && (
          <div className="px-6 pb-4">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Batting order</div>
            <div className="flex rounded-lg overflow-hidden border border-slate-600">
              {[{ label: 'Guest (1st)', value: false }, { label: 'Home (2nd)', value: true }].map(opt => (
                <button
                  key={String(opt.value)}
                  onClick={() => setIsHome(opt.value)}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    isHome === opt.value ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 px-6 py-4 border-t border-slate-700">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors"
          >
            Edit Lineup
          </button>
          <button
            onClick={() => onConfirm(pitchType === 'kid' ? isHome : false)}
            className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  )
}
