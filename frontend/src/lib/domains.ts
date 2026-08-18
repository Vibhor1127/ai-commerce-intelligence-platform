export type DomainId =
  | 'CUSTOMER'
  | 'PRODUCT'
  | 'REVENUE'
  | 'INVENTORY'
  | 'PAYMENT'
  | 'SHIPMENT'
  | 'REVIEW'
  | 'ORDER'
  | 'CUSTOMER_SATISFACTION'

export interface UniverseNode {
  id: DomainId
  label: string
  short: string
  position: [number, number, number]
  question: string
  color: string
}

export const UNIVERSE_NODES: UniverseNode[] = [
  {
    id: 'CUSTOMER',
    label: 'Customers',
    short: 'CUS',
    position: [-2.45, 0.32, 0.55],
    question: 'Who are my biggest customers?',
    color: '#B7D7DE',
  },
  {
    id: 'PRODUCT',
    label: 'Products',
    short: 'PRD',
    position: [2.4, 0.42, 0.35],
    question: 'Which products are selling the most?',
    color: '#C4B8E4',
  },
  {
    id: 'REVENUE',
    label: 'Revenue',
    short: 'REV',
    position: [0.1, 1.58, 1.05],
    question: 'Show revenue trends',
    color: '#B7D8C7',
  },
  {
    id: 'INVENTORY',
    label: 'Inventory',
    short: 'INV',
    position: [1.85, -0.58, -1.45],
    question: 'Which products need restocking?',
    color: '#DCC6A0',
  },
  {
    id: 'PAYMENT',
    label: 'Payments',
    short: 'PAY',
    position: [-1.9, -0.28, 1.5],
    question: 'Which payments failed?',
    color: '#A9D4D8',
  },
  {
    id: 'SHIPMENT',
    label: 'Shipments',
    short: 'SHP',
    position: [-2.05, 0.12, -1.5],
    question: 'Which shipments are delayed?',
    color: '#B4C6DC',
  },
  {
    id: 'REVIEW',
    label: 'Reviews',
    short: 'REVW',
    position: [1.7, 0.82, -1.3],
    question: 'Which products have bad reviews?',
    color: '#D4B8D0',
  },
]

export const UNIVERSE_LINKS: [DomainId, DomainId][] = [
  ['CUSTOMER', 'PAYMENT'],
  ['CUSTOMER', 'REVIEW'],
  ['CUSTOMER', 'REVENUE'],
  ['PRODUCT', 'INVENTORY'],
  ['PRODUCT', 'REVIEW'],
  ['PRODUCT', 'REVENUE'],
  ['PAYMENT', 'REVENUE'],
  ['SHIPMENT', 'CUSTOMER'],
  ['SHIPMENT', 'PRODUCT'],
  ['INVENTORY', 'REVENUE'],
]

export const RELATED: Record<string, string[]> = {
  CUSTOMER: ['ORDER', 'REVIEW', 'PAYMENT', 'CUSTOMER_SATISFACTION', 'REVENUE'],
  PRODUCT: ['INVENTORY', 'REVIEW', 'REVENUE', 'ORDER'],
  REVENUE: ['PRODUCT', 'ORDER', 'PAYMENT', 'CUSTOMER'],
  INVENTORY: ['PRODUCT'],
  PAYMENT: ['ORDER', 'CUSTOMER', 'REVENUE'],
  SHIPMENT: ['ORDER', 'CUSTOMER', 'PRODUCT'],
  REVIEW: ['PRODUCT', 'CUSTOMER', 'CUSTOMER_SATISFACTION'],
  ORDER: ['CUSTOMER', 'PRODUCT', 'PAYMENT', 'SHIPMENT', 'REVENUE'],
  CUSTOMER_SATISFACTION: ['CUSTOMER', 'REVIEW'],
}

export const PIPELINE_STAGES = [
  { id: 'question', label: 'Question', caption: 'Language received' },
  { id: 'intent', label: 'Intent Detection', caption: 'Entity + metric' },
  { id: 'capability', label: 'Capability Selection', caption: 'Handler resolved' },
  { id: 'engine', label: 'Analytics Engine', caption: 'Verified SQL' },
  { id: 'insight', label: 'Insight Generated', caption: 'Evidence locked' },
] as const

export function galaxyLayout(entities: string[]): { entity: string; position: [number, number, number] }[] {
  const radius = 2.65
  return entities.map((entity, i) => {
    const angle = (i / Math.max(entities.length, 1)) * Math.PI * 2 - Math.PI / 2
    const y = Math.sin(i * 1.618) * 0.42
    return {
      entity,
      position: [Math.cos(angle) * radius, y, Math.sin(angle) * radius],
    }
  })
}

export function relatedPairs(entities: string[]): [string, string][] {
  const set = new Set(entities.map((e) => e.toUpperCase()))
  const pairs: [string, string][] = []
  const seen = new Set<string>()
  for (const entity of set) {
    for (const other of RELATED[entity] ?? []) {
      if (!set.has(other)) continue
      const key = [entity, other].sort().join(':')
      if (seen.has(key)) continue
      seen.add(key)
      pairs.push([entity, other])
    }
  }
  return pairs
}

export function shortDomainLabel(entity: string): string {
  if (entity === 'CUSTOMER_SATISFACTION') return 'Satisfaction'
  return entityLabelLocal(entity)
}

function entityLabelLocal(entity: string): string {
  return entity
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function domainColor(entity?: string): string {
  const hit = UNIVERSE_NODES.find((n) => n.id === entity)
  if (hit) return hit.color
  if (entity === 'ORDER') return '#B8D8C4'
  if (entity === 'CUSTOMER_SATISFACTION') return '#E2C39A'
  return '#C8C2B8'
}
