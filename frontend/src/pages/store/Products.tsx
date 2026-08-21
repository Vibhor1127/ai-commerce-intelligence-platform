import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { useState } from 'react'
import { api } from '@/services/api'

export function StoreProductsPage() {
  const [params, setParams] = useSearchParams()
  const category = params.get('category') ? Number(params.get('category')) : undefined
  const [search, setSearch] = useState(params.get('search') || '')
  const [page, setPage] = useState(0)

  const categories = useQuery({ queryKey: ['categories'], queryFn: () => api.getCategories() })
  const products = useQuery({
    queryKey: ['products', category, search, page],
    queryFn: () => api.getProducts({ category, search: search || undefined, page, size: 12 }),
  })

  return (
    <div>
      <h1 className="font-storeDisplay text-3xl font-semibold text-store-ink">Products</h1>
      <p className="mt-1 text-sm text-store-mist">Browse, search, and filter the catalog.</p>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && setPage(0)}
          placeholder="Search products…"
          className="w-full rounded-lg border border-store-ink/15 bg-white px-3 py-2 text-sm md:max-w-sm"
        />
        <select
          value={category ?? ''}
          onChange={(e) => {
            const v = e.target.value
            const next = new URLSearchParams(params)
            if (v) next.set('category', v)
            else next.delete('category')
            setParams(next)
            setPage(0)
          }}
          className="rounded-lg border border-store-ink/15 bg-white px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {(categories.data ?? []).map((c) => (
            <option key={c.categoryId} value={c.categoryId}>
              {c.categoryName}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.isLoading &&
          Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-52" />)}
        {products.isError && (
          <p className="text-sm text-red-600">Could not load products. Is the API running?</p>
        )}
        {(products.data?.content ?? []).map((p, i) => (
          <motion.div
            key={p.productId}
            layoutId={`product-${p.productId}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Link
              to={`/store/products/${p.productId}`}
              className="block h-full rounded-2xl border border-store-ink/8 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-store-sand/70 to-store-paper overflow-hidden">
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.productName}
                    className="h-full w-full object-contain p-2"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                ) : null}
                <span className={`font-display text-3xl font-bold text-store-clay/20 ${p.imageUrl ? 'hidden' : ''}`}>{p.productName.slice(0, 1)}</span>
                {p.categoryName && (
                  <span className="absolute top-2 left-2 rounded-md bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-store-ink/80 backdrop-blur">
                    {p.categoryName}
                  </span>
                )}
              </div>
              <p className="text-xs uppercase tracking-wide text-store-mist mt-2">{p.categoryName}</p>
              <h3 className="mt-1 font-medium text-store-ink">{p.productName}</h3>
              <div className="mt-4 flex items-end justify-between">
                <p className="text-lg font-semibold text-store-clay">₹{p.price?.toLocaleString()}</p>
                <p className="text-xs text-store-mist">
                  {p.avgRating?.toFixed?.(1) ?? '—'} ★ · {p.stock} in stock
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {products.data && products.data.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-store-ink/15 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-store-mist">
            Page {page + 1} / {products.data.totalPages}
          </span>
          <button
            type="button"
            disabled={page + 1 >= products.data.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-store-ink/15 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
