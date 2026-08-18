import {
  Users,
  Package,
  Boxes,
  CreditCard,
  Truck,
  Star,
  DollarSign,
  ShoppingCart,
  Smile,
  Activity,
  type LucideIcon,
} from 'lucide-react'

export function entityIcon(entity: string): LucideIcon {
  const norm = entity.toUpperCase()
  switch (norm) {
    case 'CUSTOMER':
      return Users
    case 'PRODUCT':
      return Package
    case 'INVENTORY':
      return Boxes
    case 'PAYMENT':
      return CreditCard
    case 'SHIPMENT':
      return Truck
    case 'REVIEW':
      return Star
    case 'REVENUE':
      return DollarSign
    case 'ORDER':
      return ShoppingCart
    case 'CUSTOMER_SATISFACTION':
      return Smile
    default:
      return Activity
  }
}
