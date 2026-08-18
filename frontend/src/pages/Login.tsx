import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Terminal, ShieldCheck, ArrowRight } from 'lucide-react'
import { api } from '@/services/api'

export function LoginPage() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await api.login(username, password)
      navigate('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-void px-4 font-sans text-bone">
      {/* Background glow */}
      <div className="pointer-events-none absolute h-96 w-96 rounded-full bg-cyan/10 blur-[100px]" />

      <div className="holo-panel relative w-full max-w-md p-6 md:p-8">
        <span className="holo-edge" />

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border border-cyan/40 bg-cyan/10 text-cyan">
            <Terminal size={20} />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight text-ivory">
              ACI <span className="text-cyan">OS</span>
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-mute">
              Security Clearance · Node Access
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mono-label" htmlFor="username">
              Identifier / Username
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1.5 w-full border border-white/10 bg-void/80 px-3.5 py-2.5 font-mono text-sm text-ivory outline-none transition focus:border-cyan/50"
              placeholder="e.g. admin"
            />
          </div>

          <div>
            <label className="mono-label" htmlFor="password">
              Clearance Key / Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full border border-white/10 bg-void/80 px-3.5 py-2.5 font-mono text-sm text-ivory outline-none transition focus:border-cyan/50"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="border border-amber/30 bg-amber/10 px-3.5 py-2.5 font-mono text-xs text-amber">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex h-11 w-full items-center justify-center gap-2 bg-ivory font-mono text-xs font-semibold uppercase tracking-widest text-void transition hover:bg-cyan disabled:opacity-50"
          >
            {loading ? 'Authenticating…' : 'Access Platform'}
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-[11px] text-mute">
          <span className="flex items-center gap-1">
            <ShieldCheck size={13} className="text-emerald" /> JWT Guard Active
          </span>
          <span className="font-mono">Demo: admin / admin123</span>
        </div>
      </div>
    </div>
  )
}
