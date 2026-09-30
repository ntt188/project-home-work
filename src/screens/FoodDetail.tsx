import { useState } from 'react'
import { Icon } from '../components/Icon'
import { ActionBar, Button, FoodImage, IconButton, QuantityStepper, Screen } from '../components/ui'
import { findFood, findRestaurant } from '../data/mock'
import { useApp } from '../store/AppContext'
import { formatVND } from '../utils/format'

export function FoodDetail({ foodId }: { foodId: string }) {
  const { back, addToCart, showToast, cart } = useApp()
  const [qty, setQty] = useState(1)
  const food = findFood(foodId)
  if (!food) return null

  const restaurant = findRestaurant(food.restaurantId)
  const inCart = cart.find((i) => i.food.id === food.id)?.qty ?? 0

  const handleAdd = () => {
    addToCart(food, qty)
    showToast(`Added ${qty} × ${food.name} to cart`)
    back()
  }

  return (
    <Screen
      className="bg-white"
      footer={
        <ActionBar>
          <Button className="w-full" onClick={handleAdd}>
            <Icon name="cart" className="size-5" />
            Add to Cart · {formatVND(food.price * qty)}
          </Button>
        </ActionBar>
      }
    >
      <div className="relative">
        <FoodImage src={food.image} emoji={food.emoji} alt={food.name} className="aspect-square max-h-80 w-full" />
        <IconButton label="Back" onClick={back} className="absolute top-3 left-3 bg-white/90 text-slate-800 shadow hover:bg-white">
          <Icon name="chevronLeft" className="size-6" />
        </IconButton>
      </div>

      <div className="relative -mt-6 rounded-t-[28px] bg-white px-5 pt-6 pb-6">
        {food.popular && (
          <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-600">
            <Icon name="flame" filled strokeWidth={1} className="size-3" /> Popular
          </span>
        )}
        <h1 className="text-2xl leading-tight font-extrabold">{food.name}</h1>
        <p className="mt-1 text-xl font-bold text-brand-600">{formatVND(food.price)}</p>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{food.description}</p>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
          <Icon name="utensils" className="size-3.5" /> {restaurant?.name} · {restaurant?.location}
        </p>

        <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 p-4">
          <div>
            <p className="font-semibold">Quantity</p>
            {inCart > 0 && <p className="text-xs text-slate-500">{inCart} already in cart</p>}
          </div>
          <QuantityStepper value={qty} onChange={setQty} size="lg" />
        </div>
      </div>
    </Screen>
  )
}
