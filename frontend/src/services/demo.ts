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

const delay = (ms = 420) => new Promise((resolve) => setTimeout(resolve, ms))

export const DEMO_CAPABILITIES: Capability[] = [
  {
    entity: 'CUSTOMER',
    description:
      'Analyzes customer behavior including top spenders, customer lifetime value, and inactive/churning customers',
    operations: ['TOP_CUSTOMERS', 'LIFETIME_VALUE', 'INACTIVE_CUSTOMERS'],
  },
  {
    entity: 'CUSTOMER_SATISFACTION',
    description:
      'Performs cross-table analytics joining customer spending with review ratings to identify high-value dissatisfied customers at risk of churn',
    operations: ['HIGH_SPEND_LOW_RATING', 'SATISFACTION_OVERVIEW'],
  },
  {
    entity: 'PRODUCT',
    description:
      'Analyzes product performance including best sellers, low performing products, and product sales rankings',
    operations: ['TOP_PRODUCTS', 'LOW_PERFORMING_PRODUCTS'],
  },
  {
    entity: 'REVENUE',
    description:
      'Analyzes revenue data including monthly revenue trends, category-wise revenue breakdown, and overall revenue summaries',
    operations: ['MONTHLY_REVENUE', 'CATEGORY_REVENUE', 'REVENUE_SUMMARY'],
  },
  {
    entity: 'INVENTORY',
    description:
      'Monitors inventory levels including low stock alerts, products needing restocking, and inventory status overview',
    operations: ['LOW_STOCK_ALERTS', 'INVENTORY_SUMMARY'],
  },
  {
    entity: 'PAYMENT',
    description:
      'Analyzes payment transactions, failed payments, payment method breakdown, and payment success rates',
    operations: ['FAILED_PAYMENTS', 'PAYMENT_METHOD_ANALYSIS', 'PAYMENT_SUCCESS_RATE'],
  },
  {
    entity: 'SHIPMENT',
    description:
      'Analyzes shipping and logistics operations including delayed shipments, tracking status, and delivery time performance',
    operations: ['DELAYED_SHIPMENTS', 'SHIPMENT_STATUS_SUMMARY', 'AVERAGE_DELIVERY_TIME'],
  },
  {
    entity: 'REVIEW',
    description:
      'Analyzes customer feedback, negative reviews, product ratings, and customer satisfaction sentiment',
    operations: ['NEGATIVE_REVIEWS', 'PRODUCT_RATINGS', 'RATING_SUMMARY'],
  },
  {
    entity: 'ORDER',
    description:
      'Analyzes order metrics, cancelled/returned orders, monthly order volume trends, and customer purchase frequency',
    operations: ['CANCELLED_ORDERS', 'ORDER_TRENDS', 'CUSTOMER_ORDER_FREQUENCY'],
  },
]

export const DEMO_DASHBOARD: DashboardDTO = {
  totalRevenue: 4862410,
  totalOrders: 1284,
  totalCustomers: 612,
  totalProducts: 148,
}

export const DEMO_MONTHLY: MonthlyRevenueDTO[] = [
  { year: 2025, month: 11, revenue: 312400 },
  { year: 2025, month: 12, revenue: 401880 },
  { year: 2026, month: 1, revenue: 356210 },
  { year: 2026, month: 2, revenue: 388940 },
  { year: 2026, month: 3, revenue: 421670 },
  { year: 2026, month: 4, revenue: 398120 },
  { year: 2026, month: 5, revenue: 467890 },
  { year: 2026, month: 6, revenue: 512450 },
]

export const DEMO_CATEGORIES: CategoryRevenueDTO[] = [
  { categoryId: 1, categoryName: 'Electronics', revenue: 2145800 },
  { categoryId: 2, categoryName: 'Fashion', revenue: 986440 },
  { categoryId: 3, categoryName: 'Home & Kitchen', revenue: 742190 },
  { categoryId: 4, categoryName: 'Books', revenue: 287980 },
]

