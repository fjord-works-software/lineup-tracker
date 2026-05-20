export default function ImportModal({ lineup, existingLineup, onAdd, onUpdate, onCancel }) {
  const activePlayers = lineup.players.filter(p => p.name.trim() && p.enabled !== false)

  return (
    <div className="fixed inset-0 bg-black/70 grid place-items-center z-50 px-6">
      <div className="bg-slate-800 rounded-2xl border border-slate-600 w-full max-w-sm flex flex-col max-h-[85vh] p-6">
        <div className="mb-4 shrink-0">
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Incoming Lineup</div>
          <div className="text-white font-bold text-xl">{lineup.teamName || 'Unnamed Team'}</div>
          {lineup.league && <div className="text-slate-400 text-sm mt-0.5">{lineup.league}</div>}
        </div>

        <div className="bg-slate-900 rounded-xl divide-y divide-slate-700/50 overflow-y-auto mb-5 min-h-0">
          {activePlayers.map((player, i) => (
            <div key={i} className="px-3 py-2 flex items-center gap-2 text-sm">
              <span className="text-slate-600 w-5 text-center text-xs">{i + 1}</span>
              <span className="text-slate-200 flex-1">{player.name}</span>
              {player.number && <span className="text-slate-500 text-xs">#{player.number}</span>}
              {player.position && <span className="text-slate-500 text-xs">{player.position}</span>}
            </div>
          ))}
        </div>

        <div className="flex gap-3 shrink-0">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors"
          >
            Cancel
          </button>
          {existingLineup ? (
            <>
              <button
                onClick={onAdd}
                className="flex-1 py-3 rounded-xl bg-slate-600 hover:bg-slate-500 text-white font-medium transition-colors"
              >
                Add as New
              </button>
              <button
                onClick={onUpdate}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors"
              >
                Update Existing
              </button>
            </>
          ) : (
            <button
              onClick={onAdd}
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors"
            >
              Add to My Lineups
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
