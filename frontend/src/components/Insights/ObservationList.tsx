import { motion } from 'framer-motion'

export function ObservationList({ items }: { items: string[] }) {
  if (!items.length) {
    return <p className="text-sm text-mute">No observations locked for this query.</p>
  }
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <motion.li
          key={`${item}-${i}`}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08 * i }}
          className="flex gap-3 text-sm leading-relaxed text-bone"
        >
          <span className="mt-1 h-1.5 w-1.5 shrink-0 bg-cyan" />
          <span>{item}</span>
        </motion.li>
      ))}
    </ul>
  )
}
