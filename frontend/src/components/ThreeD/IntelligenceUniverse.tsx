import { useState } from 'react'
import { UNIVERSE_LINKS, UNIVERSE_NODES, type DomainId } from '@/lib/domains'
import { SpatialCanvas } from '@/components/ThreeD/SpatialCanvas'
import {
  CameraRig,
  DomainNode,
  DustField,
  FloorGrid,
  IntelligenceCore,
  LinkLine,
  SignalPulse,
} from '@/components/ThreeD/sceneKit'

export function IntelligenceUniverse({
  onSelect,
  ambient = false,
}: {
  onSelect?: (id: DomainId, question: string) => void
  ambient?: boolean
}) {
  const [hover, setHover] = useState<DomainId | null>(null)

  return (
    <SpatialCanvas camera={[0, 0.55, 6.8]} fov={38}>
      <CameraRig intensity={ambient ? 0.28 : 0.62} base={[0, 0.55, 6.8]} />
      <DustField count={ambient ? 90 : 150} />
      <FloorGrid />
      <IntelligenceCore energy={hover ? 0.7 : 0.38} />

      {UNIVERSE_NODES.map((node) => (
        <LinkLine
          key={`core-${node.id}`}
          from={[0, 0, 0]}
          to={node.position}
          active={hover === node.id}
          dim={Boolean(hover) && hover !== node.id}
          color="#8A918C"
        />
      ))}

      {UNIVERSE_LINKS.map(([a, b], i) => {
        const na = UNIVERSE_NODES.find((n) => n.id === a)
        const nb = UNIVERSE_NODES.find((n) => n.id === b)
        if (!na || !nb) return null
        const active = hover === a || hover === b
        const dim = Boolean(hover) && !active
        return (
          <group key={`${a}-${b}`}>
            <LinkLine from={na.position} to={nb.position} active={active} dim={dim} />
            {!ambient && i % 2 === 0 ? (
              <SignalPulse from={na.position} to={nb.position} speed={0.12 + i * 0.015} delay={i * 0.08} />
            ) : null}
          </group>
        )
      })}

      {UNIVERSE_NODES.map((node) => (
        <DomainNode
          key={node.id}
          position={node.position}
          label={node.label}
          color={node.color}
          selected={hover === node.id}
          dim={Boolean(hover) && hover !== node.id}
          onHover={(over) => setHover(over ? node.id : null)}
          onSelect={ambient ? undefined : () => onSelect?.(node.id, node.question)}
        />
      ))}
    </SpatialCanvas>
  )
}
