import { useNavigate } from 'react-router-dom'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { IntelligenceUniverse } from '@/components/ThreeD/IntelligenceUniverse'
import { HoloPanel } from '@/components/ui/HoloPanel'
import { RevenueChart } from '@/components/Dashboard/RevenueChart'
import {
  useCategoryRevenue,
  useDashboard,
  useInventoryAlerts,
  useMonthlyRevenue,
} from '@/hooks/useAnalytics'
import { formatInt, inr, toNumber } from '@/lib/format'
import { useAuth } from '@/context/AuthContext'
import { useSignal } from '@/context/SignalContext'
import type { DomainId } from '@/lib/domains'

const TOOLTIP = {
  background: '#0B1020',
  border: '1px solid rgba(244,239,230,0.12)',
  fontFamily: 'IBM Plex Mono',
  fontSize: 12,
  color: '#F4EFE6',
}

export function DashboardPage() {
  const { username } = useAuth()
  const signal = useSignal()
  const navigate = useNavigate()
  const dash = useDashboard()
  const monthly = useMonthlyRevenue()
  const categories = useCategoryRevenue()
  const inventory = useInventoryAlerts()
  const kpis = dash.data

  function openDomain(_id: DomainId, question: string) {
    navigate(`/ask?q=${encodeURIComponent(question)}`)
  }

  return (
    <div className="spatial-stage">
      <IntelligenceUniverse onSelect={openDomain} />
      <div className="pointer-events-none absolute inset-0 z-10 vignette" />

      <div className="spatial-hud">
        <header className="pointer-events-auto flex items-end justify-between gap-4">
          <div>
            <p className="mono-label">Intelligence universe</p>
            <h1 className="mt-1 font-display text-3xl text-ivory md:text-[42px]">
              {greeting()}{username ? `, ${username.split(/[._-]/)[0]}` : ''}.
            </h1>
            <p className="mt-2 max-w-md text-sm text-bone/80">
              Select a domain in the field. The core routes you to a verified question.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/ask')}
            className="hidden border border-ivory/20 bg-ivory/5 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ivory transition hover:bg-ivory hover:text-void md:inline-flex"
          >
            Enter cockpit
          </button>
        </header>

        {dash.isError ? (
          <div className="pointer-events-auto mt-4 border border-amber/30 bg-amber/10 px-3 py-2 text-xs text-amber">
            Metrics unavailable. {signal === 'replica' ? 'Replica is still aligning.' : 'Check /analytics/dashboard.'}
          </div>
        ) : null}

        <div className="pointer-events-auto mt-5 grid grid-cols-2 gap-3 lg:absolute lg:left-6 lg:top-36 lg:mt-0 lg:w-48 lg:grid-cols-1">
          <MetricChip label="Revenue" value={kpis ? inr(kpis.totalRevenue, true) : '—'} delay={0.05} />
          <MetricChip label="Customers" value={kpis ? formatInt(kpis.totalCustomers) : '—'} delay={0.1} />
        </div>
        <div className="pointer-events-auto mt-3 hidden grid-cols-1 gap-3 lg:absolute lg:right-6 lg:top-36 lg:grid lg:w-48">
          <MetricChip label="Orders" value={kpis ? formatInt(kpis.totalOrders) : '—'} delay={0.14} />
          <MetricChip label="Products" value={kpis ? formatInt(kpis.totalProducts) : '—'} delay={0.18} />
        </div>
        <div className="pointer-events-auto mt-3 grid grid-cols-2 gap-3 lg:hidden">
          <MetricChip label="Orders" value={kpis ? formatInt(kpis.totalOrders) : '—'} delay={0.14} />
          <MetricChip label="Products" value={kpis ? formatInt(kpis.totalProducts) : '—'} delay={0.18} />
        </div>

        <div className="pointer-events-auto mt-auto hidden gap-3 pt-6 md:grid md:grid-cols-3">
          <HoloPanel label="Revenue trajectory" depth={8} className="p-4">
            {monthly.isLoading ? (
              <div className="shimmer h-28" />
            ) : monthly.data?.length ? (
              <div className="h-28">
                <RevenueChart data={monthly.data} />
              </div>
            ) : (
              <p className="py-8 text-center text-xs text-mute">No series</p>
            )}
          </HoloPanel>
          <HoloPanel label="Category mix" depth={14} className="p-4">
            {categories.isLoading ? (
              <div className="shimmer h-28" />
            ) : categories.data?.length ? (
              <div className="h-28">
                <ResponsiveContainer>
                  <BarChart
                    data={categories.data.map((row) => ({
                      name: row.categoryName,
                      value: toNumber(row.revenue),
                    }))}
                    layout="vertical"
                    margin={{ left: 4, right: 4, top: 4, bottom: 0 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" width={78} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={TOOLTIP} formatter={(v) => [inr(v), 'Revenue']} />
                    <Bar dataKey="value" fill="#C4B8E4" radius={[0, 2, 2, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="py-8 text-center text-xs text-mute">No mix</p>
            )}
          </HoloPanel>
          <HoloPanel label="Stock pressure" depth={18} className="p-4">
            <ul className="space-y-2">
              {(inventory.data ?? []).slice(0, 4).map((row) => (
                <li key={row.productId} className="flex items-center justify-between text-sm">
                  <span className="truncate text-bone">{row.productName}</span>
                  <span className={row.stock <= 5 ? 'font-mono text-amber' : 'font-mono text-ivory/80'}>
                    {row.stock}
                  </span>
                </li>
              ))}
              {!inventory.data?.length && !inventory.isLoading ? (
                <li className="py-6 text-center text-xs text-mute">No alerts</li>
              ) : null}
            </ul>
          </HoloPanel>
        </div>
      </div>
    </div>
  )
}

function MetricChip({ label, value, delay }: { label: string; value: string; delay: number }) {
  return (
    <HoloPanel depth={16} delay={delay} className="px-4 py-3">
      <div className="mono-label">{label}</div>
      <div className="mt-1 font-display text-2xl text-ivory">{value}</div>
    </HoloPanel>
  )
}

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Morning field'
  if (hour < 17) return 'Afternoon field'
  return 'Evening field'
}
