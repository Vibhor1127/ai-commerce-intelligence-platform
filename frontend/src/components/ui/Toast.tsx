import React, { createContext, useCallback, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

type Toast = { id: number; message: string; type?: 'ok' | 'err' }

const ToastCtx = createContext<{ push: (message: string, type?: 'ok' | 'err') => void } | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const push = useCallback((message: string, type: 'ok' | 'err' = 'ok') => {
    const id = Date.now()
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className={`pointer-events-auto rounded-lg px-4 py-3 text-sm shadow-lg ${
                t.type === 'err' ? 'bg-red-700 text-white' : 'bg-store-ink text-store-paper'
              }`}
            >
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast requires ToastProvider')
  return ctx
}
