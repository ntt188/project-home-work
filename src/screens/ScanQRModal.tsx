import { useEffect, useState } from 'react'
import { Icon } from '../components/Icon'
import { Button, IconButton } from '../components/ui'

/** Mock camera view. Auto-"detects" a QR code after a few seconds, or on tap. */
export function ScanQRModal({ onClose, onScanned }: { onClose: () => void; onScanned: () => void }) {
  const [detected, setDetected] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setDetected(true), 2600)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <div className="animate-fade-in absolute inset-0 z-40 flex flex-col bg-slate-950 text-white">
      <div className="flex items-center justify-between px-3 pt-3">
        <IconButton label="Close scanner" onClick={onClose} className="bg-white/10 text-white hover:bg-white/20">
          <Icon name="x" />
        </IconButton>
        <p className="font-semibold">Scan QR</p>
        <IconButton label="Flashlight" className="bg-white/10 text-white hover:bg-white/20">
          <Icon name="flashlight" />
        </IconButton>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-10">
        <p className="mb-6 text-center text-sm text-white/70">Point your camera at the QR code on the restaurant counter</p>
        <div className="relative aspect-square w-full max-w-64 rounded-3xl bg-[radial-gradient(circle_at_50%_40%,#334155,#0f172a)]">
          {/* corner brackets */}
          {['top-0 left-0 border-t-4 border-l-4 rounded-tl-3xl', 'top-0 right-0 border-t-4 border-r-4 rounded-tr-3xl', 'bottom-0 left-0 border-b-4 border-l-4 rounded-bl-3xl', 'bottom-0 right-0 border-b-4 border-r-4 rounded-br-3xl'].map(
            (c) => (
              <span key={c} className={`absolute size-10 ${detected ? 'border-emerald-400' : 'border-brand-400'} transition-colors ${c}`} />
            ),
          )}
          <div className={`absolute inset-10 grid place-items-center transition ${detected ? 'opacity-100' : 'opacity-30'}`}>
            <Icon name="qr" className="size-full text-white/80" strokeWidth={1.2} />
          </div>
          {!detected && <span className="animate-scan absolute inset-x-4 h-0.5 rounded-full bg-brand-400 shadow-[0_0_16px_4px] shadow-brand-500/60" />}
        </div>
        <p className="mt-6 h-5 text-sm font-semibold">
          {detected ? (
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Icon name="check" className="size-4" strokeWidth={3} /> Canteen Food Court detected
            </span>
          ) : (
            <span className="text-white/60">Scanning…</span>
          )}
        </p>
      </div>

      <div className="space-y-2 p-4 pb-6">
        <Button className="w-full" disabled={!detected} onClick={onScanned}>
          {detected ? 'Open Canteen Food Court' : 'Waiting for QR code…'}
        </Button>
        <button type="button" onClick={() => setDetected(true)} className="flex w-full items-center justify-center gap-2 py-2 text-sm text-white/70 hover:text-white">
          <Icon name="image" className="size-4" /> Choose from gallery
        </button>
      </div>
    </div>
  )
}
