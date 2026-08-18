import type { ReactNode } from 'react'
import { Frame } from '@/components/ui/Frame'
import { cn } from '@/lib/cn'

export function AnalyticsCard({
  label,
  children,
  className,
  action,
}: {
  label: string
  children: ReactNode
  className?: string
  action?: ReactNode
}) {
  return (
    <Frame label={label} className={cn('h-full', className)}>
      {action ? <div className="absolute right-5 top-5">{action}</div> : null}
      {children}
    </Frame>
  )
}
