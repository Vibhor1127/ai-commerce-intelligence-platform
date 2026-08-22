import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { api } from '@/services/api'
import { ArrowRight, Sparkles, Truck, ShieldCheck, Zap } from 'lucide-react'
import { getProductImageUrl } from '@/lib/productImage'
import type { ProductCard } from '@/types/api'

const DEFAULT_FEATURED: ProductCard[] = [
  {
    productId: 1,
    productName: 'Apex 750W Turbo Mixer Grinder (3 Stainless Steel Jars)',
    price: 3499,
    stock: 45,
    categoryName: 'Home & Kitchen',
    imageUrl: '/images/mixer-grinder.jpg',
    avgRating: 4.9,
  },
  {
    productId: 2,
    productName: 'Pro Match Size 5 Tournament Football',
    price: 1299,
    stock: 80,
    categoryName: 'Sports & Fitness',
    imageUrl: '/images/football.jpg',
    avgRating: 4.8,
  },
  {
    productId: 3,
    productName: 'HyperSpeed 4WD High-Speed Remote Control Offroad Car',
    price: 4999,
    stock: 25,
    categoryName: 'Toys & RC Vehicles',
    imageUrl: '/images/remote-car.jpg',
    avgRating: 4.9,
  },
]

export function StoreHomePage() {
  const products = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => api.getProducts({ size: 8 }),
  })
  const categories = useQuery({ queryKey: ['categories'], queryFn: () => api.getCategories() })

  const valueProps = [
    {
      icon: Zap,
      title: 'Real-Time Inventory',
      description: 'Live transactional synchronization direct from enterprise warehouses.',
    },
    {
      icon: Truck,
      title: 'Priority Dispatch',
      description: 'Streamlined order routing with instant fulfillment tracking.',
    },
    {
      icon: ShieldCheck,
      title: 'Verified Quality',
      description: 'Authentic products backed by genuine customer verified reviews.',
    },
  ]

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Banner with Radial Glow */}
      <section className="relative overflow-hidden rounded-3xl bg-store-ink px-6 py-14 text-store-paper shadow-2xl md:px-12 md:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(196,92,38,0.4),transparent_50%)]" />
        <div className="pointer-events-none absolute -bottom-10 right-10 h-64 w-64 rounded-full bg-store-pine/20 blur-3xl" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
            <Sparkles size={14} className="text-amber-300" />
            <span>Next-Gen Commerce Experience</span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl text-white tracking-tight">
            Curated Quality, Powered by Intelligence
          </h1>
          <p className="mt-4 text-base text-store-paper/80 md:text-lg leading-relaxed">
            Discover handpicked collections with instantaneous checkout, live parcel tracking, and real-time inventory confidence.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/store/products"
              className="inline-flex items-center gap-2 rounded-xl bg-store-clay px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-store-clay/90 hover:shadow-store-clay/20 active:scale-95"
            >
              <span>Explore Collection</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/store/orders"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/15 active:scale-95"
            >
              Track Existing Orders
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Value Propositions */}
      <section className="grid gap-4 sm:grid-cols-3">
        {valueProps.map((v, i) => {
          const Icon = v.icon
          return (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="rounded-2xl border border-store-ink/8 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-store-sand/60 text-store-clay">
                <Icon size={20} />
              </div>
              <h3 className="mt-4 font-semibold text-store-ink">{v.title}</h3>
              <p className="mt-1 text-sm text-store-ink/65 leading-relaxed">{v.description}</p>
            </motion.div>
          )
        })}
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-store-ink">Shop by Category</h2>
            <p className="text-sm text-store-ink/60 mt-0.5">Explore structured verticals curated for you</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {(categories.data ?? []).map((c) => (
            <Link
              key={c.categoryId}
              to={`/store/products?category=${c.categoryId}`}
              className="rounded-full border border-store-ink/10 bg-white px-5 py-2.5 text-sm font-medium text-store-ink shadow-sm transition-all hover:border-store-clay hover:bg-store-clay hover:text-white active:scale-95"
            >
              {c.categoryName}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Grid with Motion */}
      <section>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-store-ink">Featured Arrivals</h2>
            <p className="text-sm text-store-ink/60 mt-0.5">Trending items with active demand</p>
          </div>
          <Link
            to="/store/products"
            className="inline-flex items-center gap-1 text-sm font-semibold text-store-clay hover:underline"
          >
            <span>View all catalog</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-72 rounded-2xl" />
            ))}

          {((products.data?.content && products.data.content.length > 0) ? products.data.content : DEFAULT_FEATURED).map((p, i) => (
            <motion.div
              key={p.productId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              whileHover={{ y: -4, transition: { duration: 0.15 } }}
            >
              <Link
                to={`/store/products/${p.productId}`}
                className="group flex h-full flex-col justify-between rounded-2xl border border-store-ink/8 bg-white p-4 shadow-sm transition-all hover:shadow-xl hover:border-store-clay/30"
              >
                <div>
                  <div className="relative flex h-48 items-center justify-center rounded-xl bg-gradient-to-br from-store-sand/40 to-store-paper text-store-mist overflow-hidden">
                    <img
                      src={getProductImageUrl(p)}
                      alt={p.productName}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = getProductImageUrl({ ...p, imageUrl: undefined })
                      }}
                    />
                    {p.categoryName && (
                      <span className="absolute top-2 left-2 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-store-ink/80 backdrop-blur shadow-sm">
                        {p.categoryName}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3.5 line-clamp-2 text-sm font-semibold text-store-ink group-hover:text-store-clay transition-colors">
                    {p.productName}
                  </h3>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-store-ink/5 pt-3">
                  <div>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-store-ink/40">Price</span>
                    <p className="font-semibold text-store-clay text-base">
                      ₹{p.price?.toLocaleString()}
                    </p>
                  </div>
                  <span className="rounded-lg bg-store-sand/50 px-2.5 py-1 text-xs font-semibold text-store-ink/70 group-hover:bg-store-clay group-hover:text-white transition-colors">
                    Details &rarr;
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
