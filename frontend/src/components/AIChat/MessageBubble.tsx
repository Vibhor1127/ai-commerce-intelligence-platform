import { InsightPanel } from '@/components/Insights/InsightPanel'
import type { ChatTurn } from '@/types/api'

export function MessageBubble({ turn }: { turn: ChatTurn }) {
  if (turn.role === 'user') {
    return (
      <article className="holo-panel ml-auto max-w-2xl px-4 py-3">
        <span className="holo-edge" />
        <div className="mono-label">Query</div>
        <p className="mt-2 text-[15px] text-ivory">{turn.question}</p>
      </article>
    )
  }

  if (turn.error) {
    return (
      <article className="border border-amber/30 bg-amber/10 px-4 py-4">
        <div className="mono-label text-amber">Signal fault</div>
        <p className="mt-2 text-sm text-ivory">{turn.error}</p>
      </article>
    )
  }

  if (!turn.response) return null
  return <InsightPanel response={turn.response} />
}