export const DEMO_CUSTOMERS: TopCustomerDTO[] = [
  { customerId: 1, customerName: 'Vibhor Srivastava', totalSpending: 264997 },
  { customerId: 4, customerName: 'Meera Kapoor', totalSpending: 188420 },
  { customerId: 2, customerName: 'Rahul Sharma', totalSpending: 156880 },
  { customerId: 7, customerName: 'Ishaan Patel', totalSpending: 121340 },
  { customerId: 3, customerName: 'Ananya Singh', totalSpending: 98450 },
]

export const DEMO_PRODUCTS: TopProductDTO[] = [
  { productId: 1, productName: 'iPhone 15', quantity: 42, revenue: 3359958 },
  { productId: 2, productName: 'Samsung S24', quantity: 31, revenue: 2324969 },
  { productId: 8, productName: 'Sony WH-1000XM5', quantity: 64, revenue: 1919360 },
  { productId: 3, productName: 'Nike Air Max', quantity: 88, revenue: 615912 },
  { productId: 11, productName: 'Dyson Airwrap', quantity: 19, revenue: 759810 },
]

export const DEMO_INVENTORY: InventoryAlertDTO[] = [
  { productId: 14, productName: 'Pixel 9 Pro', stock: 4 },
  { productId: 22, productName: 'Kindle Paperwhite', stock: 6 },
  { productId: 9, productName: 'Levi 511 Slim', stock: 8 },
  { productId: 31, productName: 'Breville Barista', stock: 3 },
  { productId: 18, productName: 'AirPods Pro 2', stock: 10 },
]

const CLV = DEMO_CUSTOMERS.map((c, i) => ({
  customerId: c.customerId,
  customerName: c.customerName,
  lifetimeValue: Number(c.totalSpending) + (5 - i) * 12000,
}))

const INACTIVE = [
  { customerId: 19, customerName: 'Kavya Nair', lastOrderDate: '2025-12-11T10:20:00' },
  { customerId: 23, customerName: 'Arjun Mehta', lastOrderDate: '2026-01-04T16:40:00' },
  { customerId: 28, customerName: 'Sana Qureshi', lastOrderDate: '2026-02-18T09:05:00' },
]

const FAILED_PAYMENTS = [
  {
    paymentId: 441,
    orderId: 901,
    amount: 12990,
    paymentMethod: 'Credit Card',
    paymentStatus: 'FAILED',
    paymentDate: '2026-06-02T14:22:00',
  },
  {
    paymentId: 448,
    orderId: 918,
    amount: 7999,
    paymentMethod: 'Credit Card',
    paymentStatus: 'FAILED',
    paymentDate: '2026-06-04T11:08:00',
  },
  {
    paymentId: 452,
    orderId: 933,
    amount: 4599,
    paymentMethod: 'UPI',
    paymentStatus: 'FAILED',
    paymentDate: '2026-06-05T19:41:00',
  },
  {
    paymentId: 460,
    orderId: 948,
    amount: 2199,
    paymentMethod: 'Net Banking',
    paymentStatus: 'FAILED',
    paymentDate: '2026-06-07T08:15:00',
  },
  {
    paymentId: 471,
    orderId: 966,
    amount: 2000,
    paymentMethod: 'Credit Card',
    paymentStatus: 'FAILED',
    paymentDate: '2026-06-08T21:03:00',
  },
]

const PAYMENT_METHODS = [
  {
    paymentMethod: 'UPI',
    totalTransactions: 612,
    successfulTransactions: 598,
    failedTransactions: 14,
    totalVolume: 1842200,
    successRate: 97.7,
  },
  {
    paymentMethod: 'Credit Card',
    totalTransactions: 388,
    successfulTransactions: 351,
    failedTransactions: 37,
    totalVolume: 2210450,
    successRate: 90.5,
  },
  {
    paymentMethod: 'Net Banking',
    totalTransactions: 164,
    successfulTransactions: 151,
    failedTransactions: 13,
    totalVolume: 486210,
    successRate: 92.1,
  },
  {
    paymentMethod: 'Wallet',
    totalTransactions: 120,
    successfulTransactions: 117,
    failedTransactions: 3,
    totalVolume: 223550,
    successRate: 97.5,
  },
]

