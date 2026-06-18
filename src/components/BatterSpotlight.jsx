const VARIANTS = {
  atbat:  { card: 'bg-blue-700 border-blue-500 p-5',    label: 'text-blue-200 text-xs',  name: 'text-white text-3xl',  detail: 'text-blue-200' },
  ondeck: { card: 'bg-green-700 border-green-500 p-3',  label: 'text-green-300 text-xs', name: 'text-white text-xl',   detail: 'text-green-300' },
  inhole: { card: 'bg-amber-700 border-amber-500 p-3',  label: 'text-amber-200 text-xs', name: 'text-white text-xl',   detail: 'text-amber-200' },
}

function PlayerCard({ label, player, variant = 'ondeck' }) {
  if (!player) return null
  const v = VARIANTS[variant]
  const isAtBat = variant === 'atbat'
  return (
    <div className={`rounded-xl border ${v.card}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className={`font-bold uppercase tracking-widest mb-1 ${v.label}`}>{label}</div>
          <div className={`font-bold leading-tight ${v.name}`}>{player.name}</div>
          <div className={`mt-1 flex gap-3 ${v.detail} text-sm`}>
            {!isAtBat && player.number && <span>#{player.number}</span>}
            {player.position && <span>{player.position}</span>}
          </div>
        </div>
        {isAtBat && player.number && (
          <div className="shrink-0 flex flex-col items-center justify-center bg-blue-800 rounded-xl px-4 py-2 leading-none">
            <span className="text-blue-300 text-[10px] font-bold tracking-widest">NO.</span>
            <span className="text-white text-4xl font-black">{player.number}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BatterSpotlight({ atBat, onDeck, inHole }) {
  return (
    <div className="space-y-2">
      <PlayerCard label="At Bat" player={atBat} variant="atbat" />
      <div className="grid grid-cols-2 gap-2">
        <PlayerCard label="On Deck" player={onDeck} variant="ondeck" />
        <PlayerCard label="In the Hole" player={inHole} variant="inhole" />
      </div>
    </div>
  )
}
