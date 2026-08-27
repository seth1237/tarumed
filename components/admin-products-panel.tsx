'use client'

import { Fragment, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import type { CatalogCategory, CatalogProduct } from '@/lib/catalog'
import { formatKes, productImageSrc } from '@/lib/catalog'

const PAGE_SIZE = 10

export function AdminProductsPanel({
  products,
  categories = [],
  title,
  subtitle,
}: {
  products: CatalogProduct[]
  categories?: CatalogCategory[]
  title: string
  subtitle: string
}) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [categoryId, setCategoryId] = useState('all')
  const [page, setPage] = useState(1)
  const [openId, setOpenId] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [details, setDetails] = useState<Record<string, string>>({})

  const categoryOptions = useMemo(() => {
    if (categories.length) return categories.filter((category) => category.count > 0)
    const map = new Map<string, CatalogCategory>()
    for (const product of products) {
      const current = map.get(product.categoryId)
      if (current) current.count += 1
      else map.set(product.categoryId, { _id: product.categoryId, name: product.categoryName, count: 1 })
    }
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name))
  }, [categories, products])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products
      .filter((product) => (categoryId === 'all' ? true : product.categoryId === categoryId))
      .filter((product) => (q ? `${product.name} ${product.categoryName}`.toLowerCase().includes(q) : true))
      .sort((a, b) => a.categoryName.localeCompare(b.categoryName) || a.name.localeCompare(b.name))
  }, [products, query, categoryId])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function changeCategory(id: string) {
    setCategoryId(id)
    setPage(1)
    setOpenId(null)
  }

  function detailValue(product: CatalogProduct) {
    return details[product.id] ?? product.details ?? product.description ?? ''
  }

  async function upload(productId: string, files: FileList | File[]) {
    setBusyId(productId)
    setMessage('')
    const body = new FormData()
    body.set('erpProductId', productId)
    for (const file of Array.from(files)) body.append('file', file)
    const response = await fetch('/api/admin/product-image', { method: 'POST', body })
    const payload = await response.json()
    setBusyId(null)
    if (!response.ok) {
      setMessage(payload.message || 'Upload failed')
      return
    }
    setMessage('Images saved to Cloudinary.')
    router.refresh()
  }

  async function removeImage(productId: string, publicId: string) {
    setBusyId(productId)
    const response = await fetch('/api/admin/product-image', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ erpProductId: productId, publicId }),
    })
    const payload = await response.json()
    setBusyId(null)
    if (!response.ok) {
      setMessage(payload.message || 'Could not remove image')
      return
    }
    setMessage('Image removed.')
    router.refresh()
  }

  async function saveDetails(productId: string) {
    setBusyId(productId)
    const response = await fetch('/api/admin/product-details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ erpProductId: productId, details: details[productId] || '' }),
    })
    const payload = await response.json()
    setBusyId(null)
    if (!response.ok) {
      setMessage(payload.message || 'Could not save details')
      return
    }
    setMessage('Product details saved.')
    router.refresh()
  }

  return (
    <>
      <header className="admin-header">
        <div>
          <span className="admin-eyebrow">Tarumed content manager</span>
          <h1>{title}</h1>
        </div>
        <div className="admin-header-tools">
          <select
            className="filter-input category-select"
            value={categoryId}
            onChange={(event) => changeCategory(event.target.value)}
            aria-label="Filter by category"
          >
            <option value="all">All categories</option>
            {categoryOptions.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            className="filter-input"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
            placeholder="Search products"
          />
        </div>
      </header>
      <div className="category-chips admin-category-chips">
        <button type="button" className={categoryId === 'all' ? 'chip active' : 'chip'} onClick={() => changeCategory('all')}>
          All <small>{products.length}</small>
        </button>
        {categoryOptions.map((category) => (
          <button
            key={category._id}
            type="button"
            className={categoryId === category._id ? 'chip active' : 'chip'}
            onClick={() => changeCategory(category._id)}
          >
            {category.name} <small>{products.filter((product) => product.categoryId === category._id).length}</small>
          </button>
        ))}
      </div>
      <div className="admin-card">
        <div className="card-title">
          <div>
            <h3>{categoryId === 'all' ? title : categoryOptions.find((category) => category._id === categoryId)?.name || title}</h3>
            <span>{subtitle}</span>
          </div>
          <small className="page-status">{filtered.length} products</small>
        </div>
        {message && <p className="admin-message">{message}</p>}
        <div className="admin-product-list">
          {visible.map((product, index) => {
            const open = openId === product.id
            const previous = visible[index - 1]
            const showHeading = categoryId === 'all' && product.categoryName !== previous?.categoryName
            return (
              <Fragment key={product.id}>
                {showHeading && <h4 className="admin-cat-head">{product.categoryName}</h4>}
                <article className="admin-product-block">
                <button type="button" className="admin-product" onClick={() => setOpenId(open ? null : product.id)}>
                  <img src={productImageSrc(product)} alt="" />
                  <div>
                    <b>{product.name}</b>
                    <small>{product.categoryName} · {formatKes(product.price)} · {product.imageAssets.length} photos</small>
                  </div>
                  <span className="click-metric">
                    <b>{product.clicks || 0}</b>
                    <small>clicks</small>
                  </span>
                </button>
                {open && (
                  <div className="admin-editor">
                    <label>
                      Product details
                      <textarea
                        value={detailValue(product)}
                        onChange={(event) => setDetails((current) => ({ ...current, [product.id]: event.target.value }))}
                        rows={5}
                        placeholder="Specifications, pack size, usage notes…"
                      />
                    </label>
                    <button className="button button-primary button-compact" disabled={busyId === product.id} onClick={() => saveDetails(product.id)}>
                      Save details
                    </button>
                    <div className="admin-thumbs">
                      {product.imageAssets.map((asset) => (
                        <div key={asset.publicId} className="admin-thumb">
                          <img src={asset.secureUrl} alt="" />
                          <button type="button" onClick={() => removeImage(product.id, asset.publicId)} aria-label="Remove image"><Trash2 size={14} /></button>
                        </div>
                      ))}
                    </div>
                    <label className="button button-outline button-compact">
                      {busyId === product.id ? 'Saving…' : 'Add images'}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        disabled={busyId === product.id}
                        onChange={(event) => {
                          const files = event.target.files
                          if (files?.length) void upload(product.id, files)
                          event.target.value = ''
                        }}
                      />
                    </label>
                  </div>
                )}
                </article>
              </Fragment>
            )
          })}
          {filtered.length === 0 && <p className="empty-state">No products match that search.</p>}
        </div>
        {filtered.length > PAGE_SIZE && (
          <div className="catalog-more">
            {currentPage > 1 && (
              <button type="button" className="button button-outline" onClick={() => setPage(currentPage - 1)}>Previous</button>
            )}
            <span className="page-status">{currentPage} of {totalPages}</span>
            {currentPage < totalPages && (
              <button type="button" className="button button-primary" onClick={() => setPage(currentPage + 1)}>View more</button>
            )}
          </div>
        )}
      </div>
    </>
  )
}
