import { useState } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { useApp } from '../store/AppContext'
import { Icon } from './Icon'

/** Full-height screen with an optional fixed header and footer; only the body scrolls. */
export function Screen({
  header,
  footer,
  overlay,
  children,
  className = 'bg-slate-50',
}: {
  header?: ReactNode
  footer?: ReactNode
  /** Modals/sheets covering the whole screen, rendered outside the scroll area. */
  overlay?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`animate-screen absolute inset-0 flex flex-col ${className}`}>
      {header}
      <main className="no-scrollbar relative flex-1 overflow-y-auto">{children}</main>
      {footer}
      {overlay}
    </div>
  )
}

/** Standard white top bar with a back button. */
export function TopBar({ title, right, onBack }: { title: string; right?: ReactNode; onBack?: () => void }) {
  const { back } = useApp()
  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-slate-100 bg-white/95 px-2 backdrop-blur">
      <IconButton label="Back" onClick={onBack ?? back}>
        <Icon name="chevronLeft" className="size-6" />
      </IconButton>
      <h1 className="flex-1 truncate text-[17px] font-semibold">{title}</h1>
      {right}
    </header>
  )
}

export function IconButton({
  label,
  children,
  className = 'text-slate-700 hover:bg-slate-100',
  ...rest
}: { label: string; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`grid size-10 shrink-0 place-items-center rounded-full transition active:scale-95 ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'dark'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-500 text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600 disabled:bg-slate-300 disabled:shadow-none',
  secondary: 'bg-brand-50 text-brand-600 hover:bg-brand-100 disabled:opacity-50',
  ghost: 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 disabled:opacity-50',
  dark: 'bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-300',
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...rest
}: { variant?: ButtonVariant; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`flex h-13 items-center justify-center gap-2 rounded-2xl px-5 text-[15px] font-semibold transition active:scale-[0.98] disabled:active:scale-100 ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

/** Sticky footer area for primary actions. */
export function ActionBar({ children }: { children: ReactNode }) {
  return (
    <div className="shrink-0 border-t border-slate-100 bg-white px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-12px_rgba(15,23,42,0.12)]">
      {children}
    </div>
  )
}

/** Image with a graceful emoji fallback if the remote photo fails to load. */
export function FoodImage({ src, emoji, alt, className = '' }: { src: string; emoji: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  if (failed) {
    return (
      <div className={`grid place-items-center bg-gradient-to-br from-brand-100 to-gold-100 ${className}`}>
        <span className="text-4xl" role="img" aria-label={alt}>
          {emoji}
        </span>
      </div>
    )
  }
  return (
    <div className={`relative overflow-hidden bg-slate-200 ${className}`}>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-slate-200" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`size-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}

export function Rating({ value, count, className = '' }: { value: number; count?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[13px] font-semibold ${className}`}>
      <Icon name="star" filled className="size-3.5 text-gold-400" strokeWidth={1.5} />
      {value.toFixed(1)}
      {count !== undefined && <span className="font-normal text-slate-400">({count.toLocaleString('en-US')})</span>}
    </span>
  )
}

export function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon
          key={i}
          name="star"
          filled
          strokeWidth={1.5}
          className={`size-3.5 ${i <= value ? 'text-gold-400' : 'text-slate-200'}`}
        />
      ))}
    </span>
  )
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  size = 'md',
}: {
  value: number
  onChange: (next: number) => void
  min?: number
  size?: 'sm' | 'md' | 'lg'
}) {
  const btn = { sm: 'size-7', md: 'size-9', lg: 'size-12' }[size]
  const text = { sm: 'w-6 text-sm', md: 'w-8 text-base', lg: 'w-12 text-xl' }[size]
  const icon = size === 'lg' ? 'size-5' : 'size-4'
  return (
    <div className="inline-flex items-center gap-1">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        className={`${btn} grid place-items-center rounded-full bg-white text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 active:scale-90 disabled:opacity-40`}
      >
        <Icon name="minus" className={icon} strokeWidth={2.5} />
      </button>
      <span className={`${text} text-center font-bold tabular-nums`}>{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
        className={`${btn} grid place-items-center rounded-full bg-brand-500 text-white transition hover:bg-brand-600 active:scale-90`}
      >
        <Icon name="plus" className={icon} strokeWidth={2.5} />
      </button>
    </div>
  )
}

export function Avatar({ initials, className = 'size-11 text-sm' }: { initials: string; className?: string }) {
  return (
    <div
      className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 font-bold text-white ring-2 ring-white/70 ${className}`}
    >
      {initials}
    </div>
  )
}

export function GoldCoin({ className = 'size-5 text-[10px]' }: { className?: string }) {
  return (
    <span
      className={`inline-grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 leading-none font-extrabold text-white shadow-inner ring-1 ring-gold-600/40 ${className}`}
      aria-hidden="true"
    >
      G
    </span>
  )
}

export function Spinner({ className = 'size-5' }: { className?: string }) {
  return <span className={`inline-block animate-spin rounded-full border-2 border-current border-r-transparent ${className}`} />
}

export function EmptyState({
  emoji,
  title,
  message,
  action,
}: {
  emoji: string
  title: string
  message: string
  action?: ReactNode
}) {
  return (
    <div className="animate-fade-up flex flex-col items-center px-8 py-16 text-center">
      <div className="mb-5 grid size-24 place-items-center rounded-full bg-brand-50 text-5xl">{emoji}</div>
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-1.5 text-sm text-slate-500">{message}</p>
      {action && <div className="mt-6 w-full">{action}</div>}
    </div>
  )
}

export function Toast() {
  const { toast } = useApp()
  if (!toast) return null
  return (
    <div key={toast.id} className="pointer-events-none absolute inset-x-0 top-16 z-50 flex justify-center px-6">
      <div className="animate-fade-up flex items-center gap-2 rounded-full bg-slate-900/90 px-4 py-2.5 text-sm font-medium text-white shadow-xl backdrop-blur">
        <Icon name="check" className="size-4 text-emerald-400" strokeWidth={3} />
        {toast.message}
      </div>
    </div>
  )
}
