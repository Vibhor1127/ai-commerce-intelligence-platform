import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'

export function ConsoleReviewsPage() {
  const [minRating, setMinRating] = useState<number | undefined>()
  const reviews = useQuery({
    queryKey: ['admin-reviews', minRating],
    queryFn: () => api.getAdminReviews({ minRating, page: 0 }),
  })

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ivory">Reviews feed</h1>
          <p className="mono-label mt-1">Spot low ratings without asking the AI</p>
        </div>
        <select
          value={minRating ?? ''}
          onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : undefined)}
          className="rounded border border-white/10 bg-panel px-3 py-2 text-sm text-bone"
        >
          <option value="">All ratings</option>
          <option value="1">1+ stars</option>
          <option value="3">3+ stars</option>
          <option value="4">4+ stars</option>
          <option value="5">5 stars</option>
        </select>
      </div>

      {reviews.isLoading && <div className="console-skeleton mt-6 h-32" />}
      <div className="mt-6 space-y-3">
        {(reviews.data?.content ?? []).map((r) => (
          <div key={r.reviewId} className="holo-panel rounded-xl p-4">
            <span className="holo-edge" />
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-ivory">{r.productName}</p>
                <p className="text-xs text-mute">
                  {r.customerName} · {r.reviewDate}
                </p>
                <p className="mt-2 text-sm text-bone">{r.reviewText || '—'}</p>
              </div>
              <span className="shrink-0 text-amber">{r.rating}★</span>
            </div>
          </div>
        ))}
        {!reviews.isLoading && (reviews.data?.content?.length ?? 0) === 0 && (
          <p className="text-sm text-mute">No reviews match this filter</p>
        )}
      </div>
    </div>
  )
}
