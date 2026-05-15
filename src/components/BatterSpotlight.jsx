function PlayerCard({ label, player, size = 'sm' }) {
  if (!player) return null
  const isMain = size === 'lg'
  return (
    <div className={`rounded-xl border ${isMain
      ? 'bg-blue-600 border-blue-400 p-5'
      : 'bg-slate-800 border-slate-600 p-3'
    }`}>
      <div className={`font-bold uppercase tracking-widest mb-1 ${isMain
        ? 'text-blue-200 text-xs'
        : 'text-slate-500 text-xs'
      }`}>
        {label}
      </div>
      <div className={`font-bold leading-tight ${isMain ? 'text-white text-3xl' : 'text-slate-200 text-xl'}`}>
        {player.name}
      </div>
      <div className={`mt-1 flex gap-3 ${isMain ? 'text-blue-200' : 'text-slate-400'} text-sm`}>
        {player.number && <span>#{player.number}</span>}
        {player.position && <span>{player.position}</span>}
      </div>
    </div>
  )
}

export default function BatterSpotlight({ atBat, onDeck, inHole }) {
  return (
    <div className="space-y-2">
      <PlayerCard label="At Bat" player={atBat} size="lg" />
      <div className="grid grid-cols-2 gap-2">
        <PlayerCard label="On Deck" player={onDeck} size="sm" />
        <PlayerCard label="In the Hole" player={inHole} size="sm" />
      </div>
    </div>
  )
}
