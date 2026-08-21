import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { Search, Shield, ShieldCheck, UserCog } from 'lucide-react'
import { api } from '@/services/api'
import { useToast } from '@/components/ui/Toast'
import { useAuth } from '@/lib/auth'
import type { UserSummary } from '@/types/api'

const ROLE_STYLES: Record<string, string> = {
  ADMIN: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  ANALYST: 'text-cyan border-cyan/30 bg-cyan/10',
  USER: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
}

const ROLE_ICONS: Record<string, typeof Shield> = {
  ADMIN: ShieldCheck,
  ANALYST: Shield,
  USER: UserCog,
}

export function ConsoleUsersPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const toast = useToast()
  const qc = useQueryClient()
  const { username: currentUsername } = useAuth()

  const users = useQuery({
    queryKey: ['admin-users', search, page],
    queryFn: () => api.getAdminUsers({ search: search || undefined, page }),
  })

  const updateRole = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: string }) =>
      api.updateUserRole(userId, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] })
      toast.push('Role updated')
    },
    onError: (e: Error) => toast.push(e.message, 'err'),
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ivory">User Management</h1>
        <p className="mono-label mt-1">Manage user accounts and roles</p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          placeholder="Search users…"
          className="w-full rounded-lg border border-white/10 bg-panel pl-9 pr-3 py-2 text-sm text-ivory"
        />
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-panel text-mute">
            <tr>
              <th className="px-3 py-2">User</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Linked Customer</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.isLoading && (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-mute">Loading…</td>
              </tr>
            )}
            {!users.isLoading && (users.data?.content?.length ?? 0) === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-mute">No users found</td>
              </tr>
            )}
            {(users.data?.content ?? []).map((u: UserSummary, i: number) => {
              const isSelf = u.username === currentUsername
              const Icon = ROLE_ICONS[u.role] || UserCog
              return (
                <motion.tr
                  key={u.userId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-t border-white/5 hover:bg-white/[0.02]"
                >
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <Icon size={14} className="text-mute" />
                      <span className="text-ivory font-medium">{u.username}</span>
                      {isSelf && (
                        <span className="text-[9px] uppercase text-mute">(you)</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${ROLE_STYLES[u.role] || 'text-bone'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    {u.linkedCustomer ? (
                      <span className="text-emerald-400 text-xs">✓ Linked</span>
                    ) : (
                      <span className="text-mute text-xs">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-mute text-xs">{u.customerEmail || '—'}</td>
                  <td className="px-3 py-3">
                    {isSelf ? (
                      <span className="text-xs text-mute">Cannot change own role</span>
                    ) : (
                      <select
                        value={u.role}
                        onChange={(e) => {
                          if (window.confirm(`Change ${u.username}'s role to ${e.target.value}?`)) {
                            updateRole.mutate({ userId: u.userId, role: e.target.value })
                          }
                        }}
                        disabled={updateRole.isPending}
                        className="rounded border border-white/10 bg-void px-2 py-1 text-xs text-cyan"
                      >
                        <option value="USER">USER</option>
                        <option value="ANALYST">ANALYST</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    )}
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {users.data && users.data.totalPages > 1 && (
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
            Page {page + 1} / {users.data.totalPages}
          </span>
          <button
            type="button"
            disabled={page + 1 >= users.data.totalPages}
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
