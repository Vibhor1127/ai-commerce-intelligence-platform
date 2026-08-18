export function inr(value: unknown): string {
  const num = Number(value ?? 0)
  if (isNaN(num)) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num)
}

export function toNumber(val: unknown): number {
  if (typeof val === 'number') return val
  if (typeof val === 'string') {
    const parsed = parseFloat(val.replace(/[^\d.-]/g, ''))
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
}

export function monthLabel(year: unknown, month: unknown): string {
  const m = Number(month)
  const y = Number(year)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const name = monthNames[m - 1] || `M${month}`
  return y ? `${name} ${String(y).slice(-2)}` : name
}

export function entityLabel(entity: string): string {
  return entity
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export function prettyKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

export function cellValue(val: unknown): string {
  if (val === null || val === undefined) return '—'
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE'
  if (typeof val === 'number') {
    if (val > 1000) return inr(val)
    return String(val)
  }
  if (typeof val === 'object') return JSON.stringify(val)
  return String(val)
}

export function pick(row: Record<string, unknown>, ...keys: string[]): unknown {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null) return row[key]
    const lowerKey = key.toLowerCase()
    for (const rk of Object.keys(row)) {
      if (rk.toLowerCase() === lowerKey) return row[rk]
    }
  }
  return undefined
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`
}
