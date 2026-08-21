import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Html, Float } from '@react-three/drei'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { Capability } from '@/types/api'
import { entityLabel } from '@/lib/format'
import { Activity, Sparkles, Compass } from 'lucide-react'

// Cosmic Starfield Dust
function CosmicParticleField({ count = 450 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const cols = new Float32Array(count * 3)
    const cyan = new THREE.Color('#00F5FF')
    const purple = new THREE.Color('#8B5CF6')
    const white = new THREE.Color('#FFFFFF')

    for (let i = 0; i < count; i++) {
      const r = 8 + Math.random() * 22
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = (r * Math.sin(phi) * Math.sin(theta)) * 0.45
      pos[i * 3 + 2] = r * Math.cos(phi)

      const mixed = Math.random() > 0.5 ? cyan : (Math.random() > 0.3 ? purple : white)
      cols[i * 3] = mixed.r
      cols[i * 3 + 1] = mixed.g
      cols[i * 3 + 2] = mixed.b
    }
    return [pos, cols]
  }, [count])

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02
      pointsRef.current.rotation.x += delta * 0.005
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Orbital Track Ring
function OrbitalRing({ radius }: { radius: number }) {
  const ringRef = useRef<THREE.LineLoop>(null)
  
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = []
    const segments = 64
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2
      points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius))
    }
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [radius])

  return (
    <lineLoop ref={ringRef} geometry={geometry}>
      <lineBasicMaterial color="#00F5FF" transparent opacity={0.15} />
    </lineLoop>
  )
}

// Interactive Orbiting Domain Node
function OrbitingNode({
  capability,
  angle,
  radius,
  speed,
  onSelect,
}: {
  capability: Capability
  angle: number
  radius: number
  speed: number
  onSelect?: (c: Capability) => void
}) {
  const ref = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * speed + angle
      ref.current.position.x = Math.cos(t) * radius
      ref.current.position.z = Math.sin(t) * radius
      ref.current.position.y = Math.sin(t * 2.2) * 0.7
    }
  })

  return (
    <group ref={ref}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
        <Sphere
          args={[hovered ? 0.42 : 0.32, 24, 24]}
          onClick={() => onSelect?.(capability)}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshStandardMaterial
            color={hovered ? '#FFFFFF' : '#00F5FF'}
            emissive={hovered ? '#00F5FF' : '#0099FF'}
            emissiveIntensity={hovered ? 1.8 : 0.8}
            roughness={0.15}
            metalness={0.8}
          />
        </Sphere>

        {/* Orbit Glow Ring on Hover */}
        {hovered && (
          <Sphere args={[0.55, 16, 16]}>
            <meshBasicMaterial
              color="#00F5FF"
              wireframe
              transparent
              opacity={0.4}
            />
          </Sphere>
        )}

        <Html distanceFactor={14} center>
          <div
            onClick={() => onSelect?.(capability)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`group cursor-pointer select-none whitespace-nowrap rounded-lg border px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wider backdrop-blur-md transition-all duration-200 ${
              hovered
                ? 'scale-110 border-cyan bg-cyan text-void shadow-[0_0_20px_rgba(0,245,255,0.8)]'
                : 'border-cyan/30 bg-void/85 text-cyan hover:border-cyan hover:bg-void'
            }`}
          >
            <div className="flex items-center gap-1.5 font-semibold">
              <span className={`h-1.5 w-1.5 rounded-full ${hovered ? 'bg-void animate-ping' : 'bg-cyan'}`} />
              {entityLabel(capability.entity)}
            </div>
            {hovered && (
              <div className="mt-1 text-[9px] lowercase tracking-normal text-void font-mono">
                {capability.operations.length} capabilities &rarr;
              </div>
            )}
          </div>
        </Html>
      </Float>
    </group>
  )
}

