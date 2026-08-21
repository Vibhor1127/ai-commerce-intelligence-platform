import React, { createContext, useContext, useMemo, useState } from 'react'
import { api } from '@/services/api'

type AuthState = {
  token: string | null
  username: string | null
  role: string | null
  login: (username: string, password: string) => Promise<void>
  register: (payload: {
    username: string
    password: string
    role?: string
    firstName?: string
    lastName?: string
    email?: string
    city?: string
  }) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
  isUser: boolean
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(api.getToken())
  const [username, setUsername] = useState<string | null>(api.getUsername())
  const [role, setRole] = useState<string | null>(api.getRole())

  const value = useMemo<AuthState>(
    () => ({
      token,
      username,
      role,
      isAuthenticated: Boolean(token),
      isAdmin: role === 'ADMIN',
      isUser: role === 'USER',
      async login(u, p) {
        const resp = await api.login(u, p)
        setToken(resp.token)
        setUsername(resp.username || u)
        setRole(resp.role || 'USER')
      },
      async register(payload) {
        await api.register(payload)
        await api.login(payload.username, payload.password)
        setToken(api.getToken())
        setUsername(api.getUsername())
        setRole(api.getRole())
      },
      logout() {
        api.logout()
        setToken(null)
        setUsername(null)
        setRole(null)
      },
    }),
    [token, username, role],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
