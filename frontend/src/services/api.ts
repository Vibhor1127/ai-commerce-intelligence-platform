import type {
  AIExplanationResponse,
  Capability,
  CategoryRevenueDTO,
  DashboardDTO,
  InventoryAlertDTO,
  MonthlyRevenueDTO,
  TopCustomerDTO,
  TopProductDTO,
} from '@/types/api'
import { demoHandle } from '@/services/demo'
import { ensureSignal, getSignalMode } from '@/services/signal'
import { clearSession, getToken } from '@/services/auth'

export class ApiError extends Error {
  status: number
  payload: unknown

  constructor(message: string, status: number, payload?: unknown) {
    super(message)
    this.status = status
    this.payload = payload
  }
}

const TOKEN_KEY_HEADER = 'Authorization'

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  await ensureSignal()
  const mode = getSignalMode()
  const headers = new Headers(init.headers)
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const token = getToken()
  if (token) headers.set(TOKEN_KEY_HEADER, `Bearer ${token}`)

  const base = import.meta.env.VITE_API_BASE ?? ''
  const res =
    mode === 'replica'
      ? await demoHandle(path, { ...init, headers })
      : await fetch(`${base}${path}`, { ...init, headers })

  if (res.status === 401 && !path.startsWith('/auth/')) {
    clearSession()
    window.dispatchEvent(new Event('aci:unauthorized'))
  }

  const text = await res.text()
  const parsed = parseBody(text)

  if (!res.ok) {
    const message =
      (parsed && typeof parsed === 'object' && 'message' in parsed
        ? String((parsed as { message: unknown }).message)
        : null) ||
      (typeof parsed === 'string' && parsed) ||
      `Request failed (${res.status})`
    throw new ApiError(message, res.status, parsed)
  }

  return parsed as T
}

function parseBody(text: string): unknown {
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export const api = {
  login: (username: string, password: string) =>
    request<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  register: (username: string, password: string, role = 'ANALYST') =>
    request<string>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, role }),
    }),

  health: () => request<string>('/ai/health'),

  capabilities: () => request<Capability[]>('/ai/capabilities'),

  ask: (question: string) =>
    request<AIExplanationResponse>('/ai/ask', {
      method: 'POST',
      body: JSON.stringify({ question }),
    }),

  dashboard: () => request<DashboardDTO>('/analytics/dashboard'),

  monthlyRevenue: () => request<MonthlyRevenueDTO[]>('/analytics/monthly-revenue'),

  categoryRevenue: () => request<CategoryRevenueDTO[]>('/analytics/category-revenue'),

  topCustomers: () => request<TopCustomerDTO[]>('/analytics/top-customers'),

  topProducts: () => request<TopProductDTO[]>('/analytics/top-products'),

  inventoryAlerts: () => request<InventoryAlertDTO[]>('/analytics/inventory-alerts'),
}
