import { motion } from 'framer-motion'

export function RecommendationCard({ items }: { items: string[] }) {
  if (!items.length) {
    return <p className="text-sm text-mute">No recommendations issued.</p>
  }
  return (
    <ol className="space-y-3">
      {items.map((item, i) => (
        <motion.li
          key={`${item}-${i}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 * i }}
          className="flex gap-3 border border-emerald/15 bg-emerald/5 px-3 py-3 text-sm leading-relaxed text-ivory/90"
        >
          <span className="font-mono text-[11px] text-emerald">0{i + 1}</span>
          <span>{item}</span>
        </motion.li>
      ))}
    </ol>
  )
}
