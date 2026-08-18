import { FormEvent, useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { ArrowUpRight, CornerDownLeft } from 'lucide-react'
import { MessageBubble } from '@/components/AIChat/MessageBubble'
import { ThinkingAnimation } from '@/components/AIChat/ThinkingAnimation'
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

export function ChatInterface({ seed }: { seed?: string }) {
  const [question, setQuestion] = useState(seed ?? '')
  const [turns, setTurns] = useState<ChatTurn[]>([])
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
    if (seed) setQuestion(seed)
  }, [seed])

  return (
    <div className="flex flex-col gap-6">
      {turns.length === 0 && !mutation.isPending ? (
        <EmptyState onPick={submit} />
      ) : (
        <div className="space-y-6">
          {turns.map((turn) => (
            <MessageBubble key={turn.id} turn={turn} />
          ))}
          {mutation.isPending ? <ThinkingAnimation /> : null}
          <div ref={endRef} />
        </div>
      )}

      <form onSubmit={onSubmit} className="sticky bottom-3 z-20">
        <div className="frame flex items-end gap-3 p-3 md:p-4">
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
      {SUGGESTIONS.map((q) => (
        <button
          key={q}
          type="button"
          onClick={() => onPick(q)}
          className="frame group flex items-center justify-between px-4 py-4 text-left transition hover:border-cyan/30"
        >
          <span className="text-sm text-bone group-hover:text-ivory">{q}</span>
          <ArrowUpRight size={16} className="text-mute group-hover:text-cyan" />
        </button>
      ))}
    </div>
  )
}
