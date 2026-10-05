import { useState } from 'react'
import type { ReactNode } from 'react'
import { Icon } from '../components/Icon'
import { ActionBar, Button, EmptyState, GoldCoin, Screen, Spinner, TopBar } from '../components/ui'
import { useApp } from '../store/AppContext'
import type { PaymentMethod } from '../store/AppContext'
import { formatGold, formatVND, vndToGold } from '../utils/format'

export function Payment() {
  const { cart, cartRestaurant, cartTotal, gold, paymentMethod, setPaymentMethod, navigate, placeOrder, resetTo } = useApp()
  const [processing, setProcessing] = useState(false)

  if (!cart.length) {
    return (
      <Screen header={<TopBar title="Payment" />}>
        <EmptyState
          emoji="🧾"
          title="Nothing to pay for"
          message="Your cart is empty."
          action={
            <Button className="w-full" onClick={() => resetTo([{ name: 'myfpt' }, { name: 'canteen' }])}>
              Back to Canteen
            </Button>
          }
        />
      </Screen>
    )
  }

  const goldRequired = vndToGold(cartTotal)
  const goldEnough = gold >= goldRequired
  // A previously chosen Gold method is void if the balance is no longer enough.
  const selected: PaymentMethod | null = paymentMethod === 'gold' && !goldEnough ? null : paymentMethod

  const confirm = () => {
    if (!selected) return
    if (selected === 'gold') {
      setProcessing(true)
      window.setTimeout(() => {
        if (placeOrder('gold')) resetTo([{ name: 'myfpt' }, { name: 'canteen' }, { name: 'success' }])
        else setProcessing(false)
      }, 1200)
    } else {
      navigate({ name: 'external', method: selected })
    }
  }

  const ctaLabel =
    selected === 'gold'
      ? `Pay ${formatGold(goldRequired)}`
      : selected === 'momo'
        ? 'Continue to Momo'
        : selected === 'bank'
          ? 'Continue to Bank'
          : 'Select a payment method'

  return (
    <Screen
      header={<TopBar title="Payment" />}
      footer={
        <ActionBar>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-slate-500">Total amount</span>
            <span className="text-right">
              <span className="block text-xl font-extrabold">{formatVND(cartTotal)}</span>
              {selected === 'gold' && (
                <span className="block text-xs font-semibold text-gold-600">= {formatGold(goldRequired)}</span>
              )}
            </span>
          </div>
          <Button className="w-full" disabled={!selected || processing} onClick={confirm}>
            {processing ? (
              <>
                <Spinner /> Processing payment…
              </>
            ) : (
              <>
                {selected && <Icon name="shield" className="size-5" />}
                {selected ? 'Confirm Payment' : ctaLabel}
              </>
            )}
          </Button>
          {selected && !processing && <p className="mt-2 text-center text-xs text-slate-400">{ctaLabel}</p>}
        </ActionBar>
      }
    >
      <div className="space-y-5 p-4">
        {/* Order summary */}
        <section>
          <h2 className="mb-2 px-1 text-sm font-bold tracking-wide text-slate-500 uppercase">Order Summary</h2>
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <p className="mb-3 flex items-center gap-2 font-bold">
              <span className="text-lg">{cartRestaurant?.emoji}</span> {cartRestaurant?.name}
            </p>
            <ul className="space-y-2 text-sm">
              {cart.map(({ food, qty, note }) => (
                <li key={food.id} className="flex gap-2">
                  <span className="w-7 shrink-0 font-semibold text-brand-600">{qty}×</span>
                  <span className="flex-1">
                    {food.name}
                    {note && <span className="block text-xs text-slate-500 italic">“{note}”</span>}
                  </span>
                  <span className="font-medium">{formatVND(food.price * qty)}</span>
                </li>
              ))}
            </ul>
            <div className="my-3 border-t border-dashed border-slate-200" />
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span>{formatVND(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Service fee</span>
                <span className="text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between pt-1 text-base font-bold">
                <span>Total</span>
                <span>{formatVND(cartTotal)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Methods */}
        <section role="radiogroup" aria-label="Payment methods">
          <h2 className="mb-2 px-1 text-sm font-bold tracking-wide text-slate-500 uppercase">Payment Method</h2>
          <div className="space-y-2.5">
            <MethodOption
              checked={selected === 'gold'}
              disabled={!goldEnough}
              onSelect={() => setPaymentMethod('gold')}
              logo={<GoldCoin className="size-10 text-base" />}
              title="Gold"
              subtitle={
                <>
                  Balance: <b className="text-slate-700">{formatGold(gold)}</b>
                  <span className="mx-1">·</span>
                  {goldRequired} Gold required
                </>
              }
              extra={
                !goldEnough && (
                  <div className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-red-50 px-3 py-2">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600">
                      <Icon name="info" className="size-4" /> Insufficient balance · need {goldRequired - gold} more
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate({ name: 'topup', returnTo: 'payment' })}
                      className="shrink-0 rounded-full bg-gold-400 px-3 py-1.5 text-xs font-bold text-slate-900 shadow-sm hover:bg-gold-500"
                    >
                      Top Up Gold
                    </button>
                  </div>
                )
              }
            />
            <MethodOption
              checked={selected === 'momo'}
              onSelect={() => setPaymentMethod('momo')}
              logo={
                <span className="grid size-10 place-items-center rounded-xl bg-momo text-[11px] leading-none font-extrabold text-white">
                  mo
                  <br />
                  mo
                </span>
              }
              title="Momo"
              subtitle="Pay securely through Momo"
            />
            <MethodOption
              checked={selected === 'bank'}
              onSelect={() => setPaymentMethod('bank')}
              logo={
                <span className="grid size-10 place-items-center rounded-xl bg-bank text-white">
                  <Icon name="bank" />
                </span>
              }
              title="Bank Account"
              subtitle="Pay using a linked bank account · VCB ••• 6789"
            />
          </div>
        </section>

        <p className="flex items-start gap-2 px-1 pb-2 text-xs text-slate-400">
          <Icon name="shield" className="size-4 shrink-0" />
          This is a prototype. No real money is charged and no external payment service is contacted.
        </p>
      </div>
    </Screen>
  )
}

function MethodOption({
  checked,
  disabled = false,
  onSelect,
  logo,
  title,
  subtitle,
  extra,
}: {
  checked: boolean
  disabled?: boolean
  onSelect: () => void
  logo: ReactNode
  title: string
  subtitle: ReactNode
  extra?: ReactNode
}) {
  return (
    <div
      className={`rounded-2xl bg-white p-4 transition ${
        checked ? 'ring-2 ring-brand-500 shadow-md shadow-brand-500/10' : 'ring-1 ring-slate-200'
      }`}
    >
      <button
        type="button"
        role="radio"
        aria-checked={checked}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={onSelect}
        className="flex w-full items-center gap-3 text-left disabled:cursor-not-allowed"
      >
        <span className={disabled ? 'opacity-40 grayscale' : ''}>{logo}</span>
        <span className="min-w-0 flex-1">
          <span className={`block font-bold ${disabled ? 'text-slate-400' : ''}`}>{title}</span>
          <span className="block text-xs text-slate-500">{subtitle}</span>
        </span>
        <span
          className={`grid size-6 shrink-0 place-items-center rounded-full border-2 transition ${
            checked ? 'border-brand-500 bg-brand-500' : disabled ? 'border-slate-200 bg-slate-100' : 'border-slate-300'
          }`}
        >
          {checked && <span className="size-2.5 rounded-full bg-white" />}
        </span>
      </button>
      {extra}
    </div>
  )
}
