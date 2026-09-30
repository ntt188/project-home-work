import { useEffect, useState } from 'react'
import { Icon } from '../components/Icon'
import { Button, Spinner } from '../components/ui'
import { useApp } from '../store/AppContext'
import { formatVND } from '../utils/format'

const BRANDS = {
  momo: { name: 'Momo', app: 'Momo Wallet', bg: 'bg-momo', text: 'text-momo', account: 'Ví Momo · 090 ••• 4417' },
  bank: { name: 'Bank', app: 'VCB Digibank', bg: 'bg-bank', text: 'text-bank', account: 'Vietcombank · ••• 6789' },
}

/** Simulated hand-off to an external payment app. No real transaction happens. */
export function ExternalPayment({ method }: { method: 'momo' | 'bank' }) {
  const { cartTotal, placeOrder, resetTo, back } = useApp()
  const [step, setStep] = useState<'redirecting' | 'confirm' | 'processing' | 'returning'>('redirecting')
  const brand = BRANDS[method]

  useEffect(() => {
    if (step === 'redirecting') {
      const t = window.setTimeout(() => setStep('confirm'), 1400)
      return () => window.clearTimeout(t)
    }
    if (step === 'processing') {
      const t = window.setTimeout(() => setStep('returning'), 1400)
      return () => window.clearTimeout(t)
    }
    if (step === 'returning') {
      const t = window.setTimeout(() => {
        if (placeOrder(method)) resetTo([{ name: 'myfpt' }, { name: 'canteen' }, { name: 'success' }])
        else back()
      }, 1100)
      return () => window.clearTimeout(t)
    }
  }, [step, method, placeOrder, resetTo, back])

  if (step === 'redirecting' || step === 'returning') {
    return (
      <div className={`animate-fade-in absolute inset-0 flex flex-col items-center justify-center gap-5 px-8 text-center text-white ${brand.bg}`}>
        <div className="grid size-20 place-items-center rounded-3xl bg-white/15">
          <Spinner className="size-9 border-[3px]" />
        </div>
        <div>
          <p className="text-lg font-bold">{step === 'redirecting' ? `Redirecting to ${brand.app}…` : 'Payment approved'}</p>
          <p className="mt-1 text-sm text-white/75">
            {step === 'redirecting' ? 'Please do not close the app' : 'Returning to MyFPT Canteen…'}
          </p>
        </div>
        <span className="absolute bottom-8 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold">SIMULATED · PROTOTYPE</span>
      </div>
    )
  }

  return (
    <div className="animate-screen absolute inset-0 flex flex-col bg-slate-100">
      <div className={`${brand.bg} px-5 pt-6 pb-16 text-white`}>
        <div className="flex items-center justify-between">
          <p className="text-lg font-extrabold">{brand.app}</p>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">SIMULATED</span>
        </div>
        <p className="mt-6 text-sm text-white/75">Payment to</p>
        <p className="text-lg font-bold">MyFPT Canteen · FPT Complex Đà Nẵng</p>
      </div>

      <div className="-mt-10 flex-1 px-4">
        <div className="rounded-3xl bg-white p-5 shadow-lg">
          <p className="text-center text-sm text-slate-500">Amount</p>
          <p className={`text-center text-3xl font-extrabold ${brand.text}`}>{formatVND(cartTotal)}</p>
          <div className="mt-5 space-y-2 border-t border-dashed border-slate-200 pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Source</span>
              <span className="font-medium">{brand.account}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Fee</span>
              <span className="font-medium">0 VND</span>
            </div>
          </div>
        </div>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <Icon name="shield" className="size-4" /> Mock screen — no real transaction is made
        </p>
      </div>

      <div className="space-y-2 p-4 pb-6">
        <button
          type="button"
          className={`flex h-13 w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-semibold text-white transition hover:opacity-90 active:scale-[0.98] disabled:opacity-70 ${brand.bg}`}
          disabled={step === 'processing'}
          onClick={() => setStep('processing')}
        >
          {step === 'processing' ? (
            <>
              <Spinner /> Authorizing…
            </>
          ) : (
            'Confirm payment'
          )}
        </button>
        <Button variant="ghost" className="w-full" disabled={step === 'processing'} onClick={back}>
          Cancel and return
        </Button>
      </div>
    </div>
  )
}
