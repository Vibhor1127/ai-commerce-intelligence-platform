import { FormEvent, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { IntelligenceUniverse } from '@/components/ThreeD/IntelligenceUniverse'
import { BrandMark } from '@/components/ui/BrandMark'
import { HoloPanel } from '@/components/ui/HoloPanel'
import { useAuth } from '@/context/AuthContext'
import { useSignal } from '@/context/SignalContext'
import { ApiError } from '@/services/api'

export function LoginPage() {
  const { token, login, register } = useAuth()
  const signal = useSignal()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const [mode, setMode] = useState<'enter' | 'clearance'>('enter')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (token) return <Navigate to={from} replace />

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      if (mode === 'clearance') await register(username.trim(), password)
      else await login(username.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Clearance rejected. Check credentials or create an account.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-void text-ivory">
      <IntelligenceUniverse ambient />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-void/80 via-void/35 to-void/55" />
      <div className="pointer-events-none absolute inset-0 vignette" />

      <div className="relative z-10 mx-auto grid min-h-dvh max-w-6xl items-center gap-12 px-5 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <BrandMark />
          <p className="mono-label mt-10">System 01 · Clearance gate</p>
          <h1 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ivory md:text-[64px]">
            An operating system
            <br />
            for commerce truth.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-bone md:text-lg">
            Step into the intelligence field. Domains orbit a verified SQL core. Ask in English. Audit the evidence.
          </p>
        </div>

        <form onSubmit={onSubmit}>
          <HoloPanel depth={18} className="p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div className="mono-label">{mode === 'enter' ? 'Request clearance' : 'Create operator'}</div>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
                {signal === 'live' ? 'Live JWT' : signal === 'replica' ? 'Replica JWT' : 'Probing'}
              </span>
            </div>
            <h2 className="mt-3 font-display text-2xl text-ivory">
              {mode === 'enter' ? 'Enter the universe' : 'Issue a new operator key'}
            </h2>
            <p className="mt-2 text-sm text-mute">
              {signal === 'replica'
                ? 'Spring Boot is offline here. Replica signal will admit any operator name.'
                : 'Authenticated against /auth/login. Token stored locally as Bearer.'}
            </p>

            <label className="mono-label mt-8 block" htmlFor="username">
              Operator
            </label>
            <input
              id="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full border-b border-white/15 bg-transparent py-3 text-ivory outline-none transition focus:border-ivory"
              placeholder="analytics_admin"
              required
              minLength={3}
            />

            <label className="mono-label mt-6 block" htmlFor="password">
              Passphrase
            </label>
            <input
              id="password"
              type="password"
              autoComplete={mode === 'enter' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border-b border-white/15 bg-transparent py-3 text-ivory outline-none transition focus:border-ivory"
              placeholder="••••••••"
              required
              minLength={6}
            />

            {error ? <p className="mt-4 text-sm text-amber">{error}</p> : null}

            <button
              type="submit"
              disabled={busy}
              className="mt-8 w-full bg-ivory py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-void transition hover:bg-cyan disabled:opacity-50"
            >
              {busy ? 'Authenticating…' : mode === 'enter' ? 'Authenticate' : 'Provision & enter'}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode((m) => (m === 'enter' ? 'clearance' : 'enter'))
                setError(null)
              }}
              className="mt-4 w-full text-center font-mono text-[11px] uppercase tracking-[0.16em] text-mute hover:text-ivory"
            >
              {mode === 'enter' ? 'Need clearance? Create operator' : 'Already provisioned? Sign in'}
            </button>
          </HoloPanel>
        </form>
      </div>
    </div>
  )
}
