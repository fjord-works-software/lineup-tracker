export default function StartGameModal({ players, teamName, onConfirm, onCancel }) {
  const battingOrder = players.filter(p => p.name.trim() && p.enabled !== false)

  return (
    <div className="fixed inset-0 bg-black/70 grid place-items-center z-50 px-6">
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-sm max-h-[85vh] flex flex-col">
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-blue-700 font-bold text-xl">{teamName || 'Lineup'}</h2>
          <p className="text-slate-500 text-sm mt-0.5">Review batting order before starting</p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-2">
          {battingOrder.map((player, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-slate-400 text-sm font-bold w-5 text-right">{i + 1}</span>
              <div className="flex-1 flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                <span className="text-slate-900 font-medium text-sm">{player.name}</span>
                <div className="flex items-center gap-2">
                  {player.number && <span className="text-slate-500 text-xs">#{player.number}</span>}
                  {player.position && (
                    <span className="text-slate-500 text-xs bg-slate-200 px-1.5 py-0.5 rounded">{player.position}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-slate-200">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
          >
            Edit Lineup
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold transition-colors"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  )
}
