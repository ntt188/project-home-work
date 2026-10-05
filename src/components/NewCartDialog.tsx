import { findRestaurant } from '../data/mock'
import { useApp } from '../store/AppContext'
import { Button } from './ui'

/** Asks before replacing a cart from one restaurant with a dish from another. */
export function NewCartDialog() {
  const { pendingAdd, cartRestaurant, confirmNewCart, cancelNewCart } = useApp()
  if (!pendingAdd) return null
  const next = findRestaurant(pendingAdd.food.restaurantId)

  return (
    <div
      className="animate-fade-in absolute inset-0 z-50 grid place-items-center bg-slate-900/50 p-6"
      onClick={cancelNewCart}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="new-cart-title"
        className="animate-pop w-full rounded-3xl bg-white p-6 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-brand-50 text-3xl">🛒</div>
        <h2 id="new-cart-title" className="text-lg font-bold">
          Start a new order?
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Your cart has items from <b className="text-slate-700">{cartRestaurant?.name}</b>. Starting a new order at{' '}
          <b className="text-slate-700">{next?.name}</b> will remove them.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <Button variant="ghost" onClick={cancelNewCart}>
            Cancel
          </Button>
          <Button onClick={confirmNewCart}>New order</Button>
        </div>
      </div>
    </div>
  )
}
