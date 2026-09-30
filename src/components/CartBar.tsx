import { useApp } from '../store/AppContext'
import { formatVND } from '../utils/format'
import { Icon } from './Icon'

/** Floating "View Cart" pill shown when the cart has items. */
export function CartBar() {
  const { cartCount, cartTotal, navigate } = useApp()
  if (!cartCount) return null
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4 pb-[max(16px,env(safe-area-inset-bottom))]">
      <button
        type="button"
        onClick={() => navigate({ name: 'cart' })}
        className="animate-fade-up pointer-events-auto flex h-14 w-full items-center gap-3 rounded-2xl bg-brand-500 pr-4 pl-3 text-white shadow-xl shadow-brand-500/40 transition hover:bg-brand-600 active:scale-[0.98]"
      >
        <span className="relative grid size-9 place-items-center rounded-xl bg-white/20">
          <Icon name="cart" className="size-5" />
          <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-white text-[11px] font-bold text-brand-600">
            {cartCount}
          </span>
        </span>
        <span className="flex-1 text-left">
          <span className="block text-xs text-white/80">
            {cartCount} item{cartCount > 1 ? 's' : ''}
          </span>
          <span className="block text-[15px] leading-tight font-bold">{formatVND(cartTotal)}</span>
        </span>
        <span className="flex items-center gap-1 text-[15px] font-bold">
          View Cart <Icon name="chevronRight" className="size-4" strokeWidth={3} />
        </span>
      </button>
    </div>
  )
}
