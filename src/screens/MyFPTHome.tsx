import { BottomNavigation } from '../components/BottomNavigation'
import { Icon } from '../components/Icon'
import type { IconName } from '../components/Icon'
import { Avatar, IconButton, Screen } from '../components/ui'
import { employee } from '../data/mock'
import { useApp } from '../store/AppContext'

type Service = { icon: IconName; label: string; tone: string; isNew?: boolean; primary?: boolean }

const services: Service[] = [
  { icon: 'clock', label: 'Check-in', tone: 'bg-blue-50 text-blue-600' },
  { icon: 'calendar', label: 'Leave', tone: 'bg-violet-50 text-violet-600' },
  { icon: 'fileText', label: 'Payslip', tone: 'bg-emerald-50 text-emerald-600' },
  { icon: 'utensils', label: 'Canteen', tone: 'bg-brand-500 text-white shadow-lg shadow-brand-500/40', isNew: true, primary: true },
  { icon: 'bus', label: 'Shuttle Bus', tone: 'bg-sky-50 text-sky-600' },
  { icon: 'building', label: 'Room Booking', tone: 'bg-rose-50 text-rose-600' },
  { icon: 'newspaper', label: 'News', tone: 'bg-amber-50 text-amber-600' },
  { icon: 'grid', label: 'More', tone: 'bg-slate-100 text-slate-600' },
]

const news = [
  { tag: 'Event', title: 'F-Town Family Day 2026 registration is open', date: '28 Sep' },
  { tag: 'HR', title: 'Q4 health check-up schedule for Đà Nẵng site', date: '25 Sep' },
]

export function MyFPTHome() {
  const { navigate, showToast } = useApp()
  const openCanteen = () => navigate({ name: 'canteen' })
  const mock = (label: string) => () => showToast(`${label} is not part of this prototype`)

  return (
    <Screen
      className="bg-slate-50"
      footer={
        <BottomNavigation
          items={[
            { icon: 'home', label: 'Home', active: true, onClick: () => {} },
            { icon: 'grid', label: 'Services', onClick: mock('Services') },
            { icon: 'message', label: 'Messages', badge: 3, onClick: mock('Messages') },
            { icon: 'user', label: 'Profile', onClick: mock('Profile') },
          ]}
        />
      }
    >
      {/* Header */}
      <div className="rounded-b-[32px] bg-gradient-to-br from-brand-500 via-brand-500 to-brand-700 px-5 pt-5 pb-20 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-2xl font-extrabold tracking-tight">
            <span className="rounded-lg bg-white px-1.5 text-brand-500">My</span>FPT
          </div>
          <div className="flex items-center gap-1">
            <IconButton label="Search" onClick={mock('Search')} className="text-white hover:bg-white/15">
              <Icon name="search" />
            </IconButton>
            <IconButton label="Notifications" onClick={mock('Notifications')} className="text-white hover:bg-white/15">
              <Icon name="bell" />
            </IconButton>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <Avatar initials={employee.initials} className="size-12 text-base" />
          <div>
            <p className="text-sm text-white/80">Good morning 👋</p>
            <p className="text-lg font-bold">{employee.name}</p>
          </div>
        </div>
      </div>

      {/* Attendance card */}
      <div className="-mt-14 px-4">
        <div className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-lg shadow-slate-900/5 ring-1 ring-slate-100">
          <div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Icon name="shield" className="size-6" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-500">Today · Tue, 29 Sep</p>
            <p className="font-bold">Checked in at 08:02</p>
            <p className="text-xs text-slate-500">{employee.site}</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">On time</span>
        </div>
      </div>

      {/* Services */}
      <section className="px-4 pt-6">
        <h2 className="mb-3 text-base font-bold">Services</h2>
        <div className="grid grid-cols-4 gap-y-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          {services.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={s.primary ? openCanteen : mock(s.label)}
              className="group relative flex flex-col items-center gap-1.5 text-center"
            >
              <span className={`grid size-13 place-items-center rounded-2xl transition group-active:scale-90 ${s.tone}`}>
                <Icon name={s.icon} className="size-6" />
              </span>
              {s.isNew && (
                <span className="absolute -top-1.5 right-0 rounded-full bg-red-500 px-1.5 text-[9px] leading-4 font-bold text-white ring-2 ring-white">
                  NEW
                </span>
              )}
              <span className={`text-xs ${s.primary ? 'font-bold text-brand-600' : 'font-medium text-slate-700'}`}>{s.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Canteen promo */}
      <section className="px-4 pt-5">
        <button
          type="button"
          onClick={openCanteen}
          className="relative flex w-full items-center overflow-hidden rounded-3xl bg-gradient-to-r from-amber-100 via-brand-100 to-brand-200 p-5 text-left transition active:scale-[0.99]"
        >
          <div className="relative z-10 max-w-[65%]">
            <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold tracking-wide text-brand-600">NEW FEATURE</span>
            <h3 className="mt-2 text-lg leading-tight font-extrabold text-slate-900">Order lunch, skip the queue</h3>
            <p className="mt-1 text-xs text-slate-600">Pay with Gold, Momo or your bank account.</p>
            <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-brand-500 px-3.5 py-1.5 text-[13px] font-bold text-white shadow-md shadow-brand-500/30">
              Open Canteen <Icon name="chevronRight" className="size-4" strokeWidth={3} />
            </span>
          </div>
          <div className="absolute -right-3 -bottom-4 text-[96px] leading-none select-none">🍱</div>
          <div className="absolute top-3 right-16 text-3xl select-none">🥢</div>
        </button>
      </section>

      {/* News */}
      <section className="px-4 pt-6 pb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold">Company News</h2>
          <button type="button" onClick={mock('News')} className="text-[13px] font-semibold text-brand-600">
            See all
          </button>
        </div>
        <div className="space-y-2.5">
          {news.map((n) => (
            <button
              key={n.title}
              type="button"
              onClick={mock('News')}
              className="flex w-full items-center gap-3 rounded-2xl bg-white p-3.5 text-left shadow-sm ring-1 ring-slate-100"
            >
              <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500">
                <Icon name="newspaper" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-brand-600">
                  {n.tag} · {n.date}
                </p>
                <p className="truncate text-sm font-semibold">{n.title}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </Screen>
  )
}
