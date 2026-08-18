import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'
import { useAuth } from '@/context/AuthContext'

export function useDashboard() {
  const { token } = useAuth()
  return useQuery({
    queryKey: ['dashboard', token],
    queryFn: api.dashboard,
    enabled: Boolean(token),
    staleTime: 60_000,
  })
}

export function useMonthlyRevenue() {
  const { token } = useAuth()
  return useQuery({
    queryKey: ['monthly-revenue', token],
    queryFn: api.monthlyRevenue,
    enabled: Boolean(token),
    staleTime: 60_000,
  })
}

export function useCategoryRevenue() {
  const { token } = useAuth()
  return useQuery({
    queryKey: ['category-revenue', token],
    queryFn: api.categoryRevenue,
    enabled: Boolean(token),
    staleTime: 60_000,
  })
}

export function useTopCustomers() {
  const { token } = useAuth()
  return useQuery({
    queryKey: ['top-customers', token],
    queryFn: api.topCustomers,
    enabled: Boolean(token),
    staleTime: 60_000,
  })
}

export function useTopProducts() {
  const { token } = useAuth()
  return useQuery({
    queryKey: ['top-products', token],
    queryFn: api.topProducts,
    enabled: Boolean(token),
    staleTime: 60_000,
  })
}

export function useInventoryAlerts() {
  const { token } = useAuth()
  return useQuery({
    queryKey: ['inventory-alerts', token],
    queryFn: api.inventoryAlerts,
    enabled: Boolean(token),
    staleTime: 60_000,
  })
}
