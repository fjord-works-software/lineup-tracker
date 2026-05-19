export default function GameHeader({ teamName, league, inning, inningLabel, subtitle, inningEnded, onEndGame }) {
  return (
    <div className={`border-b px-4 py-3 flex items-center justify-between transition-colors duration-300 ${inningEnded ? 'bg-amber-900 border-amber-800' : 'bg-slate-800 border-slate-700'}`}>
      <div>
        <div className="text-xs text-slate-400 uppercase tracking-wider">{inningLabel}</div>
        <div className="text-2xl font-bold">{inning}</div>
      </div>
      <div className="text-center">
        <div className="text-base font-bold text-white leading-tight">{teamName || 'Game'}</div>
        {league ? <div className="text-xs text-slate-400">{league}</div> : null}
        {subtitle ? <div className="text-xs text-slate-500 mt-0.5">{subtitle}</div> : null}
      </div>
      <button
        onClick={onEndGame}
        className="text-slate-500 hover:text-red-400 text-sm font-medium transition-colors py-2 px-1 -mr-1"
      >
        End Game
      </button>
    </div>
  )
}
