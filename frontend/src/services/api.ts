import type {
  AuthResponse,
  AIExplanationResponse,
  AICapabilitiesResponse,
  DashboardDTO,
  MonthlyRevenueDTO,
  TopCustomerDTO,
  TopProductsDTO,
  CategoryRevenueDTO,
  CustomerProfile,
  CategoryDTO,
  ProductCard,
  CartDTO,
  OrderDTO,
  ReviewDTO,
  InventoryItem,
  PageResponse,
  RecentOrderDTO,
  OrderStatusHistoryDTO,
  OrderStatus,
  UserSummary,
  AddressDTO,
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
    if (token) localStorage.setItem('aci_token', token)
    else localStorage.removeItem('aci_token')
  }

  setSession(username: string | null, role: string | null) {
    if (username) localStorage.setItem('aci_username', username)
    else localStorage.removeItem('aci_username')
    if (role) localStorage.setItem('aci_role', role)
    else localStorage.removeItem('aci_role')
  }

  getToken() {
    return this.token
  }

  getRole() {
    return localStorage.getItem('aci_role')
  }

  getUsername() {
    return localStorage.getItem('aci_username')
  }

  isAuthenticated() {
    return Boolean(this.token)
  }

  private headers(): HeadersInit {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (this.token) headers.Authorization = `Bearer ${this.token}`
    return headers
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { ...this.headers(), ...options.headers },
    })

    if (!response.ok) {
      let errMsg = `Request failed (${response.status})`
      try {
        const body = await response.json()
        if (body.errors && typeof body.errors === 'object') {
          errMsg = Object.values(body.errors).join(', ')
        } else if (body.message) {
          errMsg = body.message
        }
      } catch {
        /* ignore */
      }
      throw new ApiError(errMsg, response.status)
    }

    if (response.status === 204) return undefined as T
    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) return (await response.json()) as T
    return { message: await response.text() } as unknown as T
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    if (FORCE_REPLICA) {
      const resp: AuthResponse = { token: 'mock-jwt', username, role: 'ADMIN' }
      this.setToken(resp.token)
      this.setSession(username, 'ADMIN')
      return resp
    }
    const resp = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    if (resp?.token) {
      this.setToken(resp.token)
      this.setSession(resp.username || username, resp.role || 'USER')
    }
    return resp
  }

  async register(payload: {
    username: string
    password: string
    role?: string
    firstName?: string
    lastName?: string
    email?: string
    city?: string
  }): Promise<{ message?: string }> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  logout() {
    this.setToken(null)
    this.setSession(null, null)
  }

  // —— Store ——
  getProfile() {
    return this.request<CustomerProfile>('/api/store/me')
  }

  updateProfile(body: { firstName: string; lastName?: string; city: string }) {
    return this.request<CustomerProfile>('/api/store/me', {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
  }

  getCategories() {
    return this.request<CategoryDTO[]>('/api/store/categories')
  }

  getProducts(params: { category?: number; search?: string; page?: number; size?: number } = {}) {
    const q = new URLSearchParams()
    if (params.category != null) q.set('category', String(params.category))
    if (params.search) q.set('search', params.search)
    if (params.page != null) q.set('page', String(params.page))
    if (params.size != null) q.set('size', String(params.size))
    return this.request<PageResponse<ProductCard>>(`/api/store/products?${q}`)
  }

  getProduct(id: number) {
    return this.request<ProductCard>(`/api/store/products/${id}`)
  }

  getProductReviews(id: number, page = 0) {
    return this.request<PageResponse<ReviewDTO>>(`/api/store/products/${id}/reviews?page=${page}`)
  }

  getCart() {
    return this.request<CartDTO>('/api/store/cart')
  }

  addToCart(productId: number, quantity: number) {
    return this.request<CartDTO>('/api/store/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    })
  }

  updateCartItem(id: number, quantity: number) {
    return this.request<CartDTO>(`/api/store/cart/items/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    })
  }

  removeCartItem(id: number) {
    return this.request<CartDTO>(`/api/store/cart/items/${id}`, { method: 'DELETE' })
  }

  checkout(body: Record<string, unknown>) {
    return this.request<OrderDTO>('/api/store/checkout', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  getOrders(page = 0) {
    return this.request<PageResponse<OrderDTO>>(`/api/store/orders?page=${page}`)
  }

  getOrder(id: number) {
    return this.request<OrderDTO>(`/api/store/orders/${id}`)
  }

  createReview(body: { productId: number; rating: number; comment?: string; orderId?: number }) {
    return this.request<ReviewDTO>('/api/store/reviews', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  // —— Admin ——
  getAdminReviews(params: { minRating?: number; maxRating?: number; page?: number } = {}) {
    const q = new URLSearchParams()
    if (params.minRating != null) q.set('minRating', String(params.minRating))
    if (params.maxRating != null) q.set('maxRating', String(params.maxRating))
    if (params.page != null) q.set('page', String(params.page))
    return this.request<PageResponse<ReviewDTO>>(`/api/admin/reviews?${q}`)
  }

  getInventory(page = 0) {
    return this.request<PageResponse<InventoryItem>>(`/api/admin/inventory?page=${page}&size=20`)
  }

  createProduct(body: { productName: string; price: number; stock: number; categoryId: number; imageUrl?: string }) {
    return this.request<ProductCard>('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  updateProduct(
    id: number,
    body: { productName: string; price: number; stock: number; categoryId: number; imageUrl?: string },
  ) {
    return this.request<ProductCard>(`/api/admin/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
  }

  adjustInventory(productId: number, stock: number, reason?: string) {
    return this.request<InventoryItem>(`/api/admin/inventory/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify({ stock, reason }),
    })
  }

  getRecentOrders(limit = 15) {
    return this.request<RecentOrderDTO[]>(`/analytics/orders/recent?limit=${limit}`)
  }

  // —— Admin Orders ——
  getAdminOrders(params: { status?: string; search?: string; page?: number } = {}) {
    const q = new URLSearchParams()
    if (params.status) q.set('status', params.status)
    if (params.search) q.set('search', params.search)
    if (params.page != null) q.set('page', String(params.page))
    return this.request<PageResponse<RecentOrderDTO>>(`/api/admin/orders?${q}`)
  }

  updateOrderStatus(orderId: number, body: { newStatus: OrderStatus; note?: string }) {
    return this.request<OrderStatusHistoryDTO>(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
  }

  getOrderHistory(orderId: number) {
    return this.request<OrderStatusHistoryDTO[]>(`/api/admin/orders/${orderId}/history`)
  }

  getValidTransitions(orderId: number) {
    return this.request<OrderStatus[]>(`/api/admin/orders/${orderId}/transitions`)
  }

  cancelStoreOrder(orderId: number) {
    return this.request<OrderDTO>(`/api/store/orders/${orderId}/cancel`, { method: 'PATCH' })
  }

  // —— Admin Users ——
  getAdminUsers(params: { search?: string; page?: number } = {}) {
    const q = new URLSearchParams()
    if (params.search) q.set('search', params.search)
    if (params.page != null) q.set('page', String(params.page))
    return this.request<PageResponse<UserSummary>>(`/api/admin/users?${q}`)
  }

  updateUserRole(userId: number, role: string) {
    return this.request<UserSummary>(`/api/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    })
  }

  // —— Address Management ——
  getAddresses() {
    return this.request<AddressDTO[]>('/api/store/addresses')
  }

  addAddress(body: Omit<AddressDTO, 'addressId'>) {
    return this.request<AddressDTO>('/api/store/addresses', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  updateAddress(id: number, body: Omit<AddressDTO, 'addressId'>) {
    return this.request<AddressDTO>(`/api/store/addresses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
  }

  deleteAddress(id: number) {
    return this.request<void>(`/api/store/addresses/${id}`, { method: 'DELETE' })
  }

  setDefaultAddress(id: number) {
    return this.request<void>(`/api/store/addresses/${id}/default`, { method: 'PATCH' })
  }

  // —— Analytics / AI ——
  async checkHealth(): Promise<boolean> {
    if (FORCE_REPLICA) return false
    try {
      const res = await fetch(`${API_BASE}/ai/health`)
      return res.ok
    } catch {
      return false
    }
  }

  async getCapabilities(): Promise<AICapabilitiesResponse> {
    try {
      const resp = await this.request<AICapabilitiesResponse>('/ai/capabilities')
      if (resp?.capabilities && resp.capabilities.length > 0) return resp
      return REPLICA_CAPABILITIES
    } catch {
      return REPLICA_CAPABILITIES
    }
  }

  async ask(question: string): Promise<AIExplanationResponse> {
    if (FORCE_REPLICA) {
      await new Promise((r) => setTimeout(r, 800))
      return generateReplicaAnswer(question)
    }
    try {
      return await this.request('/ai/ask', {
        method: 'POST',
        body: JSON.stringify({ question }),
      })
    } catch (err) {
      if (err instanceof ApiError && (err.status === 0 || err.status === 404)) {
        return generateReplicaAnswer(question)
      }
      throw err
    }
  }

  async getDashboard(): Promise<DashboardDTO> {
    try {
      return await this.request('/analytics/dashboard')
    } catch {
      return REPLICA_DASHBOARD
    }
  }

  async getMonthlyRevenue(): Promise<MonthlyRevenueDTO[]> {
    try {
      return await this.request('/analytics/monthly-revenue')
    } catch {
      return REPLICA_MONTHLY_REVENUE
    }
  }

  async getTopCustomers(): Promise<TopCustomerDTO[]> {
    try {
      return await this.request('/analytics/top-customers')
    } catch {
      return REPLICA_TOP_CUSTOMERS
    }
  }

  async getTopProducts(): Promise<TopProductsDTO[]> {
    try {
      return await this.request('/analytics/top-products')
    } catch {
      return REPLICA_TOP_PRODUCTS
    }
  }

  async getCategoryRevenue(): Promise<CategoryRevenueDTO[]> {
    try {
      return await this.request('/analytics/category-revenue')
    } catch {
      return REPLICA_CATEGORY_REVENUE
    }
  }

  async getCustomerLifetimeValue() {
    try {
      return await this.request('/analytics/customer-lifetime-value')
    } catch {
      return []
    }
  }

  async getInactiveCustomers() {
    try {
      return await this.request('/analytics/inactive-customers')
    } catch {
      return []
    }
  }

  async getInventoryAlerts() {
    try {
      return await this.request('/analytics/inventory-alerts')
    } catch {
      return []
    }
  }
}

export const api = new ApiService()
