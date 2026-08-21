import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { useState } from 'react'
import { api } from '@/services/api'
import { useToast } from '@/components/ui/Toast'

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
  const reviews = useQuery({
    queryKey: ['product-reviews', productId],
    queryFn: () => api.getProductReviews(productId),
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
  if (product.isError || !product.data) return <p className="text-red-600">Product not found</p>

  const p = product.data

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <motion.div
        layoutId={`product-${p.productId}`}
        className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-store-sand via-white to-store-paper"
      >
        {p.imageUrl ? (
          <img
            src={p.imageUrl}
            alt={p.productName}
            className="h-full w-full object-contain p-8"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextElementSibling?.classList.remove('hidden')
            }}
          />
        ) : null}
        <span className={`font-storeDisplay text-8xl text-store-ink/15 ${p.imageUrl ? 'hidden' : ''}`}>{p.productName.slice(0, 1)}</span>
      </motion.div>

      <div>
        <p className="text-xs uppercase tracking-wide text-store-mist">{p.categoryName}</p>
        <h1 className="mt-1 font-storeDisplay text-3xl font-semibold text-store-ink">{p.productName}</h1>
        <p className="mt-3 text-2xl font-semibold text-store-clay">₹{p.price?.toLocaleString()}</p>
        <p className="mt-2 text-sm text-store-mist">
          {p.avgRating?.toFixed?.(1) ?? '—'} ★ · {p.reviewCount ?? 0} reviews · {p.stock} in stock
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

        <section className="mt-10">
          <h2 className="font-storeDisplay text-xl font-semibold">Reviews</h2>
          <div className="mt-4 space-y-3">
            {(reviews.data?.content ?? []).length === 0 && (
              <p className="text-sm text-store-mist">No reviews yet.</p>
            )}
            {(reviews.data?.content ?? []).map((r) => (
              <div key={r.reviewId} className="rounded-xl border border-store-ink/8 bg-white p-4">
                <p className="text-sm font-medium text-store-ink">
                  {r.customerName} · {r.rating}★
                </p>
                <p className="mt-1 text-sm text-store-mist">{r.reviewText}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
