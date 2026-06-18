export default function OutCounter({ outCount, onAdd, onRemove }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onRemove}
          disabled={outCount === 0}
          className="w-11 h-11 rounded-full bg-slate-200 hover:bg-slate-300 active:bg-slate-400 active:scale-95 disabled:opacity-30 disabled:active:scale-100 text-slate-700 font-bold text-xl transition"
        >
          −
        </button>

        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full border-2 transition-colors ${
                  i < outCount
                    ? 'bg-red-600 border-red-600'
                    : 'bg-slate-100 border-slate-400'
                }`}
              />
            ))}
          </div>
          <span className="text-slate-700 text-base font-semibold">
            {outCount === 1 ? '1 Out' : `${outCount} Outs`}
          </span>
        </div>

        <button
          onClick={onAdd}
          disabled={outCount === 3}
          className="w-11 h-11 rounded-full bg-slate-200 hover:bg-slate-300 active:bg-slate-400 active:scale-95 disabled:opacity-30 disabled:active:scale-100 text-slate-700 font-bold text-xl transition"
        >
          +
        </button>
      </div>
    </div>
  )
}
