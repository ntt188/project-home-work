import { Icon } from './Icon'
import type { IconName } from './Icon'

export function QuickAction({
  icon,
  title,
  subtitle,
  tone,
  onClick,
}: {
  icon: IconName
  title: string
  subtitle: string
  tone: 'gold' | 'blue'
  onClick: () => void
}) {
  const styles =
    tone === 'gold'
      ? { card: 'bg-gold-50 ring-gold-100', icon: 'bg-gradient-to-br from-gold-400 to-gold-600 shadow-gold-500/30' }
      : { card: 'bg-sky-50 ring-sky-100', icon: 'bg-gradient-to-br from-sky-400 to-blue-600 shadow-blue-500/30' }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-w-0 items-center gap-2.5 rounded-2xl p-2.5 text-left ring-1 transition hover:brightness-[0.98] active:scale-[0.97] ${styles.card}`}
    >
      <span className={`grid size-10 shrink-0 place-items-center rounded-xl text-white shadow-lg ${styles.icon}`}>
        <Icon name={icon} className="size-5.5" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold text-slate-900">{title}</span>
        <span className="block truncate text-xs text-slate-500">{subtitle}</span>
      </span>
    </button>
  )
}
