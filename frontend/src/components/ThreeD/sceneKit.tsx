import { Line, Text, useCursor } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { Group, Mesh } from 'three'

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function CameraRig({
  intensity = 0.55,
  lookAt = [0, 0.15, 0] as [number, number, number],
  base = [0, 0.45, 6.6] as [number, number, number],
}) {
  const { camera } = useThree()
  const reduce = useMemo(prefersReducedMotion, [])

  useFrame((state) => {
    if (reduce) {
      camera.position.set(base[0], base[1], base[2])
      camera.lookAt(...lookAt)
      return
    }
    const tx = base[0] + state.pointer.x * intensity
    const ty = base[1] + state.pointer.y * intensity * 0.42
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, tx, 0.035)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, ty, 0.035)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, base[2], 0.03)
    camera.lookAt(...lookAt)
  })

  return null
}

export function IntelligenceCore({
  energy = 0.4,
  scale = 1,
}: {
  energy?: number
  scale?: number
}) {
  const inner = useRef<Mesh>(null)
  const outer = useRef<Mesh>(null)
  const ringA = useRef<Mesh>(null)
  const ringB = useRef<Mesh>(null)
  const reduce = useMemo(prefersReducedMotion, [])

  useFrame((_, dt) => {
    if (reduce) return
    const spin = 0.12 + energy * 0.55
    if (inner.current) inner.current.rotation.y += dt * spin
    if (outer.current) {
      outer.current.rotation.y -= dt * spin * 0.55
      outer.current.rotation.x += dt * 0.04
    }
    if (ringA.current) ringA.current.rotation.z += dt * (0.08 + energy * 0.2)
    if (ringB.current) ringB.current.rotation.z -= dt * (0.05 + energy * 0.12)
  })

  return (
    <group scale={scale}>
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.52, 1]} />
        <meshBasicMaterial color="#F4EFE6" wireframe transparent opacity={0.32 + energy * 0.2} />
      </mesh>
      <mesh ref={outer}>
        <icosahedronGeometry args={[0.74, 0]} />
        <meshBasicMaterial color="#7EDCE2" wireframe transparent opacity={0.16 + energy * 0.12} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.38, 28, 28]} />
        <meshBasicMaterial color="#00F5FF" transparent opacity={0.045 + energy * 0.04} />
      </mesh>
      <mesh ref={ringA} rotation={[Math.PI / 2.35, 0.15, 0]}>
        <torusGeometry args={[0.98, 0.005, 8, 96]} />
        <meshBasicMaterial color="#C8D5D7" transparent opacity={0.38} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 2.05, 0.55, 0.25]}>
        <torusGeometry args={[1.18, 0.004, 8, 96]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.16} />
      </mesh>
    </group>
  )
}

export function DustField({ count = 140 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const geo = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 16
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [count])

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.012
  })

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#8B95A8" size={0.016} transparent opacity={0.28} depthWrite={false} />
    </points>
  )
}

export function FloorGrid() {
  return (
    <group position={[0, -1.85, 0]}>
      <gridHelper args={[22, 22, '#14202c', '#0c121c']} />
    </group>
  )
}

export function LinkLine({
  from,
  to,
  active,
  dim,
  color = '#7EDCE2',
}: {
  from: [number, number, number]
  to: [number, number, number]
  active?: boolean
  dim?: boolean
  color?: string
}) {
  return (
    <Line
      points={[from, to]}
      color={color}
      transparent
      opacity={active ? 0.55 : dim ? 0.05 : 0.14}
      lineWidth={1}
    />
  )
}

export function SignalPulse({
  from,
  to,
  speed = 0.18,
  delay = 0,
}: {
  from: [number, number, number]
  to: [number, number, number]
  speed?: number
  delay?: number
}) {
  const ref = useRef<Mesh>(null)
  const a = useMemo(() => new THREE.Vector3(...from), [from])
  const b = useMemo(() => new THREE.Vector3(...to), [to])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = (clock.getElapsedTime() * speed + delay) % 1
    ref.current.position.lerpVectors(a, b, t)
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.016, 8, 8]} />
      <meshBasicMaterial color="#E8F4F5" transparent opacity={0.75} />
    </mesh>
  )
}

export function DomainNode({
  position,
  label,
  color,
  selected,
  dim,
  onSelect,
  onHover,
}: {
  position: [number, number, number]
  label: string
  color: string
  selected?: boolean
  dim?: boolean
  onSelect?: () => void
  onHover?: (over: boolean) => void
}) {
  const group = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  useFrame(({ clock }) => {
    if (!group.current) return
    const t = clock.getElapsedTime()
    const breathe = 1 + Math.sin(t * 1.4 + position[0]) * 0.025
    const target = (selected || hovered ? 1.18 : 1) * breathe
    group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, target, 0.08))
  })

  return (
    <group
      ref={group}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        onHover?.(true)
      }}
      onPointerOut={() => {
        setHovered(false)
        onHover?.(false)
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect?.()
      }}
    >
      <mesh>
        <octahedronGeometry args={[0.11, 0]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={dim ? 0.18 : selected || hovered ? 0.95 : 0.72}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.2, 0.005, 8, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={dim ? 0.08 : selected || hovered ? 0.7 : 0.28}
        />
      </mesh>
      <Text
        position={[0, 0.32, 0]}
        fontSize={0.095}
        color={dim ? '#5c6474' : '#F4EFE6'}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.08}
        raycast={() => null}
      >
        {label.toUpperCase()}
      </Text>
    </group>
  )
}
