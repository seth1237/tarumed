'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { CategorySidebar } from '@/components/category-sidebar'
import { ProductCard } from '@/components/product-card'
import { productMatchesQuery, type Catalog } from '@/lib/catalog'

const PAGE_SIZE = 16

export function CatalogBrowser({
  catalog,
  showPrices,
  initialQuery = '',
  showFilters = false,
}: {
  catalog: Catalog
  showPrices: boolean
  initialQuery?: string
  showFilters?: boolean
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const query = (searchParams.get('q') || initialQuery).trim()
  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || 'featured'
  const page = Math.max(1, Number(searchParams.get('page') || '1') || 1)

  const filtered = useMemo(() => {
    let list = catalog.products
    if (category) list = list.filter((product) => product.categoryId === category)
    if (query) list = list.filter((product) => productMatchesQuery(product, query))
    if (sort === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    } else if (sort === 'price') {
      list = [...list].sort((a, b) => a.price - b.price || a.name.localeCompare(b.name))
    }
    return list
  }, [catalog.products, category, query, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const visible = filtered.slice(start, start + PAGE_SIZE)
  const pages = paginationWindow(currentPage, totalPages)

  function updateParams(updates: Record<string, string | null>, resetPage = false) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (!value) params.delete(key)
      else params.set(key, value)
    }
    if (resetPage) params.delete('page')
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const results = (
    <>
      <div className="catalog-toolbar">
        <p className="result-count">
          {filtered.length === 0
            ? 'No products to show'
            : `Showing ${start + 1}–${start + visible.length} of ${filtered.length}`}
          {query ? ` for “${query}”` : ''}
        </p>
        <label className="catalog-sort">
          <span>Sort</span>
          <select
            value={sort}
            onChange={(event) => updateParams({ sort: event.target.value === 'featured' ? null : event.target.value }, true)}
          >
            <option value="featured">Featured</option>
            <option value="name">Name A–Z</option>
            {showPrices && <option value="price">Price: low to high</option>}
          </select>
        </label>
      </div>

      <div className="product-grid">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} showPrice={showPrices} />
        ))}
      </div>
      {visible.length === 0 && (
        <div className="empty-state">
          <p>
            {catalog.products.length === 0 && !query
              ? 'Products are temporarily unavailable. Please try again shortly, or contact us for a quote.'
              : 'No products match this search.'}
          </p>
          {(query || category) && (
            <button type="button" className="button button-outline" onClick={() => updateParams({ q: null, category: null }, true)}>
              Clear filters
            </button>
          )}
          {catalog.products.length === 0 && (
            <Link href="/contact" className="button button-primary">Contact us</Link>
          )}
        </div>
      )}
      {filtered.length > PAGE_SIZE && (
        <div className="catalog-more">
          <button
            type="button"
            className="button button-outline"
            disabled={currentPage <= 1}
            onClick={() => updateParams({ page: currentPage <= 2 ? null : String(currentPage - 1) })}
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
                  onClick={() => updateParams({ page: item <= 1 ? null : String(item) })}
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
            onClick={() => updateParams({ page: String(currentPage + 1) })}
          >
            Next
          </button>
        </div>
      )}
    </>
  )

  if (!showFilters) return <div className="catalog-browser">{results}</div>

  return (
    <div className="catalog-layout">
      <CategorySidebar
        categories={catalog.categories}
        totalCount={catalog.products.length}
        activeId={category}
        onSelect={(id) => updateParams({ category: id }, true)}
      />
      <div className="catalog-results">{results}</div>
    </div>
  )
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