const DELAYED_SHIPMENTS = [
  {
    shipmentId: 77,
    orderId: 844,
    trackingNumber: 'TRK883421',
    shipmentStatus: 'IN_TRANSIT',
    shippedDate: '2026-05-28T09:00:00',
    deliveryDate: null,
    daysInTransit: 12,
  },
  {
    shipmentId: 81,
    orderId: 861,
    trackingNumber: 'TRK883588',
    shipmentStatus: 'DELAYED',
    shippedDate: '2026-05-30T16:20:00',
    deliveryDate: null,
    daysInTransit: 10,
  },
  {
    shipmentId: 90,
    orderId: 889,
    trackingNumber: 'TRK884012',
    shipmentStatus: 'IN_TRANSIT',
    shippedDate: '2026-06-01T11:45:00',
    deliveryDate: null,
    daysInTransit: 8,
  },
]

const SHIPMENT_STATUS = [
  { shipmentStatus: 'DELIVERED', totalShipments: 972, avgDeliveryDays: 3.4 },
  { shipmentStatus: 'IN_TRANSIT', totalShipments: 186, avgDeliveryDays: 4.1 },
  { shipmentStatus: 'PROCESSING', totalShipments: 84, avgDeliveryDays: null },
  { shipmentStatus: 'DELAYED', totalShipments: 28, avgDeliveryDays: 9.6 },
  { shipmentStatus: 'RETURNED', totalShipments: 14, avgDeliveryDays: 11.2 },
]

const NEGATIVE_REVIEWS = [
  {
    reviewId: 301,
    productId: 2,
    productName: 'Samsung S24',
    customerId: 19,
    customerName: 'Kavya Nair',
    rating: 2,
    reviewText: 'Heating during 4K video. Support ticket still open.',
    reviewDate: '2026-05-22T13:10:00',
  },
  {
    reviewId: 318,
    productId: 11,
    productName: 'Dyson Airwrap',
    customerId: 23,
    customerName: 'Arjun Mehta',
    rating: 1,
    reviewText: 'Motor noise after two weeks. Replacement requested.',
    reviewDate: '2026-05-29T18:44:00',
  },
  {
    reviewId: 334,
    productId: 9,
    productName: 'Levi 511 Slim',
    customerId: 28,
    customerName: 'Sana Qureshi',
    rating: 2,
    reviewText: 'Fit runs small versus the size chart.',
    reviewDate: '2026-06-03T09:12:00',
  },
]

const PRODUCT_RATINGS = [
  {
    productId: 1,
    productName: 'iPhone 15',
    avgRating: 4.7,
    totalReviews: 86,
    negativeReviewsCount: 3,
  },
  {
    productId: 8,
    productName: 'Sony WH-1000XM5',
    avgRating: 4.6,
    totalReviews: 54,
    negativeReviewsCount: 2,
  },
  {
    productId: 2,
    productName: 'Samsung S24',
    avgRating: 3.4,
    totalReviews: 41,
    negativeReviewsCount: 11,
  },
  {
    productId: 11,
    productName: 'Dyson Airwrap',
    avgRating: 3.1,
    totalReviews: 22,
    negativeReviewsCount: 8,
  },
  {
    productId: 9,
    productName: 'Levi 511 Slim',
    avgRating: 3.8,
    totalReviews: 33,
    negativeReviewsCount: 6,
  },
]

const ORDER_TRENDS = [
  { year: 2026, month: 1, totalOrders: 148, completedOrders: 129, cancelledOrders: 11, totalRevenue: 356210 },
  { year: 2026, month: 2, totalOrders: 161, completedOrders: 142, cancelledOrders: 9, totalRevenue: 388940 },
  { year: 2026, month: 3, totalOrders: 174, completedOrders: 155, cancelledOrders: 12, totalRevenue: 421670 },
  { year: 2026, month: 4, totalOrders: 169, completedOrders: 148, cancelledOrders: 14, totalRevenue: 398120 },
  { year: 2026, month: 5, totalOrders: 188, completedOrders: 167, cancelledOrders: 10, totalRevenue: 467890 },
  { year: 2026, month: 6, totalOrders: 201, completedOrders: 179, cancelledOrders: 13, totalRevenue: 512450 },
]

