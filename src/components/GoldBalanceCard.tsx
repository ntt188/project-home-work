import { formatGold, formatVND, goldToVnd } from '../utils/format'
import { Icon } from './Icon'
import { GoldCoin } from './ui'

export function GoldBalanceCard({ gold, onTopUp }: { gold: number; onTopUp: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 p-5 text-white shadow-xl shadow-slate-900/20">
      {/* decorative coins */}
      <div className="absolute -top-10 -right-8 size-36 rounded-full bg-gold-400/20 blur-2xl" />
      <div className="absolute -right-4 -bottom-6 size-24 rounded-full border-[10px] border-gold-400/15" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[13px] font-medium text-white/70">
            <Icon name="wallet" className="size-4" /> Your Gold
          </p>
          <p key={gold} className="animate-fade-up mt-1.5 flex items-center gap-2 text-[30px] leading-none font-extrabold whitespace-nowrap tracking-tight">
            <GoldCoin className="size-8 text-sm" />
            {formatGold(gold)}
          </p>
          <p className="mt-2 text-xs text-white/60">≈ {formatVND(goldToVnd(gold))}</p>
          <p className="text-[11px] text-white/40">1 Gold = 1,000 VND</p>
        </div>
        <button
          type="button"
          onClick={onTopUp}
          className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-gold-400 px-3.5 py-2 text-[13px] font-bold text-slate-900 shadow-lg shadow-gold-500/30 transition hover:bg-gold-500 active:scale-95"
        >
          <Icon name="plus" className="size-4" strokeWidth={3} />
          Top Up
        </button>
      </div>
    </div>
  )
}
