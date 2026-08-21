import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'motion/react'
import { Check, CreditCard, MapPin, ShoppingBag, ClipboardCheck } from 'lucide-react'
import { api } from '@/services/api'
import { useToast } from '@/components/ui/Toast'
import type { AddressDTO, CartItem as CartItemType, OrderDTO } from '@/types/api'

const STEPS = [
  { key: 'cart', label: 'Cart Review', icon: ShoppingBag },
  { key: 'address', label: 'Address', icon: MapPin },
  { key: 'payment', label: 'Payment', icon: CreditCard },
  { key: 'summary', label: 'Summary', icon: ClipboardCheck },
  { key: 'confirm', label: 'Confirmation', icon: Check },
]

export function StoreCheckoutPage() {
  const [step, setStep] = useState(0)
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<string>('COD')
  const [result, setResult] = useState<OrderDTO | null>(null)

  const cart = useQuery({ queryKey: ['cart'], queryFn: () => api.getCart() })
  const addresses = useQuery({ queryKey: ['addresses'], queryFn: () => api.getAddresses() })

  if (cart.isLoading) return <div className="skeleton h-40" />
  if (!cart.data?.items?.length && !result) {
    return <p className="text-store-mist">Your cart is empty.</p>
  }

  const items = cart.data?.items ?? []
  const total = cart.data?.total ?? 0

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-storeDisplay text-3xl font-semibold text-store-ink">Checkout</h1>

      {/* Step Progress */}
      <div className="mt-6 flex items-center gap-1">
        {STEPS.map((s, i) => {
          const Icon = s.icon
          const isActive = i === step
          const isDone = i < step
          return (
            <div key={s.key} className="flex items-center gap-1 flex-1">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                  isDone
                    ? 'bg-store-pine text-white'
                    : isActive
                    ? 'bg-store-clay text-white'
                    : 'bg-store-sand text-store-mist'
                }`}
              >
                {isDone ? <Check size={12} /> : <Icon size={12} />}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-px flex-1 ${isDone ? 'bg-store-pine' : 'bg-store-ink/10'}`} />
              )}
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-store-mist">
        {STEPS.map((s) => (
          <span key={s.key} className={s.key === STEPS[step].key ? 'font-semibold text-store-clay' : ''}>
            {s.label}
          </span>
        ))}
      </div>

      {/* Step Content */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="cart" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <CartReviewStep items={items} onNext={() => setStep(1)} />
            </motion.div>
          )}
          {step === 1 && (
            <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <AddressStep
                addresses={addresses.data ?? []}
                selectedId={selectedAddressId}
                onSelect={setSelectedAddressId}
                onBack={() => setStep(0)}
                onNext={() => setStep(2)}
              />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <PaymentStep
                method={paymentMethod}
                onSelect={setPaymentMethod}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="summary" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <SummaryStep
                items={items}
                total={total}
                paymentMethod={paymentMethod}
                onBack={() => setStep(2)}
                onPlaceOrder={() => setStep(4)}
              />
            </motion.div>
          )}
          {step === 4 && (
            <motion.div key="confirm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <ConfirmationStep
                paymentMethod={paymentMethod}
                selectedAddressId={selectedAddressId}
                addresses={addresses.data ?? []}
                onResult={(o) => setResult(o)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ======================== Step Components ======================== */

function CartReviewStep({ items, onNext }: { items: CartItemType[]; onNext: () => void }) {
  const qc = useQueryClient()
  const toast = useToast()

  const update = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) => api.updateCartItem(id, quantity),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
    onError: (e: Error) => toast.push(e.message, 'err'),
  })

  const remove = useMutation({
    mutationFn: (id: number) => api.removeCartItem(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] })
      toast.push('Removed')
    },
  })

  return (
    <div className="space-y-3">
      <p className="text-sm text-store-mist">Review your cart items before proceeding.</p>
      {items.map((item) => (
        <div key={item.cartItemId} className="flex items-center justify-between rounded-xl border border-store-ink/8 bg-white p-4">
          <div>
            <p className="font-medium text-store-ink">{item.productName}</p>
            <p className="text-xs text-store-mist">₹{Number(item.unitPrice).toLocaleString()} each</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) => update.mutate({ id: item.cartItemId, quantity: Number(e.target.value) })}
              className="w-16 rounded border border-store-ink/15 px-2 py-1 text-sm"
            />
            <button type="button" onClick={() => remove.mutate(item.cartItemId)} className="text-xs text-red-600">
              Remove
            </button>
          </div>
        </div>
      ))}
      <div className="pt-4 flex justify-end">
        <button type="button" onClick={onNext} className="rounded-lg bg-store-clay px-6 py-2.5 text-sm font-semibold text-white">
          Continue to Address →
        </button>
      </div>
    </div>
  )
}

