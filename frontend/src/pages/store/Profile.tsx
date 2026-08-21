import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'motion/react'
import { User, MapPin, Package, Plus, Pencil, Trash2, Star } from 'lucide-react'
import { api } from '@/services/api'
import { useToast } from '@/components/ui/Toast'
import type { AddressDTO } from '@/types/api'

const profileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().optional(),
  city: z.string().min(2),
})

type ProfileForm = z.infer<typeof profileSchema>

const TABS = [
  { key: 'details', label: 'Personal Details', icon: User },
  { key: 'addresses', label: 'Saved Addresses', icon: MapPin },
  { key: 'orders', label: 'Recent Orders', icon: Package },
] as const

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-purple-100 text-purple-800',
}

export function StoreProfilePage() {
  const [activeTab, setActiveTab] = useState<string>('details')

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-storeDisplay text-3xl font-semibold text-store-ink">My Account</h1>

      {/* Tab Bar */}
      <div className="mt-6 flex gap-1 rounded-lg bg-store-sand p-1">
        {TABS.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition ${
                activeTab === t.key ? 'bg-white text-store-ink shadow-sm' : 'text-store-mist'
              }`}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          {activeTab === 'details' && (
            <motion.div key="details" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <PersonalDetailsTab />
            </motion.div>
          )}
          {activeTab === 'addresses' && (
            <motion.div key="addresses" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <AddressesTab />
            </motion.div>
          )}
          {activeTab === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <RecentOrdersTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ======================== Personal Details ======================== */

function PersonalDetailsTab() {
  const toast = useToast()
  const qc = useQueryClient()
  const profile = useQuery({ queryKey: ['profile'], queryFn: () => api.getProfile() })
  const form = useForm<ProfileForm>({ resolver: zodResolver(profileSchema) })

  useEffect(() => {
    if (profile.data) {
      form.reset({
        firstName: profile.data.firstName,
        lastName: profile.data.lastName || '',
        city: profile.data.city,
      })
    }
  }, [profile.data, form])

  const save = useMutation({
    mutationFn: (data: ProfileForm) => api.updateProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] })
      toast.push('Profile updated')
    },
    onError: (e: Error) => toast.push(e.message, 'err'),
  })

  if (profile.isLoading) return <div className="skeleton h-40" />

  return (
    <div className="rounded-xl border border-store-ink/8 bg-white p-6">
      <p className="text-sm font-medium text-store-ink">Personal Information</p>
      <p className="text-xs text-store-mist">{profile.data?.email}</p>
      <form className="mt-4 space-y-3" onSubmit={form.handleSubmit((d) => save.mutate(d))}>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs text-store-mist">
            First name
            <input {...form.register('firstName')} className="mt-1 w-full rounded-lg border border-store-ink/15 px-3 py-2 text-sm" />
          </label>
          <label className="block text-xs text-store-mist">
            Last name
            <input {...form.register('lastName')} className="mt-1 w-full rounded-lg border border-store-ink/15 px-3 py-2 text-sm" />
          </label>
        </div>
        <label className="block text-xs text-store-mist">
          City
          <input {...form.register('city')} className="mt-1 w-full rounded-lg border border-store-ink/15 px-3 py-2 text-sm" />
        </label>
        <button type="submit" className="w-full rounded-lg bg-store-clay py-2.5 text-sm font-semibold text-white">
          Save Changes
        </button>
      </form>
    </div>
  )
}

/* ======================== Addresses ======================== */

function AddressesTab() {
  const toast = useToast()
  const qc = useQueryClient()
  const addresses = useQuery({ queryKey: ['addresses'], queryFn: () => api.getAddresses() })
  const [editing, setEditing] = useState<number | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.deleteAddress(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['addresses'] })
      toast.push('Address deleted')
    },
    onError: (e: Error) => toast.push(e.message, 'err'),
  })

  const setDefaultMut = useMutation({
    mutationFn: (id: number) => api.setDefaultAddress(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['addresses'] })
      toast.push('Default address updated')
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-store-ink">Delivery Addresses</p>
        <button
          type="button"
          onClick={() => { setShowAdd(true); setEditing(null) }}
          className="flex items-center gap-1 rounded-lg bg-store-clay px-3 py-1.5 text-xs font-semibold text-white"
        >
          <Plus size={12} /> Add Address
        </button>
      </div>

      {(showAdd || editing !== null) && (
        <AddressForm
          existing={editing !== null ? addresses.data?.find((a) => a.addressId === editing) : undefined}
          onClose={() => { setShowAdd(false); setEditing(null) }}
          onSuccess={() => {
            qc.invalidateQueries({ queryKey: ['addresses'] })
            setShowAdd(false)
            setEditing(null)
          }}
        />
      )}

      {addresses.isLoading && <div className="skeleton h-24" />}

      {(addresses.data ?? []).length === 0 && !addresses.isLoading && !showAdd && (
        <p className="text-sm text-store-mist">No saved addresses yet.</p>
      )}

      <div className="space-y-2">
        {(addresses.data ?? []).map((addr) => (
          <div
            key={addr.addressId}
            className={`rounded-xl border p-4 ${addr.isDefault ? 'border-store-clay bg-store-clay/5' : 'border-store-ink/8 bg-white'}`}
          >
            <div className="flex items-start justify-between">
              <div className="text-sm">
                <p className="font-medium text-store-ink">
                  {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}
                </p>
                <p className="text-store-mist">{addr.city}, {addr.state} {addr.pincode}</p>
                <p className="text-store-mist">{addr.phone}</p>
                {addr.isDefault && <span className="text-[10px] font-semibold text-store-clay">Default</span>}
              </div>
              <div className="flex gap-1">
                {!addr.isDefault && (
                  <button
                    type="button"
                    onClick={() => setDefaultMut.mutate(addr.addressId)}
                    className="rounded p-1 text-store-mist hover:text-store-clay"
                    title="Set as default"
                  >
                    <Star size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => { setEditing(addr.addressId); setShowAdd(false) }}
                  className="rounded p-1 text-store-mist hover:text-store-clay"
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => { if (window.confirm('Delete this address?')) deleteMut.mutate(addr.addressId) }}
                  className="rounded p-1 text-store-mist hover:text-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AddressForm({
  existing,
  onClose,
  onSuccess,
}: {
  existing?: AddressDTO
  onClose: () => void
  onSuccess: () => void
}) {
  const toast = useToast()
  const [line1, setLine1] = useState(existing?.line1 ?? '')
  const [line2, setLine2] = useState(existing?.line2 ?? '')
  const [city, setCity] = useState(existing?.city ?? '')
  const [state, setState] = useState(existing?.state ?? '')
  const [pincode, setPincode] = useState(existing?.pincode ?? '')
  const [phone, setPhone] = useState(existing?.phone ?? '')

  const save = useMutation({
    mutationFn: () => {
      const body = { line1, line2, city, state, pincode, phone }
      return existing ? api.updateAddress(existing.addressId, body) : api.addAddress(body)
    },
    onSuccess: () => {
      toast.push(existing ? 'Address updated' : 'Address added')
      onSuccess()
    },
    onError: (e: Error) => toast.push(e.message, 'err'),
  })

  return (
    <div className="rounded-xl border border-store-clay/30 bg-white p-4">
      <p className="text-sm font-medium">{existing ? 'Edit Address' : 'New Address'}</p>
      <div className="mt-3 space-y-2">
        <input value={line1} onChange={(e) => setLine1(e.target.value)} placeholder="Address line 1" className="w-full rounded-lg border border-store-ink/15 px-3 py-2 text-sm" />
        <input value={line2} onChange={(e) => setLine2(e.target.value)} placeholder="Address line 2 (optional)" className="w-full rounded-lg border border-store-ink/15 px-3 py-2 text-sm" />
        <div className="grid grid-cols-2 gap-2">
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="rounded-lg border border-store-ink/15 px-3 py-2 text-sm" />
          <input value={state} onChange={(e) => setState(e.target.value)} placeholder="State" className="rounded-lg border border-store-ink/15 px-3 py-2 text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="Pincode" className="rounded-lg border border-store-ink/15 px-3 py-2 text-sm" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="rounded-lg border border-store-ink/15 px-3 py-2 text-sm" />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => save.mutate()}
          disabled={save.isPending || !line1 || !city || !state || !pincode || !phone}
          className="rounded-lg bg-store-clay px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {save.isPending ? 'Saving…' : 'Save'}
        </button>
        <button type="button" onClick={onClose} className="rounded-lg border border-store-ink/15 px-4 py-2 text-sm text-store-mist">
          Cancel
        </button>
      </div>
    </div>
  )
}

/* ======================== Recent Orders ======================== */

function RecentOrdersTab() {
  const orders = useQuery({ queryKey: ['orders'], queryFn: () => api.getOrders(0) })

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-store-ink">Your recent orders</p>
      {orders.isLoading && <div className="skeleton h-24" />}
      {(orders.data?.content ?? []).length === 0 && !orders.isLoading && (
        <p className="text-sm text-store-mist">No orders yet.</p>
      )}
      {(orders.data?.content ?? []).map((o) => (
        <Link
          key={o.orderId}
          to={`/store/orders/${o.orderId}`}
          className="flex items-center justify-between rounded-xl border border-store-ink/8 bg-white p-4 hover:border-store-clay/40"
        >
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-store-ink">Order #{o.orderId}</p>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColors[o.status ?? ''] ?? ''}`}>
                {o.status}
              </span>
            </div>
            <p className="text-xs text-store-mist">{new Date(o.orderDate).toLocaleString()}</p>
          </div>
          <p className="font-semibold text-store-clay">₹{o.totalAmount?.toLocaleString()}</p>
        </Link>
      ))}
    </div>
  )
}