const CANCELLED = [
  {
    orderId: 103,
    customerId: 3,
    customerName: 'Ananya Singh',
    totalAmount: 6999,
    status: 'CANCELLED',
    orderDate: '2026-06-03T12:40:00',
  },
  {
    orderId: 214,
    customerId: 19,
    customerName: 'Kavya Nair',
    totalAmount: 45990,
    status: 'CANCELLED',
    orderDate: '2026-05-19T17:05:00',
  },
  {
    orderId: 266,
    customerId: 23,
    customerName: 'Arjun Mehta',
    totalAmount: 12990,
    status: 'RETURNED',
    orderDate: '2026-05-27T10:22:00',
  },
]

const FREQUENCY = DEMO_CUSTOMERS.map((c, i) => ({
  customerId: c.customerId,
  customerName: c.customerName,
  orderCount: 14 - i * 2,
  totalSpend: c.totalSpending,
  avgOrderValue: Math.round(Number(c.totalSpending) / (14 - i * 2)),
}))

const SATISFACTION = [
  {
    customerId: 19,
    customerName: 'Kavya Nair',
    email: 'kavya.nair@email.com',
    totalSpending: 142880,
    totalOrders: 9,
    avgRating: 2.4,
    negativeReviews: 4,
  },
  {
    customerId: 23,
    customerName: 'Arjun Mehta',
    email: 'arjun.mehta@email.com',
    totalSpending: 118640,
    totalOrders: 7,
    avgRating: 2.1,
    negativeReviews: 3,
  },
  {
    customerId: 28,
    customerName: 'Sana Qureshi',
    email: 'sana.q@email.com',
    totalSpending: 87420,
    totalOrders: 6,
    avgRating: 2.8,
    negativeReviews: 2,
  },
]

const LOW_PRODUCTS = [
  { productId: 41, productName: 'Yoga Mat Lite', quantity: 3, revenue: 2697 },
  { productId: 44, productName: 'Cable Organizer', quantity: 5, revenue: 1995 },
  { productId: 48, productName: 'Desk Plant Set', quantity: 2, revenue: 1598 },
]

type Pack = {
  match: RegExp
  entity: string
  operation: string
  description: string
  data: unknown[]
  answer: string
  reason: string
  observations: string[]
  recommendations: string[]
}

