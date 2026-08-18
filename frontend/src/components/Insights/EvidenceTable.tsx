import { cellValue, prettyKey } from '@/lib/format'
import { columnsOf } from '@/lib/evidence'
import type { EvidenceRow } from '@/types/api'

export function EvidenceTable({ rows }: { rows: EvidenceRow[] }) {
  if (!rows.length) {
    return (
      <div className="border border-dashed border-white/10 px-4 py-10 text-center text-sm text-mute">
        No evidence rows returned.
      </div>
    )
  }
  const columns = columnsOf(rows)
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10">
            {columns.map((col) => (
              <th key={col} className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
                {prettyKey(col)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/5 transition hover:bg-white/[0.03]">
              {columns.map((col) => (
                <td key={col} className="whitespace-nowrap px-3 py-2.5 text-bone">
                  {cellValue(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
