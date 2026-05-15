import { onDeckIndex, inHoleIndex } from '../utils/lineup'

export default function LineupRoll({ lineup, currentBatterIndex }) {
  const onDeck = onDeckIndex(lineup, currentBatterIndex)
  const inHole = inHoleIndex(lineup, currentBatterIndex)

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="px-4 py-2 border-b border-slate-700">
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Full Lineup</span>
      </div>
      <div className="divide-y divide-slate-700/50">
        {lineup.map((player, i) => {
          if (player.enabled === false) return null
          const disabled = false
          const isAtBat = !disabled && i === currentBatterIndex
          const isOnDeck = !disabled && i === onDeck
          const isInHole = !disabled && i === inHole

          let rowClass = 'px-4 py-2.5 flex items-center gap-3 text-sm'
          let nameClass = 'font-medium flex-1'
          let badge = null

          if (isAtBat) {
            rowClass += ' bg-blue-600/20'
            nameClass += ' text-white'
            badge = <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold">UP</span>
          } else if (isOnDeck) {
            nameClass += ' text-slate-200'
            badge = <span className="text-xs bg-slate-600 text-slate-300 px-1.5 py-0.5 rounded">deck</span>
          } else if (isInHole) {
            nameClass += ' text-slate-300'
            badge = <span className="text-xs bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">hole</span>
          } else {
            nameClass += ' text-slate-400'
          }

          return (
            <div key={i} className={rowClass}>
              <span className="text-slate-600 w-5 text-center text-xs font-mono">{i + 1}</span>
              <span className={nameClass}>{player.name}</span>
              {player.number && <span className="text-slate-500 text-xs">#{player.number}</span>}
              {player.position && <span className="text-slate-500 text-xs w-8 text-right">{player.position}</span>}
              {badge}
            </div>
          )
        })}
      </div>
    </div>
  )
}
