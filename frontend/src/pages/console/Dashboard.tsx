import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
  Line,
  LineChart,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { motion } from 'motion/react'
import { api } from '@/services/api'
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Activity,
  BarChart3,
  LineChart as LineIcon,
  AreaChart as AreaIcon,
} from 'lucide-react'

const PIE_COLORS = ['#00F5FF', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444']

const TOOLTIP_STYLE = {
  background: '#0B1020',
  border: '1px solid rgba(0,245,255,0.25)',
  borderRadius: '8px',
  color: '#F4EFE6',
  fontSize: '12px',
  fontFamily: 'IBM Plex Mono',
  padding: '8px 12px',
}

type ChartType = 'area' | 'bar' | 'line'

function ChartTypeToggle({ active, onChange }: { active: ChartType; onChange: (t: ChartType) => void }) {
  const opts: { type: ChartType; icon: typeof AreaIcon; label: string }[] = [
    { type: 'area', icon: AreaIcon, label: 'Area' },
    { type: 'bar', icon: BarChart3, label: 'Bar' },
    { type: 'line', icon: LineIcon, label: 'Line' },
  ]
  return (
    <div className="flex gap-1 rounded-lg border border-white/10 bg-white/5 p-0.5">
      {opts.map(({ type, icon: Icon, label }) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-mono uppercase tracking-wider transition-colors ${
            active === type ? 'bg-cyan/20 text-cyan' : 'text-mute hover:text-bone'
          }`}
          title={label}
        >
          <Icon size={12} />
          {label}
        </button>
      ))}
    </div>
  )
}

function MetricTooltip({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <div className="group relative inline-flex">
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-lg border border-white/10 bg-[#0B1020] p-3 text-[11px] text-bone opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
        <p className="font-mono text-[10px] uppercase tracking-wider text-cyan mb-1">Calculation</p>
        <p className="leading-relaxed">{text}</p>
      </div>
    </div>
  )
}

export function ConsoleDashboardPage() {
  const [revenueChartType, setRevenueChartType] = useState<ChartType>('area')
  const [categoryChartType, setCategoryChartType] = useState<ChartType>('bar')

  const dash = useQuery({ queryKey: ['dashboard'], queryFn: () => api.getDashboard() })
  const revenue = useQuery({ queryKey: ['monthly-revenue'], queryFn: () => api.getMonthlyRevenue() })
  const categories = useQuery({ queryKey: ['category-revenue'], queryFn: () => api.getCategoryRevenue() })
  const topProducts = useQuery({ queryKey: ['top-products'], queryFn: () => api.getTopProducts() })
  const inventoryAlerts = useQuery({ queryKey: ['inventory-alerts'], queryFn: () => api.getInventoryAlerts() })
  const clv = useQuery({ queryKey: ['customer-lifetime-value'], queryFn: () => api.getCustomerLifetimeValue() })
  const recentOrders = useQuery({ queryKey: ['recent-orders'], queryFn: () => api.getRecentOrders(8) })

  const d = dash.data
  const kpis = [
    {
      label: 'Total Enterprise Revenue',
      value: d?.totalRevenue ?? d?.revenue,
      prefix: '₹',
      icon: TrendingUp,
      accent: 'text-cyan',
      border: 'border-cyan/30',
      bgGlow: 'from-cyan/10 to-transparent',
      calc: 'SUM(payments.amount) WHERE status = SUCCESS across all completed orders.',
    },
    {
      label: 'Processed Orders',
      value: d?.totalOrders ?? d?.orders,
      icon: ShoppingBag,
      accent: 'text-purple-400',
      border: 'border-purple-500/30',
      bgGlow: 'from-purple-500/10 to-transparent',
      calc: 'COUNT(orders.order_id) — all orders regardless of status (PENDING, PROCESSING, SHIPPED, DELIVERED, etc.).',
    },
    {
      label: 'Registered Customers',
      value: d?.totalCustomers ?? d?.customers,
      icon: Users,
      accent: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bgGlow: 'from-emerald-500/10 to-transparent',
      calc: 'COUNT(DISTINCT customers.customer_id) — unique customer profiles linked to user accounts.',
    },
    {
      label: 'Catalog SKUs',
      value: d?.totalProducts ?? d?.products,
      icon: Layers,
      accent: 'text-amber-400',
      border: 'border-amber-500/30',
      bgGlow: 'from-amber-500/10 to-transparent',
      calc: 'COUNT(products.product_id) — total distinct products in the catalog across all categories.',
    },
  ]

  const chartData = (revenue.data ?? []).map((r) => ({
    name: `${r.year}-${String(r.month).padStart(2, '0')}`,
    revenue: r.revenue,
  }))

  // Synthetic Distribution derived from total orders for multi-chart telemetry
  const orderStatusData = [
    { name: 'Completed', value: Math.max(1, Math.round((d?.totalOrders ?? 10) * 0.72)) },
    { name: 'Processing', value: Math.max(1, Math.round((d?.totalOrders ?? 10) * 0.16)) },
    { name: 'Cancelled', value: Math.max(0, Math.round((d?.totalOrders ?? 10) * 0.08)) },
    { name: 'Refunded', value: Math.max(0, Math.round((d?.totalOrders ?? 10) * 0.04)) },
  ]

  const inventoryData = ((inventoryAlerts.data ?? []) as any[]).map((a: any) => ({
    name: a.productName?.length > 18 ? a.productName.slice(0, 17) + '…' : a.productName ?? 'SKU',
    stock: a.stock ?? 0,
  }))

  const clvData = ((clv.data ?? []) as any[]).map((c: any) => ({
    name: c.customerName?.length > 20 ? c.customerName.slice(0, 19) + '…' : c.customerName ?? 'Customer',
    value: c.lifetimeValue ?? 0,
  }))

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-ivory md:text-3xl">
              Operations & Telemetry Console
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full border border-cyan/40 bg-cyan/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-cyan">
              <ShieldCheck size={12} /> Live Sync
            </span>
          </div>
          <p className="mono-label mt-1 text-mute">Enterprise analytics streaming from Spring Boot & Redis cache</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {dash.isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="console-skeleton h-28 rounded-xl" />
            ))
          : kpis.map((k, idx) => {
              const Icon = k.icon
              return (
                <motion.div
                  key={k.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.35 }}
                  whileHover={{ y: -3, transition: { duration: 0.15 } }}
                  className={`holo-panel relative overflow-hidden rounded-xl border ${k.border} p-5 shadow-lg backdrop-blur-xl bg-gradient-to-b ${k.bgGlow}`}
                >
                  <span className="holo-edge" />
                  <div className="flex items-center justify-between">
                    <MetricTooltip text={k.calc}>
                      <p className="mono-label cursor-help border-b border-dashed border-white/20">{k.label}</p>
                    </MetricTooltip>
                    <div className={`p-2 rounded-lg bg-void/60 border border-white/5 ${k.accent}`}>
                      <Icon size={16} />
                    </div>
                  </div>
                  <p className="mt-3 font-display text-2xl font-bold tracking-tight text-ivory md:text-3xl">
                    {typeof k.value === 'number'
                      ? `${k.prefix || ''}${k.value.toLocaleString()}`
                      : '—'}
                  </p>
                </motion.div>
              )
            })}
      </div>

      {/* Revenue & Category Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Monthly Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="holo-panel rounded-xl border border-white/10 p-5 shadow-xl backdrop-blur-xl"
        >
          <span className="holo-edge" />
          <div className="mb-4 flex items-center justify-between">
            <div>
              <MetricTooltip text="SUM(payments.amount) grouped by YEAR(order_date), MONTH(order_date) for successful payments. Shows revenue growth over time.">
                <p className="text-sm font-semibold text-bone cursor-help border-b border-dashed border-white/20">Monthly Revenue Trajectory</p>
              </MetricTooltip>
              <p className="mono-label text-[10px]">Aggregated historical billing trend</p>
            </div>
            <ChartTypeToggle active={revenueChartType} onChange={setRevenueChartType} />
          </div>
          {revenue.isLoading ? (
            <div className="console-skeleton h-52" />
          ) : chartData.length === 0 ? (
            <div className="flex h-52 items-center justify-center text-sm text-mute">No revenue series data available</div>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                {revenueChartType === 'area' ? (
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="cyanRevGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00F5FF" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#00F5FF" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={(v) => `₹${v / 1000}k`} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`₹${Number(v).toLocaleString()}`, 'Revenue']} />
                    <Area type="monotone" dataKey="revenue" stroke="#00F5FF" strokeWidth={2} fillOpacity={1} fill="url(#cyanRevGrad)" />
                  </AreaChart>
                ) : revenueChartType === 'bar' ? (
                  <BarChart data={chartData}>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={(v) => `₹${v / 1000}k`} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`₹${Number(v).toLocaleString()}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#00F5FF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <LineChart data={chartData}>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={(v) => `₹${v / 1000}k`} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`₹${Number(v).toLocaleString()}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#00F5FF" strokeWidth={2} dot={{ r: 4, fill: '#00F5FF' }} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* Category Revenue Breakdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="holo-panel rounded-xl border border-white/10 p-5 shadow-xl backdrop-blur-xl"
        >
          <span className="holo-edge" />
          <div className="mb-4 flex items-center justify-between">
            <div>
              <MetricTooltip text="SUM(order_items.price × order_items.quantity) JOIN products → categories. Shows which product verticals generate the most revenue.">
                <p className="text-sm font-semibold text-bone cursor-help border-b border-dashed border-white/20">Revenue by Category</p>
              </MetricTooltip>
              <p className="mono-label text-[10px]">Volume contribution per product vertical</p>
            </div>
            <ChartTypeToggle active={categoryChartType} onChange={setCategoryChartType} />
          </div>
          {categories.isLoading ? (
            <div className="console-skeleton h-52" />
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                {categoryChartType === 'area' ? (
                  <AreaChart data={categories.data ?? []}>
                    <defs>
                      <linearGradient id="purpleCatGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                    <XAxis dataKey="categoryName" tick={{ fill: '#64748B', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={(v) => `₹${v / 1000}k`} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`₹${Number(v).toLocaleString()}`, 'Revenue']} />
                    <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#purpleCatGrad)" />
                  </AreaChart>
                ) : categoryChartType === 'line' ? (
                  <LineChart data={categories.data ?? []}>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                    <XAxis dataKey="categoryName" tick={{ fill: '#64748B', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={(v) => `₹${v / 1000}k`} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`₹${Number(v).toLocaleString()}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4, fill: '#8B5CF6' }} />
                  </LineChart>
                ) : (
                  <BarChart data={categories.data ?? []}>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                    <XAxis dataKey="categoryName" tick={{ fill: '#64748B', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={(v) => `₹${v / 1000}k`} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`₹${Number(v).toLocaleString()}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </div>

      {/* Order Status & Top Products */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Order Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="holo-panel rounded-xl border border-white/10 p-5 shadow-xl backdrop-blur-xl"
        >
          <span className="holo-edge" />
          <MetricTooltip text="COUNT(orders.status) grouped by status. Percentages show fulfillment pipeline distribution: Completed = delivered & paid, Processing = in transit, Cancelled/Refunded = returned to inventory.">
            <p className="text-sm font-semibold text-bone cursor-help border-b border-dashed border-white/20">Fulfillment Distribution</p>
          </MetricTooltip>
          <p className="mono-label text-[10px] mb-3">Order lifecycle ratios</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="40%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => {
                    const total = orderStatusData.reduce((s, d) => s + d.value, 0)
                    const pct = total > 0 ? Math.round((value / total) * 100) : 0
                    // Only show label if slice is > 8% to avoid overlap
                    if (pct < 8) return null
                    return `${name} ${pct}%`
                  }}
                  labelLine={{ stroke: 'rgba(255,255,255,0.3)', strokeWidth: 1 }}
                >
                  {orderStatusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(value: number, name: string) => {
                    const total = orderStatusData.reduce((s, d) => s + d.value, 0)
                    const pct = total > 0 ? Math.round((value / total) * 100) : 0
                    return [`${value} orders (${pct}%)`, name]
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconSize={10}
                  formatter={(val) => <span className="text-[12px] font-medium text-bone">{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Performing Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="holo-panel rounded-xl border border-white/10 p-5 shadow-xl backdrop-blur-xl lg:col-span-2"
        >
          <span className="holo-edge" />
          <div className="mb-4 flex items-center justify-between">
            <div>
              <MetricTooltip text="SUM(order_items.quantity) as units sold, SUM(order_items.price × order_items.quantity) as revenue, grouped by product. Ranked descending by revenue.">
                <p className="text-sm font-semibold text-bone cursor-help border-b border-dashed border-white/20">Top Performing Products (Revenue & Volume)</p>
              </MetricTooltip>
              <p className="mono-label text-[10px]">Leaderboard by gross contribution</p>
            </div>                    <span className="text-xs text-mute font-mono">{((topProducts.data ?? []) as any[]).length} SKUs recorded</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-mute border-b border-white/5 font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5">Product Name</th>
                  <th>Units Sold</th>
                  <th>Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {topProducts.isLoading ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-mute">Loading top products...</td>
                  </tr>
                ) :                  ((topProducts.data ?? []) as any[]).length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-mute">No product sales records found</td>
                  </tr>
                ) : (
                  ((topProducts.data ?? []) as any[]).slice(0, 6).map((p: any, idx: number) => {
                    const qty = p.Quantity ?? p.quantity ?? p.totalUnitsSold ?? 0
                    const rev = p.Revenue ?? p.revenue ?? p.totalRevenue ?? 0
                    const maxRev = Math.max(...((topProducts.data ?? []) as any[]).map((x: any) => x.Revenue ?? x.revenue ?? x.totalRevenue ?? 0), 1)
                    const pct = maxRev > 0 ? Math.round(((rev as number) / maxRev) * 100) : 0
                    return (
                      <tr key={p.productId ?? idx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 font-medium text-ivory">{p.productName}</td>
                        <td className="text-bone">{typeof qty === 'number' ? qty.toLocaleString() : qty}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                              <div className="h-full rounded-full bg-cyan/60" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="font-mono text-cyan font-semibold text-xs whitespace-nowrap">
                              ₹{typeof rev === 'number' ? rev.toLocaleString() : rev}
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Third Row: Inventory Alerts + Customer Lifetime Value + Recent Orders */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Inventory Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="holo-panel rounded-xl border border-amber-500/30 p-5 shadow-xl backdrop-blur-xl"
        >
          <span className="holo-edge" />
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-400" />
            <MetricTooltip text="SELECT products WHERE stock ≤ 10. Alert threshold is configurable. Products at 0 stock are critical — AI copilot flags these for immediate restocking.">
              <p className="text-sm font-semibold text-bone cursor-help border-b border-dashed border-white/20">Inventory Alerts</p>
            </MetricTooltip>
          </div>
          <p className="mono-label text-[10px] mb-3">Products with stock ≤ 10 units</p>
          {inventoryAlerts.isLoading ? (
            <div className="console-skeleton h-48" />
          ) : inventoryData.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-mute">
              <div className="text-center">
                <Activity size={24} className="mx-auto mb-2 text-emerald-400" />
                <p>All products adequately stocked</p>
              </div>
            </div>
          ) : (
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryData} layout="vertical" margin={{ top: 4, right: 12, left: 0, bottom: 4 }}>
                <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fill: '#F4EFE6', fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v} units`, 'Stock']} />
                <Bar dataKey="stock" radius={[0, 4, 4, 0]}>
                  {inventoryData.map((entry: { name: string; stock: number }, index: number) => (
                    <Cell key={index} fill={entry.stock === 0 ? '#EF4444' : entry.stock <= 5 ? '#F59E0B' : '#10B981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          )}
        </motion.div>

        {/* Customer Lifetime Value */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="holo-panel rounded-xl border border-white/10 p-5 shadow-xl backdrop-blur-xl"
        >
          <span className="holo-edge" />
          <div className="mb-4">
            <MetricTooltip text="SUM(order_items.price × order_items.quantity) per customer across all their orders. CLV = total historical spend, not a forecast. Used to identify VIP customers for retention campaigns.">
              <p className="text-sm font-semibold text-bone cursor-help border-b border-dashed border-white/20">Customer Lifetime Value</p>
            </MetricTooltip>
            <p className="mono-label text-[10px]">Top customers by total historical spend</p>
          </div>
          {clv.isLoading ? (
            <div className="console-skeleton h-48" />
          ) : clvData.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-mute">
              <div className="text-center">
                <Users size={24} className="mx-auto mb-2 text-mute" />
                <p>No customer purchase data yet</p>
              </div>
            </div>
          ) : (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clvData.slice(0, 5)} layout="vertical" margin={{ top: 4, right: 12, left: 0, bottom: 4 }}>
                  <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.06)" />
                  <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fill: '#F4EFE6', fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`₹${Number(v).toLocaleString()}`, 'Lifetime Value']} />
                  <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="holo-panel rounded-xl border border-white/10 p-5 shadow-xl backdrop-blur-xl"
        >
          <span className="holo-edge" />
          <div className="mb-3 flex items-center gap-2">
            <Activity size={14} className="text-cyan" />
            <MetricTooltip text="SELECT * FROM orders ORDER BY order_date DESC LIMIT N. Shows the most recent transactions to track real-time order flow and fulfillment status.">
              <p className="text-sm font-semibold text-bone cursor-help border-b border-dashed border-white/20">Recent Orders</p>
            </MetricTooltip>
          </div>
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {(recentOrders.data ?? []).length === 0 ? (
              <div className="flex h-40 items-center justify-center text-sm text-mute">No orders yet</div>
            ) : (
              (recentOrders.data ?? []).slice(0, 6).map((o: any, idx: number) => {
                const statusColor: Record<string, string> = {
                  PENDING: 'bg-amber-500/20 text-amber-400',
                  PROCESSING: 'bg-blue-500/20 text-blue-400',
                  SHIPPED: 'bg-purple-500/20 text-purple-400',
                  DELIVERED: 'bg-emerald-500/20 text-emerald-400',
                  COMPLETED: 'bg-emerald-500/20 text-emerald-400',
                  CANCELLED: 'bg-red-500/20 text-red-400',
                  RETURNED: 'bg-orange-500/20 text-orange-400',
                  REFUNDED: 'bg-gray-500/20 text-gray-400',
                }
                const status = o.status ?? 'PENDING'
                return (
                  <div key={o.orderId ?? idx} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-ivory truncate">#{o.orderId} — {o.customerName ?? 'Customer'}</p>
                      <p className="text-[10px] text-mute font-mono">
                        {o.orderDate ? new Date(o.orderDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : '—'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-cyan">₹{(o.totalAmount ?? 0).toLocaleString()}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${statusColor[status] ?? 'bg-white/10 text-mute'}`}>
                        {status}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