// Glowing Pulsing Central Core
function CenterCore() {
  const outerRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime()
    if (outerRef.current) {
      outerRef.current.rotation.y += delta * 0.25
      outerRef.current.rotation.x += delta * 0.12
      const scale = 1 + Math.sin(t * 1.5) * 0.05
      outerRef.current.scale.set(scale, scale, scale)
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.4
      innerRef.current.rotation.z += delta * 0.2
    }
  })

  return (
    <group>
      {/* Outer Wireframe Shell */}
      <Sphere ref={outerRef} args={[1.15, 24, 24]}>
        <meshStandardMaterial
          color="#8B5CF6"
          emissive="#8B5CF6"
          emissiveIntensity={0.9}
          wireframe
        />
      </Sphere>

      {/* Inner Glowing Nucleus */}
      <Sphere ref={innerRef} args={[0.7, 32, 32]}>
        <meshStandardMaterial
          color="#00F5FF"
          emissive="#00F5FF"
          emissiveIntensity={1.5}
          roughness={0.1}
          metalness={0.9}
        />
      </Sphere>

      {/* Point Light Source at Core */}
      <pointLight color="#00F5FF" intensity={3} distance={15} decay={2} />
      <pointLight color="#8B5CF6" intensity={2} distance={12} decay={2} />
    </group>
  )
}

export function DataGalaxy({
  capabilities,
  onSelect,
}: {
  capabilities: Capability[]
  onSelect?: (c: Capability) => void
}) {
  const radii = [4.2, 5.8, 7.4]

  return (
    <div className="relative h-[480px] w-full overflow-hidden rounded-2xl border border-white/10 bg-void/80 shadow-2xl backdrop-blur-xl">
      {/* Holographic Header HUD Overlay */}
      <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-md border border-cyan/30 bg-void/80 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-cyan shadow-sm backdrop-blur">
          <Activity size={13} className="animate-pulse text-cyan" />
          <span>Capability Matrix: Online</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 rounded-md border border-white/10 bg-void/60 px-2.5 py-1 text-[10px] font-mono text-mute backdrop-blur">
          <Sparkles size={11} className="text-purple-400" />
          <span>{capabilities.length} Domain Nodes Active</span>
        </div>
      </div>

      {/* Holographic Control Hint */}
      <div className="pointer-events-none absolute bottom-4 right-4 z-10 hidden sm:flex items-center gap-2 rounded-md border border-white/10 bg-void/70 px-3 py-1 text-[10px] font-mono text-mute backdrop-blur">
        <Compass size={12} className="text-cyan" />
        <span>Drag to Rotate · Scroll to Zoom · Click Node to Launch AI</span>
      </div>

      <Canvas camera={{ position: [0, 7, 14], fov: 45 }}>
        <color attach="background" args={['#050816']} />
        <ambientLight intensity={0.4} />
        <pointLight position={[15, 15, 15]} intensity={1.8} color="#00F5FF" />
        <pointLight position={[-15, -12, -15]} intensity={1.2} color="#8B5CF6" />

        <OrbitControls
          enableZoom={true}
          minDistance={6}
          maxDistance={22}
          enableDamping
          dampingFactor={0.06}
          autoRotate
          autoRotateSpeed={0.35}
        />

        <CosmicParticleField count={400} />
        <CenterCore />

        {/* Orbital Track Rings */}
        {radii.map((r, i) => (
          <OrbitalRing key={i} radius={r} />
        ))}

        {/* Orbiting Capability Nodes */}
        {capabilities.map((cap, i) => {
          const orbitIndex = i % radii.length
          const radius = radii[orbitIndex]
          const angle = (i / capabilities.length) * Math.PI * 2
          const speed = 0.08 + (orbitIndex * 0.03)

          return (
            <OrbitingNode
              key={cap.entity}
              capability={cap}
              angle={angle}
              radius={radius}
              speed={speed}
              onSelect={onSelect}
            />
          )
        })}
      </Canvas>
    </div>
  )
}
