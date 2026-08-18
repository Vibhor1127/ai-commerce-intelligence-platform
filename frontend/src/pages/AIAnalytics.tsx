import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChatInterface } from '@/components/AIChat/ChatInterface'
import { demoSeedFor } from '@/services/demo'

export function AIAnalyticsPage() {
  const [params] = useSearchParams()
  const seed = useMemo(() => {
    const q = params.get('q')
    if (q) return q
    const entity = params.get('entity')
    const operation = params.get('op') ?? undefined
    if (entity) return demoSeedFor(entity, operation)
    return undefined
  }, [params])

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <p className="mono-label">Ask surface</p>
        <h1 className="mt-2 font-display text-3xl text-ivory md:text-5xl">Intelligence command.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-bone">
          Natural language in. Intent classification, capability routing, SQL evidence, then an explanation. The
          frontend never invents the numbers — it only renders what the engine returns.
        </p>
      </header>
      <ChatInterface seed={seed} />
    </div>
  )
}
