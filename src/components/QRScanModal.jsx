import { useRef, useEffect, useState } from 'react'
import QrScanner from 'qr-scanner'
import { decodeLineup } from '../utils/share'

export default function QRScanModal({ onImport, onCancel }) {
  const videoRef = useRef(null)
  const scannerRef = useRef(null)
  const [error, setError] = useState(null)
  const [mirrored, setMirrored] = useState(false)

  useEffect(() => {
    const scanner = new QrScanner(
      videoRef.current,
      result => {
        try {
          const url = result.data
          const hashIndex = url.indexOf('#import=')
          if (hashIndex === -1) throw new Error('not a lineup QR code')
          const encoded = url.slice(hashIndex + '#import='.length)
          onImport(decodeLineup(encoded))
        } catch {
          setError('That QR code doesn\'t contain a lineup. Try again.')
          scanner.stop()
        }
      },
      { preferredCamera: 'environment', returnDetailedScanResult: true }
    )
    scannerRef.current = scanner

    scanner.start().then(() => {
      const track = videoRef.current?.srcObject?.getVideoTracks()[0]
      const facingMode = track?.getSettings()?.facingMode
      setMirrored(facingMode === 'user')
    }).catch(err => {
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Allow camera access and try again.')
      } else {
        setError('Could not start camera.')
      }
    })

    return () => scanner.destroy()
  }, [onImport])

  return (
    <div className="fixed inset-0 bg-black flex flex-col z-50">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80">
        <span className="text-white font-semibold">Scan Lineup QR Code</span>
        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-white text-sm font-medium transition-colors py-1 px-2"
        >
          Cancel
        </button>
      </div>

      <div className="flex-1 relative flex items-center justify-center bg-black">
        <video ref={videoRef} className={`w-full h-full object-cover${mirrored ? ' transform-[scaleX(-1)]' : ''}`} />
        {!error && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 border-2 border-white/60 rounded-2xl" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/70 px-8 text-center">
            <p className="text-white text-base">{error}</p>
            <button
              onClick={() => { setError(null); scannerRef.current?.start() }}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      <div className="px-4 py-3 bg-slate-900/80">
        <p className="text-slate-400 text-sm text-center">Point at a lineup QR code to import it</p>
      </div>
    </div>
  )
}
