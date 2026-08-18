import { useMotionValue, useSpring } from 'framer-motion'
import { useEffect } from 'react'

export function usePointerParallax(strength = 14) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 60, damping: 18, mass: 0.6 })
  const y = useSpring(rawY, { stiffness: 60, damping: 18, mass: 0.6 })

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const onMove = (event: PointerEvent) => {
      const nx = (event.clientX / window.innerWidth - 0.5) * 2
      const ny = (event.clientY / window.innerHeight - 0.5) * 2
      rawX.set(nx * strength)
      rawY.set(ny * strength)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [rawX, rawY, strength])

  return { x, y }
}
