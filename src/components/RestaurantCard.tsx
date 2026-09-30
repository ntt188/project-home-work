import type { Restaurant } from '../data/mock'
import { Icon } from './Icon'
import { FoodImage, Rating } from './ui'

export function RestaurantCard({ restaurant, onClick }: { restaurant: Restaurant; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group block w-full overflow-hidden rounded-3xl bg-white text-left shadow-sm ring-1 ring-slate-100 transition hover:shadow-md active:scale-[0.99]"
    >
      <div className="relative">
        <FoodImage
          src={restaurant.image}
          emoji={restaurant.emoji}
          alt={restaurant.name}
          className="h-36 w-full transition duration-500 group-hover:scale-[1.02]"
        />
        <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-white shadow">
          <span className="size-1.5 rounded-full bg-white" /> Open
        </span>
        <span className="absolute top-3 right-3 rounded-full bg-white/95 px-2.5 py-1 shadow">
          <Rating value={restaurant.rating} />
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold">{restaurant.name}</h3>
            <p className="text-[13px] font-medium text-brand-600">{restaurant.category}</p>
          </div>
          <Icon name="chevronRight" className="mt-1 size-5 shrink-0 text-slate-300" />
        </div>
        <p className="mt-1.5 line-clamp-2 text-[13px] text-slate-500">{restaurant.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Icon name="clock" className="size-3.5" /> {restaurant.hours}
          </span>
          <span className="flex items-center gap-1">
            <Icon name="mapPin" className="size-3.5" /> {restaurant.location}
          </span>
        </div>
      </div>
    </button>
  )
}
