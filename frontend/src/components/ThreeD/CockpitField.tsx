import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import type { Group, Mesh } from 'three'
import { SpatialCanvas } from '@/components/ThreeD/SpatialCanvas'
import { CameraRig, DustField, FloorGrid, IntelligenceCore } from '@/components/ThreeD/sceneKit'

export function CockpitField({ energy = 0.3 }: { energy?: number }) {
  return (
    <SpatialCanvas camera={[0, 0.2, 5.4]} fov={36}>
      <CameraRig intensity={0.32} base={[0, 0.2, 5.4]} lookAt={[0, 0.05, 0]} />
      <DustField count={100} />
      <FloorGrid />
      <IntelligenceCore energy={energy} scale={1.15} />
      <OrbitRings energy={energy} />
    </SpatialCanvas>
  )
}

function OrbitRings({ energy }: { energy: number }) {
  const group = useRef<Group>(null)
  const beads = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const a = (i / 7) * Math.PI * 2
      return [Math.cos(a) * 1.85, Math.sin(a * 0.5) * 0.2, Math.sin(a) * 1.85] as [number, number, number]
    })
  }, [])

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * (0.06 + energy * 0.18)
  })

  return (
    <group ref={group}>
      <mesh rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[1.85, 0.004, 8, 120]} />
        <meshBasicMaterial color="#C8D5D7" transparent opacity={0.22 + energy * 0.15} />
      </mesh>
      {beads.map((pos, i) => (
        <Bead key={i} position={pos} />
      ))}
    </group>
  )
}

function Bead({ position }: { position: [number, number, number] }) {
  const ref = useRef<Mesh>(null)
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.028, 10, 10]} />
      <meshBasicMaterial color="#E6E0D4" transparent opacity={0.7} />
    </mesh>
  )
}
