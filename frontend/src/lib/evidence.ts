import type { EvidenceRow } from '@/types/api'

export function evidenceRows(evidence: unknown): EvidenceRow[] {
  if (!evidence) return []
  if (Array.isArray(evidence)) {
    return evidence.filter((item): item is EvidenceRow => typeof item === 'object' && item !== null)
  }
  if (typeof evidence === 'object' && evidence !== null) {
    const obj = evidence as Record<string, unknown>
    if (Array.isArray(obj.data)) {
      return obj.data.filter((item): item is EvidenceRow => typeof item === 'object' && item !== null)
    }
    if (Array.isArray(obj.rows)) {
      return obj.rows.filter((item): item is EvidenceRow => typeof item === 'object' && item !== null)
    }
    if (Array.isArray(obj.results)) {
      return obj.results.filter((item): item is EvidenceRow => typeof item === 'object' && item !== null)
    }
    return [obj]
  }
  return []
}

export function evidenceMeta(evidence: unknown): { entity?: string; operation?: string } {
  if (typeof evidence === 'object' && evidence !== null) {
    const obj = evidence as Record<string, unknown>
    return {
      entity: typeof obj.entity === 'string' ? obj.entity : undefined,
      operation: typeof obj.operation === 'string' ? obj.operation : undefined,
    }
  }
  return {}
}

export function columnsOf(rows: EvidenceRow[]): string[] {
  const set = new Set<string>()
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      set.add(key)
    }
  }
  return Array.from(set)
}
