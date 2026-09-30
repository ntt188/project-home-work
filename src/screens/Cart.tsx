import { Icon } from '../components/Icon'
import { ActionBar, Button, EmptyState, FoodImage, QuantityStepper, Screen, TopBar } from '../components/ui'
import { useApp } from '../store/AppContext'
import { formatVND } from '../utils/format'

export function Cart() {
  const { cart, cartRestaurant, cartTotal, cartCount, changeQty, removeFromCart, navigate, selectRestaurant, resetTo } = useApp()

  if (!cart.length) {
    return (
      <Screen header={<TopBar title="Your Cart" />}>
        <EmptyState
          emoji="🛒"
          title="Your cart is empty"
          message="Browse restaurants at your site and add something delicious."
          action={
            <Button className="w-full" onClick={() => resetTo([{ name: 'myfpt' }, { name: 'canteen' }])}>
              Browse restaurants
            </Button>
          }
        />
      </Screen>
    )
  }

  const addMore = () => {
    if (!cartRestaurant) return
    selectRestaurant(cartRestaurant.id)
    navigate({ name: 'menu' })
  }

  return (
    <Screen
      header={<TopBar title="Your Cart" />}
      footer={
        <ActionBar>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Subtotal · {cartCount} item{cartCount > 1 ? 's' : ''}
            </span>
            <span className="text-xl font-extrabold">{formatVND(cartTotal)}</span>
          </div>
          <Button className="w-full" onClick={() => navigate({ name: 'payment' })}>
            Proceed to Payment
          </Button>
        </ActionBar>
      }
    >
      <div className="space-y-3 p-4">
        {cartRestaurant && (
          <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-slate-100">
            <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-xl">{cartRestaurant.emoji}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold">{cartRestaurant.name}</p>
              <p className="flex items-center gap-1 text-xs text-slate-500">
                <Icon name="mapPin" className="size-3 shrink-0" />
                <span className="truncate">{cartRestaurant.location}</span>
              </p>
            </div>
            <button type="button" onClick={addMore} className="shrink-0 whitespace-nowrap rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-600 hover:bg-brand-100">
              + Add more
            </button>
          </div>
        )}

        <ul className="divide-y divide-slate-100 rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
          {cart.map(({ food, qty }) => (
            <li key={food.id} className="animate-fade-up flex gap-3 p-3.5">
              <FoodImage src={food.image} emoji={food.emoji} alt={food.name} className="size-18 shrink-0 rounded-xl" />
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start gap-2">
                  <p className="flex-1 text-[15px] leading-snug font-bold">{food.name}</p>
                  <button
                    type="button"
                    aria-label={`Remove ${food.name}`}
                    onClick={() => removeFromCart(food.id)}
                    className="-mt-1 -mr-1 grid size-8 place-items-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                  >
                    <Icon name="trash" className="size-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-500">{formatVND(food.price)} each</p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <QuantityStepper size="sm" value={qty} min={1} onChange={(next) => changeQty(food.id, next - qty)} />
                  <span className="font-bold text-brand-600">{formatVND(food.price * qty)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="space-y-2 rounded-2xl bg-white p-4 text-sm shadow-sm ring-1 ring-slate-100">
          <div className="flex justify-between">
            <span className="text-slate-500">Subtotal</span>
            <span className="font-semibold">{formatVND(cartTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Service fee</span>
            <span className="font-semibold text-emerald-600">Free</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Pickup</span>
            <span className="font-semibold">At counter · ~{cartRestaurant?.prepTime}</span>
          </div>
        </div>
      </div>
    </Screen>
  )
}
