import React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'

export function HoloPanel({
  children,
  className,
  depth: _depth = 1,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  depth?: number
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: 'easeOut' }}
      className={cn('holo-panel relative overflow-hidden', className)}
    >
      <span className="holo-edge" />
      {children}
    </motion.div>
  )
}
