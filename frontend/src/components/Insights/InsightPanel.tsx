import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ChevronDown, Lightbulb, Sparkles, Database } from 'lucide-react'
import { EvidenceVisualizer } from '@/components/Insights/EvidenceVisualizer'
import type { AIExplanationResponse } from '@/types/api'

export function InsightPanel({ response }: { response: AIExplanationResponse }) {
  const [showEvidence, setShowEvidence] = useState(true)

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="holo-panel space-y-5 p-5 md:p-6"
    >
      <span className="holo-edge" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-cyan">
          <Sparkles size={18} />
          <span className="mono-label text-cyan">Verified AI Insight</span>
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg font-medium leading-relaxed text-ivory md:text-xl">
          {response.answer}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-bone/90">{response.reason}</p>
      </div>

      {response.observations?.length ? (
        <div className="border-t border-white/10 pt-4">
          <div className="mono-label mb-2.5 flex items-center gap-1.5 text-bone">
            <CheckCircle2 size={13} className="text-emerald" />
            Key Observations
          </div>
          <ul className="space-y-1.5 pl-1 text-sm text-bone/80">
            {response.observations.map((obs, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan" />
                <span>{obs}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {response.recommendations?.length ? (
        <div className="border-t border-white/10 pt-4">
          <div className="mono-label mb-2.5 flex items-center gap-1.5 text-bone">
            <Lightbulb size={13} className="text-amber" />
            Strategic Recommendations
          </div>
          <ul className="space-y-1.5 pl-1 text-sm text-bone/80">
            {response.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {response.evidence ? (
        <div className="border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={() => setShowEvidence((prev) => !prev)}
            className="flex w-full items-center justify-between py-1 text-left"
          >
            <span className="mono-label flex items-center gap-1.5 text-cyan">
              <Database size={13} />
              Empirical Evidence & Visual Proof
            </span>
            <ChevronDown
              size={16}
              className={`text-mute transition-transform duration-200 ${showEvidence ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {showEvidence ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden pt-2"
              >
                <EvidenceVisualizer evidence={response.evidence} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      ) : null}
    </motion.article>
  )
}
