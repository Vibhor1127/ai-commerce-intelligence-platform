import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import type { Group, Mesh } from 'three'

function Rig() {
  const group = useRef<Group>(null)
  const core = useRef<Mesh>(null)

  const nodes = useMemo(() => {
    const pts: [number, number, number][] = []
    const count = 18
    for (let i = 0; i < count; i += 1) {
      const phi = Math.acos(-1 + (2 * i) / count)
      const theta = Math.sqrt(count * Math.PI) * phi
      pts.push([
        1.35 * Math.cos(theta) * Math.sin(phi),
        1.35 * Math.sin(theta) * Math.sin(phi),
        1.35 * Math.cos(phi),
      ])
    }
    return pts
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (group.current) {
      group.current.rotation.y = t * 0.28
      group.current.rotation.x = 0.25 + Math.sin(t * 0.3) * 0.08
    }
    if (core.current) core.current.rotation.y = -t * 0.4
  })

  return (
    <group ref={group}>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshBasicMaterial color="#00F5FF" wireframe transparent opacity={0.55} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.07} />
      </mesh>
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshBasicMaterial color={i % 3 === 0 ? '#10B981' : '#00F5FF'} />
        </mesh>
      ))}
    </group>
  )
}

export function DataSphere({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 3.4], fov: 42 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
        <Rig />
      </Canvas>
    </div>
  )
}