const PACKS: Pack[] = [
  {
    match: /restock|inventory|stock|low stock|replenish/i,
    entity: 'INVENTORY',
    operation: 'LOW_STOCK_ALERTS',
    description: 'Products with current stock at or below 10 units needing restock',
    data: DEMO_INVENTORY,
    answer: '5 products are at or below the restock threshold of 10 units.',
    reason:
      'Breville Barista (3) and Pixel 9 Pro (4) are the most exposed SKUs. These sit in high-intent categories where a stockout converts directly into lost revenue.',
    observations: [
      'Five SKUs are at or below 10 units',
      'Two of the five belong to Electronics, the highest-revenue category',
      'Breville Barista is the most critically understocked item at 3 units',
    ],
    recommendations: [
      'Raise emergency POs for Pixel 9 Pro and Breville Barista today',
      'Lift the Electronics safety stock from 10 to 15 units ahead of the next campaign',
    ],
  },
  {
    match: /failed payment|payment fail|declined|gateway|which payments/i,
    entity: 'PAYMENT',
    operation: 'FAILED_PAYMENTS',
    description: 'Failed or declined payment transactions',
    data: FAILED_PAYMENTS,
    answer: '5 failed payments detected, totalling ₹29,787.',
    reason:
      'Credit Card is the dominant failure surface — 3 of 5 declines — which points at issuer or gateway friction rather than inventory or pricing.',
    observations: [
      'Credit Card failures are the highest among methods',
      'Total failed amount is ₹29,787',
      'Failures cluster between 2 Jun and 8 Jun 2026',
    ],
    recommendations: [
      'Investigate the Credit Card gateway retry policy and 3DS timeout',
      'Offer UPI as a one-tap fallback on declined card checkouts',
    ],
  },
  {
    match: /payment method|success rate|upi|card performance/i,
    entity: 'PAYMENT',
    operation: 'PAYMENT_METHOD_ANALYSIS',
    description: 'Payment transaction metrics broken down by payment method',
    data: PAYMENT_METHODS,
    answer: 'UPI clears at 97.7% while Credit Card lags at 90.5%.',
    reason:
      'Card volume is the largest in rupees (₹22.1L) but carries the weakest success rate, so every lost card checkout is expensive.',
    observations: [
      'UPI and Wallet are the most reliable rails',
      'Credit Card holds the most GMV and the most failures',
      'Net Banking success sits in the middle at 92.1%',
    ],
    recommendations: [
      'Default returning shoppers with a failed card to UPI',
      'Ask the acquirer for a mid-month authorization health report',
    ],
  },
  {
    match: /biggest customer|top customer|highest spend|who are my|buyers/i,
    entity: 'CUSTOMER',
    operation: 'TOP_CUSTOMERS',
    description: 'Highest-spending customers ranked by completed order value',
    data: DEMO_CUSTOMERS,
    answer: 'Top customers contributed ₹8,30,087 in verified spending.',
    reason:
      'Vibhor Srivastava is the highest contributor at ₹2,64,997. The top five account for a concentrated share of completed GMV.',
    observations: [
      'Top 5 customers account for ₹8,30,087 in completed spend',
      'Vibhor Srivastava outspends the fifth-ranked customer by more than 2.6×',
      'Three of five top spenders buy primarily in Electronics',
    ],
    recommendations: [
      'Create a dedicated VIP concierge tier for the top five spenders',
      'Offer personalized early access on the next Electronics drop',
    ],
  },
  {
    match: /lifetime|clv|ltv/i,
    entity: 'CUSTOMER',
    operation: 'LIFETIME_VALUE',
    description: 'Customer lifetime value based on historical completed purchases',
    data: CLV,
    answer: 'Lifetime value is sharply concentrated in five accounts.',
    reason:
      'The same names that lead current spend also lead lifetime value, which means loyalty programs should protect this cohort first.',
    observations: [
      'Vibhor Srivastava remains the highest-LTV account',
      'LTV and recent spend rank in the same order — no hidden whales',
    ],
    recommendations: [
      'Assign a named operator to the top three LTV accounts',
      'Fund a retention budget proportional to each account’s LTV band',
    ],
  },
  {
    match: /inactive|churn|haven.?t ordered/i,
    entity: 'CUSTOMER',
    operation: 'INACTIVE_CUSTOMERS',
    description: 'Customers whose last order was more than 90 days ago',
    data: INACTIVE,
    answer: '3 customers have gone quiet for more than 90 days.',
    reason:
      'Kavya Nair last ordered in December 2025 and also appears in the low-rating cohort, so this is churn risk, not a quiet loyalist.',
    observations: [
      'Three accounts have no completed order in the last 90 days',
      'Two of the inactive names overlap with negative review authors',
    ],
    recommendations: [
      'Send a win-back offer only after the open support tickets are closed',
      'Do not discount silently — pair the outreach with a service recovery note',
    ],
  },
  {
    match: /bad review|negative review|rating|dissatisf|complaint/i,
    entity: 'REVIEW',
    operation: 'NEGATIVE_REVIEWS',
    description: 'Negative or critical customer reviews',
    data: NEGATIVE_REVIEWS,
    answer: '3 critical reviews are open against otherwise commercial SKUs.',
    reason:
      'The complaints are specific — heat, motor noise, size chart — which makes them operationally fixable rather than generic sentiment.',
    observations: [
      'Samsung S24 and Dyson Airwrap carry the harshest recent notes',
      'Two reviewers are also high-spend customers',
    ],
    recommendations: [
      'Route Dyson and S24 tickets to a senior CX queue today',
      'Publish a size-fit note on Levi 511 before the next restock',
    ],
  },
  {
    match: /product rating|average rating|satisfaction score/i,
    entity: 'REVIEW',
    operation: 'PRODUCT_RATINGS',
    description: 'Product rating summary with average scores and total reviews',
    data: PRODUCT_RATINGS,
    answer: 'iPhone 15 leads at 4.7. Dyson Airwrap is the weakest at 3.1.',
    reason:
      'Rating quality is diverging from revenue: Airwrap still sells, but the 3.1 average will compound into returns.',
    observations: [
      'Two hero SKUs sit above 4.5',
      'Dyson Airwrap has 8 negatives on only 22 reviews',
    ],
    recommendations: [
      'Pause paid acquisition on Airwrap until the defect rate is explained',
      'Use iPhone 15 reviews in PDP social proof modules',
    ],
  },
  {
    match: /delayed|shipment|delivery|in transit|logistics/i,
    entity: 'SHIPMENT',
    operation: 'DELAYED_SHIPMENTS',
    description: 'Shipments still in transit beyond the expected delivery window',
    data: DELAYED_SHIPMENTS,
    answer: '3 shipments are outside the promised delivery window.',
    reason:
      'TRK883421 has been in transit for 12 days. That is nearly 4× the 3.4-day delivered average.',
    observations: [
      'Three active shipments exceed 8 days in transit',
      'Delivered average across the book is 3.4 days',
    ],
    recommendations: [
      'Escalate TRK883421 and TRK883588 with the carrier desk',
      'Proactively message the three customers with a revised ETA',
    ],
  },
  {
    match: /shipment status|delivery time|carrier/i,
    entity: 'SHIPMENT',
    operation: 'SHIPMENT_STATUS_SUMMARY',
    description: 'Shipment breakdown by status and average delivery durations',
    data: SHIPMENT_STATUS,
    answer: '972 of 1,284 shipments are delivered. 28 are explicitly delayed.',
    reason:
      'The delayed slice is small in count but expensive in trust — especially when average delay sits at 9.6 days.',
    observations: [
      'Delivered share is 75.7% of recorded shipments',
      'Delayed average dwell is 9.6 days versus 3.4 delivered',
    ],
    recommendations: [
      'Cap promised SLA at 5 days until the delayed queue is cleared',
      'Audit the Processing bucket nightly — 84 orders have not shipped',
    ],
  },
  {
    match: /revenue trend|monthly revenue|show revenue|sales trend/i,
    entity: 'REVENUE',
    operation: 'MONTHLY_REVENUE',
    description: 'Revenue aggregated by month showing trends over time',
    data: DEMO_MONTHLY,
    answer: 'Revenue is compounding into June at ₹5,12,450 — the high-water month.',
    reason:
      'June sits 63% above November. The only dip is April, which recovered immediately in May.',
    observations: [
      'June 2026 is the strongest month at ₹5,12,450',
      'April is the only recent contraction, then May-June resume the climb',
    ],
    recommendations: [
      'Protect June’s Electronics mix — it is carrying the curve',
      'Treat April as a campaign gap, not a demand problem',
    ],
  },
  {
    match: /category|electronics|fashion mix/i,
    entity: 'REVENUE',
    operation: 'CATEGORY_REVENUE',
    description: 'Revenue contribution per product category',
    data: DEMO_CATEGORIES,
    answer: 'Electronics contributes ₹21,45,800 — the primary revenue engine.',
    reason:
      'Electronics is larger than Fashion and Home & Kitchen combined. Concentration is a strength and a single-point risk.',
    observations: [
      'Electronics is 44% of recorded category revenue',
      'Books is the long-tail category at ₹2,87,980',
    ],
    recommendations: [
      'Do not starve Fashion inventory — it is the diversifier',
      'Keep Electronics in-stock through the next launch window',
    ],
  },
  {
    match: /top product|best seller|selling the most|product performance/i,
    entity: 'PRODUCT',
    operation: 'TOP_PRODUCTS',
    description: 'Top products by sales volume and generated revenue',
    data: DEMO_PRODUCTS,
    answer: 'iPhone 15 is the lead SKU at ₹33,59,958 across 42 units.',
    reason:
      'A small set of premium devices is doing most of the commercial work. Sony headphones punch above unit price on volume.',
    observations: [
      'iPhone 15 leads both revenue and prestige mix',
      'Nike Air Max leads unit velocity at 88 pairs',
    ],
    recommendations: [
      'Bundle Sony WH-1000XM5 with flagship phones at checkout',
      'Keep a hard reserve of iPhone 15 through the next 30 days',
    ],
  },
  {
    match: /low performing|worst product|weak sku/i,
    entity: 'PRODUCT',
    operation: 'LOW_PERFORMING_PRODUCTS',
    description: 'Bottom products by revenue with at least 1 sale',
    data: LOW_PRODUCTS,
    answer: 'Three catalog items are commercially idle.',
    reason:
      'Yoga Mat Lite, Cable Organizer and Desk Plant Set have not crossed ₹3,000 each. They occupy attention without returning it.',
    observations: [
      'None of the bottom three belong to Electronics',
      'Combined revenue of the tail is under ₹7,000',
    ],
    recommendations: [
      'Mark the tail for clearance rather than fresh ad spend',
      'Re-home Cable Organizer as an add-on, not a hero tile',
    ],
  },
  {
    match: /cancel|returned order|order status/i,
    entity: 'ORDER',
    operation: 'CANCELLED_ORDERS',
    description: 'Cancelled or returned orders',
    data: CANCELLED,
    answer: '3 cancelled or returned orders are on the current exception list.',
    reason:
      'The highest-value cancel is Kavya Nair at ₹45,990 — the same account appearing in reviews and inactivity.',
    observations: [
      'Exception orders span CANCELLED and RETURNED',
      'High-value cancels overlap with dissatisfaction signals',
    ],
    recommendations: [
      'Interview the ₹45,990 cancel before issuing a blind coupon',
      'Track return reason codes weekly, not monthly',
    ],
  },
  {
    match: /order trend|order volume|completed orders/i,
    entity: 'ORDER',
    operation: 'ORDER_TRENDS',
    description: 'Order volume, completion, and cancellation statistics aggregated over time',
    data: ORDER_TRENDS,
    answer: 'Order volume is rising into June: 201 orders, 179 completed.',
    reason:
      'Completions are scaling with volume. Cancellations are stable in the low teens, so growth is not being eaten by failure.',
    observations: [
      'June is the busiest month at 201 orders',
      'Cancellations remain between 9 and 14 per month',
    ],
    recommendations: [
      'Staff CX for a June-like run-rate rather than the April dip',
      'Keep cancellation rate under 7% as volume climbs',
    ],
  },
  {
    match: /frequency|repeat purchase|how often/i,
    entity: 'ORDER',
    operation: 'CUSTOMER_ORDER_FREQUENCY',
    description: 'Customer order count and purchase frequency',
    data: FREQUENCY,
    answer: 'The top cohort is a repeat-purchase engine, not one-off luxury.',
    reason:
      'Vibhor Srivastava’s 14 orders produce an average ticket that still sits in premium territory — frequency and value move together.',
    observations: [
      'Top spenders also lead order count',
      'Average order values remain four-figure across the cohort',
    ],
    recommendations: [
      'Design a reorder cadence reminder at day 18 for this cohort',
      'Do not train them onto deep discount — they already repeat',
    ],
  },
  {
    match: /high.?spend|at.risk|vip.*risk|dissatisfied customer/i,
    entity: 'CUSTOMER_SATISFACTION',
    operation: 'HIGH_SPEND_LOW_RATING',
    description: 'High-spending customers with average review ratings <= 3.0 (at-risk VIP customers)',
    data: SATISFACTION,
    answer: '3 high-spend customers are rating the store at or below 2.8.',
    reason:
      'These are not window shoppers. Combined spend is ₹3,48,940. Losing them is a revenue event, not a CX footnote.',
    observations: [
      'Kavya Nair has ₹1,42,880 spend against a 2.4 average rating',
      'All three accounts have multiple negative reviews',
    ],
    recommendations: [
      'Open a white-glove recovery thread with Kavya and Arjun this week',
      'Do not put these accounts into a generic win-back blast',
    ],
  },
]

