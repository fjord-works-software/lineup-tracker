export default function OutCounter({ outCount, onAdd, onRemove }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onRemove}
          disabled={outCount === 0}
          className="w-10 h-10 rounded-full bg-slate-200 hover:bg-slate-300 disabled:opacity-30 text-slate-700 font-bold text-lg transition-colors"
        >
          −
        </button>

        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className={`w-5 h-5 rounded-full border-2 transition-colors ${
                  i < outCount
                    ? 'bg-red-500 border-red-400'
                    : 'bg-transparent border-slate-300'
                }`}
              />
            ))}
          </div>
          <span className="text-slate-600 text-sm font-medium">
            {outCount === 1 ? '1 Out' : `${outCount} Outs`}
          </span>
        </div>

        <button
          onClick={onAdd}
          disabled={outCount === 3}
          className="w-10 h-10 rounded-full bg-slate-200 hover:bg-slate-300 disabled:opacity-30 text-slate-700 font-bold text-lg transition-colors"
        >
          +
        </button>
      </div>
    </div>
  )
}
