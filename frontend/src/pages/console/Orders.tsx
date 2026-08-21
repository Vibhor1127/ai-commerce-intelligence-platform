import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'motion/react'
import { Search, ChevronDown, ChevronUp, Clock, ArrowRight } from 'lucide-react'
import { api } from '@/services/api'
import { useToast } from '@/components/ui/Toast'
import type { OrderStatus, OrderStatusHistoryDTO, RecentOrderDTO } from '@/types/api'

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'text-amber border-amber/30 bg-amber/10',
  PROCESSING: 'text-cyan border-cyan/30 bg-cyan/10',
  COMPLETED: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  CANCELLED: 'text-red-400 border-red-500/30 bg-red-500/10',
  REFUNDED: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
}

export function ConsoleOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const toast = useToast()
  const qc = useQueryClient()

  const orders = useQuery({
    queryKey: ['admin-orders', statusFilter, search, page],
    queryFn: () =>
      api.getAdminOrders({
        status: statusFilter || undefined,
        search: search || undefined,
        page,
      }),
  })

  const history = useQuery({
    queryKey: ['order-history', expandedId],
    queryFn: () => api.getOrderHistory(expandedId!),
    enabled: expandedId !== null,
  })

  const transitions = useQuery({
    queryKey: ['order-transitions', expandedId],
    queryFn: () => api.getValidTransitions(expandedId!),
    enabled: expandedId !== null,
  })

  const updateStatus = useMutation({
    mutationFn: ({ orderId, newStatus, note }: { orderId: number; newStatus: OrderStatus; note?: string }) =>
      api.updateOrderStatus(orderId, { newStatus, note }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-orders'] })
      qc.invalidateQueries({ queryKey: ['order-history'] })
      qc.invalidateQueries({ queryKey: ['order-transitions'] })
      toast.push('Order status updated')
    },
    onError: (e: Error) => toast.push(e.message, 'err'),
  })

  function toggleExpand(orderId: number) {
    setExpandedId(expandedId === orderId ? null : orderId)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ivory">Order Management</h1>
        <p className="mono-label mt-1">Update status, search, and view audit trail</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            onKeyDown={(e) => e.key === 'Enter' && setPage(0)}
            placeholder="Search by order ID or customer name…"
            className="w-full rounded-lg border border-white/10 bg-panel pl-9 pr-3 py-2 text-sm text-ivory"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0) }}
          className="rounded-lg border border-white/10 bg-panel px-3 py-2 text-sm text-bone"
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="REFUNDED">Refunded</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-panel text-mute">
            <tr>
              <th className="px-3 py-2" />
              <th className="px-3 py-2">Order</th>
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.isLoading && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-mute">Loading…</td>
              </tr>
            )}
            {!orders.isLoading && (orders.data?.content?.length ?? 0) === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-mute">No orders found</td>
              </tr>
            )}
            {(orders.data?.content ?? []).map((o: RecentOrderDTO, i: number) => (
              <motion.tr
                key={o.orderId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="border-t border-white/5 hover:bg-white/[0.02]"
              >
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => toggleExpand(o.orderId)}
                    className="text-mute hover:text-cyan"
                  >
                    {expandedId === o.orderId ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </td>
                <td className="px-3 py-2 text-cyan font-mono">#{o.orderId}</td>
                <td className="px-3 py-2 text-ivory">{o.customerName}</td>
                <td className="px-3 py-2">₹{o.totalAmount?.toLocaleString()}</td>
                <td className="px-3 py-2">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-3 py-2 text-mute">
                  {o.orderDate ? new Date(o.orderDate).toLocaleString() : '—'}
                </td>
                <td className="px-3 py-2">
                  <StatusSelect
                    orderId={o.orderId}
                    validTransitions={transitions.data}
                    expandedId={expandedId}
                    isPending={updateStatus.isPending}
                    onTransition={(newStatus) =>
                      updateStatus.mutate({ orderId: o.orderId, newStatus })
                    }
                  />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expanded Status History */}
      <AnimatePresence>
        {expandedId !== null && history.data && history.data.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="holo-panel rounded-xl p-5">
              <span className="holo-edge" />
              <p className="text-sm font-semibold text-bone mb-3">
                Status History — Order #{expandedId}
              </p>
              <div className="space-y-0">
                {history.data.map((h: OrderStatusHistoryDTO, idx: number) => (
                  <div key={h.historyId} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan/20 text-cyan">
                        <Clock size={12} />
                      </div>
                      {idx < history.data.length - 1 && (
                        <div className="w-px flex-1 bg-white/10 my-1" />
                      )}
                    </div>
                    <div className="pb-4 flex-1">
                      <div className="flex items-center gap-2 text-xs">
                        {h.fromStatus && (
                          <>
                            <StatusBadge status={h.fromStatus} small />
                            <ArrowRight size={10} className="text-mute" />
                          </>
                        )}
                        <StatusBadge status={h.toStatus} small />
                      </div>
                      <p className="text-[11px] text-mute mt-0.5">
                        {h.changedBy ? `by ${h.changedBy}` : 'system'} ·{' '}
                        {new Date(h.changedAt).toLocaleString()}
                      </p>
                      {h.note && <p className="text-xs text-bone mt-0.5">{h.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {orders.data && orders.data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-cyan disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-mute">
            Page {page + 1} / {orders.data.totalPages}
          </span>
          <button
            type="button"
            disabled={page + 1 >= orders.data.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-cyan disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status, small }: { status: string; small?: boolean }) {
  const colors = STATUS_COLORS[status] || 'text-bone border-white/20 bg-white/5'
  return (
    <span
      className={`inline-flex items-center rounded-full border font-mono ${colors} ${
        small ? 'px-1.5 py-0 text-[9px]' : 'px-2 py-0.5 text-[10px] uppercase tracking-wider'
      }`}
    >
      {status}
    </span>
  )
}

function StatusSelect({
  orderId,
  validTransitions,
  expandedId,
  isPending,
  onTransition,
}: {
  orderId: number
  validTransitions?: OrderStatus[]
  expandedId: number | null
  isPending: boolean
  onTransition: (status: OrderStatus) => void
}) {
  // Only show the select if this order is expanded and has valid transitions
  const available = expandedId === orderId ? (validTransitions ?? []) : []
  if (available.length === 0) return null

  return (
    <select
      value=""
      onChange={(e) => {
        if (e.target.value) {
          onTransition(e.target.value as OrderStatus)
        }
      }}
      disabled={isPending}
      className="rounded border border-white/10 bg-void px-2 py-1 text-xs text-cyan disabled:opacity-40"
    >
      <option value="">Change status…</option>
      {available.map((s) => (
        <option key={s} value={s}>
          → {s}
        </option>
      ))}
    </select>
  )
}
