import { useNavigate } from 'react-router-dom'
import { CapabilityCard } from '@/components/Dashboard/CapabilityCard'
import { useCapabilities } from '@/hooks/useCapabilities'
import { demoSeedFor } from '@/services/demo'
import type { Capability } from '@/types/api'

export function CapabilitiesPage() {
  const { data, isLoading, isError, error } = useCapabilities()
  const navigate = useNavigate()

  function open(capability: Capability, operation?: string) {
    const q = demoSeedFor(capability.entity, operation)
    navigate(`/ask?q=${encodeURIComponent(q)}&entity=${encodeURIComponent(capability.entity)}`)
  }

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8 max-w-2xl">
        <p className="mono-label">Capability mesh</p>
        <h1 className="mt-2 font-display text-3xl text-ivory md:text-5xl">What the engine can prove.</h1>
        <p className="mt-3 text-sm leading-relaxed text-bone">
          Fetched live from <span className="text-cyan">GET /ai/capabilities</span>. Nothing here is hardcoded — when a
          new handler is registered on the backend, it appears on this mesh.
        </p>
      </header>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="shimmer h-52" />
          ))}
        </div>
      ) : isError ? (
        <div className="border border-amber/30 bg-amber/10 px-4 py-6 text-sm text-amber">
          Capability manifest unavailable. {error instanceof Error ? error.message : 'Unknown fault.'}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(data ?? []).map((cap, i) => (
            <CapabilityCard key={cap.entity + i} capability={cap} index={i} onOpen={open} />
          ))}
        </div>
      )}
    </div>
  )
}
