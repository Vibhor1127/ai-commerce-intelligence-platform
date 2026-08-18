import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { CapabilityCard } from '@/components/Dashboard/CapabilityCard'
import { DataGalaxy } from '@/components/Three/DataGalaxy'
import { api } from '@/services/api'
import type { Capability } from '@/types/api'

export function CapabilitiesPage() {
  const navigate = useNavigate()
  const [activeCap, setActiveCap] = useState<Capability | null>(null)

  const { data: capsResponse, isLoading } = useQuery({
    queryKey: ['capabilities'],
    queryFn: () => api.getCapabilities(),
  })

  const capabilities = capsResponse?.capabilities ?? []

  function handleOpen(cap: Capability, op?: string) {
    const question = op
      ? `Run analytics operation for ${cap.entity}: ${op.replaceAll('_', ' ')}`
      : `Give me a full analytics summary on ${cap.entity}`
    navigate(`/ask?q=${encodeURIComponent(question)}`)
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <div className="mono-label">Federated Domain Matrix · GET /ai/capabilities</div>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-ivory md:text-3xl">
          Capability Galaxy
        </h1>
        <p className="mt-2 text-sm text-bone/80">
          The registry dynamically maps queries to verified handlers. Click any orbiting domain or node to launch a query.
        </p>
      </div>

      {/* 3D Orbiting Galaxy */}
      <DataGalaxy capabilities={capabilities} onSelect={(cap) => setActiveCap(cap)} />

      {/* Grid of Capabilities */}
      <div>
        <div className="mono-label mb-4">Active Domain Modules ({capabilities.length})</div>
        {isLoading ? (
          <div className="py-12 text-center text-sm text-mute">Loading capability graph…</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((cap, i) => (
              <CapabilityCard
                key={cap.entity}
                capability={cap}
                index={i}
                onOpen={(c, op) => handleOpen(c, op)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
