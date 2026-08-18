import React from 'react'
import { cn } from '@/lib/cn'

export function Frame({
  label,
  children,
  className,
}: {
  label?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('frame frame-ticks relative p-5', className)}>
      <i />
      <i />
      {label && <div className="mono-label mb-3">{label}</div>}
      {children}
    </div>
  )
}
