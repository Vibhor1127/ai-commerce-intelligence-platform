import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CapabilityGalaxy } from '@/components/ThreeD/CapabilityGalaxy'
import { HoloPanel } from '@/components/ui/HoloPanel'
import { useCapabilities } from '@/hooks/useCapabilities'
import { RELATED } from '@/lib/domains'
import { entityLabel } from '@/lib/format'
import { demoSeedFor } from '@/services/demo'
import type { Capability } from '@/types/api'

export function CapabilitiesPage() {
  const { data, isLoading, isError, error } = useCapabilities()
  const navigate = useNavigate()
  const [selected, setSelected] = useState<string | null>(null)
  const capabilities = data ?? []

  const current = useMemo(
    () => capabilities.find((c) => c.entity.toUpperCase() === selected) ?? null,
    [capabilities, selected],
  )

  const neighbors = (RELATED[selected ?? ''] ?? []).filter((id) =>
    capabilities.some((c) => c.entity.toUpperCase() === id),
  )

  function ask(capability: Capability, operation?: string) {
    const q = demoSeedFor(capability.entity, operation)
    navigate(`/ask?q=${encodeURIComponent(q)}&entity=${encodeURIComponent(capability.entity)}`)
  }

  return (
    <div className="spatial-stage">
      {isLoading ? (
        <div className="absolute inset-0 grid-fade" />
      ) : (
        <CapabilityGalaxy
          capabilities={capabilities}
          selected={selected}
          onSelect={(entity) => setSelected(entity || null)}
        />
      )}
      <div className="pointer-events-none absolute inset-0 z-10 vignette" />

      <div className="spatial-hud">
        <header className="max-w-xl">
          <p className="mono-label">Capability galaxy</p>
          <h1 className="mt-1 font-display text-3xl text-ivory md:text-[42px]">Orbit the proof surface.</h1>
          <p className="mt-2 text-sm text-bone/80">
            Live from <span className="text-ivory">GET /ai/capabilities</span>. Related domains stay linked. Select a
            node to inspect operations.
          </p>
        </header>

        {isError ? (
          <div className="pointer-events-auto mt-4 border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber">
            Galaxy unavailable. {error instanceof Error ? error.message : 'Unknown fault.'}
          </div>
        ) : null}

        <div className="pointer-events-auto mt-auto flex justify-end pt-6">
          {current ? (
            <HoloPanel depth={20} className="w-full max-w-md p-5" label={entityLabel(current.entity)}>
              <p className="text-sm leading-relaxed text-bone">{current.description}</p>
              {neighbors.length ? (
                <div className="mt-4">
                  <div className="mono-label mb-2">Linked domains</div>
                  <div className="flex flex-wrap gap-1.5">
                    {neighbors.map((id) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setSelected(id)}
                        className="border border-white/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-mute hover:text-ivory"
                      >
                        {entityLabel(id)}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {current.operations.map((op) => (
                  <button
                    key={op}
                    type="button"
                    onClick={() => ask(current, op)}
                    className="border border-ivory/15 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-ivory/80 transition hover:bg-ivory hover:text-void"
                  >
                    {op.replaceAll('_', ' ')}
                  </button>
                ))}
              </div>
            </HoloPanel>
          ) : (
            <p className="mono-label">Select a domain in the galaxy</p>
          )}
        </div>
      </div>
    </div>
  )
}
