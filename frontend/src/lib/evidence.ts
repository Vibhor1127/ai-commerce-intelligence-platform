import type { AnalyticsEvidence, EvidenceRow } from '@/types/api'

export function asEvidence(raw: unknown): AnalyticsEvidence | null {
  if (raw == null) return null
  if (Array.isArray(raw)) {
    return {
      entity: undefined,
      operation: undefined,
      data: raw,
      recordCount: raw.length,
    }
  }
  if (typeof raw === 'object') {
    const rec = raw as Record<string, unknown>
    if ('data' in rec || 'entity' in rec || 'operation' in rec) {
      return {
        entity: typeof rec.entity === 'string' ? rec.entity : undefined,
        operation: typeof rec.operation === 'string' ? rec.operation : undefined,
        data: rec.data,
        dataDescription:
          typeof rec.dataDescription === 'string' ? rec.dataDescription : undefined,
        recordCount: typeof rec.recordCount === 'number' ? rec.recordCount : undefined,
      }
    }
    return { data: [rec], recordCount: 1 }
  }
  return null
}

export function evidenceRows(raw: unknown): EvidenceRow[] {
  const evidence = asEvidence(raw)
  const data = evidence?.data
  if (Array.isArray(data)) {
    return data.filter((row) => row && typeof row === 'object') as EvidenceRow[]
  }
  if (data && typeof data === 'object') return [data as EvidenceRow]
  return []
}

export function evidenceMeta(raw: unknown): {
  entity?: string
  operation?: string
  description?: string
  recordCount: number
} {
  const evidence = asEvidence(raw)
  const rows = evidenceRows(raw)
  return {
    entity: evidence?.entity,
    operation: evidence?.operation,
    description: evidence?.dataDescription,
    recordCount: evidence?.recordCount ?? rows.length,
  }
}

export function columnsOf(rows: EvidenceRow[]): string[] {
  const keys = new Set<string>()
  rows.forEach((row) => Object.keys(row).forEach((k) => keys.add(k)))
  const preferred = [
    'customerName',
    'productName',
    'categoryName',
    'paymentMethod',
    'shipmentStatus',
    'status',
    'rating',
    'avgRating',
    'amount',
    'totalSpending',
    'lifetimeValue',
    'revenue',
    'Revenue',
    'stock',
    'totalOrders',
    'orderCount',
  ]
  const ordered = [
    ...preferred.filter((k) => keys.has(k)),
    ...[...keys].filter((k) => !preferred.includes(k)),
  ]
  return ordered.filter((k) =>
    rows.some((row) => row[k] != null && row[k] !== ''),
  )
}
