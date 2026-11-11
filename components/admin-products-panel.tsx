'use client'

import { Fragment, useMemo, useState, type DragEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ExternalLink, ImageOff, ImagePlus, Package, Search, Trash2, Warehouse } from 'lucide-react'
import type { CatalogCategory, CatalogProduct } from '@/lib/catalog'
import { productCode, productHref, productImageSrc, productMatchesQuery } from '@/lib/catalog'

function adminPrice(amount: number) {
  if (!amount) return 'Request a quote'
  const digits = String(Math.round(amount))
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `Ksh ${grouped}`
}

const PAGE_SIZE = 12

type PhotoFilter = 'all' | 'needs-photo' | 'with-photos' | 'out-of-stock'

function imageFiles(list: FileList | File[] | null | undefined) {
  if (!list) return []
  return Array.from(list).filter(
    (file) => file.type.startsWith('image/') || /\.(jpe?g|png|gif|webp|avif|bmp)$/i.test(file.name),
  )
}

function hasAdminPhoto(product: CatalogProduct) {
  return product.imageAssets.length > 0
}

function paginationWindow(current: number, total: number): Array<number | 'gap'> {
  const set = new Set([1, total, current, current - 1, current + 1])
  const nums = [...set].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b)
  const items: Array<number | 'gap'> = []
  for (const page of nums) {
    const prev = items[items.length - 1]
    if (typeof prev === 'number' && page - prev > 1) items.push('gap')
    items.push(page)
  }
  return items
}

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
  const [photoFilter, setPhotoFilter] = useState<PhotoFilter>('all')
  const [page, setPage] = useState(1)
  const [openId, setOpenId] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [details, setDetails] = useState<Record<string, string>>({})

  const needsPhotoCount = products.filter((product) => !hasAdminPhoto(product)).length
  const withPhotosCount = products.length - needsPhotoCount
  const outOfStockCount = products.filter((product) => !product.inStock).length

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
    return products
      .filter((product) => (categoryId === 'all' ? true : product.categoryId === categoryId))
      .filter((product) => {
        if (photoFilter === 'needs-photo') return !hasAdminPhoto(product)
        if (photoFilter === 'with-photos') return hasAdminPhoto(product)
        if (photoFilter === 'out-of-stock') return !product.inStock
        return true
      })
      .filter((product) => productMatchesQuery(product, query))
      .sort((a, b) => a.categoryName.localeCompare(b.categoryName) || a.name.localeCompare(b.name))
  }, [products, query, categoryId, photoFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const visible = filtered.slice(start, start + PAGE_SIZE)
  const pages = paginationWindow(currentPage, totalPages)
  const selectedCategory = categoryOptions.find((category) => category._id === categoryId)

  function changeCategory(id: string) {
    setCategoryId(id)
    setPage(1)
    setOpenId(null)
  }

  function changePhotoFilter(next: PhotoFilter) {
    setPhotoFilter(next)
    setPage(1)
    setOpenId(null)
  }

  function detailValue(product: CatalogProduct) {
    return details[product.id] ?? product.details ?? product.description ?? ''
  }

  async function upload(productId: string, files: FileList | File[]) {
    const images = imageFiles(files)
    if (!images.length) {
      setMessage('Drop image files (JPG, PNG, or WebP).')
      return
    }
    setBusyId(productId)
    setMessage('')
    const body = new FormData()
    body.set('erpProductId', productId)
    for (const file of images) body.append('file', file)
    const response = await fetch('/api/admin/product-image', { method: 'POST', body })
    const payload = await response.json()
    setBusyId(null)
    if (!response.ok) {
      setMessage(payload.message || 'Upload failed')
      return
    }
    setMessage(images.length === 1 ? 'Product photo saved.' : `${images.length} photos saved.`)
    router.refresh()
  }

  function acceptDrop(productId: string, event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    setDraggingId(null)
    void upload(productId, event.dataTransfer.files)
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
    const product = products.find((item) => item.id === productId)
    if (!product) {
      setMessage('Product not found')
      return
    }
    setBusyId(productId)
    const response = await fetch('/api/admin/product-details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ erpProductId: productId, details: detailValue(product) }),
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
    <div className="admin-products">
      <header className="admin-header">
        <div>
          <span className="admin-eyebrow">Tarumed content manager</span>
          <h1>{title}</h1>
          <p className="admin-header-note">{subtitle}</p>
        </div>
        <div className="admin-header-tools">
          <select
            className="filter-input category-select"
            value={photoFilter}
            onChange={(event) => changePhotoFilter(event.target.value as PhotoFilter)}
            aria-label="Filter by photo status"
          >
            <option value="all">All products</option>
            <option value="needs-photo">Needs photo ({needsPhotoCount})</option>
            <option value="with-photos">With photos ({withPhotosCount})</option>
            <option value="out-of-stock">Out of stock ({outOfStockCount})</option>
          </select>
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
          <label className="admin-search">
            <Search size={15} aria-hidden="true" />
            <input
              className="filter-input"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              placeholder="Search name, SKU, category"
            />
          </label>
        </div>
      </header>

      <div className="admin-stats admin-products-kpis">
        <button type="button" className={photoFilter === 'all' ? 'is-on' : ''} onClick={() => changePhotoFilter('all')}>
          <Package /><span><b>{products.length}</b><small>ERP products</small></span>
        </button>
        <button type="button" className={photoFilter === 'with-photos' ? 'is-on' : ''} onClick={() => changePhotoFilter('with-photos')}>
          <ImagePlus /><span><b>{withPhotosCount}</b><small>With photos</small></span>
        </button>
        <button type="button" className={photoFilter === 'needs-photo' ? 'is-on' : ''} onClick={() => changePhotoFilter('needs-photo')}>
          <ImageOff /><span><b>{needsPhotoCount}</b><small>Needs photo</small></span>
        </button>
        <button type="button" className={photoFilter === 'out-of-stock' ? 'is-on' : ''} onClick={() => changePhotoFilter('out-of-stock')}>
          <Warehouse /><span><b>{outOfStockCount}</b><small>Out of stock</small></span>
        </button>
      </div>

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
            <h3>{categoryId === 'all' ? title : selectedCategory?.name || title}</h3>
            <span>
              {filtered.length === 0
                ? 'No products match these filters'
                : `Showing ${start + 1}–${start + visible.length} of ${filtered.length}`}
              {query ? ` for “${query.trim()}”` : ''}
            </span>
          </div>
          <small className="page-status">{filtered.length} products</small>
        </div>
        {message && <p className="admin-message">{message}</p>}
        <div className="admin-product-list">
          {visible.map((product, index) => {
            const open = openId === product.id
            const previous = visible[index - 1]
            const showHeading = categoryId === 'all' && product.categoryName !== previous?.categoryName
            const dragging = draggingId === product.id
            const needsPhoto = !hasAdminPhoto(product)
            const sku = productCode(product)
            return (
              <Fragment key={product.id}>
                {showHeading && <h4 className="admin-cat-head">{product.categoryName}</h4>}
                <article
                  className={`admin-product-block${needsPhoto ? ' needs-photo' : ''}${open ? ' is-open' : ''}${dragging ? ' is-dragging' : ''}`}
                  onDragEnter={(event) => {
                    event.preventDefault()
                    setDraggingId(product.id)
                  }}
                  onDragOver={(event) => {
                    event.preventDefault()
                    event.dataTransfer.dropEffect = 'copy'
                    setDraggingId(product.id)
                  }}
                  onDragLeave={(event) => {
                    if (event.currentTarget.contains(event.relatedTarget as Node)) return
                    setDraggingId((current) => (current === product.id ? null : current))
                  }}
                  onDrop={(event) => acceptDrop(product.id, event)}
                >
                  <button type="button" className="admin-product" onClick={() => setOpenId(open ? null : product.id)}>
                    <img src={productImageSrc(product)} alt="" />
                    <div>
                      <b>
                        {product.name}
                        {needsPhoto ? <em className="admin-status-badge">Needs photo</em> : null}
                        {!product.inStock ? <em className="admin-status-badge is-stock">Out of stock</em> : null}
                      </b>
                      <small>
                        {sku} · {product.categoryName} · {adminPrice(product.price)} · {product.imageAssets.length === 1 ? '1 photo' : `${product.imageAssets.length} photos`}
                        {product.manufacturer ? ` · ${product.manufacturer}` : ''}
                      </small>
                    </div>
                    <span className="metric-pair">
                      <span className="click-metric">
                        <b>{product.clicks || 0}</b>
                        <small>clicks</small>
                      </span>
                      <span className="click-metric">
                        <b>{product.stock}</b>
                        <small>stock</small>
                      </span>
                      <ChevronDown className={open ? 'admin-row-chevron is-open' : 'admin-row-chevron'} size={16} aria-hidden="true" />
                    </span>
                  </button>
                  {open && (
                    <div className="admin-editor">
                      <dl className="admin-product-facts">
                        <div>
                          <dt>SKU</dt>
                          <dd>{sku}</dd>
                        </div>
                        <div>
                          <dt>Stock</dt>
                          <dd>{product.inStock ? `${product.stock} in stock` : 'Out of stock'}</dd>
                        </div>
                        <div>
                          <dt>Price</dt>
                          <dd>{adminPrice(product.price)}</dd>
                        </div>
                        <div>
                          <dt>Manufacturer</dt>
                          <dd>{product.manufacturer || '—'}</dd>
                        </div>
                      </dl>
                      <a className="admin-view-link" href={productHref(product)} target="_blank" rel="noreferrer">
                        <ExternalLink size={14} /> View on website
                      </a>
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
                      <div className="admin-image-list">
                        {product.imageAssets.map((asset) => (
                          <div key={asset.publicId} className="admin-thumb">
                            <img src={asset.secureUrl} alt="" />
                            <button type="button" onClick={() => removeImage(product.id, asset.publicId)} aria-label="Remove image">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className={`admin-dropzone${dragging ? ' is-dragging' : ''}${busyId === product.id ? ' is-busy' : ''}`}>
                        <input
                          className="admin-dropzone-input"
                          type="file"
                          accept="image/*"
                          multiple
                          aria-label="Add product images"
                          disabled={busyId === product.id}
                          onChange={(event) => {
                            const files = event.target.files
                            if (files?.length) void upload(product.id, files)
                            event.target.value = ''
                          }}
                        />
                        <strong>{busyId === product.id ? 'Saving…' : dragging ? 'Drop images now' : 'Drop images here'}</strong>
                        <span>or click to browse · JPG, PNG, WebP</span>
                      </div>
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
            <button
              type="button"
              className="button button-outline"
              disabled={currentPage <= 1}
              onClick={() => setPage(currentPage - 1)}
            >
              Previous
            </button>
            <div className="page-numbers">
              {pages.map((item, index) =>
                item === 'gap' ? (
                  <span key={`gap-${index}`} className="page-status">…</span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    className={item === currentPage ? 'page-number active' : 'page-number'}
                    onClick={() => setPage(item)}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
            <button
              type="button"
              className="button button-outline"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
