import { useState } from 'react'
import { Share2, Trash2, ScanQrCode } from 'lucide-react'
import ConfirmModal from './ConfirmModal'
import QRModal from './QRModal'
import QRScanModal from './QRScanModal'
import { buildShareUrl } from '../utils/share'

export default function HomeScreen({ lineups, newLineup, selectLineup, deleteLineup, onImportLineupCode }) {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [sharingLineup, setSharingLineup] = useState(null)
  const [showQRScan, setShowQRScan] = useState(false)
  const lineupList = Object.values(lineups)

  return (
    <div className="h-screen bg-slate-900 text-white flex flex-col">
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-4 flex items-center justify-between">
        <div className="w-10" />
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-wide">Lineup Tracker</h1>
          <p className="text-slate-400 text-sm mt-1">Select a team to manage</p>
        </div>
        <button
          onClick={() => setShowQRScan(true)}
          className="w-10 flex justify-end text-slate-400 hover:text-white transition-colors"
          aria-label="Scan QR code"
        >
          <ScanQrCode size={22} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {lineupList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-20 gap-4">
            <div className="text-5xl">⚾</div>
            <p className="text-slate-400 text-center">No lineups yet.<br />Create your first team to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lineupList.map(lineup => {
              const playerCount = lineup.players.filter(p => p.name.trim()).length
              return (
                <div key={lineup.id} className="bg-slate-800 border border-slate-700 rounded-xl flex items-center">
                  <button
                    onClick={() => selectLineup(lineup.id)}
                    className="flex-1 px-4 py-4 text-left"
                  >
                    <div className="font-bold text-white text-lg leading-tight">
                      {lineup.teamName || <span className="text-slate-500 italic">Unnamed Team</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {lineup.league && (
                        <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                          {lineup.league}
                        </span>
                      )}
                      <span className="text-slate-500 text-xs">
                        {playerCount} {playerCount === 1 ? 'player' : 'players'}
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => setSharingLineup(lineup)}
                    className="px-3 py-4 text-slate-500 hover:text-blue-400 transition-colors text-lg"
                    aria-label="Share lineup"
                  >
                    <Share2 size={18} />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(lineup.id)}
                    className="px-3 py-4 text-slate-600 hover:text-red-400 transition-colors text-lg"
                    aria-label="Delete lineup"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="px-4 pt-4 pb-safe-4 border-t border-slate-700 bg-slate-900">
        <button
          onClick={newLineup}
          className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-colors"
        >
          + New Lineup
        </button>
      </div>

      {confirmDeleteId && (
        <ConfirmModal
          message={`Delete "${lineups[confirmDeleteId]?.teamName || 'this lineup'}"? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={() => { deleteLineup(confirmDeleteId); setConfirmDeleteId(null) }}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}

      {sharingLineup && (
        <QRModal
          lineup={sharingLineup}
          shareUrl={buildShareUrl(sharingLineup)}
          onClose={() => setSharingLineup(null)}
        />
      )}

      {showQRScan && (
        <QRScanModal
          onImport={decoded => { onImportLineupCode(decoded); setShowQRScan(false) }}
          onCancel={() => setShowQRScan(false)}
        />
      )}
    </div>
  )
}
