import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

function StarField() {
  const ref = useRef<THREE.Points>(null)

  const [positions, colors] = useMemo(() => {
    const count = 1200
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const colorA = new THREE.Color('#00F5FF')
    const colorB = new THREE.Color('#8B5CF6')
    const colorC = new THREE.Color('#10B981')

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const radius = 15 + Math.random() * 25
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)

      pos[i3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      pos[i3 + 2] = radius * Math.cos(phi)

      const mixed = Math.random() > 0.6 ? colorA : Math.random() > 0.3 ? colorB : colorC
      col[i3] = mixed.r
      col[i3 + 1] = mixed.g
      col[i3 + 2] = mixed.b
    }
    return [pos, col]
  }, [])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta * 0.02
      ref.current.rotation.y -= delta * 0.03
    }
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          vertexColors
          size={0.08}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.65}
        />
      </Points>
    </group>
  )
}

export function UniverseCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 18], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: 'none', position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.4} />
      <StarField />
    </Canvas>
  )
}
