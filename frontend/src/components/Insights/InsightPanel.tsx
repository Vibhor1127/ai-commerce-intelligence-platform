import { motion } from 'framer-motion'
import { ObservationList } from '@/components/Insights/ObservationList'
import { RecommendationCard } from '@/components/Insights/RecommendationCard'
import { EvidenceVisualizer } from '@/components/Insights/EvidenceVisualizer'
import { HoloPanel } from '@/components/ui/HoloPanel'
import { entityIcon } from '@/lib/entityMeta'
import { asEvidence } from '@/lib/evidence'
import { entityLabel, operationLabel } from '@/lib/format'
import type { AIExplanationResponse } from '@/types/api'

export function InsightPanel({ response }: { response: AIExplanationResponse }) {
  const evidence = asEvidence(response.evidence)
  const Icon = entityIcon(evidence?.entity)

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <HoloPanel label="Insight" depth={8} className="p-5">
          <div className="flex flex-wrap items-center gap-2">
            {evidence?.entity ? (
              <span className="inline-flex items-center gap-1.5 border border-cyan/20 bg-cyan/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan">
                <Icon size={12} />
                {entityLabel(evidence.entity)}
              </span>
            ) : null}
            {evidence?.operation ? (
              <span className="border border-violet/20 bg-violet/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-violet">
                {operationLabel(evidence.operation)}
              </span>
            ) : null}
            {evidence?.recordCount != null ? (
              <span className="font-mono text-[10px] uppercase tracking-wider text-mute">
                {evidence.recordCount} records
              </span>
            ) : null}
          </div>
          <h2 className="mt-4 font-display text-2xl leading-snug text-ivory md:text-[28px]">{response.answer}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-bone">{response.reason}</p>
        </HoloPanel>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-2">
        <HoloPanel label="Observations" depth={12} className="p-5">
          <ObservationList items={response.observations ?? []} />
        </HoloPanel>
        <HoloPanel label="Recommendations" depth={16} className="p-5">
          <RecommendationCard items={response.recommendations ?? []} />
        </HoloPanel>
      </div>

      <HoloPanel label="Evidence lock" depth={10} className="p-5">
        {evidence?.dataDescription ? (
          <p className="mb-4 text-xs text-mute">{evidence.dataDescription}</p>
        ) : null}
        <EvidenceVisualizer evidence={response.evidence} />
      </HoloPanel>
    </div>
  )
}
