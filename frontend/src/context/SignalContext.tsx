import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { ensureSignal, subscribeSignal } from '@/services/signal'
import type { SignalMode } from '@/types/api'

const SignalContext = createContext<SignalMode>('checking')

export function SignalProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<SignalMode>('checking')

  useEffect(() => {
    const unsub = subscribeSignal(setMode)
    void ensureSignal()
    return unsub
  }, [])

  return <SignalContext.Provider value={mode}>{children}</SignalContext.Provider>
}

export function useSignal() {
  return useContext(SignalContext)
}