function packToResponse(pack: Pack): AIExplanationResponse {
  return {
    answer: pack.answer,
    reason: pack.reason,
    observations: pack.observations,
    recommendations: pack.recommendations,
    evidence: {
      entity: pack.entity,
      operation: pack.operation,
      data: pack.data,
      dataDescription: pack.description,
      recordCount: pack.data.length,
    },
  }
}

export function demoAsk(question: string): AIExplanationResponse {
  const hit = PACKS.find((pack) => pack.match.test(question))
  if (hit) return packToResponse(hit)
  return packToResponse(PACKS[3])
}

export function demoSeedFor(entity: string, operation?: string): string {
  const q = `${entity} ${operation ?? ''}`.toUpperCase()
  if (q.includes('INVENTORY')) return 'Which products need restocking?'
  if (q.includes('FAILED')) return 'Which payments failed?'
  if (q.includes('PAYMENT')) return 'How are payment methods performing?'
  if (q.includes('INACTIVE')) return 'Which customers have gone inactive?'
  if (q.includes('LIFETIME')) return 'Show customer lifetime value'
  if (q.includes('SATISFACTION') || q.includes('HIGH_SPEND'))
    return 'Which high-spend customers are dissatisfied?'
  if (q.includes('NEGATIVE')) return 'Which products have bad reviews?'
  if (q.includes('RATING') || q.includes('REVIEW')) return 'Show product rating summary'
  if (q.includes('DELAYED') || q.includes('SHIPMENT')) return 'Which shipments are delayed?'
  if (q.includes('MONTHLY') || q.includes('REVENUE')) return 'Show revenue trends'
  if (q.includes('CATEGORY')) return 'Break revenue down by category'
  if (q.includes('LOW_PERFORM')) return 'Which products are low performing?'
  if (q.includes('PRODUCT')) return 'Which products are selling the most?'
  if (q.includes('CANCEL')) return 'Which orders were cancelled?'
  if (q.includes('TREND')) return 'Show order volume trends'
  if (q.includes('FREQUENCY')) return 'How often do top customers purchase?'
  return 'Who are my biggest customers?'
}

