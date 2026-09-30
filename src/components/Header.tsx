import type { Employee } from '../data/mock'
import { Icon } from './Icon'
import { Avatar, IconButton } from './ui'

/** Canteen header: employee identity + current company site. */
export function Header({
  employee,
  onBack,
  onLocation,
  onBell,
}: {
  employee: Employee
  onBack: () => void
  onLocation: () => void
  onBell: () => void
}) {
  return (
    <div className="flex items-center gap-3">
      <IconButton label="Back to MyFPT" onClick={onBack} className="-ml-2 text-white hover:bg-white/15">
        <Icon name="chevronLeft" className="size-6" />
      </IconButton>
      <Avatar initials={employee.initials} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] leading-tight font-bold text-white">{employee.name}</p>
        <button
          type="button"
          onClick={onLocation}
          className="mt-0.5 flex max-w-full items-center gap-1 text-[13px] text-white/85 hover:text-white"
        >
          <Icon name="mapPin" className="size-3.5 shrink-0" />
          <span className="truncate">{employee.site}</span>
          <Icon name="chevronDown" className="size-3.5 shrink-0" />
        </button>
      </div>
      <IconButton label="Notifications" onClick={onBell} className="relative bg-white/15 text-white hover:bg-white/25">
        <Icon name="bell" />
        <span className="absolute top-2 right-2.5 size-2 rounded-full bg-red-500 ring-2 ring-brand-500" />
      </IconButton>
    </div>
  )
}
