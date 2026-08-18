import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'

function CubeRig() {
  const ref = useRef<Group>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.rotation.x = 0.4 + Math.sin(t * 0.35) * 0.12
    ref.current.rotation.y = t * 0.35
  })
  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshBasicMaterial color="#00F5FF" wireframe transparent opacity={0.7} />
      </mesh>
      <mesh>
        <boxGeometry args={[0.72, 0.72, 0.72]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.18} />
      </mesh>
    </group>
  )
}

export function AnalyticsCube({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 3.2], fov: 40 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
        <CubeRig />
      </Canvas>
    </div>
  )
}
