import { useState } from 'react'
import ConfirmModal from './ConfirmModal'

const POSITIONS = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH', 'EH', 'BN']

const emptyPlayer = () => ({ name: '', number: '', position: '', enabled: true })

export default function LineupSetup({ lineup, onSave, onStart, onBack }) {
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null)
  const [league, setLeague] = useState(lineup.league)
  const [teamName, setTeamName] = useState(lineup.teamName)
  const [players, setPlayers] = useState(
    lineup.players.length >= 2 ? lineup.players : [emptyPlayer(), emptyPlayer()]
  )

  function save(patch) {
    onSave({ league, teamName, players, ...patch })
  }

  function handleLeagueChange(val) {
    setLeague(val)
    onSave({ league: val, teamName, players })
  }

  function handleTeamNameChange(val) {
    setTeamName(val)
    onSave({ league, teamName: val, players })
  }

  function updatePlayer(i, field, value) {
    const next = players.map((p, idx) => idx === i ? { ...p, [field]: value } : p)
    setPlayers(next)
    onSave({ league, teamName, players: next })
  }

  function togglePlayer(i) {
    const next = players.map((p, idx) => idx === i ? { ...p, enabled: !p.enabled } : p)
    setPlayers(next)
    onSave({ league, teamName, players: next })
  }

  function addPlayer() {
    if (players.length >= 15) return
    const next = [...players, emptyPlayer()]
    setPlayers(next)
    onSave({ league, teamName, players: next })
  }

  function removePlayer(i) {
    if (players.length <= 2) return
    const next = players.filter((_, idx) => idx !== i)
    setPlayers(next)
    onSave({ league, teamName, players: next })
  }

  function moveUp(i) {
    if (i === 0) return
    const next = [...players]
    ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
    setPlayers(next)
    onSave({ league, teamName, players: next })
  }

  function moveDown(i) {
    if (i === players.length - 1) return
    const next = [...players]
    ;[next[i], next[i + 1]] = [next[i + 1], next[i]]
    setPlayers(next)
    onSave({ league, teamName, players: next })
  }

  function handleStart() {
    const validPlayers = players.filter(p => p.name.trim())
    const enabledCount = validPlayers.filter(p => p.enabled !== false).length
    if (enabledCount < 2) return
    save({ players: validPlayers })
    onStart()
  }

  const validCount = players.filter(p => p.name.trim()).length
  const enabledCount = players.filter(p => p.name.trim() && p.enabled !== false).length
  const canStart = enabledCount >= 2

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="text-slate-400 hover:text-white text-xl p-2 -ml-2">‹</button>
        <div className="flex-1">
          <h1 className="text-lg font-bold leading-tight">{teamName || 'New Lineup'}</h1>
          {league ? <p className="text-slate-400 text-xs">{league}</p> : null}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 space-y-3">
          <div>
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1">Team Name</label>
            <input
              type="text"
              placeholder="e.g. Tigers"
              value={teamName}
              onChange={e => handleTeamNameChange(e.target.value)}
              className="w-full bg-slate-700 rounded-lg px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1">League</label>
            <input
              type="text"
              placeholder="e.g. Westside Little League"
              value={league}
              onChange={e => handleLeagueChange(e.target.value)}
              className="w-full bg-slate-700 rounded-lg px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider px-1">Batting Order</div>

        {players.map((player, i) => {
          const disabled = player.enabled === false
          return (
            <div key={i} className={`rounded-xl p-3 border transition-opacity ${disabled ? 'bg-slate-800/50 border-slate-700/50 opacity-50' : 'bg-slate-800 border-slate-700'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-slate-500 font-bold w-6 text-center text-sm">{i + 1}</span>
                <div className="flex flex-col">
                  <button onClick={() => moveUp(i)} disabled={i === 0} className="text-slate-500 hover:text-white disabled:opacity-20 text-sm py-2.5 px-2">▲</button>
                  <button onClick={() => moveDown(i)} disabled={i === players.length - 1} className="text-slate-500 hover:text-white disabled:opacity-20 text-sm py-2.5 px-2">▼</button>
                </div>
                <input
                  type="text"
                  placeholder="Player name *"
                  value={player.name}
                  onChange={e => updatePlayer(i, 'name', e.target.value)}
                  className="flex-1 bg-slate-700 rounded-lg px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => togglePlayer(i)}
                  className={`p-2.5 text-lg transition-colors ${disabled ? 'text-slate-600 hover:text-green-400' : 'text-green-500 hover:text-slate-400'}`}
                  title={disabled ? 'Enable player' : 'Bench player'}
                >
                  {disabled ? '○' : '●'}
                </button>
                <button onClick={() => setConfirmDeleteIndex(i)} disabled={players.length <= 2} className="text-slate-500 hover:text-red-400 disabled:opacity-20 p-2.5 text-lg">✕</button>
              </div>
              <div className="flex gap-2 pl-9">
                <input
                  type="text"
                  placeholder="#"
                  value={player.number}
                  onChange={e => updatePlayer(i, 'number', e.target.value)}
                  maxLength={3}
                  className="w-16 bg-slate-700 rounded-lg px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                  inputMode='numeric'
                />
                <select
                  value={player.position}
                  onChange={e => updatePlayer(i, 'position', e.target.value)}
                  className="flex-1 bg-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Position</option>
                  {POSITIONS.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                </select>
              </div>
            </div>
          )
        })}
      </div>

      <div className="px-4 pt-4 pb-safe-4 space-y-3 border-t border-slate-700 bg-slate-900">
        {players.length < 15 && (
          <button onClick={addPlayer} className="w-full py-3 rounded-xl border-2 border-dashed border-slate-600 text-slate-400 hover:border-blue-500 hover:text-blue-400 transition-colors text-sm font-medium">
            + Add Player
          </button>
        )}
        <button
          onClick={handleStart}
          disabled={!canStart}
          className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold text-lg transition-colors"
        >
          {canStart ? `Start Game (${enabledCount} of ${validCount} active)` : 'Need at least 2 active players'}
        </button>
      </div>

      {confirmDeleteIndex !== null && (
        <ConfirmModal
          message={`Remove ${players[confirmDeleteIndex]?.name || 'this player'} from the lineup?`}
          confirmLabel="Remove"
          onConfirm={() => { removePlayer(confirmDeleteIndex); setConfirmDeleteIndex(null) }}
          onCancel={() => setConfirmDeleteIndex(null)}
        />
      )}
    </div>
  )
}
