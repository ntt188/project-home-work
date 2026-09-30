import { Icon } from '../components/Icon'
import { ActionBar, Button, FoodImage, IconButton, Rating, Screen, Stars } from '../components/ui'
import { useApp } from '../store/AppContext'
import { formatVND } from '../utils/format'

export function RestaurantDetail() {
  const { selectedRestaurant: r, back, navigate } = useApp()
  if (!r) return null

  const featured = r.foods.filter((f) => f.popular)
  const avg = r.reviews.reduce((s, x) => s + x.rating, 0) / r.reviews.length

  return (
    <Screen
      className="bg-white"
      footer={
        <ActionBar>
          <Button className="w-full" onClick={() => navigate({ name: 'menu' })}>
            <Icon name="utensils" className="size-5" /> Order Now
          </Button>
        </ActionBar>
      }
    >
      {/* Cover */}
      <div className="relative">
        <FoodImage src={r.image} emoji={r.emoji} alt={r.name} className="h-60 w-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
        <IconButton label="Back" onClick={back} className="absolute top-3 left-3 bg-white/90 text-slate-800 shadow hover:bg-white">
          <Icon name="chevronLeft" className="size-6" />
        </IconButton>
      </div>

      {/* Info */}
      <div className="relative -mt-8 rounded-t-[28px] bg-white px-5 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl leading-tight font-extrabold">{r.name}</h1>
            <p className="mt-0.5 text-sm font-medium text-brand-600">{r.category}</p>
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
            <span className="size-1.5 rounded-full bg-emerald-500" /> Open
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-500">{r.description}</p>

        <div className="mt-4 grid grid-cols-3 divide-x divide-slate-100 rounded-2xl bg-slate-50 py-3 text-center">
          <div>
            <Rating value={r.rating} className="justify-center text-base" />
            <p className="text-[11px] text-slate-500">{r.ratingCount.toLocaleString('en-US')} ratings</p>
          </div>
          <div>
            <p className="text-sm font-bold">{r.hours}</p>
            <p className="text-[11px] text-slate-500">Opening hours</p>
          </div>
          <div>
            <p className="text-sm font-bold">{r.prepTime}</p>
            <p className="text-[11px] text-slate-500">Prep time</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3 rounded-2xl p-3 ring-1 ring-slate-100">
          <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-500">
            <Icon name="mapPin" />
          </span>
          <div>
            <p className="text-sm font-semibold">{r.location}</p>
            <p className="text-xs text-slate-500">FPT Complex Đà Nẵng · Pick up at counter</p>
          </div>
        </div>
      </div>

      {/* Featured */}
      <section className="pt-6">
        <div className="mb-3 flex items-center justify-between px-5">
          <h2 className="text-lg font-bold">Featured Food</h2>
          <button type="button" onClick={() => navigate({ name: 'menu' })} className="text-[13px] font-semibold text-brand-600">
            Full menu
          </button>
        </div>
        <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto px-5 pb-1">
          {featured.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => navigate({ name: 'food', foodId: f.id })}
              className="w-40 shrink-0 snap-start overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-slate-100 transition active:scale-[0.98]"
            >
              <FoodImage src={f.image} emoji={f.emoji} alt={f.name} className="h-28 w-full" />
              <div className="p-3">
                <p className="truncate text-sm font-bold">{f.name}</p>
                <p className="mt-0.5 line-clamp-2 h-8 text-[11px] leading-4 text-slate-500">{f.description}</p>
                <p className="mt-1.5 text-sm font-bold text-brand-600">{formatVND(f.price)}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="px-5 pt-6 pb-6">
        <h2 className="mb-3 text-lg font-bold">Reviews</h2>
        <div className="mb-4 flex items-center gap-4 rounded-2xl bg-gold-50 p-4">
          <p className="text-4xl font-extrabold">{r.rating.toFixed(1)}</p>
          <div>
            <Stars value={Math.round(avg)} />
            <p className="mt-1 text-xs text-slate-500">Based on {r.ratingCount.toLocaleString('en-US')} employee ratings</p>
          </div>
        </div>
        <ul className="space-y-3">
          {r.reviews.map((rev) => (
            <li key={rev.author} className="rounded-2xl p-4 ring-1 ring-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                  {rev.author
                    .split(' ')
                    .map((w) => w[0])
                    .join('')}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{rev.author}</p>
                  <Stars value={rev.rating} />
                </div>
                <span className="text-[11px] text-slate-400">{rev.date}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">“{rev.comment}”</p>
            </li>
          ))}
        </ul>
      </section>
    </Screen>
  )
}
