import React from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { EvidenceTable } from '@/components/Insights/EvidenceTable'
import { evidenceMeta, evidenceRows } from '@/lib/evidence'
import { inr, monthLabel, pick, toNumber } from '@/lib/format'

const TOOLTIP = {
  background: '#0B1020',
  border: '1px solid rgba(0,245,255,0.2)',
  fontFamily: 'IBM Plex Mono',
  fontSize: 12,
  color: '#F4EFE6',
}

const COLORS = ['#00F5FF', '#8B5CF6', '#10B981', '#F59E0B', '#67e8f9', '#c4b5fd']

function ChartBox({ children, height = 220 }: { children: React.ReactNode; height?: number }) {
  return <div style={{ height }} className="w-full">{children}</div>
}

export function EvidenceVisualizer({ evidence }: { evidence: unknown }) {
  const rows = evidenceRows(evidence)
  const meta = evidenceMeta(evidence)
  const entity = (meta.entity ?? '').toUpperCase()
  const operation = (meta.operation ?? '').toUpperCase()

  if (!rows.length) {
    return (
      <div className="border border-dashed border-white/10 px-4 py-8 text-center text-sm text-mute">
        Evidence payload is empty. The SQL engine returned no rows.
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {renderChart(entity, operation, rows)}
      <EvidenceTable rows={rows} />
    </div>
  )
}

function renderChart(entity: string, operation: string, rows: Record<string, unknown>[]) {
  if (entity === 'CUSTOMER' || entity === 'CUSTOMER_SATISFACTION') {
    const data = rows.map((row) => ({
      name: String(pick(row, 'customerName', 'name') ?? 'Customer'),
      value: toNumber(pick(row, 'totalSpending', 'lifetimeValue', 'totalSpend', 'avgOrderValue')),
    }))
    if (data.some((d) => d.value > 0)) return <SpendBars data={data} label="Spend" />
  }

  if (entity === 'PRODUCT') {
    const data = rows.map((row) => ({
      name: String(pick(row, 'productName') ?? 'Product'),
      value: toNumber(pick(row, 'revenue', 'Revenue')),
      qty: toNumber(pick(row, 'quantity', 'Quantity')),
    }))
    return <SpendBars data={data} label="Revenue" />
  }

  if (entity === 'INVENTORY') {
    const data = rows.map((row) => ({
      name: String(pick(row, 'productName') ?? 'SKU'),
      value: toNumber(pick(row, 'stock')),
    }))
    return (
      <ChartBox>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 24, right: 12 }}>
            <CartesianGrid horizontal={false} />
            <XAxis type="number" tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="name" width={110} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={TOOLTIP} />
            <Bar dataKey="value" name="Stock" fill="#F59E0B" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartBox>
    )
  }

  if (entity === 'PAYMENT' && operation.includes('METHOD')) {
    const data = rows.map((row) => ({
      name: String(pick(row, 'paymentMethod') ?? 'Method'),
      value: toNumber(pick(row, 'successRate')),
    }))
    return <SpendBars data={data} label="Success %" currency={false} />
  }

  if (entity === 'PAYMENT') {
    const grouped = new Map<string, number>()
    rows.forEach((row) => {
      const method = String(pick(row, 'paymentMethod') ?? 'Unknown')
      grouped.set(method, (grouped.get(method) ?? 0) + toNumber(pick(row, 'amount', 'totalVolume')))
    })
    const data = [...grouped.entries()].map(([name, value]) => ({ name, value }))
    return <Donut data={data} />
  }

  if (entity === 'SHIPMENT' && operation.includes('STATUS')) {
    const data = rows.map((row) => ({
      name: String(pick(row, 'shipmentStatus') ?? 'Status'),
      value: toNumber(pick(row, 'totalShipments')),
    }))
    return <Donut data={data} />
  }

  if (entity === 'REVIEW' && (operation.includes('RATING') || operation.includes('SUMMARY'))) {
    const data = rows.map((row) => ({
      name: String(pick(row, 'productName') ?? 'Product'),
      value: toNumber(pick(row, 'avgRating')),
    }))
    return <SpendBars data={data} label="Avg rating" currency={false} />
  }

  if (entity === 'REVIEW') {
    const grouped = new Map<number, number>()
    rows.forEach((row) => {
      const rating = toNumber(pick(row, 'rating'))
      grouped.set(rating, (grouped.get(rating) ?? 0) + 1)
    })
    const data = [...grouped.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([name, value]) => ({ name: `${name}★`, value }))
    if (data.length) return <SpendBars data={data} label="Reviews" currency={false} />
  }

  if (entity === 'REVENUE' && (operation.includes('MONTH') || operation.includes('TREND'))) {
    const data = rows.map((row) => ({
      name: monthLabel(pick(row, 'year'), pick(row, 'month')),
      value: toNumber(pick(row, 'revenue')),
    }))
    return <Trend data={data} />
  }

  if (entity === 'REVENUE') {
    const data = rows.map((row) => ({
      name: String(pick(row, 'categoryName') ?? 'Category'),
      value: toNumber(pick(row, 'revenue')),
    }))
    return <Donut data={data} />
  }

  if (entity === 'ORDER' && operation.includes('TREND')) {
    const data = rows.map((row) => ({
      name: monthLabel(pick(row, 'year'), pick(row, 'month')),
      completed: toNumber(pick(row, 'completedOrders')),
      cancelled: toNumber(pick(row, 'cancelledOrders')),
    }))
    return (
      <ChartBox>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={36} />
            <Tooltip contentStyle={TOOLTIP} />
            <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={1.8} dot={false} />
            <Line type="monotone" dataKey="cancelled" stroke="#F59E0B" strokeWidth={1.8} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartBox>
    )
  }

  const numericKey = Object.keys(rows[0]).find((k) => typeof rows[0][k] === 'number')
  const nameKey = Object.keys(rows[0]).find((k) => /name|method|status|product|customer/i.test(k))
  if (numericKey && nameKey) {
    const data = rows.map((row) => ({
      name: String(row[nameKey]),
      value: toNumber(row[numericKey]),
    }))
    return <SpendBars data={data} label={numericKey} currency={/revenue|spend|amount|value/i.test(numericKey)} />
  }

  return null
}

function SpendBars({
  data,
  label,
  currency = true,
}: {
  data: { name: string; value: number }[]
  label: string
  currency?: boolean
}) {
  return (
    <ChartBox>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} interval={0} tick={{ fontSize: 10 }} />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={48}
            tickFormatter={(v) => (currency ? `${Math.round(Number(v) / 1000)}k` : String(v))}
          />
          <Tooltip
            contentStyle={TOOLTIP}
            formatter={(value) => [currency ? inr(value) : String(value), label]}
          />
          <Bar dataKey="value" fill="#00F5FF" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartBox>
  )
}

function Donut({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ChartBox height={210}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={52} outerRadius={78} paddingAngle={3}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={TOOLTIP} />
        </PieChart>
      </ResponsiveContainer>
    </ChartBox>
  )
}

function Trend({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ChartBox>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={48}
            tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
          />
          <Tooltip contentStyle={TOOLTIP} formatter={(v) => [inr(v), 'Revenue']} />
          <Line type="monotone" dataKey="value" stroke="#00F5FF" strokeWidth={2} dot={{ r: 3, fill: '#00F5FF' }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartBox>
  )
}
