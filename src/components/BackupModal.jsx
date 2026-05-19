import { useState } from 'react'
import { decodeBackup } from '../utils/share'

export default function BackupModal({ onRestore, onCancel }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState(null)

  function handleRestore() {
    try {
      onRestore(decodeBackup(code))
    } catch {
      setError('Invalid backup code — paste the full code exactly as exported.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-6">
      <div className="bg-slate-800 rounded-2xl border border-slate-600 p-6 w-full max-w-sm">
        <h2 className="text-white font-bold text-lg mb-1">Restore Backup</h2>
        <p className="text-slate-400 text-sm mb-4">Paste your backup code below. Any lineups not in the backup will be kept.</p>
        <textarea
          className="w-full bg-slate-700 text-white text-xs rounded-xl p-3 h-32 resize-none font-mono border border-slate-600 focus:outline-none focus:border-blue-500"
          placeholder="Paste backup code here..."
          value={code}
          onChange={e => { setCode(e.target.value); setError(null) }}
          autoFocus
        />
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        <div className="flex gap-3 mt-4">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleRestore}
            disabled={!code.trim()}
            className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold transition-colors"
          >
            Restore
          </button>
        </div>
      </div>
    </div>
  )
}
