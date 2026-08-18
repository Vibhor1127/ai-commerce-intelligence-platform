import { FormEvent, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { NeuralBackground } from '@/components/ThreeD/NeuralBackground'
import { BrandMark } from '@/components/ui/BrandMark'
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
      <NeuralBackground />
      <div className="pointer-events-none absolute inset-0 vignette" />
      <div className="pointer-events-none absolute inset-0 grid-fade opacity-80" />

      <div className="relative z-10 mx-auto grid min-h-dvh max-w-6xl items-center gap-12 px-5 py-10 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <BrandMark />
          <p className="mono-label mt-10">System 01 · Clearance gate · 28.61°N</p>
          <h1 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ivory md:text-[68px]">
            Commerce,
            <br />
            as a conversation.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-bone md:text-lg">
            A private intelligence layer over your store. Ask in English. The platform classifies intent, executes
            verified SQL, and returns an explanation you can audit.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {['Customer', 'Revenue', 'Payments', 'Shipments', 'Reviews', 'Inventory'].map((item) => (
              <li
                key={item}
                className="border border-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-mute"
              >
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="frame p-6 md:p-8"
        >
          <div className="flex items-center justify-between">
            <div className="mono-label">{mode === 'enter' ? 'Request clearance' : 'Create operator'}</div>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
              {signal === 'live' ? 'Live JWT' : signal === 'replica' ? 'Replica JWT' : 'Probing'}
            </span>
          </div>
          <h2 className="mt-3 font-display text-2xl text-ivory">
            {mode === 'enter' ? 'Enter the command center' : 'Issue a new operator key'}
          </h2>
          <p className="mt-2 text-sm text-mute">
            {signal === 'replica'
              ? 'Spring Boot is offline in this environment. Replica signal will admit any operator name.'
              : 'Authenticated against /auth/login. Token is stored locally and sent as Bearer.'}
          </p>

          <label className="mono-label mt-8 block" htmlFor="username">
            Operator
          </label>
          <input
            id="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-2 w-full border-b border-white/15 bg-transparent py-3 text-ivory outline-none transition focus:border-cyan"
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
            className="mt-2 w-full border-b border-white/15 bg-transparent py-3 text-ivory outline-none transition focus:border-cyan"
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
        </motion.form>
      </div>
    </div>
  )
}
