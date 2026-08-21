import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { ShoppingBag, Package, User, LogOut } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/lib/auth'
import { api } from '@/services/api'
import { cn } from '@/lib/cn'

export function StoreShell() {
  const { username, logout, isUser } = useAuth()
  const navigate = useNavigate()
  const cart = useQuery({
    queryKey: ['cart'],
    queryFn: () => api.getCart(),
    enabled: isUser,
    retry: false,
  })
  const count = cart.data?.items?.reduce((n, i) => n + i.quantity, 0) ?? 0

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const link = ({ isActive }: { isActive: boolean }) =>
    cn(
      'text-sm font-medium transition-colors',
      isActive ? 'text-store-clay' : 'text-store-ink/70 hover:text-store-ink',
    )

  return (
    <div className="store-shell">
      <header className="sticky top-0 z-40 border-b border-store-ink/10 bg-store-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link to="/store" className="font-storeDisplay text-2xl font-semibold tracking-tight text-store-ink">
            ACI <span className="text-store-clay">Market</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <NavLink to="/store" end className={link}>
              Home
            </NavLink>
            <NavLink to="/store/products" className={link}>
              Products
            </NavLink>
            <NavLink to="/store/orders" className={link}>
              Orders
            </NavLink>
            <NavLink to="/store/profile" className={link}>
              Profile
            </NavLink>
          </nav>
          <div className="flex items-center gap-3">
            <NavLink
              to="/store/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-store-sand text-store-ink"
            >
              <ShoppingBag size={18} />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-store-clay px-1 text-[10px] font-semibold text-white">
                  {count}
                </span>
              )}
            </NavLink>
            <span className="hidden text-sm text-store-mist sm:inline">{username}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-10 w-10 items-center justify-center rounded-full text-store-mist hover:bg-store-sand hover:text-store-ink"
              aria-label="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
        <nav className="flex gap-4 overflow-x-auto border-t border-store-ink/5 px-4 py-2 md:hidden">
          <NavLink to="/store/products" className={link}>
            <Package size={14} className="mr-1 inline" /> Products
          </NavLink>
          <NavLink to="/store/orders" className={link}>
            Orders
          </NavLink>
          <NavLink to="/store/profile" className={link}>
            <User size={14} className="mr-1 inline" /> Profile
          </NavLink>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
