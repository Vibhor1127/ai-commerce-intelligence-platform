import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useSignal } from '@/context/SignalContext'
import { cn } from '@/lib/cn'

export function StatusBar() {
  const { username, logout } = useAuth()
  const signal = useSignal()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const stamp = now.toLocaleString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    day: '2-digit',
    month: 'short',
  })

  return (
    <header className="flex h-11 items-center justify-between border-b border-white/5 bg-[#070a14]/55 px-4 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <span className="mono-label">SYS.01</span>
        <span className="hidden text-[11px] text-mute sm:inline">Commerce intelligence command</span>
      </div>
      <div className="flex items-center gap-4">
        <span
          className={cn(
            'inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em]',
            signal === 'live' && 'text-emerald',
            signal === 'replica' && 'text-amber',
            signal === 'checking' && 'text-mute',
          )}
        >
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              signal === 'live' && 'bg-emerald',
              signal === 'replica' && 'bg-amber',
              signal === 'checking' && 'bg-mute',
            )}
            style={{ animation: 'pulse-dot 1.6s ease-in-out infinite' }}
          />
          {signal === 'live' ? 'Live engine' : signal === 'replica' ? 'Replica signal' : 'Probing'}
        </span>
        <span className="hidden font-mono text-[11px] text-mute md:inline">{stamp}</span>
        <span className="hidden font-mono text-[11px] text-bone sm:inline">{username}</span>
        <button
          type="button"
          onClick={logout}
          className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute transition hover:text-ivory"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
