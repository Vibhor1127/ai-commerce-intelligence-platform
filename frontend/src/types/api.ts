export interface AuthResponse {
  token: string
  username?: string
  role?: string
}

export interface CustomerProfile {
  customerId: number
  firstName: string
  lastName?: string
  email: string
  city: string
  signupDate?: string
}

export interface CategoryDTO {
  categoryId: number
  categoryName: string
}

export interface ProductCard {
  productId: number
  productName: string
  price: number
  stock: number
  categoryId?: number
  categoryName?: string
  imageUrl?: string
  avgRating?: number
  reviewCount?: number
}

export interface CartItem {
  cartItemId: number
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  lineTotal: number
  stockAvailable?: number
}

export interface CartDTO {
  cartId: number
  items: CartItem[]
  total: number
}

export interface OrderDTO {
  orderId: number
  orderDate: string
  status: string
  totalAmount: number
  paymentStatus?: string
  paymentMethod?: string
  items?: {
    productId: number
    productName: string
    quantity: number
    price: number
  }[]
  shippingAddress?: {
    addressId?: number
    line1: string
    line2?: string
    city: string
    state: string
    pincode: string
    phone: string
  }
}

export interface ReviewDTO {
  reviewId: number
  productId: number
  productName?: string
  customerId?: number
  customerName?: string
  rating: number
  reviewText?: string
  reviewDate?: string
}

export interface InventoryItem {
  productId: number
  productName: string
  categoryId?: number
  categoryName?: string
  price: number
  stock: number
  lowStock: boolean
  lastRestockDate?: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export interface RecentOrderDTO {
  orderId: number
  customerId: number
  customerName: string
  totalAmount: number
  status: string
  orderDate: string
}

export interface OrderStatusHistoryDTO {
  historyId: number
  orderId: number
  fromStatus: string | null
  toStatus: string
  changedBy: string | null
  note: string | null
  changedAt: string
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'

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

export interface DashboardDTO {
  totalRevenue?: number
  totalOrders?: number
  totalCustomers?: number
  totalProducts?: number
  revenue?: number
  orders?: number
  customers?: number
  products?: number
  pendingShipments?: number
  failedPayments?: number
  lowStockProducts?: number
}

export interface MonthlyRevenueDTO {
  year: number
  month: number
  revenue: number
  orderCount?: number
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
  Revenue?: number
  Quantity?: number
}

export interface CategoryRevenueDTO {
  categoryName: string
  revenue: number
  percentage?: number
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

export interface UserSummary {
  userId: number
  username: string
  role: string
  linkedCustomer: boolean
  customerEmail: string | null
}

export interface AddressDTO {
  addressId: number
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  phone: string
  isDefault?: boolean
}
