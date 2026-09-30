import { Button, EmptyState, Screen, TopBar } from '../components/ui'
import { useApp } from '../store/AppContext'
import { METHOD_LABEL, formatVND } from '../utils/format'

export function Orders() {
  const { orders, back } = useApp()

  return (
    <Screen header={<TopBar title="My Orders" />}>
      {orders.length ? (
        <ul className="space-y-3 p-4">
          {orders.map((o, i) => (
            <li key={o.id} className="animate-fade-up rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center gap-3">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-slate-900 text-lg font-extrabold text-brand-400">
                  {o.queueNumber}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold">#{o.id}</p>
                  <p className="truncate text-xs text-slate-500">
                    {o.restaurant.name} · {o.createdAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    i === 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                  }`}
                >
                  {i === 0 ? 'Preparing' : 'Picked up'}
                </span>
              </div>
              <p className="mt-3 line-clamp-1 text-sm text-slate-600">
                {o.items.map((it) => `${it.qty}× ${it.food.name}`).join(', ')}
              </p>
              <div className="mt-2 flex justify-between border-t border-slate-100 pt-2 text-sm">
                <span className="text-slate-500">{METHOD_LABEL[o.method]}</span>
                <span className="font-bold">{formatVND(o.total)}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          emoji="🧾"
          title="No orders yet"
          message="Your orders will appear here after checkout."
          action={
            <Button className="w-full" onClick={back}>
              Browse restaurants
            </Button>
          }
        />
      )}
    </Screen>
  )
}
