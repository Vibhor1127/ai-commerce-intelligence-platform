import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Html } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
import type { Capability } from '@/types/api'
import { entityLabel } from '@/lib/format'

function OrbitingNode({
  capability,
  angle,
  radius,
  onSelect,
}: {
  capability: Capability
  angle: number
  radius: number
  onSelect?: (c: Capability) => void
}) {
  const ref = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * 0.15 + angle
      ref.current.position.x = Math.cos(t) * radius
      ref.current.position.z = Math.sin(t) * radius
      ref.current.position.y = Math.sin(t * 2) * 0.8
    }
  })

  return (
    <group ref={ref}>
      <Sphere args={[0.3, 16, 16]} onClick={() => onSelect?.(capability)}>
        <meshStandardMaterial
          color="#00F5FF"
          emissive="#00F5FF"
          emissiveIntensity={0.8}
          roughness={0.2}
        />
      </Sphere>
      <Html distanceFactor={12} center>
        <div
          onClick={() => onSelect?.(capability)}
          className="cursor-pointer whitespace-nowrap rounded border border-cyan/40 bg-void/90 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan shadow-lg backdrop-blur hover:bg-cyan hover:text-void"
        >
          {entityLabel(capability.entity)}
        </div>
      </Html>
    </group>
  )
}

function CenterCore() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.2
      ref.current.rotation.x += delta * 0.1
    }
  })

  return (
    <Sphere ref={ref} args={[1, 32, 32]}>
      <meshStandardMaterial
        color="#8B5CF6"
        emissive="#8B5CF6"
        emissiveIntensity={0.6}
        wireframe
      />
    </Sphere>
  )
}

export function DataGalaxy({
  capabilities,
  onSelect,
}: {
  capabilities: Capability[]
  onSelect?: (c: Capability) => void
}) {
  return (
    <div className="h-[420px] w-full overflow-hidden rounded border border-white/10 bg-void/50">
      <Canvas camera={{ position: [0, 6, 12], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00F5FF" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#8B5CF6" />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        <CenterCore />
        {capabilities.map((cap, i) => {
          const angle = (i / capabilities.length) * Math.PI * 2
          const radius = 4.5 + (i % 2) * 1.5
          return (
            <OrbitingNode
              key={cap.entity}
              capability={cap}
              angle={angle}
              radius={radius}
              onSelect={onSelect}
            />
          )
        })}
      </Canvas>
    </div>
  )
}
