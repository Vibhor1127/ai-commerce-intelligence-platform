import { Canvas } from '@react-three/fiber'
import type { ReactNode } from 'react'
import { Component, useState } from 'react'
import { cn } from '@/lib/cn'

class WebGLGuard extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onError()
  }
  render() {
    if (this.state.failed) return null
    return this.props.children
  }
}

export function SpatialCanvas({
  children,
  className,
  camera = [0, 0.45, 6.6],
  fov = 40,
  onMissed,
}: {
  children: ReactNode
  className?: string
  camera?: [number, number, number]
  fov?: number
  onMissed?: () => void
}) {
  const [ok, setOk] = useState(true)

  if (!ok) return <div className={cn('absolute inset-0 grid-fade', className)} />

  return (
    <div className={cn('absolute inset-0', className)}>
      <WebGLGuard onError={() => setOk(false)}>
        <Canvas
          camera={{ position: camera, fov, near: 0.1, far: 40 }}
          dpr={[1, 1.4]}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            gl.setClearColor('#050816', 1)
          }}
          onPointerMissed={onMissed}
        >
          <color attach="background" args={['#050816']} />
          <fog attach="fog" args={['#050816', 7.5, 17]} />
          {children}
        </Canvas>
      </WebGLGuard>
    </div>
  )
}
