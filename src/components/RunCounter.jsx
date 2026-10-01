export default function RunCounter({ totalRuns, inningRuns, runRule, onAdd, onRemove }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onRemove}
          disabled={inningRuns === 0}
          className="w-11 h-11 rounded-full bg-slate-200 hover:bg-slate-300 active:bg-slate-400 active:scale-95 disabled:opacity-30 disabled:active:scale-100 text-slate-700 font-bold text-xl transition"
          aria-label="Remove run"
        >
          −
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-slate-900 text-3xl font-black leading-none">{totalRuns}</span>
            <span className="text-slate-700 text-base font-semibold">{totalRuns === 1 ? 'Run' : 'Runs'}</span>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
            {runRule ? `${inningRuns} of ${runRule}` : inningRuns} this inning
          </span>
        </div>

        <button
          onClick={onAdd}
          className="w-11 h-11 rounded-full bg-slate-200 hover:bg-slate-300 active:bg-slate-400 active:scale-95 text-slate-700 font-bold text-xl transition"
          aria-label="Add run"
        >
          +
        </button>
      </div>
    </div>
  )
}
