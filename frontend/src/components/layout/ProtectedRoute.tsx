import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { api } from '@/services/api'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  if (!api.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
