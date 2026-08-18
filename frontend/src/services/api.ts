import type {
  AuthResponse,
  AIExplanationResponse,
  AICapabilitiesResponse,
  DashboardDTO,
  MonthlyRevenueDTO,
  TopCustomerDTO,
  TopProductsDTO,
  CategoryRevenueDTO,
} from '@/types/api'
import {
  REPLICA_DASHBOARD,
  REPLICA_MONTHLY_REVENUE,
  REPLICA_TOP_CUSTOMERS,
  REPLICA_TOP_PRODUCTS,
  REPLICA_CATEGORY_REVENUE,
  REPLICA_CAPABILITIES,
  generateReplicaAnswer,
} from './replica'

const API_BASE = import.meta.env.VITE_API_BASE || ''
const FORCE_REPLICA = import.meta.env.VITE_FORCE_REPLICA === 'true'

export class ApiError extends Error {
  status: number
  constructor(message: string, status = 500) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

class ApiService {
  private token: string | null = null

  constructor() {
    this.token = localStorage.getItem('aci_token')
  }

  setToken(token: string | null) {
    this.token = token
    if (token) {
      localStorage.setItem('aci_token', token)
    } else {
      localStorage.removeItem('aci_token')
    }
  }

  getToken(): string | null {
    return this.token
  }

  isAuthenticated(): boolean {
    return Boolean(this.token)
  }

  private headers(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }
    return headers
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${path}`
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.headers(),
          ...options.headers,
        },
      })

      if (!response.ok) {
        let errMsg = `Request failed (${response.status})`
        try {
          const body = await response.json()
          errMsg = body.message || body.error || errMsg
        } catch {
          // ignore json parse error
        }
        throw new ApiError(errMsg, response.status)
      }

      return (await response.json()) as T
    } catch (err) {
      if (err instanceof ApiError) throw err
      throw new ApiError(err instanceof Error ? err.message : 'Network failure', 0)
    }
  }

  async login(username: string, password: string):Promise<AuthResponse> {
    if (FORCE_REPLICA) {
      const resp: AuthResponse = { token: 'mock-jwt-token-replica', username, role: 'ADMIN' }
      this.setToken(resp.token)
      return resp
    }
    try {
      const resp = await this.request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      })
      if (resp?.token) {
        this.setToken(resp.token)
      }
      return resp
    } catch (err) {
      // If server unreachable, provide clearance for preview
      if (err instanceof ApiError && err.status === 0) {
        const resp: AuthResponse = { token: 'mock-jwt-token-replica', username, role: 'ADMIN' }
        this.setToken(resp.token)
        return resp
      }
      throw err
    }
  }

  async register(username: string, password: string, role = 'USER'): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, role }),
    })
  }

  async checkHealth(): Promise<boolean> {
    if (FORCE_REPLICA) return false
    try {
      const res = await fetch(`${API_BASE}/ai/health`, { method: 'GET' })
      return res.ok
    } catch {
      return false
    }
  }

  async getCapabilities(): Promise<AICapabilitiesResponse> {
    try {
      return await this.request<AICapabilitiesResponse>('/ai/capabilities')
    } catch {
      return REPLICA_CAPABILITIES
    }
  }

  async ask(question: string): Promise<AIExplanationResponse> {
    if (FORCE_REPLICA) {
      await new Promise((r) => setTimeout(r, 1200))
      return generateReplicaAnswer(question)
    }
    try {
      return await this.request<AIExplanationResponse>('/ai/ask', {
        method: 'POST',
        body: JSON.stringify({ question }),
      })
    } catch (err) {
      if (err instanceof ApiError && (err.status === 0 || err.status === 404)) {
        await new Promise((r) => setTimeout(r, 1000))
        return generateReplicaAnswer(question)
      }
      throw err
    }
  }

  async getDashboard(): Promise<DashboardDTO> {
    try {
      return await this.request<DashboardDTO>('/analytics/dashboard')
    } catch {
      return REPLICA_DASHBOARD
    }
  }

  async getMonthlyRevenue(): Promise<MonthlyRevenueDTO[]> {
    try {
      return await this.request<MonthlyRevenueDTO[]>('/analytics/monthly-revenue')
    } catch {
      return REPLICA_MONTHLY_REVENUE
    }
  }

  async getTopCustomers(): Promise<TopCustomerDTO[]> {
    try {
      return await this.request<TopCustomerDTO[]>('/analytics/top-customers')
    } catch {
      return REPLICA_TOP_CUSTOMERS
    }
  }

  async getTopProducts(): Promise<TopProductsDTO[]> {
    try {
      return await this.request<TopProductsDTO[]>('/analytics/top-products')
    } catch {
      return REPLICA_TOP_PRODUCTS
    }
  }

  async getCategoryRevenue(): Promise<CategoryRevenueDTO[]> {
    try {
      return await this.request<CategoryRevenueDTO[]>('/analytics/category-revenue')
    } catch {
      return REPLICA_CATEGORY_REVENUE
    }
  }

  logout() {
    this.setToken(null)
  }
}

export const api = new ApiService()