export async function demoHandle(path: string, init?: RequestInit): Promise<Response> {
  await delay(path.includes('/ask') ? 780 : 280)
  const url = path.split('?')[0]

  if (url.endsWith('/auth/login')) {
    const body = init?.body ? JSON.parse(String(init.body)) : {}
    const username = String(body.username ?? 'operator')
    return json({ token: `replica.${btoa(username)}.aci` })
  }
  if (url.endsWith('/auth/register')) {
    return new Response('User registered successfully', { status: 201 })
  }
  if (url.endsWith('/ai/health')) {
    return new Response('AI Analytics Platform Running (replica)', { status: 200 })
  }
  if (url.endsWith('/ai/capabilities')) {
    return json(DEMO_CAPABILITIES)
  }
  if (url.endsWith('/ai/ask')) {
    const body = init?.body ? JSON.parse(String(init.body)) : {}
    return json(demoAsk(String(body.question ?? '')))
  }
  if (url.endsWith('/analytics/dashboard')) return json(DEMO_DASHBOARD)
  if (url.endsWith('/analytics/monthly-revenue')) return json(DEMO_MONTHLY)
  if (url.endsWith('/analytics/category-revenue')) return json(DEMO_CATEGORIES)
  if (url.endsWith('/analytics/top-customers')) return json(DEMO_CUSTOMERS)
  if (url.endsWith('/analytics/top-products')) return json(DEMO_PRODUCTS)
  if (url.endsWith('/analytics/inventory-alerts')) return json(DEMO_INVENTORY)
  if (url.endsWith('/analytics/customer-lifetime-value')) return json(CLV)
  if (url.endsWith('/analytics/inactive-customers')) return json(INACTIVE)

  return json({ timestamp: new Date().toISOString(), status: 404, message: 'Replica has no such route' }, 404)
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
