import { useState } from 'react'
import { CartBar } from '../components/CartBar'
import { FoodCard } from '../components/FoodCard'
import { Rating, Screen, TopBar } from '../components/ui'
import { useApp } from '../store/AppContext'

export function FoodMenu() {
  const { selectedRestaurant: r, cart, navigate, addToCart, changeQty, showToast } = useApp()
  const [section, setSection] = useState('All')
  if (!r) return null

  const sections = ['All', ...new Set(r.foods.map((f) => f.category))]
  const foods = section === 'All' ? r.foods : r.foods.filter((f) => f.category === section)
  const qtyOf = (id: string) => cart.find((i) => i.food.id === id)?.qty ?? 0

  return (
    <Screen
      header={
        <div className="shrink-0 bg-white">
          <TopBar title={r.name} />
          <div className="flex items-center gap-3 px-4 pt-2 text-xs text-slate-500">
            <Rating value={r.rating} />
            <span>·</span>
            <span>{r.hours}</span>
            <span>·</span>
            <span className="truncate">{r.location}</span>
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
            {sections.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSection(s)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-[13px] font-semibold transition ${
                  section === s ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      }
    >
      <div className="space-y-3 p-4 pb-28">
        <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
          {section} · {foods.length} items
        </p>
        {foods.map((f) => (
          <FoodCard
            key={f.id}
            food={f}
            qtyInCart={qtyOf(f.id)}
            onOpen={() => navigate({ name: 'food', foodId: f.id })}
            onAdd={() => {
              addToCart(f, 1)
              showToast(`Added ${f.name}`)
            }}
            onChangeQty={(delta) => changeQty(f.id, delta)}
          />
        ))}
      </div>
      <CartBar />
    </Screen>
  )
}
