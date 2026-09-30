import { Icon } from '../components/Icon'
import { ActionBar, Button, Screen } from '../components/ui'
import { useApp } from '../store/AppContext'
import { METHOD_LABEL, formatGold, formatVND } from '../utils/format'

export function OrderSuccess() {
  const { currentOrder: order, gold, resetTo } = useApp()
  const close = () => resetTo([{ name: 'myfpt' }, { name: 'canteen' }])
  if (!order) return null

  return (
    <Screen
      className="bg-white"
      footer={
        <ActionBar>
          <Button className="w-full" onClick={close}>
            Close
          </Button>
        </ActionBar>
      }
    >
      <div className="bg-gradient-to-b from-emerald-50 to-white px-6 pt-14 pb-6 text-center">
        <div className="animate-pop mx-auto grid size-24 place-items-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 ring-8 ring-emerald-100">
          <Icon name="check" className="size-12" strokeWidth={3} />
        </div>
        <h1 className="animate-fade-up mt-6 text-2xl font-extrabold">Order Successful!</h1>
        <p className="animate-fade-up mt-1 text-sm text-slate-500">
          Order <b className="text-slate-800">#{order.id}</b> · {order.restaurant.name}
        </p>
      </div>

      <div className="animate-fade-up space-y-4 px-5 pb-6" style={{ animationDelay: '120ms' }}>
        {/* Queue ticket */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-5 text-center text-white">
          <span className="absolute top-1/2 -left-3 size-6 -translate-y-1/2 rounded-full bg-white" />
          <span className="absolute top-1/2 -right-3 size-6 -translate-y-1/2 rounded-full bg-white" />
          <p className="text-xs font-semibold tracking-[0.2em] text-white/60 uppercase">Queue Number</p>
          <p className="mt-1 text-6xl font-extrabold tracking-tight text-brand-400">{order.queueNumber}</p>
          <div className="mt-4 border-t border-dashed border-white/20 pt-4 text-sm">
            <p className="flex items-center justify-center gap-1.5 text-white/70">
              <Icon name="clock" className="size-4" /> Estimated preparation time
            </p>
            <p className="mt-0.5 text-base font-bold">10–15 minutes</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm">
          <Icon name="mapPin" className="size-5 shrink-0 text-brand-500" />
          <span>
            Pick up at <b>{order.restaurant.location}</b> when your number is called.
          </span>
        </div>

        {/* Receipt */}
        <div className="rounded-2xl p-4 text-sm ring-1 ring-slate-100">
          <ul className="space-y-1.5">
            {order.items.map(({ food, qty }) => (
              <li key={food.id} className="flex gap-2">
                <span className="w-7 font-semibold text-brand-600">{qty}×</span>
                <span className="flex-1">{food.name}</span>
                <span>{formatVND(food.price * qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 space-y-1.5 border-t border-dashed border-slate-200 pt-3">
            <div className="flex justify-between font-bold">
              <span>Total paid</span>
              <span>{formatVND(order.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Paid with</span>
              <span className="font-medium">
                {METHOD_LABEL[order.method]}
                {order.method === 'gold' && ` (−${formatGold(order.goldUsed)})`}
              </span>
            </div>
            {order.method === 'gold' && (
              <div className="flex justify-between">
                <span className="text-slate-500">Remaining Gold</span>
                <span className="font-bold text-gold-600">{formatGold(gold)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Screen>
  )
}
