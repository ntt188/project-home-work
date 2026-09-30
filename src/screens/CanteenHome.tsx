import { useState } from 'react'
import { BottomNavigation } from '../components/BottomNavigation'
import { GoldBalanceCard } from '../components/GoldBalanceCard'
import { Header } from '../components/Header'
import { Icon } from '../components/Icon'
import { QuickAction } from '../components/QuickAction'
import { RestaurantCard } from '../components/RestaurantCard'
import { EmptyState, Screen } from '../components/ui'
import { categories, employee, restaurants } from '../data/mock'
import { useApp } from '../store/AppContext'
import { ScanQRModal } from './ScanQRModal'

export function CanteenHome() {
  const { gold, navigate, back, selectRestaurant, showToast, currentOrder, cartCount, orders, setGoldBalance } = useApp()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [scanning, setScanning] = useState(false)
  const [demoOpen, setDemoOpen] = useState(false)

  const openRestaurant = (id: string) => {
    selectRestaurant(id)
    navigate({ name: 'restaurant' })
  }
  const openTopUp = () => navigate({ name: 'topup', returnTo: 'canteen' })

  const q = query.trim().toLowerCase()
  const visible = restaurants.filter(
    (r) =>
      (category === 'all' || r.tags.includes(category)) &&
      (!q ||
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.foods.some((f) => f.name.toLowerCase().includes(q))),
  )

  return (
    <Screen
      overlay={
        <>
          {scanning && (
            <ScanQRModal
              onClose={() => setScanning(false)}
              onScanned={() => {
                setScanning(false)
                showToast('QR scanned: Canteen Food Court')
                openRestaurant('food-court')
              }}
            />
          )}
          {demoOpen && (
            <div className="animate-fade-in absolute inset-0 z-40 flex items-end bg-slate-900/50" onClick={() => setDemoOpen(false)}>
              <div className="animate-sheet-up w-full rounded-t-3xl bg-white p-5 pb-8" onClick={(e) => e.stopPropagation()}>
                <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-slate-200" />
                <h3 className="text-lg font-bold">Prototype controls</h3>
                <p className="mt-1 text-sm text-slate-500">Set the Gold balance to try different payment scenarios.</p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[50, 250, 1000].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        setGoldBalance(g)
                        setDemoOpen(false)
                        showToast(`Gold balance set to ${g}`)
                      }}
                      className={`rounded-2xl py-3 text-sm font-bold ring-1 transition active:scale-95 ${
                        gold === g ? 'bg-gold-50 text-gold-600 ring-gold-400' : 'ring-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {g} Gold
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      }
      footer={
        <BottomNavigation
          items={[
            { icon: 'home', label: 'Canteen', active: true, onClick: () => {} },
            { icon: 'receipt', label: 'Orders', badge: orders.length || undefined, onClick: () => navigate({ name: 'orders' }) },
            { icon: 'cart', label: 'Cart', badge: cartCount || undefined, onClick: () => navigate({ name: 'cart' }) },
            { icon: 'user', label: 'Account', onClick: () => setDemoOpen(true) },
          ]}
        />
      }
    >
      {/* Header */}
      <div className="rounded-b-[32px] bg-gradient-to-br from-brand-500 to-brand-600 px-4 pt-3 pb-24">
        <Header
          employee={employee}
          onBack={back}
          onLocation={() => showToast(`${employee.site} is your registered site`)}
          onBell={() => showToast('No new notifications')}
        />
        <label className="mt-4 flex h-11 items-center gap-2 rounded-2xl bg-white px-3.5 shadow-sm">
          <Icon name="search" className="size-5 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search restaurants or dishes"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
          {query && (
            <button type="button" aria-label="Clear search" onClick={() => setQuery('')} className="text-slate-400">
              <Icon name="x" className="size-4" />
            </button>
          )}
        </label>
      </div>

      {/* Gold + quick actions */}
      <div className="-mt-20 space-y-3 px-4">
        <GoldBalanceCard gold={gold} onTopUp={openTopUp} />
        <div className="grid grid-cols-2 gap-2.5 rounded-3xl bg-white p-2.5 shadow-sm ring-1 ring-slate-100">
          <QuickAction icon="coins" title="Top Up Gold" subtitle="From salary" tone="gold" onClick={openTopUp} />
          <QuickAction icon="qr" title="Scan QR" subtitle="At the counter" tone="blue" onClick={() => setScanning(true)} />
        </div>
      </div>

      {/* Active order */}
      {currentOrder && (
        <div className="px-4 pt-3">
          <button
            type="button"
            onClick={() => navigate({ name: 'orders' })}
            className="animate-fade-up flex w-full items-center gap-3 rounded-2xl bg-emerald-50 p-3.5 text-left ring-1 ring-emerald-100"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-500 text-lg font-extrabold text-white">
              {currentOrder.queueNumber}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-emerald-800">Order #{currentOrder.id} is being prepared</span>
              <span className="block truncate text-xs text-emerald-700">
                {currentOrder.restaurant.name} · Ready in 10–15 min
              </span>
            </span>
            <Icon name="chevronRight" className="size-5 text-emerald-600" />
          </button>
        </div>
      )}

      {/* Categories */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pt-5">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition ${
              category === c.id
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{c.emoji}</span>
            {c.label}
          </button>
        ))}
      </div>

      {/* Restaurants */}
      <section className="px-4 pt-5 pb-6">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-bold">Restaurants near you</h2>
            <p className="text-xs text-slate-500">
              {visible.length} vendors at {employee.site}
            </p>
          </div>
        </div>
        {visible.length ? (
          <div className="space-y-4">
            {visible.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} onClick={() => openRestaurant(r.id)} />
            ))}
          </div>
        ) : (
          <EmptyState emoji="🔍" title="No restaurants found" message="Try a different keyword or category." />
        )}
      </section>

    </Screen>
  )
}
