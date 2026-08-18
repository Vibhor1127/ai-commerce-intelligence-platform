import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import type { Group } from 'three'
import * as THREE from 'three'

function Network({ density = 46 }: { density?: number }) {
  const group = useRef<Group>(null)

  const { points, lineGeo, pointGeo } = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i < density; i += 1) {
      pts.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 9.5,
          (Math.random() - 0.5) * 6.2,
          (Math.random() - 0.5) * 7.2,
        ),
      )
    }

    const segments: number[] = []
    for (let i = 0; i < pts.length; i += 1) {
      for (let j = i + 1; j < pts.length; j += 1) {
        if (pts[i].distanceTo(pts[j]) < 2.15) {
          segments.push(...pts[i].toArray(), ...pts[j].toArray())
        }
      }
    }

    const positions = new Float32Array(pts.flatMap((p) => p.toArray()))
    const pointGeo = new THREE.BufferGeometry()
    pointGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(segments), 3))

    return { points: pts, lineGeo, pointGeo }
  }, [density])

  useFrame(({ clock }) => {
    if (!group.current) return
    const t = clock.getElapsedTime()
    group.current.rotation.y = t * 0.045
    group.current.rotation.x = Math.sin(t * 0.12) * 0.08
    group.current.position.y = Math.sin(t * 0.25) * 0.08
  })

  return (
    <group ref={group}>
      <points geometry={pointGeo}>
        <pointsMaterial color="#00F5FF" size={0.045} sizeAttenuation transparent opacity={0.9} />
      </points>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#00F5FF" transparent opacity={0.16} />
      </lineSegments>
      {points
        .filter((_, i) => i % 7 === 0)
        .map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.042, 10, 10]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#8B5CF6' : '#10B981'} />
          </mesh>
        ))}
    </group>
  )
}

function Particles() {
  const ref = useRef<THREE.Points>(null)
  const geo = useMemo(() => {
    const count = 160
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 14
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [])

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.02
  })

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#8B5CF6" size={0.018} transparent opacity={0.45} />
    </points>
  )
}

export function NeuralBackground({ className = '' }: { className?: string }) {
  const [ok, setOk] = useState(true)

  if (!ok) return <div className={`grid-fade ${className}`} />

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 48 }}
        dpr={[1, 1.4]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
        }}
        onError={() => setOk(false)}
      >
        <fog attach="fog" args={['#050816', 6.5, 14]} />
        <Network />
        <Particles />
      </Canvas>
    </div>
  )
}
