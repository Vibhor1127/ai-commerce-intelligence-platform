import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { KPIOrb } from '@/components/Dashboard/KPIOrb'
import { AnalyticsCard } from '@/components/Dashboard/AnalyticsCard'
import { RevenueChart } from '@/components/Dashboard/RevenueChart'
import { api } from '@/services/api'
import { inr } from '@/lib/format'

export function DashboardPage() {
  const { data: dashboard, isLoading: dashLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.getDashboard(),
  })

  const { data: monthlyRevenue = [] } = useQuery({
    queryKey: ['monthlyRevenue'],
    queryFn: () => api.getMonthlyRevenue(),
  })

  const { data: topCustomers = [] } = useQuery({
    queryKey: ['topCustomers'],
    queryFn: () => api.getTopCustomers(),
  })

  const { data: topProducts = [] } = useQuery({
    queryKey: ['topProducts'],
    queryFn: () => api.getTopProducts(),
  })

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="mono-label">Store Telemetry · Core Hub</div>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-ivory md:text-3xl">
            Commerce Intelligence Overview
          </h1>
        </div>
        <Link
          to="/ask"
          className="inline-flex items-center gap-2 border border-cyan/40 bg-cyan/10 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-cyan transition hover:bg-cyan hover:text-void"
        >
          <Sparkles size={14} />
          Query AI Cockpit
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* KPI Orbs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <KPIOrb
          label="Total Revenue"
          value={dashLoading ? '…' : inr(dashboard?.totalRevenue ?? 0)}
          tone="cyan"
          delay={0}
        />
        <KPIOrb
          label="Total Orders"
          value={dashLoading ? '…' : String(dashboard?.totalOrders ?? 0)}
          tone="violet"
          delay={0.05}
        />
        <KPIOrb
          label="Active Customers"
          value={dashLoading ? '…' : String(dashboard?.totalCustomers ?? 0)}
          tone="emerald"
          delay={0.1}
        />
        <KPIOrb
          label="Pending Transit"
          value={dashLoading ? '…' : String(dashboard?.pendingShipments ?? 0)}
          tone="amber"
          delay={0.15}
        />
        <KPIOrb
          label="Payment Faults"
          value={dashLoading ? '…' : String(dashboard?.failedPayments ?? 0)}
          tone="amber"
          delay={0.2}
        />
        <KPIOrb
          label="Inventory Alerts"
          value={dashLoading ? '…' : String(dashboard?.lowStockProducts ?? 0)}
          tone="cyan"
          delay={0.25}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Velocity */}
        <div className="lg:col-span-2">
          <AnalyticsCard
            label="Revenue Trajectory (Monthly)"
            className="h-[340px]"
            action={
              <Link to="/ask?q=Show+revenue+trends" className="text-xs text-mute hover:text-cyan">
                Ask AI →
              </Link>
            }
          >
            <div className="h-[260px] pt-4">
              <RevenueChart data={monthlyRevenue} />
            </div>
          </AnalyticsCard>
        </div>

        {/* Top Products */}
        <div>
          <AnalyticsCard
            label="Top Performing SKUs"
            className="h-[340px]"
            action={
              <Link to="/ask?q=Who+are+the+top+products" className="text-xs text-mute hover:text-cyan">
                Ask AI →
              </Link>
            }
          >
            <div className="mt-3 divide-y divide-white/5 overflow-y-auto">
              {topProducts.slice(0, 4).map((p, i) => (
                <div key={i} className="py-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate font-medium text-bone">{p.productName}</span>
                    <span className="font-mono text-xs text-cyan">{inr(p.revenue ?? p.totalRevenue ?? 0)}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-mute">
                    <span>Units sold: {p.quantity ?? p.totalUnitsSold ?? 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </AnalyticsCard>
        </div>
      </div>

      {/* Spenders List */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <AnalyticsCard
          label="Top Spenders (VIP Cluster)"
          action={
            <Link to="/ask?q=Who+are+my+biggest+customers" className="text-xs text-mute hover:text-cyan">
              Ask AI →
            </Link>
          }
        >
          <div className="mt-3 divide-y divide-white/5">
            {topCustomers.slice(0, 5).map((c, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <div className="font-medium text-bone">{c.customerName}</div>
                  <div className="text-[11px] text-mute">{c.totalOrders ?? 0} confirmed orders</div>
                </div>
                <div className="font-mono text-cyan">{inr(c.totalSpending ?? 0)}</div>
              </div>
            ))}
          </div>
        </AnalyticsCard>

        <AnalyticsCard label="Operational Intelligence Stack">
          <div className="mt-3 space-y-3 text-sm text-bone/90">
            <p>
              The platform executes <strong>deterministic SQL pipelines</strong> across orders, customers, inventory, and reviews, pairing hard SQL proof with high-level LLM reasoning.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="border border-white/10 p-3">
                <div className="mono-label text-[10px]">Redis Guard</div>
                <div className="mt-1 font-mono text-xs text-emerald">5m-15m Active TTL</div>
              </div>
              <div className="border border-white/10 p-3">
                <div className="mono-label text-[10px]">Proof Engine</div>
                <div className="mt-1 font-mono text-xs text-cyan">Zero Hallucination</div>
              </div>
            </div>
          </div>
        </AnalyticsCard>
      </div>
    </div>
  )
}
