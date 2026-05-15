import { useState } from 'react'

const POSITIONS = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH', 'EH', 'BN']

const emptyPlayer = () => ({ name: '', number: '', position: '' })

export default function LineupSetup({ onStart, savedLineup }) {
  const [players, setPlayers] = useState(
    savedLineup?.length >= 2 ? savedLineup : [emptyPlayer(), emptyPlayer()]
  )

  function updatePlayer(i, field, value) {
    setPlayers(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p))
  }

  function addPlayer() {
    if (players.length < 15) setPlayers(prev => [...prev, emptyPlayer()])
  }

  function removePlayer(i) {
    if (players.length > 2) setPlayers(prev => prev.filter((_, idx) => idx !== i))
  }

  function moveUp(i) {
    if (i === 0) return
    setPlayers(prev => {
      const next = [...prev]
      ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
      return next
    })
  }

  function moveDown(i) {
    if (i === players.length - 1) return
    setPlayers(prev => {
      const next = [...prev]
      ;[next[i], next[i + 1]] = [next[i + 1], next[i]]
      return next
    })
  }

  function handleStart() {
    const lineup = players.filter(p => p.name.trim())
    if (lineup.length >= 2) onStart(lineup)
  }

  const validCount = players.filter(p => p.name.trim()).length
  const canStart = validCount >= 2

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-4">
        <h1 className="text-2xl font-bold text-center tracking-wide">Lineup Tracker</h1>
        <p className="text-slate-400 text-sm text-center mt-1">Enter your batting order</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {players.map((player, i) => (
          <div key={i} className="bg-slate-800 rounded-xl p-3 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-slate-500 font-bold w-6 text-center text-sm">{i + 1}</span>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveUp(i)}
                  disabled={i === 0}
                  className="text-slate-500 hover:text-white disabled:opacity-20 text-xs leading-none"
                >▲</button>
                <button
                  onClick={() => moveDown(i)}
                  disabled={i === players.length - 1}
                  className="text-slate-500 hover:text-white disabled:opacity-20 text-xs leading-none"
                >▼</button>
              </div>
              <input
                type="text"
                placeholder="Player name *"
                value={player.name}
                onChange={e => updatePlayer(i, 'name', e.target.value)}
                className="flex-1 bg-slate-700 rounded-lg px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => removePlayer(i)}
                disabled={players.length <= 2}
                className="text-slate-500 hover:text-red-400 disabled:opacity-20 px-1 text-lg leading-none"
              >✕</button>
            </div>
            <div className="flex gap-2 pl-9">
              <input
                type="text"
                placeholder="#"
                value={player.number}
                onChange={e => updatePlayer(i, 'number', e.target.value)}
                maxLength={3}
                className="w-16 bg-slate-700 rounded-lg px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
              />
              <select
                value={player.position}
                onChange={e => updatePlayer(i, 'position', e.target.value)}
                className="flex-1 bg-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Position</option>
                {POSITIONS.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-4 space-y-3 border-t border-slate-700 bg-slate-900">
        {players.length < 15 && (
          <button
            onClick={addPlayer}
            className="w-full py-3 rounded-xl border-2 border-dashed border-slate-600 text-slate-400 hover:border-blue-500 hover:text-blue-400 transition-colors text-sm font-medium"
          >
            + Add Player
          </button>
        )}
        <button
          onClick={handleStart}
          disabled={!canStart}
          className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold text-lg transition-colors"
        >
          {canStart ? `Start Game (${validCount} players)` : 'Add at least 2 players'}
        </button>
      </div>
    </div>
  )
}
