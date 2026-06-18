import { onDeckIndex, inHoleIndex } from '../utils/lineup'

export default function LineupRoll({ lineup, currentBatterIndex }) {
  const onDeck = onDeckIndex(lineup, currentBatterIndex)
  const inHole = inHoleIndex(lineup, currentBatterIndex)

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-2 border-b border-slate-200">
        <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Full Lineup</span>
      </div>
      <div className="divide-y divide-slate-200">
        {lineup.map((player, i) => {
          if (player.enabled === false) return null
          const disabled = false
          const isAtBat = !disabled && i === currentBatterIndex
          const isOnDeck = !disabled && i === onDeck
          const isInHole = !disabled && i === inHole

          let rowClass = 'px-4 py-2.5 flex items-center gap-3 text-sm'
          let nameClass = 'font-medium'
          let badge = null

          if (isAtBat) {
            rowClass += ' bg-blue-50'
            nameClass += ' text-slate-900'
            badge = <span className="text-xs bg-blue-700 text-white px-1.5 py-0.5 rounded font-bold">up</span>
          } else if (isOnDeck) {
            nameClass += ' text-green-700'
            badge = <span className="text-xs bg-green-700 text-white px-1.5 py-0.5 rounded font-bold">deck</span>
          } else if (isInHole) {
            nameClass += ' text-amber-700'
            badge = <span className="text-xs bg-amber-700 text-amber-50 px-1.5 py-0.5 rounded font-bold">hole</span>
          } else {
            nameClass += ' text-slate-500'
          }

          return (
            <div key={i} className={rowClass}>
              <span className="text-slate-400 w-5 text-center text-xs font-mono">{i + 1}</span>
              <span className={nameClass}>{player.name}</span>
              {badge}
              <div className="ml-auto flex items-center gap-3">
                {player.number && <span className="text-slate-400 text-xs">#{player.number}</span>}
                {player.position && <span className="text-slate-400 text-xs w-8 text-right">{player.position}</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
