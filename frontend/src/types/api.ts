export interface AuthResponse {
  token: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
  role?: string
}

export interface DashboardDTO {
  totalRevenue: number | string
  totalOrders: number
  totalCustomers: number
  totalProducts: number
}

export interface MonthlyRevenueDTO {
  year: number
  month: number
  revenue: number | string
}

export interface CategoryRevenueDTO {
  categoryId: number
  categoryName: string
  revenue: number | string
}

export interface TopCustomerDTO {
  customerId: number
  customerName: string
  totalSpending: number | string
}

export interface TopProductDTO {
  productId: number
  productName: string
  quantity?: number | string
  Quantity?: number | string
  revenue?: number | string
  Revenue?: number | string
}

export interface InventoryAlertDTO {
  productId: number
  productName: string
  stock: number
}

export interface Capability {
  entity: string
  description: string
  operations: string[]
}

export interface AnalyticsEvidence {
  entity?: string
  operation?: string
  data?: unknown
  dataDescription?: string
  recordCount?: number
}

export interface AIExplanationResponse {
  answer: string
  reason: string
  observations: string[] | null
  recommendations: string[] | null
  evidence: AnalyticsEvidence | Record<string, unknown> | unknown[] | null
}

export interface ChatTurn {
  id: string
  role: 'user' | 'assistant'
  question?: string
  createdAt: string
  response?: AIExplanationResponse
  error?: string
}

export type SignalMode = 'checking' | 'live' | 'replica'

export type EvidenceRow = Record<string, unknown>
