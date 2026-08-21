import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/cn'
import { UniverseCanvas } from '@/components/Three/UniverseCanvas'

export function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('USER')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (mode === 'register') {
        await register({
          username,
          password,
          role,
          firstName: role === 'USER' ? firstName : undefined,
          lastName: role === 'USER' ? lastName : undefined,
          email: role === 'USER' ? email : undefined,
          city: role === 'USER' ? city : undefined,
        })
      } else {
        await login(username, password)
      }
      const storedRole = localStorage.getItem('aci_role')
      navigate(storedRole === 'ADMIN' || storedRole === 'ANALYST' ? '/console' : '/store')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-store-paper px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(196,92,38,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(47,93,80,0.12),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 z-0">
        <UniverseCanvas />
      </div>
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-store-ink/10 bg-white/80 p-6 shadow-xl backdrop-blur md:p-8">
        <p className="font-storeDisplay text-3xl font-semibold text-store-ink">
          ACI <span className="text-store-clay">Commerce</span>
        </p>
        <p className="mt-1 text-sm text-store-mist">
          {mode === 'login' ? 'Sign in to your store or console' : 'Create an account'}
        </p>

        <div className="mt-6 flex gap-2 rounded-lg bg-store-sand p-1">
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                'flex-1 rounded-md py-2 text-sm font-medium capitalize',
                mode === m ? 'bg-white text-store-ink shadow-sm' : 'text-store-mist',
              )}
            >
              {m}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <Field label="Username" value={username} onChange={setUsername} required />
          <Field label="Password" value={password} onChange={setPassword} type="password" required />

          {mode === 'register' && (
            <>
              <label className="block text-xs font-medium text-store-mist">
                Role
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-store-ink/15 bg-white px-3 py-2 text-sm text-store-ink"
                >
                  <option value="USER">Shopper (USER)</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </label>
              {role === 'USER' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="First name" value={firstName} onChange={setFirstName} required />
                    <Field label="Last name" value={lastName} onChange={setLastName} />
                  </div>
                  <Field label="Email" value={email} onChange={setEmail} type="email" required />
                  <Field label="City" value={city} onChange={setCity} required />
                </>
              )}
            </>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-store-clay py-2.5 text-sm font-semibold text-white transition hover:bg-store-clay/90 disabled:opacity-60"
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-store-mist">
          <Link to="/" className="underline">
            Back
          </Link>
        </p>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
}) {
  return (
    <label className="block text-xs font-medium text-store-mist">
      {label}
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-store-ink/15 bg-white px-3 py-2 text-sm text-store-ink outline-none focus:border-store-clay"
      />
    </label>
  )
}
