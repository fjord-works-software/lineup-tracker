import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import QRCode from 'qrcode'

export default function QRModal({ lineup, shareUrl, onClose }) {
  const [qrDataUrl, setQrDataUrl] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    QRCode.toDataURL(shareUrl, { width: 512, margin: 2, color: { dark: '#0f172a', light: '#ffffff' } })
      .then(setQrDataUrl)
  }, [shareUrl])

  function copyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="fixed inset-0 bg-black/70 grid place-items-center z-50 px-6">
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-6 flex flex-col items-center gap-4">
        <div className="text-center">
          <div className="text-blue-700 font-bold text-xl">{lineup.teamName || 'Unnamed Team'}</div>
          {lineup.league && <div className="text-slate-500 text-sm">{lineup.league}</div>}
          <div className="text-slate-500 text-xs mt-1">Scan to import this lineup</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 w-full">
          {qrDataUrl
            ? <img src={qrDataUrl} alt="QR code" className="w-full h-auto" />
            : <div className="w-full aspect-square flex items-center justify-center text-slate-400 text-sm">Generating…</div>
          }
        </div>

        <button
          onClick={copyLink}
          className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 active:scale-[0.98] text-slate-700 font-medium transition text-sm"
        >
          {copied ? <span className="flex items-center justify-center gap-1.5"><Check size={14} /> Link Copied!</span> : 'Copy Link'}
        </button>

        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-900 text-sm transition-colors py-2 px-8"
        >
          Close
        </button>
      </div>
    </div>
  )
}
