import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, MessageSquare, Boxes, Star, Package, LogOut, Orbit, Users } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/cn'

const links = [
  { to: '/console', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/console/orders', label: 'Orders', icon: Package },
  { to: '/console/reviews', label: 'Reviews', icon: Star },
  { to: '/console/inventory', label: 'Inventory', icon: Boxes },
  { to: '/console/users', label: 'Users', icon: Users },
  { to: '/console/ask', label: 'Ask AI', icon: MessageSquare },
  { to: '/console/capabilities', label: 'Galaxy', icon: Orbit },
]

export function ConsoleShell() {
  const { username, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="console-shell flex h-screen overflow-hidden">
      <aside className="hidden w-56 shrink-0 border-r border-white/5 bg-panel/80 p-4 md:flex md:flex-col h-full overflow-y-auto">
        <div className="mb-8">
          <p className="font-display text-lg font-bold text-ivory">
            ACI <span className="text-cyan">Console</span>
          </p>
          <p className="mono-label mt-1">Command center</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {links.map(({ to, end, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                  isActive ? 'bg-cyan/10 text-cyan' : 'text-bone/70 hover:bg-white/5 hover:text-ivory',
                )
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto border-t border-white/5 pt-4">
          <p className="truncate text-xs text-mute">{username}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 flex items-center gap-2 text-xs text-mute hover:text-cyan"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col h-full overflow-hidden">
        <header className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-white/5 px-3 py-3 md:hidden">
          {links.map(({ to, end, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'shrink-0 rounded px-2 py-1 text-xs',
                  isActive ? 'bg-cyan/15 text-cyan' : 'text-mute',
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </header>
        <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 flex flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
