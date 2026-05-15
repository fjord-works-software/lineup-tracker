import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

export default function QRModal({ lineup, shareUrl, onClose }) {
  const [qrDataUrl, setQrDataUrl] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    QRCode.toDataURL(shareUrl, { width: 280, margin: 2, color: { dark: '#0f172a', light: '#f8fafc' } })
      .then(setQrDataUrl)
  }, [shareUrl])

  function copyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-6">
      <div className="bg-slate-800 rounded-2xl border border-slate-600 w-full max-w-sm p-6 flex flex-col items-center gap-4">
        <div className="text-center">
          <div className="text-white font-bold text-lg">{lineup.teamName || 'Unnamed Team'}</div>
          {lineup.league && <div className="text-slate-400 text-sm">{lineup.league}</div>}
          <div className="text-slate-500 text-xs mt-1">Scan to import this lineup</div>
        </div>

        <div className="bg-slate-100 rounded-xl p-2">
          {qrDataUrl
            ? <img src={qrDataUrl} alt="QR code" className="w-64 h-64" />
            : <div className="w-64 h-64 flex items-center justify-center text-slate-400 text-sm">Generating…</div>
          }
        </div>

        <button
          onClick={copyLink}
          className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors text-sm"
        >
          {copied ? '✓ Link Copied!' : 'Copy Link'}
        </button>

        <button
          onClick={onClose}
          className="text-slate-500 hover:text-white text-sm transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  )
}
