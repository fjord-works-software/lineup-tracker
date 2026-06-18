import { useState } from 'react'
import { Share2, Trash2, ScanQrCode, Info } from 'lucide-react'
import ConfirmModal from './ConfirmModal'
import QRModal from './QRModal'
import QRScanModal from './QRScanModal'
import { buildShareUrl } from '../utils/share'

export default function HomeScreen({ lineups, newLineup, selectLineup, deleteLineup, onImportLineupCode }) {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [sharingLineup, setSharingLineup] = useState(null)
  const [sharingUrl, setSharingUrl] = useState(null)
  const [showQRScan, setShowQRScan] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  function openShareModal(lineup) {
    try {
      setSharingUrl(buildShareUrl(lineup))
      setSharingLineup(lineup)
    } catch {
      alert('Could not generate QR code for this lineup.')
    }
  }
  const lineupList = Object.values(lineups)

  return (
    <div className="h-screen bg-slate-50 flex flex-col">
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => setShowInfo(true)}
          className="w-10 flex justify-start text-slate-300 hover:text-white transition-colors"
          aria-label="About"
        >
          <Info size={22} />
        </button>
        <div className="flex items-center gap-3">
          <span className="text-4xl">⚾</span>
          <div>
            <h1 className="text-2xl font-bold tracking-wide text-white">Lineup Tracker</h1>
            <p className="text-slate-300 text-sm mt-1">Select a team to manage</p>
          </div>
        </div>
        <button
          onClick={() => setShowQRScan(true)}
          className="w-10 flex justify-end text-slate-300 hover:text-white transition-colors"
          aria-label="Scan QR code"
        >
          <ScanQrCode size={22} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {lineupList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-20 gap-4">
            <div className="text-5xl">⚾</div>
            <p className="text-slate-500 text-center">No lineups yet.<br />Create your first team to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lineupList.map(lineup => {
              const playerCount = lineup.players.filter(p => p.name.trim()).length
              return (
                <div key={lineup.id} className="bg-white border border-slate-200 rounded-xl flex items-center">
                  <button
                    onClick={() => selectLineup(lineup.id)}
                    className="flex-1 px-4 py-4 text-left rounded-l-xl active:bg-slate-100 transition-colors"
                  >
                    <div className="font-bold text-slate-900 text-lg leading-tight">
                      {lineup.teamName || <span className="text-slate-400 italic">Unnamed Team</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {lineup.league && (
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {lineup.league}
                        </span>
                      )}
                      <span className="text-slate-500 text-xs">
                        {playerCount} {playerCount === 1 ? 'player' : 'players'}
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => openShareModal(lineup)}
                    className="px-3 py-4 text-slate-500 hover:text-blue-600 active:text-blue-700 transition-colors text-lg"
                    aria-label="Share lineup"
                  >
                    <Share2 size={18} />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(lineup.id)}
                    className="px-3 py-4 text-slate-500 hover:text-red-500 active:text-red-600 transition-colors text-lg"
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

      <div className="px-4 pt-4 pb-safe-4 border-t border-slate-200 bg-white">
        <button
          onClick={newLineup}
          className="w-full py-4 rounded-xl bg-blue-700 hover:bg-blue-600 active:bg-blue-800 active:scale-[0.98] text-white font-bold text-lg transition"
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
          shareUrl={sharingUrl}
          onClose={() => { setSharingLineup(null); setSharingUrl(null) }}
        />
      )}

      {showInfo && (
        <div className="fixed inset-0 bg-black/70 grid place-items-center z-50 px-6">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-sm p-6 text-center">
            <div className="text-blue-700 font-bold text-xl mb-1">Lineup Tracker</div>
            <p className="text-slate-500 text-sm mb-4">Built by Fjord Works Software LLC</p>
            <button
              onClick={() => window.open('https://fjordworkssoftware.com', '_blank', 'noopener,noreferrer')}
              className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
            >
              fjordworkssoftware.com
            </button>
            <button
              onClick={() => setShowInfo(false)}
              className="block w-full mt-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
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
