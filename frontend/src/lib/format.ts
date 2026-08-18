import type { EvidenceRow } from '@/types/api'

export function toNumber(value: unknown): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  if (typeof value === 'string') {
    const n = Number(value.replace(/[,₹\s]/g, ''))
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

export function inr(value: unknown, compact = false): string {
  const n = toNumber(value)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: compact && Math.abs(n) >= 1000 ? 1 : 0,
    notation: compact && Math.abs(n) >= 100000 ? 'compact' : 'standard',
  }).format(n)
}

export function compactInt(value: unknown): string {
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(toNumber(value))
}

export function formatInt(value: unknown): string {
  return new Intl.NumberFormat('en-IN').format(toNumber(value))
}

export function formatDate(value: unknown): string {
  if (value == null || value === '') return '—'
  if (Array.isArray(value) && value.length >= 3) {
    const [y, m, d, hh = 0, mm = 0] = value as number[]
    const dt = new Date(y, (m ?? 1) - 1, d, hh, mm)
    if (Number.isNaN(dt.getTime())) return String(value)
    return dt.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }
  const dt = new Date(String(value))
  if (Number.isNaN(dt.getTime())) return String(value)
  return dt.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function monthLabel(year: unknown, month: unknown): string {
  const y = toNumber(year)
  const m = toNumber(month)
  if (!y || !m) return '—'
  return new Date(y, m - 1, 1).toLocaleString('en-IN', {
    month: 'short',
    year: '2-digit',
  })
}

export function prettyKey(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (s) => s.toUpperCase())
}

export function cellValue(value: unknown): string {
  if (value == null || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'number') {
    if (Math.abs(value) >= 100 && Number.isInteger(value) === false) return inr(value)
    return formatInt(value)
  }
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) return formatDate(value)
  if (Array.isArray(value) && typeof value[0] === 'number' && value.length >= 3) {
    return formatDate(value)
  }
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

export function pick(row: EvidenceRow, ...keys: string[]): unknown {
  const map = new Map(Object.entries(row).map(([k, v]) => [k.toLowerCase(), v]))
  for (const key of keys) {
    if (key in row && row[key] != null) return row[key]
    const hit = map.get(key.toLowerCase())
    if (hit != null) return hit
  }
  return undefined
}

export function uid(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

export function entityLabel(entity?: string): string {
  if (!entity) return 'Unknown'
  return entity
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function operationLabel(operation?: string): string {
  if (!operation) return 'Insight'
  return operation
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}
