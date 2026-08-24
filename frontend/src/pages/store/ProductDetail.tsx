import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { useState } from 'react'
import { Star, ShieldCheck, Truck, RefreshCw, MessageSquarePlus, User } from 'lucide-react'
import { api } from '@/services/api'
import { useToast } from '@/components/ui/Toast'
import { getProductImageUrl } from '@/lib/productImage'

export function StoreProductDetailPage() {
  const { id } = useParams()
  const productId = Number(id)
  const [qty, setQty] = useState(1)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [comment, setComment] = useState('')

  const toast = useToast()
  const qc = useQueryClient()

  const product = useQuery({
    queryKey: ['product', productId],
    queryFn: () => api.getProduct(productId),
    enabled: Number.isFinite(productId),
  })

  const reviews = useQuery({
    queryKey: ['product-reviews', productId],
    queryFn: () => api.getProductReviews(productId, 0),
    enabled: Number.isFinite(productId),
  })

  const add = useMutation({
    mutationFn: () => api.addToCart(productId, qty),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] })
      toast.push('Added to cart successfully', 'ok')
    },
    onError: (e: Error) => toast.push(e.message, 'err'),
  })

  const submitReview = useMutation({
    mutationFn: () => api.createReview({ productId, rating, comment: comment.trim() }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['product-reviews', productId] })
      qc.invalidateQueries({ queryKey: ['product', productId] })
      toast.push('Thank you! Your review has been submitted.', 'ok')
      setShowReviewForm(false)
      setComment('')
      setRating(5)
    },
    onError: (e: Error) => toast.push(e.message || 'Failed to submit review', 'err'),
  })

  if (product.isLoading) return <div className="skeleton h-80 rounded-3xl" />
  
  const p = product.data
  if (!p) return <p className="text-red-600">Product not found</p>

  const reviewList = reviews.data?.content ?? []
  const avgRating = p.avgRating || (reviewList.length > 0
    ? (reviewList.reduce((acc, r) => acc + (r.rating || 5), 0) / reviewList.length).toFixed(1)
    : '5.0')

  function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!comment.trim()) {
      toast.push('Please enter your review feedback', 'err')
      return
    }
    submitReview.mutate()
  }

  return (
    <div className="space-y-12 pb-12">
      {/* Product Overview Section */}
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Product Media */}
        <motion.div
          layoutId={`product-${p.productId}`}
          className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-store-sand/40 via-white to-store-paper shadow-sm border border-store-ink/5"
        >
          <img
            src={getProductImageUrl(p)}
            alt={p.productName}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = getProductImageUrl({ ...p, imageUrl: undefined })
            }}
          />
          {p.stock <= 5 && p.stock > 0 && (
            <span className="absolute top-4 left-4 rounded-full bg-amber-500/90 px-3 py-1 text-xs font-semibold text-white shadow">
              Only {p.stock} left in stock
            </span>
          )}
          {p.stock === 0 && (
            <span className="absolute top-4 left-4 rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold text-white shadow">
              Out of stock
            </span>
          )}
        </motion.div>

        {/* Product Details */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-store-sand px-3 py-1 text-xs font-medium uppercase tracking-wider text-store-mist">
                {p.categoryName}
              </span>
              <div className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span>{avgRating}</span>
                <span className="text-store-mist">({reviewList.length} verified reviews)</span>
              </div>
            </div>

            <h1 className="mt-3 font-storeDisplay text-3xl font-semibold text-store-ink leading-tight">
              {p.productName}
            </h1>

            <div className="mt-4 flex items-baseline gap-3">
              <p className="text-3xl font-bold text-store-clay">₹{p.price?.toLocaleString()}</p>
              <p className="text-xs text-store-mist">Inclusive of all taxes</p>
            </div>

            <div className="mt-4 border-t border-store-ink/8 pt-4">
              <p className="text-sm font-medium text-store-ink">Availability:</p>
              <p className="text-sm font-semibold text-emerald-700">
                {p.stock > 0 ? `In Stock (${p.stock} units available)` : 'Currently Unavailable'}
              </p>
            </div>

            {/* Quick trust badges */}
            <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-store-ink/8 bg-white p-4">
              <div className="flex flex-col items-center text-center">
                <ShieldCheck size={20} className="text-store-pine" />
                <span className="mt-1 text-[11px] font-medium text-store-ink">100% Genuine</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Truck size={20} className="text-store-clay" />
                <span className="mt-1 text-[11px] font-medium text-store-ink">Free Express Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <RefreshCw size={20} className="text-store-mist" />
                <span className="mt-1 text-[11px] font-medium text-store-ink">7-Day Easy Return</span>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="mt-8 border-t border-store-ink/8 pt-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-xl border border-store-ink/15 bg-white">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-2 text-sm font-semibold text-store-ink hover:bg-store-sand/50"
                  disabled={qty <= 1}
                >
                  -
                </button>
                <span className="px-3 py-2 text-sm font-medium text-store-ink min-w-[2rem] text-center">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty(Math.min(p.stock, qty + 1))}
                  className="px-3 py-2 text-sm font-semibold text-store-ink hover:bg-store-sand/50"
                  disabled={qty >= p.stock}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                disabled={add.isPending || p.stock < 1}
                onClick={() => add.mutate()}
                className="flex-1 rounded-xl bg-store-clay py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-store-clay/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {add.isPending ? 'Adding to Cart…' : `Add to Cart — ₹${((p.price ?? 0) * qty).toLocaleString()}`}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="rounded-3xl border border-store-ink/8 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-store-ink/8 pb-6">
          <div>
            <h2 className="font-storeDisplay text-2xl font-semibold text-store-ink">
              Customer Reviews & Ratings
            </h2>
            <div className="mt-1 flex items-center gap-2 text-sm text-store-mist">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= Math.round(Number(avgRating)) ? 'fill-amber-400' : 'text-store-ink/15'}
                  />
                ))}
              </div>
              <span className="font-bold text-store-ink">{avgRating} out of 5</span>
              <span>• Based on {reviewList.length} verified ratings</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="flex items-center gap-2 rounded-xl bg-store-pine px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-store-pine/90 shadow-sm"
          >
            <MessageSquarePlus size={16} />
            {showReviewForm ? 'Cancel Review' : 'Write a Review'}
          </button>
        </div>

        {/* Review Form Drawer */}
        {showReviewForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleReviewSubmit}
            className="mt-6 rounded-2xl border border-store-pine/20 bg-store-pine/5 p-6 space-y-4"
          >
            <p className="text-sm font-semibold text-store-ink">Share Your Product Experience</p>
            <div>
              <label className="block text-xs font-medium text-store-mist">Your Rating (1 to 5 Stars)</label>
              <div className="mt-1 flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 text-amber-400 transition hover:scale-110"
                  >
                    <Star
                      size={24}
                      className={
                        star <= (hoverRating ?? rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-store-ink/20'
                      }
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs font-semibold text-store-ink">
                  {rating === 5 ? '5 Stars — Excellent' : `${rating} Stars`}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-store-mist">Your Feedback & Review *</label>
              <textarea
                required
                rows={3}
                placeholder="What did you like or dislike about this product? How is the quality and performance?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-1 w-full rounded-xl border border-store-ink/15 p-3 text-sm focus:border-store-pine focus:outline-none bg-white"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="rounded-lg border border-store-ink/15 px-4 py-2 text-xs text-store-mist"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitReview.isPending}
                className="rounded-lg bg-store-pine px-6 py-2 text-xs font-semibold text-white disabled:opacity-50"
              >
                {submitReview.isPending ? 'Submitting…' : 'Post Review'}
              </button>
            </div>
          </motion.form>
        )}

        {/* Reviews List */}
        <div className="mt-8 space-y-4">
          {reviews.isLoading ? (
            <div className="skeleton h-24 rounded-2xl" />
          ) : reviewList.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-store-ink/15 p-8 text-center">
              <p className="text-sm font-medium text-store-ink">No customer reviews yet</p>
              <p className="mt-1 text-xs text-store-mist">Be the first verified customer to review this product!</p>
              <button
                type="button"
                onClick={() => setShowReviewForm(true)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-store-sand px-4 py-2 text-xs font-semibold text-store-ink hover:bg-store-sand/80"
              >
                <MessageSquarePlus size={14} /> Write the first review
              </button>
            </div>
          ) : (
            reviewList.map((rev) => (
              <div
                key={rev.reviewId}
                className="rounded-2xl border border-store-ink/8 bg-store-paper/30 p-5 transition hover:border-store-ink/15"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-store-sand text-store-ink font-semibold text-xs">
                      <User size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-store-ink">
                        {rev.customerName || 'Verified Buyer'}
                      </p>
                      <p className="text-[11px] text-store-mist">
                        {rev.reviewDate ? new Date(rev.reviewDate).toLocaleDateString() : 'Verified Purchase'}
                      </p>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={star <= rev.rating ? 'fill-amber-400' : 'text-store-ink/15'}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-sm text-store-ink/90 leading-relaxed">
                  {rev.reviewText}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
