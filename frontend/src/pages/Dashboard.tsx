import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DataSphere } from '@/components/ThreeD/DataSphere'
import { AnalyticsCard } from '@/components/Dashboard/AnalyticsCard'
import { KPIOrb } from '@/components/Dashboard/KPIOrb'
import { RevenueChart } from '@/components/Dashboard/RevenueChart'
import {
  useCategoryRevenue,
  useDashboard,
  useInventoryAlerts,
  useMonthlyRevenue,
  useTopCustomers,
  useTopProducts,
} from '@/hooks/useAnalytics'
import { compactInt, formatInt, inr, toNumber } from '@/lib/format'
import { useAuth } from '@/context/AuthContext'
import { useSignal } from '@/context/SignalContext'

const TOOLTIP = {
  background: '#0B1020',
  border: '1px solid rgba(0,245,255,0.2)',
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
  const customers = useTopCustomers()
  const products = useTopProducts()
  const inventory = useInventoryAlerts()

  const kpis = dash.data

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mono-label">Command surface</p>
          <h1 className="mt-2 font-display text-3xl text-ivory md:text-5xl">
            {greeting()} brief{username ? `, ${username.split(/[._-]/)[0]}` : ''}.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-bone">
            Macro metrics from the SQL analytics engine. Ask a question when you want the explanation layer on top.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <DataSphere className="h-28 w-28 shrink-0" />
          <button
            type="button"
            onClick={() => navigate('/ask')}
            className="border border-cyan/40 bg-cyan/10 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-cyan transition hover:bg-cyan hover:text-void"
          >
            Open ask surface
          </button>
        </div>
      </header>

      {dash.isError ? (
        <div className="border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber">
          Dashboard metrics could not be loaded. {signal === 'replica' ? 'Replica signal is still booting.' : 'Check JWT and /analytics/dashboard.'}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPIOrb
          label="Revenue"
          value={kpis ? inr(kpis.totalRevenue, true) : '—'}
          hint="Completed order value"
          tone="cyan"
          delay={0.05}
        />
        <KPIOrb
          label="Orders"
          value={kpis ? formatInt(kpis.totalOrders) : '—'}
          hint="All recorded orders"
          tone="violet"
          delay={0.12}
        />
        <KPIOrb
          label="Customers"
          value={kpis ? formatInt(kpis.totalCustomers) : '—'}
          hint="Unique buyers"
          tone="emerald"
          delay={0.18}
        />
        <KPIOrb
          label="Products"
          value={kpis ? formatInt(kpis.totalProducts) : '—'}
          hint="Active catalog"
          tone="amber"
          delay={0.24}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <AnalyticsCard label="Revenue trajectory">
          {monthly.isLoading ? (
            <div className="shimmer h-64" />
          ) : monthly.data?.length ? (
            <RevenueChart data={monthly.data} />
          ) : (
            <Empty>No monthly revenue series yet.</Empty>
          )}
        </AnalyticsCard>
        <AnalyticsCard label="Category mix">
          {categories.isLoading ? (
            <div className="shimmer h-64" />
          ) : categories.data?.length ? (
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart
                  data={categories.data.map((row) => ({
                    name: row.categoryName,
                    value: toNumber(row.revenue),
                  }))}
                  layout="vertical"
                  margin={{ left: 8, right: 8 }}
                >
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={96} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={TOOLTIP} formatter={(v) => [inr(v), 'Revenue']} />
                  <Bar dataKey="value" fill="#8B5CF6" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <Empty>No category mix available.</Empty>
          )}
        </AnalyticsCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AnalyticsCard label="Highest spenders">
          <RankList
            loading={customers.isLoading}
            rows={(customers.data ?? []).map((row) => ({
              name: row.customerName,
              meta: `ID ${row.customerId}`,
              value: inr(row.totalSpending),
            }))}
          />
        </AnalyticsCard>
        <AnalyticsCard label="Lead SKUs">
          <RankList
            loading={products.isLoading}
            rows={(products.data ?? []).map((row) => ({
              name: row.productName,
              meta: `${compactInt(row.quantity ?? row.Quantity)} units`,
              value: inr(row.revenue ?? row.Revenue),
            }))}
          />
        </AnalyticsCard>
        <AnalyticsCard label="Stock pressure">
          <RankList
            loading={inventory.isLoading}
            rows={(inventory.data ?? []).map((row) => ({
              name: row.productName,
              meta: `SKU ${row.productId}`,
              value: `${row.stock} left`,
              warn: row.stock <= 5,
            }))}
          />
        </AnalyticsCard>
      </div>
    </div>
  )
}

function RankList({
  rows,
  loading,
}: {
  rows: { name: string; meta: string; value: string; warn?: boolean }[]
  loading: boolean
}) {
  if (loading) return <div className="shimmer h-48" />
  if (!rows.length) return <Empty>Nothing to rank.</Empty>
  return (
    <ul className="space-y-3">
      {rows.slice(0, 5).map((row, i) => (
        <motion.li
          key={row.name}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center justify-between gap-3 border-b border-white/5 pb-3"
        >
          <div>
            <div className="text-sm text-ivory">{row.name}</div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-mute">{row.meta}</div>
          </div>
          <div className={`font-mono text-xs ${row.warn ? 'text-amber' : 'text-cyan'}`}>{row.value}</div>
        </motion.li>
      ))}
    </ul>
  )
}

function Empty({ children }: { children: string }) {
  return <p className="py-10 text-center text-sm text-mute">{children}</p>
}

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Morning'
  if (hour < 17) return 'Afternoon'
  return 'Evening'
}
