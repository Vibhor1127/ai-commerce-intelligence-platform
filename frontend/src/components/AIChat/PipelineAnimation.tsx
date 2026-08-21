import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { PIPELINE_STAGES } from '@/lib/domains'
import { cn } from '@/lib/cn'

const GATES = [0, 380, 860, 1480, 2300]

export function PipelineAnimation({
  active,
  complete,
  question,
}: {
  active: boolean
  complete?: boolean
  question?: string
}) {
  const [stage, setStage] = useState(complete ? 4 : -1)

  useEffect(() => {
    if (complete) {
      setStage(4)
      return
    }
    if (!active) {
      setStage(-1)
      return
    }
    setStage(0)
    const timers = GATES.slice(1).map((ms, i) => window.setTimeout(() => setStage(i + 1), ms))
    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [active, complete, question])

  const current = complete ? 4 : stage

  return (
    <div className="holo-panel overflow-hidden px-4 py-4 md:px-6">
      <span className="holo-edge" />
      <div className="flex items-center justify-between gap-4">
        <div className="mono-label">{active ? 'Processing stack' : complete ? 'Insight locked' : 'Awaiting query'}</div>
        {question && (active || complete) ? (
          <p className="hidden max-w-md truncate font-mono text-[11px] text-bone/80 md:block">“{question}”</p>
        ) : null}
      </div>

      <ol className="mt-4 grid grid-cols-5 gap-1 md:gap-2">
        {PIPELINE_STAGES.map((item, i) => {
          const state = current > i ? 'done' : current === i ? 'live' : 'idle'
          return (
            <li key={item.id} className="relative min-w-0">
              {i < PIPELINE_STAGES.length - 1 ? (
                <span className="absolute left-[calc(50%+14px)] right-[-50%] top-[9px] hidden h-px bg-white/10 md:block">
                  <motion.span
                    className="block h-px origin-left bg-ivory/70"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: current > i ? 1 : 0 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                  />
                </span>
              ) : null}
              <div className="flex flex-col items-center text-center">
                <span
                  className={cn(
                    'relative z-10 h-[18px] w-[18px] rounded-full border',
                    state === 'done' && 'border-ivory bg-ivory',
                    state === 'live' && 'border-cyan bg-cyan/30',
                    state === 'idle' && 'border-white/15 bg-transparent',
                  )}
                >
                  {state === 'live' ? (
                    <span className="absolute inset-0 animate-ping rounded-full bg-cyan/30" />
                  ) : null}
                </span>
                <span
                  className={cn(
                    'mt-2 font-mono text-[9px] uppercase tracking-[0.14em] md:text-[10px]',
                    state === 'idle' ? 'text-mute' : 'text-ivory',
                  )}
                >
                  {item.label}
                </span>
                <span className="mt-1 hidden text-[10px] text-mute md:block">{item.caption}</span>
              </div>
            </li>
          )
        })}
      </ol>

      {active ? (
        <div className="relative mt-4 h-px overflow-hidden bg-white/10">
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-ivory/70 to-transparent scan-x" />
        </div>
      ) : null}
    </div>
  )
}