import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { monthLabel, toNumber } from '@/lib/format'
import type { MonthlyRevenueDTO } from '@/types/api'

export function RevenueChart({ data }: { data: MonthlyRevenueDTO[] }) {
  const series = data.map((row) => ({
    label: monthLabel(row.year, row.month),
    revenue: toNumber(row.revenue),
  }))

  return (
    <div className="h-full min-h-[7rem] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00F5FF" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#00F5FF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={48}
            tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
          />
          <Tooltip
            contentStyle={{
              background: '#0B1020',
              border: '1px solid rgba(0,245,255,0.2)',
              fontFamily: 'IBM Plex Mono',
              fontSize: 12,
              color: '#F4EFE6',
            }}
            formatter={(value) => [
              new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
                Number(value ?? 0),
              ),
              'Revenue',
            ]}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#00F5FF"
            strokeWidth={1.8}
            fill="url(#revFill)"
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}