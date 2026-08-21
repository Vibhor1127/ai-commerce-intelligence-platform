import { useSearchParams } from 'react-router-dom'
import { ChatInterface } from '@/components/AIChat/ChatInterface'

export function AIAnalyticsPage() {
  const [params] = useSearchParams()
  const seed = params.get('q') ?? undefined

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-3 pb-2">
      <div className="shrink-0">
        <div className="mono-label">Cognitive Layer · Natural Language Interface</div>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-ivory md:text-3xl">
          AI Intelligence Cockpit
        </h1>
      </div>

      <div className="min-h-0 flex-1">
        <ChatInterface seed={seed} />
      </div>
    </div>
  )
}
