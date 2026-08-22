/**
 * Resolves high quality product imagery based on product image URL, product title, or category.
 */

export const DEFAULT_PRODUCT_IMAGES: Record<string, string> = {
  'mixer-grinder': '/images/mixer-grinder.jpg',
  'football': '/images/football.jpg',
  'remote-car': '/images/remote-car.jpg',
}

export function getProductImageUrl(product?: {
  productName?: string
  name?: string
  imageUrl?: string | null
  categoryName?: string
  productId?: number
}): string {
  if (!product) return '/images/mixer-grinder.jpg'

  // If explicit valid image URL provided
  if (product.imageUrl && product.imageUrl.trim() !== '') {
    return product.imageUrl
  }

  const name = (product.productName || product.name || '').toLowerCase()
  const cat = (product.categoryName || '').toLowerCase()

  // Mixer Grinder matching
  if (
    name.includes('mixer') ||
    name.includes('grind') ||
    name.includes('blender') ||
    name.includes('juicer') ||
    cat.includes('kitchen') ||
    cat.includes('appliance')
  ) {
    return '/images/mixer-grinder.jpg'
  }

  // Football / Soccer matching
  if (
    name.includes('foot') ||
    name.includes('ball') ||
    name.includes('soccer') ||
    name.includes('fifa') ||
    cat.includes('sport') ||
    cat.includes('fitness')
  ) {
    return '/images/football.jpg'
  }

  // Remote Car / RC Car matching
  if (
    name.includes('remote') ||
    name.includes('car') ||
    name.includes('rc') ||
    name.includes('truck') ||
    name.includes('toy') ||
    name.includes('vehicle') ||
    cat.includes('toy') ||
    cat.includes('game')
  ) {
    return '/images/remote-car.jpg'
  }

  // Fallback by ID cycling if name doesn't match
  const id = product.productId || 1
  const images = ['/images/mixer-grinder.jpg', '/images/football.jpg', '/images/remote-car.jpg']
  return images[id % images.length]
}
