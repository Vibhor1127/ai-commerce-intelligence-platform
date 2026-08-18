import { motion, useTransform } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { usePointerParallax } from '@/hooks/usePointerParallax'

interface HoloPanelProps {
  children: ReactNode
  className?: string
  label?: string
  depth?: number
  delay?: number
  interactive?: boolean
}

export function HoloPanel({
  children,
  className,
  label,
  depth = 10,
  delay = 0,
  interactive = true,
}: HoloPanelProps) {
  const { x, y } = usePointerParallax(5 + depth * 0.28)
  const rotateY = useTransform(x, [-24, 24], [-3.2, 3.2])
  const rotateX = useTransform(y, [-24, 24], [2.6, -2.6])

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={
        interactive
          ? { x, y, rotateX, rotateY, transformPerspective: 1100 }
          : undefined
      }
      className={cn('holo-panel', className)}
    >
      <span className="holo-edge" />
      {label ? <div className="mono-label mb-3">{label}</div> : null}
      {children}
    </motion.section>
  )
}
