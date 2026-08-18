import type { SignalMode } from '@/types/api'

type Listener = (mode: SignalMode) => void

let mode: SignalMode = 'checking'
const listeners = new Set<Listener>()
let probe: Promise<SignalMode> | null = null

export function getSignalMode(): SignalMode {
  return mode
}

export function subscribeSignal(listener: Listener): () => void {
  listeners.add(listener)
  listener(mode)
  return () => listeners.delete(listener)
}

function setMode(next: SignalMode) {
  if (mode === next) return
  mode = next
  listeners.forEach((fn) => fn(mode))
}

export function forceReplica() {
  setMode('replica')
}

export async function ensureSignal(): Promise<SignalMode> {
  if (import.meta.env.VITE_FORCE_REPLICA === 'true') {
    setMode('replica')
    return 'replica'
  }
  if (mode !== 'checking') return mode
  if (probe) return probe

  probe = (async () => {
    try {
      const base = import.meta.env.VITE_API_BASE ?? ''
      const res = await fetch(`${base}/ai/health`, {
        signal: AbortSignal.timeout(2200),
      })
      const text = await res.text()
      if (res.ok && /running/i.test(text)) {
        setMode('live')
        return 'live'
      }
    } catch {
      /* Spring Boot, MySQL or Redis is not reachable in this environment */
    }
    setMode('replica')
    return 'replica'
  })()

  try {
    return await probe
  } finally {
    probe = null
  }
}

export async function refreshSignal(): Promise<SignalMode> {
  mode = 'checking'
  listeners.forEach((fn) => fn(mode))
  return ensureSignal()
}
