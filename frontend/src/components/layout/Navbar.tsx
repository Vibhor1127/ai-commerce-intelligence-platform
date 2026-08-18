import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, MessageSquareCode, Orbit, LogOut, Terminal } from 'lucide-react'
import { api } from '@/services/api'
import { cn } from '@/lib/cn'

export function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()

  const links = [
    { to: '/', label: 'Overview', icon: LayoutDashboard },
    { to: '/ask', label: 'AI Cockpit', icon: MessageSquareCode },
    { to: '/capabilities', label: 'Galaxy', icon: Orbit },
  ]

  function handleLogout() {
    api.logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-void/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center border border-cyan/40 bg-cyan/10 text-cyan">
            <Terminal size={16} />
          </div>
          <div>
            <Link to="/" className="font-display font-semibold tracking-wider text-ivory">
              ACI <span className="text-cyan">OS</span>
            </Link>
            <span className="ml-2 hidden font-mono text-[10px] uppercase tracking-widest text-mute md:inline-block">
              v1.0.0 · Core Node
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-1 md:gap-2">
          {links.map((link) => {
            const Icon = link.icon
            const active = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition',
                  active
                    ? 'border border-cyan/40 bg-cyan/10 text-cyan'
                    : 'text-bone/70 hover:bg-white/5 hover:text-ivory',
                )}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            )
          })}

          <div className="ml-2 h-4 w-px bg-white/10" />

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-mute transition hover:text-amber"
            title="Sign out"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </nav>
      </div>
    </header>
  )
}
