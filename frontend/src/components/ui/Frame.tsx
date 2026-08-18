import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface FrameProps {
  children: ReactNode
  className?: string
  label?: string
  pad?: boolean
}

export function Frame({ children, className, label, pad = true }: FrameProps) {
  return (
    <section className={cn('frame frame-ticks', pad && 'p-5 md:p-6', className)}>
      <i />
      <i />
      {label ? <div className="mono-label mb-4">{label}</div> : null}
      {children}
    </section>
  )
}
