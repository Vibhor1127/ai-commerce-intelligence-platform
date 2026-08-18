import {
  Boxes,
  CreditCard,
  HeartCrack,
  Package,
  ShoppingBag,
  Star,
  Truck,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  CUSTOMER: Users,
  CUSTOMER_SATISFACTION: HeartCrack,
  PRODUCT: Package,
  REVENUE: Wallet,
  INVENTORY: Boxes,
  PAYMENT: CreditCard,
  SHIPMENT: Truck,
  REVIEW: Star,
  ORDER: ShoppingBag,
}

const TONES: Record<string, string> = {
  CUSTOMER: 'text-cyan',
  CUSTOMER_SATISFACTION: 'text-amber',
  PRODUCT: 'text-violet',
  REVENUE: 'text-emerald',
  INVENTORY: 'text-amber',
  PAYMENT: 'text-cyan',
  SHIPMENT: 'text-violet',
  REVIEW: 'text-amber',
  ORDER: 'text-emerald',
}

export function entityIcon(entity?: string): LucideIcon {
  if (!entity) return Wallet
  return ICONS[entity.toUpperCase()] ?? Wallet
}

export function entityTone(entity?: string): string {
  if (!entity) return 'text-cyan'
  return TONES[entity.toUpperCase()] ?? 'text-cyan'
}
