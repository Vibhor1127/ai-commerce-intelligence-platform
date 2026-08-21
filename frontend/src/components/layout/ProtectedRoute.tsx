import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/lib/auth'

export function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode
  roles?: Array<'USER' | 'ADMIN' | 'ANALYST'>
}) {
  const { isAuthenticated, role } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && role && !roles.includes(role as 'USER' | 'ADMIN' | 'ANALYST')) {
    const fallback = role === 'ADMIN' ? '/console' : '/store'
    return <Navigate to={fallback} replace />
  }

  return <>{children}</>
}

export function RoleHome() {
  const { role, isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role === 'ADMIN' || role === 'ANALYST') return <Navigate to="/console" replace />
  return <Navigate to="/store" replace />
}
