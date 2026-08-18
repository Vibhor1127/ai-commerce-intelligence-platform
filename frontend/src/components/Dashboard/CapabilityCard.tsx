import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { entityIcon } from '@/lib/entityMeta'
import { entityLabel } from '@/lib/format'
import type { Capability } from '@/types/api'

export function CapabilityCard({
  capability,
  index = 0,
  onOpen,
}: {
  capability: Capability
  index?: number
  onOpen?: (capability: Capability, operation?: string) => void
}) {
  const Icon = entityIcon(capability.entity)
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="frame frame-ticks flex h-full flex-col p-5"
    >
      <i />
      <i />
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center border border-cyan/20 bg-cyan/5 text-cyan">
          <Icon size={18} strokeWidth={1.6} />
        </div>
        <button
          type="button"
          onClick={() => onOpen?.(capability)}
          className="text-mute transition hover:text-cyan"
          aria-label={`Open ${capability.entity}`}
        >
          <ArrowUpRight size={16} />
        </button>
      </div>
      <h3 className="mt-4 font-display text-lg text-ivory">{entityLabel(capability.entity)}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-bone/80">{capability.description}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {capability.operations.map((op) => (
          <button
            key={op}
            type="button"
            onClick={() => onOpen?.(capability, op)}
            className="border border-white/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-mute transition hover:border-cyan/40 hover:text-cyan"
          >
            {op.replaceAll('_', ' ')}
          </button>
        ))}
      </div>
    </motion.article>
  )
}
