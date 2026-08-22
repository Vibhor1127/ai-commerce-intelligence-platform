import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { useState } from 'react'
import { api } from '@/services/api'
import { useToast } from '@/components/ui/Toast'

import { getProductImageUrl } from '@/lib/productImage'
import type { ProductCard } from '@/types/api'

const DEFAULT_CATALOG: Record<number, ProductCard> = {
  1: {
    productId: 1,
    productName: 'Apex 750W Turbo Mixer Grinder (3 Stainless Steel Jars)',
    price: 3499,
    stock: 45,
    categoryName: 'Home & Kitchen',
    imageUrl: '/images/mixer-grinder.jpg',
    avgRating: 4.9,
  },
  2: {
    productId: 2,
    productName: 'Pro Match Size 5 Tournament Football',
    price: 1299,
    stock: 80,
    categoryName: 'Sports & Fitness',
    imageUrl: '/images/football.jpg',
    avgRating: 4.8,
  },
  3: {
    productId: 3,
    productName: 'HyperSpeed 4WD High-Speed Remote Control Offroad Car',
    price: 4999,
    stock: 25,
    categoryName: 'Toys & RC Vehicles',
    imageUrl: '/images/remote-car.jpg',
    avgRating: 4.9,
  },
}

export function StoreProductDetailPage() {
  const { id } = useParams()
  const productId = Number(id)
  const [qty, setQty] = useState(1)
  const toast = useToast()
  const qc = useQueryClient()

  const product = useQuery({
    queryKey: ['product', productId],
    queryFn: () => api.getProduct(productId),
    enabled: Number.isFinite(productId),
  })
  const add = useMutation({
    mutationFn: () => api.addToCart(productId, qty),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] })
      toast.push('Added to cart')
    },
    onError: (e: Error) => toast.push(e.message, 'err'),
  })

  if (product.isLoading) return <div className="skeleton h-64" />
  
  const p = product.data || DEFAULT_CATALOG[productId]
  if (!p) return <p className="text-red-600">Product not found</p>

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <motion.div
        layoutId={`product-${p.productId}`}
        className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-store-sand/40 via-white to-store-paper shadow-sm border border-store-ink/5"
      >
        <img
          src={getProductImageUrl(p)}
          alt={p.productName}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = getProductImageUrl({ ...p, imageUrl: undefined })
          }}
        />
      </motion.div>

      <div>
        <p className="text-xs uppercase tracking-wide text-store-mist">{p.categoryName}</p>
        <h1 className="mt-1 font-storeDisplay text-3xl font-semibold text-store-ink">{p.productName}</h1>
        <p className="mt-3 text-2xl font-semibold text-store-clay">₹{p.price?.toLocaleString()}</p>
        <p className="mt-2 text-sm text-store-mist">
          {p.stock} in stock
        </p>

        <div className="mt-6 flex items-center gap-3">
          <input
            type="number"
            min={1}
            max={p.stock}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-20 rounded-lg border border-store-ink/15 px-3 py-2 text-sm"
          />
          <button
            type="button"
            disabled={add.isPending || p.stock < 1}
            onClick={() => add.mutate()}
            className="rounded-lg bg-store-pine px-5 py-2.5 text-sm font-semibold text-white hover:bg-store-pine/90 disabled:opacity-50"
          >
            {add.isPending ? 'Adding…' : 'Add to cart'}
          </button>
        </div>


      </div>
    </div>
  )
}
