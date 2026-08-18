import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'
import { cn } from '@/lib/cn'

interface KPIOrbProps {
  label: string
  value: string
  hint?: string
  tone?: 'cyan' | 'violet' | 'emerald' | 'amber'
  delay?: number
}

const tones = {
  cyan: 'from-cyan/20 via-transparent to-transparent',
  violet: 'from-violet/20 via-transparent to-transparent',
  emerald: 'from-emerald/20 via-transparent to-transparent',
  amber: 'from-amber/20 via-transparent to-transparent',
}

const rings = {
  cyan: '#00F5FF',
  violet: '#8B5CF6',
  emerald: '#10B981',
  amber: '#F59E0B',
}

export function KPIOrb({ label, value, hint, tone = 'cyan', delay = 0 }: KPIOrbProps) {
  const stripped = String(value).replace(/[^\d.-]/g, '')
  const numeric = Number(stripped)
  const canTick = stripped !== '' && Number.isFinite(numeric) && !/[₹A-Za-z]/.test(value)
  const mv = useMotionValue(0)
  const shown = useTransform(mv, (v) => (canTick ? Math.round(v).toLocaleString('en-IN') : value))

  useEffect(() => {
    if (!canTick) return
    const controls = animate(mv, numeric, { duration: 1.15, delay, ease: 'easeOut' })
    return controls.stop
  }, [canTick, numeric, delay, mv])

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className="frame frame-ticks group relative overflow-hidden p-5"
    >
      <i />
      <i />
      <div className={cn('pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-gradient-to-br blur-2xl', tones[tone])} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="mono-label">{label}</div>
          <div className="mt-3 font-display text-3xl font-semibold tracking-tight text-ivory md:text-[34px]">
            {/[₹A-Za-z]/.test(value) ? value : <motion.span>{shown}</motion.span>}
          </div>
          {hint ? <p className="mt-2 text-xs text-mute">{hint}</p> : null}
        </div>
        <svg width="54" height="54" viewBox="0 0 54 54" className="shrink-0 opacity-80 transition group-hover:opacity-100">
          <circle cx="27" cy="27" r="22" fill="none" stroke="rgba(244,239,230,0.08)" strokeWidth="2" />
          <circle
            cx="27"
            cy="27"
            r="22"
            fill="none"
            stroke={rings[tone]}
            strokeWidth="2"
            strokeDasharray="90 140"
            strokeLinecap="round"
            transform="rotate(-90 27 27)"
          />
          <circle cx="27" cy="27" r="3" fill={rings[tone]} />
        </svg>
      </div>
    </motion.article>
  )
}
