import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChatInterface } from '@/components/AIChat/ChatInterface'
import { CockpitField } from '@/components/ThreeD/CockpitField'
import { demoSeedFor } from '@/services/demo'

export function AIAnalyticsPage() {
  const [params] = useSearchParams()
  const [busy, setBusy] = useState(false)
  const seed = useMemo(() => {
    const q = params.get('q')
    if (q) return q
    const entity = params.get('entity')
    const operation = params.get('op') ?? undefined
    if (entity) return demoSeedFor(entity, operation)
    return undefined
  }, [params])

  return (
    <div className="spatial-stage">
      <CockpitField energy={busy ? 0.95 : 0.38} />
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-void/20 via-void/55 to-void/88" />
      <div className="spatial-hud pointer-events-auto">
        <header className="mb-4 max-w-2xl">
          <p className="mono-label">AI cockpit</p>
          <h1 className="mt-1 font-display text-3xl text-ivory md:text-[42px]">Ask the engine.</h1>
          <p className="mt-2 text-sm text-bone/80">
            Question → intent → capability → SQL engine → insight. The UI never invents a number.
          </p>
        </header>
        <div className="min-h-0 flex-1">
          <ChatInterface seed={seed} onBusy={setBusy} />
        </div>
      </div>
    </div>
  )
}
