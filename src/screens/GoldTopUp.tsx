import { useState } from 'react'
import type { ReactNode } from 'react'
import { Icon } from '../components/Icon'
import { ActionBar, Button, GoldCoin, Screen, Spinner, TopBar } from '../components/ui'
import { MONTHLY_TOPUP_LIMIT, useApp } from '../store/AppContext'
import { formatGold, formatVND, goldToVnd, vndToGold } from '../utils/format'

const AMOUNTS = [100, 200, 500, 1000]
const MIN_AMOUNT = 10
const PAYROLL_DATE = '05 Nov 2026'

export function GoldTopUp({ returnTo }: { returnTo: 'payment' | 'canteen' }) {
  const { gold, topUpGold, back, cart, cartTotal, setPaymentMethod, monthlyToppedUp } = useApp()
  const [preset, setPreset] = useState<number | null>(
    returnTo === 'payment' ? pickSuggested(vndToGold(cartTotal) - gold) : 500,
  )
  const [custom, setCustom] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle')
  const [added, setAdded] = useState(0)

  const remaining = Math.max(0, MONTHLY_TOPUP_LIMIT - monthlyToppedUp)
  const amount = custom ? Number(custom) : (preset ?? 0)
  const error = !amount
    ? 'Choose or enter an amount.'
    : amount < MIN_AMOUNT
      ? `Minimum top-up is ${formatGold(MIN_AMOUNT)}.`
      : amount > remaining
        ? remaining
          ? `Exceeds the monthly limit of ${formatGold(MONTHLY_TOPUP_LIMIT)}. You can top up ${formatGold(remaining)} more this month.`
          : `You have reached the monthly limit of ${formatGold(MONTHLY_TOPUP_LIMIT)}.`
        : null
  // Only show "choose an amount" once the user has interacted with the custom field.
  const showError = error && (amount > 0 || custom !== '')
  const canConfirm = !error && agreed && status === 'idle'

  const confirm = () => {
    if (!canConfirm) return
    setStatus('processing')
    window.setTimeout(() => {
      topUpGold(amount)
      setAdded(amount)
      setStatus('done')
      // Coming from checkout: pre-select Gold if it now covers the order.
      if (returnTo === 'payment' && cart.length && gold + amount >= vndToGold(cartTotal)) setPaymentMethod('gold')
    }, 1300)
  }

  if (status === 'done') {
    return (
      <Screen
        className="bg-white"
        footer={
          <ActionBar>
            <Button className="w-full" onClick={back}>
              {returnTo === 'payment' ? 'Return to Payment' : 'Back to Canteen'}
            </Button>
            <button
              type="button"
              onClick={() => {
                setStatus('idle')
                setAgreed(false)
                setCustom('')
              }}
              className="mt-2 w-full py-2 text-sm font-semibold text-slate-500"
            >
              Top up more
            </button>
          </ActionBar>
        }
      >
        <div className="flex flex-col items-center px-6 pt-16 text-center">
          <div className="animate-pop grid size-24 place-items-center rounded-full bg-gold-100">
            <GoldCoin className="size-16 text-2xl" />
          </div>
          <h1 className="animate-fade-up mt-6 text-2xl font-extrabold">Top Up Successful!</h1>
          <p className="animate-fade-up mt-2 text-sm text-slate-500">
            <b className="text-gold-600">+{formatGold(added)}</b> has been added to your balance.
          </p>
          <div className="animate-fade-up mt-8 w-full rounded-2xl bg-slate-50 p-4 text-sm">
            <Row label="New balance" value={<b className="text-lg">{formatGold(gold)}</b>} />
            <Row label="Salary advance" value={formatVND(goldToVnd(added))} />
            <Row label="Deducted on" value={`Payroll · ${PAYROLL_DATE}`} />
            <Row label="Used this month" value={`${monthlyToppedUp.toLocaleString('en-US')} / ${formatGold(MONTHLY_TOPUP_LIMIT)}`} />
          </div>
        </div>
      </Screen>
    )
  }

  return (
    <Screen
      header={<TopBar title="Top Up Gold" />}
      footer={
        <ActionBar>
          <Button className="w-full" onClick={confirm} disabled={!canConfirm}>
            {status === 'processing' ? (
              <>
                <Spinner /> Processing…
              </>
            ) : (
              `Confirm Top Up${amount && !error ? ` · ${formatGold(amount)}` : ''}`
            )}
          </Button>
        </ActionBar>
      }
    >
      <div className="space-y-5 p-4">
        {/* Current balance */}
        <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-slate-900 to-amber-900 p-4 text-white">
          <GoldCoin className="size-11 text-base" />
          <div className="flex-1">
            <p className="text-xs text-white/70">Current balance</p>
            <p className="text-2xl font-extrabold">{formatGold(gold)}</p>
          </div>
          <div className="text-right text-xs text-white/70">
            <p>After top-up</p>
            <p className="text-base font-bold text-gold-400">{formatGold(gold + (error ? 0 : amount))}</p>
          </div>
        </div>

        {/* Explanation */}
        <div className="flex gap-3 rounded-2xl bg-gold-50 p-4 ring-1 ring-gold-100">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold-400 text-slate-900">
            <Icon name="wallet" className="size-5" />
          </span>
          <div className="text-sm">
            <p className="font-bold">Salary advance</p>
            <p className="mt-0.5 text-slate-600">
              Top up Gold by advancing part of your next month's salary. 1 Gold = 1,000 VND. No fees.
            </p>
          </div>
        </div>

        {/* Monthly limit */}
        <div className="rounded-2xl bg-white p-4 text-sm shadow-sm ring-1 ring-slate-100">
          <div className="flex justify-between">
            <span className="text-slate-500">Monthly advance limit</span>
            <span className="font-semibold">
              {monthlyToppedUp.toLocaleString('en-US')} / {formatGold(MONTHLY_TOPUP_LIMIT)}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all ${remaining ? 'bg-gold-400' : 'bg-red-500'}`}
              style={{ width: `${(monthlyToppedUp / MONTHLY_TOPUP_LIMIT) * 100}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            You can top up <b className="text-slate-700">{formatGold(remaining)}</b> more this month.
          </p>
        </div>

        {/* Amounts */}
        <section>
          <h2 className="mb-2 px-1 text-sm font-bold tracking-wide text-slate-500 uppercase">Choose an amount</h2>
          <div role="radiogroup" className="grid grid-cols-2 gap-3">
            {AMOUNTS.map((a) => {
              const active = !custom && a === preset
              return (
                <button
                  key={a}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => {
                    setPreset(a)
                    setCustom('')
                  }}
                  className={`relative rounded-2xl bg-white p-4 text-left transition active:scale-[0.97] ${
                    active ? 'ring-2 ring-gold-500 shadow-lg shadow-gold-500/15' : 'ring-1 ring-slate-200 hover:ring-slate-300'
                  }`}
                >
                  {active && (
                    <span className="absolute top-3 right-3 grid size-5 place-items-center rounded-full bg-gold-500 text-white">
                      <Icon name="check" className="size-3" strokeWidth={3.5} />
                    </span>
                  )}
                  <GoldCoin className="size-7 text-xs" />
                  <p className="mt-2 text-lg font-extrabold">{formatGold(a)}</p>
                  <p className="text-xs text-slate-500">{formatVND(goldToVnd(a))}</p>
                </button>
              )
            })}
          </div>

          {/* Custom amount */}
          <label
            className={`mt-3 flex h-14 items-center gap-3 rounded-2xl bg-white px-4 transition ${
              custom
                ? showError
                  ? 'ring-2 ring-red-400'
                  : 'ring-2 ring-gold-500'
                : 'ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-gold-400'
            }`}
          >
            <GoldCoin className="size-7 text-xs" />
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 5))}
              inputMode="numeric"
              placeholder="Or enter another amount"
              aria-label="Custom Gold amount"
              aria-invalid={!!(custom && showError)}
              className="min-w-0 flex-1 bg-transparent text-base font-bold outline-none placeholder:font-normal placeholder:text-slate-400"
            />
            <span className="text-sm font-semibold text-slate-400">Gold</span>
          </label>

          {showError && (
            <p role="alert" className="mt-2 flex items-start gap-1.5 px-1 text-xs font-semibold text-red-600">
              <Icon name="info" className="size-4 shrink-0" /> {error}
            </p>
          )}
        </section>

        {/* Summary + agreement */}
        <div className="rounded-2xl bg-white p-4 text-sm shadow-sm ring-1 ring-slate-100">
          <p className="font-semibold">{formatGold(error ? 0 : amount)}</p>
          <p className="text-slate-500">
            Advance {formatVND(goldToVnd(error ? 0 : amount))} from next month's salary
          </p>
          <div className="mt-3 border-t border-slate-100 pt-3">
            <Row label="Deduction date" value={`Payroll · ${PAYROLL_DATE}`} />
          </div>
          <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-xl bg-slate-50 p-3">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 size-5 shrink-0 accent-brand-500"
            />
            <span className="text-[13px] text-slate-600">
              I agree to advance this amount from my next month's salary. It will be deducted on payroll ({PAYROLL_DATE}).
            </span>
          </label>
          {!agreed && !error && (
            <p className="mt-2 text-xs text-slate-400">Please tick the box above to confirm the top-up.</p>
          )}
        </div>
      </div>
    </Screen>
  )
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

/** Smallest preset that covers the shortfall at checkout. */
function pickSuggested(shortfall: number) {
  return AMOUNTS.find((a) => a >= shortfall) ?? AMOUNTS[AMOUNTS.length - 1]
}
