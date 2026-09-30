import { Icon } from './Icon'
import type { IconName } from './Icon'

export type NavItem = {
  icon: IconName
  label: string
  active?: boolean
  badge?: number
  onClick: () => void
}

export function BottomNavigation({ items }: { items: NavItem[] }) {
  return (
    <nav className="shrink-0 border-t border-slate-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="flex">
        {items.map((item) => (
          <li key={item.label} className="flex-1">
            <button
              type="button"
              onClick={item.onClick}
              aria-current={item.active ? 'page' : undefined}
              className={`relative flex w-full flex-col items-center gap-1 pt-2.5 pb-2 text-[11px] font-medium transition ${
                item.active ? 'text-brand-500' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="relative">
                <Icon name={item.icon} className="size-6" strokeWidth={item.active ? 2.4 : 2} />
                {!!item.badge && (
                  <span className="absolute -top-1.5 -right-2.5 grid min-w-[18px] place-items-center rounded-full bg-red-500 px-1 text-[10px] leading-[18px] font-bold text-white ring-2 ring-white">
                    {item.badge}
                  </span>
                )}
              </span>
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
