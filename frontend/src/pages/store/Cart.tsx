import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'
import { useToast } from '@/components/ui/Toast'

export function StoreCartPage() {
  const qc = useQueryClient()
  const toast = useToast()
  const navigate = useNavigate()
  const cart = useQuery({ queryKey: ['cart'], queryFn: () => api.getCart() })

  const update = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      api.updateCartItem(id, quantity),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
    onError: (e: Error) => toast.push(e.message, 'err'),
  })

  const remove = useMutation({
    mutationFn: (id: number) => api.removeCartItem(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] })
      toast.push('Removed from cart')
    },
  })

  if (cart.isLoading) return <div className="skeleton h-40" />

  const items = cart.data?.items ?? []

  return (
    <div>
      <h1 className="font-storeDisplay text-3xl font-semibold text-store-ink">Your cart</h1>
      {items.length === 0 ? (
        <p className="mt-6 text-store-mist">
          Cart is empty.{' '}
          <Link to="/store/products" className="text-store-clay underline">
            Browse products
          </Link>
        </p>
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_280px]">
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.cartItemId}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-store-ink/8 bg-white p-4"
              >
                <div>
                  <p className="font-medium text-store-ink">{item.productName}</p>
                  <p className="text-sm text-store-mist">₹{Number(item.unitPrice).toLocaleString()} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      update.mutate({ id: item.cartItemId, quantity: Number(e.target.value) })
                    }
                    className="w-16 rounded border border-store-ink/15 px-2 py-1 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => remove.mutate(item.cartItemId)}
                    className="text-sm text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <aside className="h-fit rounded-2xl border border-store-ink/8 bg-white p-5">
            <p className="text-sm text-store-mist">Total</p>
            <p className="mt-1 text-2xl font-semibold text-store-ink">
              ₹{Number(cart.data?.total ?? 0).toLocaleString()}
            </p>
            <button
              type="button"
              onClick={() => navigate('/store/checkout')}
              className="mt-4 w-full rounded-lg bg-store-clay py-2.5 text-sm font-semibold text-white"
            >
              Checkout
            </button>
          </aside>
        </div>
      )}
    </div>
  )
}
