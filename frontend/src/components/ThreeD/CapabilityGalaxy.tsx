import { useMemo, useRef, useState, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { SpatialCanvas } from '@/components/ThreeD/SpatialCanvas'
import {
  CameraRig,
  DomainNode,
  DustField,
  FloorGrid,
  IntelligenceCore,
  LinkLine,
} from '@/components/ThreeD/sceneKit'
import { domainColor, galaxyLayout, relatedPairs, shortDomainLabel } from '@/lib/domains'
import type { Capability } from '@/types/api'

export function CapabilityGalaxy({
  capabilities,
  selected,
  onSelect,
}: {
  capabilities: Capability[]
  selected?: string | null
  onSelect: (entity: string) => void
}) {
  const key = capabilities.map((c) => c.entity.toUpperCase()).join('|')
  const nodes = useMemo(
    () => galaxyLayout(key ? key.split('|') : []),
    [key],
  )
  const pairs = useMemo(() => relatedPairs(key ? key.split('|') : []), [key])
  const [hover, setHover] = useState<string | null>(null)
  const focus = selected ?? hover

  const look = useMemo(() => {
    const hit = nodes.find((n) => n.entity === selected)
    if (!hit) return [0, 0.1, 0] as [number, number, number]
    return [hit.position[0] * 0.2, hit.position[1] * 0.25, hit.position[2] * 0.2] as [
      number,
      number,
      number,
    ]
  }, [nodes, selected])

  const cam = selected ? ([0, 1.05, 5.6] as [number, number, number]) : ([0, 0.85, 7.1] as [number, number, number])

  return (
    <SpatialCanvas camera={cam} fov={40} onMissed={() => onSelect('')}>
      <CameraRig intensity={0.48} base={cam} lookAt={look} />
      <DustField count={120} />
      <FloorGrid />
      <OrbitingMesh paused={Boolean(selected)}>
        <IntelligenceCore energy={focus ? 0.65 : 0.32} scale={0.92} />
        {pairs.map(([a, b]) => {
          const na = nodes.find((n) => n.entity === a)
          const nb = nodes.find((n) => n.entity === b)
          if (!na || !nb) return null
          const active = focus === a || focus === b
          const dim = Boolean(focus) && !active
          return (
            <LinkLine
              key={`${a}-${b}`}
              from={na.position}
              to={nb.position}
              active={active}
              dim={dim}
              color="#9AA7B2"
            />
          )
        })}
        {nodes.map((node) => (
          <DomainNode
            key={node.entity}
            position={node.position}
            label={shortDomainLabel(node.entity)}
            color={domainColor(node.entity)}
            selected={selected === node.entity || hover === node.entity}
            dim={Boolean(focus) && focus !== node.entity}
            onHover={(over) => setHover(over ? node.entity : null)}
            onSelect={() => onSelect(node.entity)}
          />
        ))}
      </OrbitingMesh>
    </SpatialCanvas>
  )
}

function OrbitingMesh({ children, paused }: { children: ReactNode; paused?: boolean }) {
  const ref = useRef<Group>(null)
  useFrame((_, dt) => {
    if (!paused && ref.current) ref.current.rotation.y += dt * 0.045
  })
  return <group ref={ref}>{children}</group>
}
