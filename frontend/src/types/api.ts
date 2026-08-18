export interface User {
  id?: number
  username: string
  role?: string
}

export interface AuthResponse {
  token: string
  username?: string
  role?: string
}

export interface AIExplanationResponse {
  answer: string
  reason: string
  observations: string[]
  recommendations: string[]
  evidence: unknown
}

export interface Capability {
  entity: string
  description: string
  operations: string[]
}

export interface AICapabilitiesResponse {
  capabilities: Capability[]
  totalEntities?: number
}

export interface TopCustomerDTO {
  customerId?: number
  customerName?: string
  totalSpending?: number
  totalOrders?: number
}

export interface TopProductsDTO {
  productId?: number
  productName?: string
  totalUnitsSold?: number
  totalRevenue?: number
  revenue?: number
  quantity?: number
}

export interface MonthlyRevenueDTO {
  year: number
  month: number
  revenue: number
  orderCount?: number
}

export interface CategoryRevenueDTO {
  categoryName: string
  revenue: number
  percentage?: number
}

export interface CustomerLifetimeValueDTO {
  customerId: number
  customerName: string
  lifetimeValue: number
  avgOrderValue?: number
}

export interface InactiveCustomerDTO {
  customerId: number
  customerName: string
  email: string
  lastOrderDate: string
  daysInactive: number
}

export interface InventoryAlertDTO {
  productId: number
  productName: string
  stock: number
  status?: string
}

export interface DashboardDTO {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  pendingShipments: number
  failedPayments: number
  lowStockProducts: number
}

export interface ChatTurn {
  id: string
  role: 'user' | 'assistant'
  question: string
  createdAt: string
  response?: AIExplanationResponse
  error?: string
}

export type EvidenceRow = Record<string, unknown>
