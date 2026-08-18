import type {
  AIExplanationResponse,
  AICapabilitiesResponse,
  DashboardDTO,
  MonthlyRevenueDTO,
  TopCustomerDTO,
  TopProductsDTO,
  CategoryRevenueDTO,
} from '@/types/api'

export const REPLICA_DASHBOARD: DashboardDTO = {
  totalRevenue: 1485290,
  totalOrders: 1842,
  totalCustomers: 640,
  pendingShipments: 14,
  failedPayments: 6,
  lowStockProducts: 8,
}

export const REPLICA_MONTHLY_REVENUE: MonthlyRevenueDTO[] = [
  { year: 2026, month: 1, revenue: 142000, orderCount: 160 },
  { year: 2026, month: 2, revenue: 189000, orderCount: 210 },
  { year: 2026, month: 3, revenue: 235000, orderCount: 265 },
  { year: 2026, month: 4, revenue: 198000, orderCount: 220 },
  { year: 2026, month: 5, revenue: 310000, orderCount: 340 },
  { year: 2026, month: 6, revenue: 411290, orderCount: 447 },
]

export const REPLICA_TOP_CUSTOMERS: TopCustomerDTO[] = [
  { customerId: 1, customerName: 'Vibhor Sharma', totalSpending: 264997, totalOrders: 12 },
  { customerId: 2, customerName: 'Aarav Patel', totalSpending: 182450, totalOrders: 9 },
  { customerId: 3, customerName: 'Priya Sundaram', totalSpending: 145200, totalOrders: 7 },
  { customerId: 4, customerName: 'Rohan Mehra', totalSpending: 112800, totalOrders: 6 },
]

export const REPLICA_TOP_PRODUCTS: TopProductsDTO[] = [
  { productId: 101, productName: 'Quantum Pro Wireless Headset', totalUnitsSold: 342, revenue: 427500 },
  { productId: 102, productName: 'AeroGlide Ergonomic Keyboard', totalUnitsSold: 289, revenue: 317900 },
  { productId: 103, productName: 'Onyx Pro Ultra-Wide Monitor 34"', totalUnitsSold: 114, revenue: 513000 },
]

export const REPLICA_CATEGORY_REVENUE: CategoryRevenueDTO[] = [
  { categoryName: 'Electronics & Audio', revenue: 742000, percentage: 50 },
  { categoryName: 'Ergonomic Peripherals', revenue: 412000, percentage: 28 },
  { categoryName: 'Smart Workspace', revenue: 331290, percentage: 22 },
]

export const REPLICA_CAPABILITIES: AICapabilitiesResponse = {
  totalEntities: 8,
  capabilities: [
    {
      entity: 'CUSTOMER',
      description: 'Analytics for customer spending, orders, customer lifetime value, and inactivity.',
      operations: ['GET_TOP_CUSTOMERS', 'GET_CUSTOMER_LIFETIME_VALUE', 'GET_INACTIVE_CUSTOMERS'],
    },
    {
      entity: 'PRODUCT',
      description: 'Sales volume, revenue performance, and underperforming SKU identification.',
      operations: ['GET_TOP_PRODUCTS', 'GET_LOW_PERFORMING_PRODUCTS'],
    },
    {
      entity: 'INVENTORY',
      description: 'Real-time stock level monitoring, threshold alerts, and depletion warnings.',
      operations: ['GET_INVENTORY_ALERTS', 'GET_LOW_STOCK'],
    },
    {
      entity: 'PAYMENT',
      description: 'Payment success rates, transaction failures, and preferred gateway breakdown.',
      operations: ['GET_FAILED_PAYMENTS', 'GET_METHOD_BREAKDOWN'],
    },
    {
      entity: 'SHIPMENT',
      description: 'Fulfillment speed, delivery exceptions, transit durations, and bottlenecks.',
      operations: ['GET_DELAYED_SHIPMENTS', 'GET_STATUS_BREAKDOWN'],
    },
    {
      entity: 'REVIEW',
      description: 'Product satisfaction scoring, sentiment trends, and negative review audits.',
      operations: ['GET_NEGATIVE_REVIEWS', 'GET_RATING_SUMMARY'],
    },
    {
      entity: 'REVENUE',
      description: 'Deterministic monthly recurring revenue, historical trends, and category distribution.',
      operations: ['GET_MONTHLY_REVENUE', 'GET_CATEGORY_REVENUE'],
    },
    {
      entity: 'ORDER',
      description: 'Order fulfillment rates, cancellations, and order velocity trends.',
      operations: ['GET_CANCELLED_ORDERS', 'GET_ORDER_TRENDS'],
    },
  ],
}

export function generateReplicaAnswer(question: string): AIExplanationResponse {
  const q = question.toLowerCase()
  if (q.includes('customer') || q.includes('who') || q.includes('biggest')) {
    return {
      answer: 'The top customer is Vibhor Sharma who contributed ₹264,997 across 12 orders.',
      reason: 'Vibhor Sharma placed repeat high-value orders predominantly in electronics, representing 17.8% of top-tier gross spend.',
      observations: [
        'Top 4 customers generate over ₹705,000 in revenue.',
        'Average repeat purchase cycle is 18.4 days.',
        'Zero return requests logged across top customer profiles.',
      ],
      recommendations: [
        'Enroll Vibhor Sharma and top spenders into an exclusive VIP Concierge tier.',
        'Provide early access invites for upcoming high-margin hardware launches.',
      ],
      evidence: {
        entity: 'CUSTOMER',
        operation: 'GET_TOP_CUSTOMERS',
        data: REPLICA_TOP_CUSTOMERS,
      },
    }
  }

  if (q.includes('stock') || q.includes('restock') || q.includes('inventory')) {
    return {
      answer: '8 items currently sit below safety thresholds, with 3 SKUs at critical risk of stockout within 48 hours.',
      reason: 'Supply chain lead time delays combined with a 28% velocity surge in Audio Peripherals resulted in rapid inventory depletion.',
      observations: [
        'Quantum Pro Wireless Headset has 4 units remaining (daily run rate: 6 units).',
        'AeroGlide Keyboard inventory buffer is 12% below reorder trigger.',
      ],
      recommendations: [
        'Trigger expedited air shipment for Quantum Pro Wireless Headset.',
        'Temporarily throttle top-of-funnel ad spend on low-stock SKUs to prevent backorders.',
      ],
      evidence: {
        entity: 'INVENTORY',
        operation: 'GET_INVENTORY_ALERTS',
        data: [
          { productId: 101, productName: 'Quantum Pro Wireless Headset', stock: 4 },
          { productId: 102, productName: 'AeroGlide Ergonomic Keyboard', stock: 7 },
          { productId: 108, productName: 'USB-C Magnetic Dock 10-in-1', stock: 2 },
        ],
      },
    }
  }

  return {
    answer: 'Overall store performance is robust with ₹1,485,290 in year-to-date revenue and positive month-over-month growth.',
    reason: 'Conversion rates improved by 14% after checkout optimization, while payment failure rates fell below 1.2%.',
    observations: [
      'Monthly revenue grew from ₹142k in Jan to ₹411k in June.',
      'Electronics & Audio remain the strongest revenue driver at 50% share.',
    ],
    recommendations: [
      'Expand the catalog with complementary ergonomic desk accessories.',
      'Implement proactive customer check-in emails for orders over ₹25,000.',
    ],
    evidence: {
      entity: 'REVENUE',
      operation: 'GET_MONTHLY_REVENUE',
      data: REPLICA_MONTHLY_REVENUE,
    },
  }
}
