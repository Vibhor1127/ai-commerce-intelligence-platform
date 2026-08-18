import { cn } from '@/lib/cn'

export function BrandMark({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <svg viewBox="0 0 36 36" className="h-8 w-8 shrink-0" aria-hidden>
        <rect width="36" height="36" rx="8" fill="#0B1020" stroke="rgba(0,245,255,0.35)" />
        <path d="M9 26 L18 8 L27 26" stroke="#00F5FF" strokeWidth="1.8" fill="none" />
        <circle cx="18" cy="17" r="1.7" fill="#8B5CF6" />
        <circle cx="11.4" cy="25" r="1.2" fill="#00F5FF" />
        <circle cx="24.6" cy="25" r="1.2" fill="#10B981" />
      </svg>
      {compact ? (
        <div className="leading-none">
          <div className="font-display text-[15px] font-semibold tracking-wide text-ivory">ACI</div>
          <div className="mono-label mt-1">OS</div>
        </div>
      ) : (
        <div className="leading-tight">
          <div className="font-display text-sm font-semibold tracking-[0.22em] text-ivory">ACI OS</div>
          <div className="mt-0.5 text-[11px] text-mute">AI Commerce Intelligence</div>
        </div>
      )}
    </div>
  )
}
