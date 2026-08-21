import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { api } from '@/services/api'
import { useToast } from '@/components/ui/Toast'

const CANCELABLE_STATUSES = ['PENDING', 'PROCESSING']

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-purple-100 text-purple-800',
}

export function StoreOrdersPage() {
  const qc = useQueryClient()
  const toast = useToast()
  const orders = useQuery({ queryKey: ['orders'], queryFn: () => api.getOrders(0) })

  const cancelOrder = useMutation({
    mutationFn: (orderId: number) => api.cancelStoreOrder(orderId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] })
      toast.push('Order cancelled')
    },
    onError: (e: Error) => toast.push(e.message, 'err'),
  })

  return (
    <div>
      <h1 className="font-storeDisplay text-3xl font-semibold text-store-ink">Your orders</h1>
      <div className="mt-6 space-y-3">
        {orders.isLoading && <div className="skeleton h-24" />}
        {(orders.data?.content ?? []).length === 0 && !orders.isLoading && (
          <p className="text-store-mist">No orders yet.</p>
        )}
        {(orders.data?.content ?? []).map((o, i) => (
          <motion.div
            key={o.orderId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <div className="flex items-center justify-between rounded-2xl border border-store-ink/8 bg-white p-4 hover:border-store-clay/40">
              <Link to={`/store/orders/${o.orderId}`} className="flex-1">
                <div className="flex items-center gap-3">
                  <p className="font-medium text-store-ink">Order #{o.orderId}</p>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      statusColors[o.status ?? ''] ?? 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {o.status}
                  </span>
                </div>
                <p className="text-xs text-store-mist">
                  {new Date(o.orderDate).toLocaleString()}
                </p>
              </Link>
              <div className="flex items-center gap-3">
                <p className="font-semibold text-store-clay">₹{o.totalAmount?.toLocaleString()}</p>
                {CANCELABLE_STATUSES.includes(o.status ?? '') && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Cancel this order?')) {
                        cancelOrder.mutate(o.orderId)
                      }
                    }}
                    disabled={cancelOrder.isPending}
                    className="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-40"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
