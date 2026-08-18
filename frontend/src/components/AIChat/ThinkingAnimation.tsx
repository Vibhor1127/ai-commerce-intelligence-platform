import { motion } from 'framer-motion'

const STAGES = [
  'Parsing language',
  'Classifying intent',
  'Resolving capability',
  'Executing SQL engine',
  'Composing explanation',
]

export function ThinkingAnimation() {
  return (
    <div className="frame relative overflow-hidden p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-cyan/40 thinking-scan" />
      <div className="mono-label">Thinking</div>
      <p className="mt-2 font-display text-lg text-ivory">The engine is verifying the question against live capabilities.</p>
      <ol className="mt-5 space-y-2">
        {STAGES.map((stage, i) => (
          <motion.li
            key={stage}
            initial={{ opacity: 0.25 }}
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.22 }}
            className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-cyan"
          >
            <span className="h-1 w-1 rounded-full bg-cyan" />
            {stage}
          </motion.li>
        ))}
      </ol>
    </div>
  )
}
