import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api } from '@/services/api'
import {
  clearSession,
  getToken,
  getUsername,
  persistSession,
} from '@/services/auth'

interface AuthState {
  token: string | null
  username: string | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getToken())
  const [username, setUsername] = useState<string | null>(() => getUsername())

  const login = useCallback(async (user: string, password: string) => {
    const res = await api.login(user, password)
    persistSession(res.token, user)
    setToken(res.token)
    setUsername(user)
  }, [])

  const register = useCallback(async (user: string, password: string) => {
    await api.register(user, password, 'ANALYST')
    const res = await api.login(user, password)
    persistSession(res.token, user)
    setToken(res.token)
    setUsername(user)
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setToken(null)
    setUsername(null)
  }, [])

  useEffect(() => {
    const onUnauthorized = () => logout()
    window.addEventListener('aci:unauthorized', onUnauthorized)
    return () => window.removeEventListener('aci:unauthorized', onUnauthorized)
  }, [logout])

  const value = useMemo(
    () => ({ token, username, login, register, logout }),
    [token, username, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
