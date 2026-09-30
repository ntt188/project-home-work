import type { Food } from '../data/mock'
import { formatVND } from '../utils/format'
import { Icon } from './Icon'
import { FoodImage, QuantityStepper } from './ui'

/** Menu row: tap the card for details, or use the Add button / stepper inline. */
export function FoodCard({
  food,
  qtyInCart,
  onOpen,
  onAdd,
  onChangeQty,
}: {
  food: Food
  qtyInCart: number
  onOpen: () => void
  onAdd: () => void
  onChangeQty: (delta: number) => void
}) {
  return (
    <div className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
      <button type="button" onClick={onOpen} className="shrink-0" aria-label={`View ${food.name}`}>
        <FoodImage src={food.image} emoji={food.emoji} alt={food.name} className="size-24 rounded-xl" />
      </button>
      <div className="flex min-w-0 flex-1 flex-col">
        <button type="button" onClick={onOpen} className="text-left">
          <h3 className="flex items-center gap-1.5 text-[15px] leading-snug font-bold">
            {food.name}
            {food.popular && <Icon name="flame" className="size-3.5 shrink-0 text-brand-500" filled strokeWidth={1} />}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{food.description}</p>
        </button>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-[15px] font-bold text-brand-600">{formatVND(food.price)}</span>
          {qtyInCart > 0 ? (
            <QuantityStepper size="sm" value={qtyInCart} min={0} onChange={(next) => onChangeQty(next - qtyInCart)} />
          ) : (
            <button
              type="button"
              onClick={onAdd}
              className="flex items-center gap-1 rounded-full bg-brand-500 px-3 py-1.5 text-[13px] font-bold text-white shadow-md shadow-brand-500/30 transition hover:bg-brand-600 active:scale-95"
            >
              <Icon name="plus" className="size-3.5" strokeWidth={3} /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
