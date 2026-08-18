import { FormEvent, useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { ArrowUpRight, CornerDownLeft } from 'lucide-react'
import { MessageBubble } from '@/components/AIChat/MessageBubble'
import { PipelineAnimation } from '@/components/AIChat/PipelineAnimation'
import { HoloPanel } from '@/components/ui/HoloPanel'
import { api, ApiError } from '@/services/api'
import { uid } from '@/lib/format'
import type { ChatTurn } from '@/types/api'

const SUGGESTIONS = [
  'Which products need restocking?',
  'Which payments failed?',
  'Who are my biggest customers?',
  'Which products have bad reviews?',
  'Which shipments are delayed?',
  'Show revenue trends',
]

export function ChatInterface({
  seed,
  onBusy,
}: {
  seed?: string
  onBusy?: (busy: boolean) => void
}) {
  const [question, setQuestion] = useState(seed ?? '')
  const [turns, setTurns] = useState<ChatTurn[]>([])
  const [lastAsk, setLastAsk] = useState<string | undefined>(seed)
  const endRef = useRef<HTMLDivElement>(null)

  const mutation = useMutation({
    mutationFn: (q: string) => api.ask(q),
    onSuccess: (response, q) => {
      setTurns((prev) => [
        ...prev,
        {
          id: uid('ai'),
          role: 'assistant',
          createdAt: new Date().toISOString(),
          question: q,
          response,
        },
      ])
    },
    onError: (err, q) => {
      const message = err instanceof ApiError ? err.message : 'The intelligence layer could not complete this query.'
      setTurns((prev) => [
        ...prev,
        {
          id: uid('err'),
          role: 'assistant',
          createdAt: new Date().toISOString(),
          question: q,
          error: message,
        },
      ])
    },
  })

  function submit(raw: string) {
    const q = raw.trim()
    if (!q || mutation.isPending) return
    setLastAsk(q)
    setTurns((prev) => [
      ...prev,
      { id: uid('q'), role: 'user', question: q, createdAt: new Date().toISOString() },
    ])
    setQuestion('')
    mutation.mutate(q)
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    submit(question)
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [turns, mutation.isPending])

  useEffect(() => {
    if (seed) {
      setQuestion(seed)
      setLastAsk(seed)
    }
  }, [seed])

  useEffect(() => {
    onBusy?.(mutation.isPending)
  }, [mutation.isPending, onBusy])

  const lastAssistant = [...turns].reverse().find((t) => t.role === 'assistant' && t.response)

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <PipelineAnimation
        active={mutation.isPending}
        complete={Boolean(lastAssistant) && !mutation.isPending}
        question={lastAsk}
      />

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {turns.length === 0 && !mutation.isPending ? (
          <EmptyState onPick={submit} />
        ) : (
          <div className="space-y-5 pb-4">
            {turns.map((turn) => (
              <MessageBubble key={turn.id} turn={turn} />
            ))}
            <div ref={endRef} />
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="shrink-0">
        <div className="holo-panel flex items-end gap-3 p-3 md:p-4">
          <span className="holo-edge" />
          <div className="min-w-0 flex-1">
            <label className="mono-label" htmlFor="ask-field">
              Command line
            </label>
            <textarea
              id="ask-field"
              rows={2}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  submit(question)
                }
              }}
              placeholder="Ask the store a business question…"
              className="mt-2 w-full resize-none bg-transparent text-[15px] text-ivory outline-none placeholder:text-mute"
            />
          </div>
          <button
            type="submit"
            disabled={mutation.isPending || !question.trim()}
            className="flex h-11 items-center gap-2 bg-ivory px-4 font-mono text-[11px] uppercase tracking-[0.16em] text-void transition hover:bg-cyan disabled:cursor-not-allowed disabled:opacity-40"
          >
            Run
            <CornerDownLeft size={14} />
          </button>
        </div>
      </form>
    </div>
  )
}

function EmptyState({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {SUGGESTIONS.map((q, i) => (
        <HoloPanel key={q} depth={8 + i} delay={0.04 * i} className="p-0">
          <button
            type="button"
            onClick={() => onPick(q)}
            className="group flex w-full items-center justify-between px-4 py-4 text-left"
          >
            <span className="text-sm text-bone group-hover:text-ivory">{q}</span>
            <ArrowUpRight size={16} className="text-mute group-hover:text-ivory" />
          </button>
        </HoloPanel>
      ))}
    </div>
  )
}