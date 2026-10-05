import { useState } from 'react'
import { Icon } from '../components/Icon'
import { Button, EmptyState, Screen, TopBar } from '../components/ui'
import { useApp } from '../store/AppContext'
import type { Order } from '../store/AppContext'
import { METHOD_LABEL, formatVND } from '../utils/format'

/** Matches order id, restaurant, dish names and item notes. */
const matches = (order: Order, q: string) =>
  order.id.toLowerCase().includes(q) ||
  order.restaurant.name.toLowerCase().includes(q) ||
  order.items.some((i) => i.food.name.toLowerCase().includes(q) || i.note.toLowerCase().includes(q))

export function Orders() {
  const { orders, preparingCount, markPickedUp, showToast, back } = useApp()
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const visible = q ? orders.filter((o) => matches(o, q)) : orders

  const pickUp = (order: Order) => {
    markPickedUp(order.id)
    showToast(`Order #${order.id} picked up`)
  }

  return (
    <Screen
      header={
        <div className="shrink-0 bg-white">
          <TopBar title="My Orders" />
          {orders.length > 0 && (
            <div className="space-y-2 px-4 pt-2 pb-3">
              <label className="flex h-11 items-center gap-2 rounded-2xl bg-slate-100 px-3.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-400">
                <Icon name="search" className="size-5 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search dishes, order # or restaurant"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
                {query && (
                  <button type="button" aria-label="Clear search" onClick={() => setQuery('')} className="text-slate-400">
                    <Icon name="x" className="size-4" />
                  </button>
                )}
              </label>
              <p className="text-xs text-slate-500">
                <b className="text-amber-600">{preparingCount} preparing</b> · {orders.length - preparingCount} picked up
              </p>
            </div>
          )}
        </div>
      }
    >
      {!orders.length ? (
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
      ) : !visible.length ? (
        <EmptyState emoji="🔍" title="No matching orders" message={`Nothing found for “${query.trim()}”.`} />
      ) : (
        <ul className="space-y-3 p-4">
          {visible.map((o) => {
            const preparing = o.status === 'preparing'
            return (
              <li key={o.id} className="animate-fade-up rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <div className="flex items-center gap-3">
                  <span
                    className={`grid size-12 shrink-0 place-items-center rounded-xl text-lg font-extrabold ${
                      preparing ? 'bg-slate-900 text-brand-400' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
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
                      preparing ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    {preparing ? 'Preparing' : 'Picked up'}
                  </span>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-slate-600">
                  {o.items.map((it) => (
                    <li key={it.food.id}>
                      {it.qty}× {it.food.name}
                      {it.note && <span className="block pl-5 text-xs text-slate-400 italic">“{it.note}”</span>}
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex justify-between border-t border-slate-100 pt-2 text-sm">
                  <span className="text-slate-500">{METHOD_LABEL[o.method]}</span>
                  <span className="font-bold">{formatVND(o.total)}</span>
                </div>
                {preparing && (
                  <Button variant="secondary" className="mt-3 h-11 w-full" onClick={() => pickUp(o)}>
                    <Icon name="check" className="size-4" strokeWidth={3} /> Mark as picked up
                  </Button>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </Screen>
  )
}
