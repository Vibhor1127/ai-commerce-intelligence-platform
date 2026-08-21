import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'
import { useToast } from '@/components/ui/Toast'

export function ConsoleInventoryPage() {
  const [page, setPage] = useState(0)
  const [productName, setProductName] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const toast = useToast()
  const qc = useQueryClient()
  const inventory = useQuery({
    queryKey: ['inventory', page],
    queryFn: () => api.getInventory(page),
  })
  const categories = useQuery({ queryKey: ['categories'], queryFn: () => api.getCategories() })

  const create = useMutation({
    mutationFn: () =>
      api.createProduct({
        productName: productName.trim(),
        price: Number(price),
        stock: Number(stock),
        categoryId: Number(categoryId),
        imageUrl: imageUrl.trim() || undefined,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventory'] })
      setProductName('')
      setPrice('')
      setStock('')
      setCategoryId('')
      setImageUrl('')
      toast.push('Product created')
    },
    onError: (e: Error) => toast.push(e.message, 'err'),
  })

  const adjust = useMutation({
    mutationFn: ({ id, stock: s }: { id: number; stock: number }) => api.adjustInventory(id, s),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventory'] })
      toast.push('Stock updated')
    },
    onError: (e: Error) => toast.push(e.message, 'err'),
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ivory">Inventory</h1>
        <p className="mono-label mt-1">Add products and adjust stock</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!productName.trim() || !categoryId) {
            toast.push('Name and category are required', 'err')
            return
          }
          create.mutate()
        }}
        className="holo-panel grid gap-3 rounded-xl p-4 md:grid-cols-5"
      >
        <span className="holo-edge" />
        <input
          placeholder="Product name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="rounded border border-white/10 bg-void px-3 py-2 text-sm text-ivory md:col-span-2"
        />
        <input
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="rounded border border-white/10 bg-void px-3 py-2 text-sm text-ivory md:col-span-2"
        />
        <input
          placeholder="Price"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="rounded border border-white/10 bg-void px-3 py-2 text-sm text-ivory"
        />
        <input
          placeholder="Stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="rounded border border-white/10 bg-void px-3 py-2 text-sm text-ivory"
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="rounded border border-white/10 bg-void px-3 py-2 text-sm text-ivory"
        >
          <option value="">Category</option>
          {(categories.data ?? []).map((c) => (
            <option key={c.categoryId} value={c.categoryId}>
              {c.categoryName}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded bg-cyan/20 px-3 py-2 text-sm font-medium text-cyan md:col-span-5"
        >
          Add product
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-panel text-mute">
            <tr>
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Stock</th>
              <th className="px-3 py-2">Adjust</th>
            </tr>
          </thead>
          <tbody>
            {inventory.isLoading && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-mute">
                  Loading…
                </td>
              </tr>
            )}
            {(inventory.data?.content ?? []).map((item) => (
              <tr key={item.productId} className="border-t border-white/5">
                <td className="px-3 py-2 text-ivory">
                  {item.productName}
                  {item.lowStock && (
                    <span className="ml-2 text-[10px] uppercase text-amber">Low</span>
                  )}
                </td>
                <td className="px-3 py-2">{item.categoryName}</td>
                <td className="px-3 py-2">{item.price?.toLocaleString()}</td>
                <td className="px-3 py-2">{item.stock}</td>
                <td className="px-3 py-2">
                  <form
                    className="flex gap-2"
                    onSubmit={(e) => {
                      e.preventDefault()
                      const fd = new FormData(e.currentTarget)
                      adjust.mutate({
                        id: item.productId,
                        stock: Number(fd.get('stock')),
                      })
                    }}
                  >
                    <input
                      name="stock"
                      type="number"
                      min={0}
                      defaultValue={item.stock}
                      className="w-20 rounded border border-white/10 bg-void px-2 py-1 text-xs"
                    />
                    <button type="submit" className="text-xs text-cyan">
                      Save
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {inventory.data && inventory.data.totalPages > 1 && (
        <div className="flex gap-3">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="text-sm text-cyan disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={page + 1 >= inventory.data.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="text-sm text-cyan disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