function AddressStep({
  addresses,
  selectedId,
  onSelect,
  onBack,
  onNext,
}: {
  addresses: AddressDTO[]
  selectedId: number | null
  onSelect: (id: number | null) => void
  onBack: () => void
  onNext: () => void
}) {
  const defaultAddr = addresses.find((a) => a.isDefault)

  function handleNext() {
    if (!selectedId && defaultAddr) {
      onSelect(defaultAddr.addressId)
    }
    onNext()
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-store-mist">Select a saved delivery address.</p>
      {addresses.length === 0 ? (
        <p className="text-sm text-store-mist">No saved addresses. Add one from your profile first.</p>
      ) : (
        <div className="space-y-2">
          {addresses.map((addr) => (
            <label
              key={addr.addressId}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${
                selectedId === addr.addressId || (!selectedId && addr.isDefault)
                  ? 'border-store-clay bg-store-clay/5'
                  : 'border-store-ink/8 bg-white'
              }`}
            >
              <input
                type="radio"
                name="address"
                checked={selectedId === addr.addressId || (!selectedId && addr.isDefault)}
                onChange={() => onSelect(addr.addressId)}
                className="mt-1"
              />
              <div className="text-sm">
                <p className="font-medium text-store-ink">
                  {addr.line1}
                  {addr.line2 ? `, ${addr.line2}` : ''}
                </p>
                <p className="text-store-mist">
                  {addr.city}, {addr.state} {addr.pincode}
                </p>
                <p className="text-store-mist">{addr.phone}</p>
                {addr.isDefault && <span className="text-[10px] text-store-clay">Default</span>}
              </div>
            </label>
          ))}
        </div>
      )}
      <div className="pt-4 flex justify-between">
        <button type="button" onClick={onBack} className="rounded-lg border border-store-ink/15 px-4 py-2 text-sm text-store-mist">
          ← Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={addresses.length > 0 && !selectedId && !defaultAddr}
          className="rounded-lg bg-store-clay px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          Continue to Payment →
        </button>
      </div>
    </div>
  )
}

function PaymentStep({
  method,
  onSelect,
  onBack,
  onNext,
}: {
  method: string
  onSelect: (m: string) => void
  onBack: () => void
  onNext: () => void
}) {
  const methods = [
    { value: 'COD', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
    { value: 'UPI', label: 'UPI', desc: 'Google Pay, PhonePe, etc.' },
    { value: 'CARD', label: 'Credit/Debit Card', desc: 'Visa, Mastercard, etc.' },
  ]

  return (
    <div className="space-y-4">
      <p className="text-sm text-store-mist">Choose a payment method (simulated).</p>
      <div className="space-y-2">
        {methods.map((m) => (
          <label
            key={m.value}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${
              method === m.value ? 'border-store-clay bg-store-clay/5' : 'border-store-ink/8 bg-white'
            }`}
          >
            <input type="radio" name="payment" checked={method === m.value} onChange={() => onSelect(m.value)} />
            <div>
              <p className="text-sm font-medium text-store-ink">{m.label}</p>
              <p className="text-xs text-store-mist">{m.desc}</p>
            </div>
          </label>
        ))}
      </div>
      <div className="pt-4 flex justify-between">
        <button type="button" onClick={onBack} className="rounded-lg border border-store-ink/15 px-4 py-2 text-sm text-store-mist">
          ← Back
        </button>
        <button type="button" onClick={onNext} className="rounded-lg bg-store-clay px-6 py-2.5 text-sm font-semibold text-white">
          Review Order →
        </button>
      </div>
    </div>
  )
}

function SummaryStep({
  items,
  total,
  paymentMethod,
  onBack,
  onPlaceOrder,
}: {
  items: CartItemType[]
  total: number
  paymentMethod: string
  onBack: () => void
  onPlaceOrder: () => void
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-store-mist">Review your order before placing it.</p>
      <div className="rounded-xl border border-store-ink/8 bg-white p-4 space-y-2">
        {items.map((item) => (
          <div key={item.cartItemId} className="flex justify-between text-sm">
            <span className="text-store-ink">
              {item.productName} × {item.quantity}
            </span>
            <span className="text-store-clay">₹{Number(item.lineTotal).toLocaleString()}</span>
          </div>
        ))}
        <div className="border-t border-store-ink/8 pt-2 flex justify-between text-sm">
          <span className="text-store-mist">Subtotal</span>
          <span>₹{Number(total).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-store-mist">Shipping</span>
          <span className="text-store-pine">Free</span>
        </div>
        <div className="border-t border-store-ink/8 pt-2 flex justify-between font-semibold">
          <span>Total</span>
          <span className="text-store-clay">₹{Number(total).toLocaleString()}</span>
        </div>
      </div>
      <p className="text-xs text-store-mist">Payment: {paymentMethod}</p>
      <div className="pt-4 flex justify-between">
        <button type="button" onClick={onBack} className="rounded-lg border border-store-ink/15 px-4 py-2 text-sm text-store-mist">
          ← Back
        </button>
        <button type="button" onClick={onPlaceOrder} className="rounded-lg bg-store-pine px-6 py-2.5 text-sm font-semibold text-white">
          Place Order →
        </button>
      </div>
    </div>
  )
}

function ConfirmationStep({
  paymentMethod,
  selectedAddressId,
  addresses,
  onResult,
}: {
  paymentMethod: string
  selectedAddressId: number | null
  addresses: AddressDTO[]
  onResult: (o: OrderDTO) => void
}) {
  const navigate = useNavigate()
  const toast = useToast()
  const qc = useQueryClient()
  const [started, setStarted] = useState(false)

  const addressId = selectedAddressId ?? addresses.find((a) => a.isDefault)?.addressId

  const checkout = useMutation({
    mutationFn: () =>
      api.checkout({
        paymentMethod,
        addressId,
      }),
    onSuccess: (order) => {
      qc.invalidateQueries({ queryKey: ['cart'] })
      qc.invalidateQueries({ queryKey: ['orders'] })
      onResult(order)
    },
    onError: (e: Error) => toast.push(e.message, 'err'),
  })

  // Auto-trigger the checkout when this step mounts
  useEffect(() => {
    if (!started && checkout.isIdle) {
      setStarted(true)
      checkout.mutate()
    }
  }, [started, checkout])

  if (checkout.isPending) {
    return (
      <div className="flex flex-col items-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-store-clay border-t-transparent" />
        <p className="mt-4 text-sm text-store-mist">Processing your order…</p>
      </div>
    )
  }

  if (checkout.isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-medium text-red-800">Order Failed</p>
        <p className="mt-1 text-sm text-red-600">{checkout.error.message}</p>
        <button
          type="button"
          onClick={() => checkout.mutate()}
          className="mt-4 rounded-lg bg-store-clay px-4 py-2 text-sm font-semibold text-white"
        >
          Retry
        </button>
      </div>
    )
  }

  // After success, show result
  const order = checkout.data
  if (!order) return null

  const isFailed = order.paymentStatus === 'FAILED'

  return (
    <div className="text-center space-y-4">
      <div className={`inline-flex h-16 w-16 items-center justify-center rounded-full ${isFailed ? 'bg-red-100' : 'bg-emerald-100'}`}>
        {isFailed ? (
          <span className="text-2xl">✕</span>
        ) : (
          <Check size={32} className="text-emerald-600" />
        )}
      </div>
      <h2 className="font-storeDisplay text-2xl font-semibold text-store-ink">
        {isFailed ? 'Payment Failed' : 'Order Confirmed!'}
      </h2>
      <p className="text-sm text-store-mist">
        {isFailed
          ? 'Your payment could not be processed. The order has been cancelled and your cart has been restored.'
          : `Order #${order.orderId} is now ${order.status}.`}
      </p>
      <div className="flex justify-center gap-3 pt-4">
        <button
          type="button"
          onClick={() => navigate(`/store/orders/${order.orderId}`)}
          className="rounded-lg bg-store-clay px-4 py-2 text-sm font-semibold text-white"
        >
          View Order
        </button>
        <button
          type="button"
          onClick={() => navigate('/store/products')}
          className="rounded-lg border border-store-ink/15 px-4 py-2 text-sm text-store-mist"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )
}
