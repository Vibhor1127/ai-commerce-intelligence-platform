import { useParams, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { api } from '@/services/api'
import { useToast } from '@/components/ui/Toast'

const CANCELABLE_STATUSES = ['PENDING', 'PROCESSING']

export function StoreOrderDetailPage() {
  const { id } = useParams()
  const orderId = Number(id)
  const navigate = useNavigate()
  const toast = useToast()
  const qc = useQueryClient()
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  const order = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => api.getOrder(orderId),
    enabled: Number.isFinite(orderId),
  })

  const cancelOrder = useMutation({
    mutationFn: () => api.cancelStoreOrder(orderId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['order', orderId] })
      qc.invalidateQueries({ queryKey: ['orders'] })
      toast.push('Order cancelled successfully')
      setShowCancelConfirm(false)
    },
    onError: (e: Error) => toast.push(e.message, 'err'),
  })

  if (order.isLoading) return <div className="skeleton h-40" />
  if (!order.data) return <p className="text-red-600">Order not found</p>

  const o = order.data
  const canCancel = CANCELABLE_STATUSES.includes(o.status ?? '')

  const statusColors: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-emerald-100 text-emerald-800',
    CANCELLED: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-purple-100 text-purple-800',
  }

  return (
    <div>
      <h1 className="font-storeDisplay text-3xl font-semibold text-store-ink">Order #{o.orderId}</h1>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
            statusColors[o.status ?? ''] ?? 'bg-gray-100 text-gray-800'
          }`}
        >
          {o.status}
        </span>
        <p className="text-sm text-store-mist">
          payment {o.paymentStatus ?? '—'} ({o.paymentMethod ?? '—'})
        </p>
      </div>
      <p className="mt-2 text-lg font-semibold text-store-clay">₹{o.totalAmount?.toLocaleString()}</p>

      <ul className="mt-6 space-y-2">
        {(o.items ?? []).map((item) => (
          <li
            key={`${item.productId}-${item.quantity}`}
            className="flex items-center justify-between rounded-xl border border-store-ink/8 bg-white p-4"
          >
            <div>
              <p className="font-medium">{item.productName}</p>
              <p className="text-xs text-store-mist">
                Qty {item.quantity} · ₹{item.price}
              </p>
            </div>

          </li>
        ))}
      </ul>

      {o.shippingAddress && (
        <div className="mt-6 rounded-xl border border-store-ink/8 bg-white p-4 text-sm">
          <p className="font-medium">Ship to</p>
          <p className="mt-1 text-store-mist">
            {o.shippingAddress.line1}
            {o.shippingAddress.line2 ? `, ${o.shippingAddress.line2}` : ''}
            <br />
            {o.shippingAddress.city}, {o.shippingAddress.state} {o.shippingAddress.pincode}
            <br />
            {o.shippingAddress.phone}
          </p>
        </div>
      )}

      {/* Cancel Order */}
      {canCancel && (
        <div className="mt-6">
          {!showCancelConfirm ? (
            <button
              type="button"
              onClick={() => setShowCancelConfirm(true)}
              className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Cancel Order
            </button>
          ) : (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => cancelOrder.mutate()}
                  disabled={cancelOrder.isPending}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {cancelOrder.isPending ? 'Cancelling…' : 'Yes, cancel order'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(false)}
                  className="rounded-lg border border-store-ink/15 px-4 py-2 text-sm text-store-mist"
                >
                  Keep order
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Back link */}
      <button
        type="button"
        onClick={() => navigate('/store/orders')}
        className="mt-8 text-sm text-store-clay underline"
      >
        ← Back to orders
      </button>
    </div>
  )
}
