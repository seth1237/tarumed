'use client'

import { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ProductCard } from '@/components/product-card'
import type { Catalog } from '@/lib/catalog'

const PAGE_SIZE = 15

export function CatalogBrowser({
  catalog,
  showPrices,
  initialQuery = '',
}: {
  catalog: Catalog
  showPrices: boolean
  initialQuery?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const query = (searchParams.get('q') || initialQuery).trim()
  const page = Math.max(1, Number(searchParams.get('page') || '1') || 1)

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    if (!q) return catalog.products
    return catalog.products.filter((product) =>
      `${product.name} ${product.categoryName} ${product.description}`.toLowerCase().includes(q),
    )
  }, [catalog.products, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const visible = filtered.slice(start, start + PAGE_SIZE)

  function goToPage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString())
    if (nextPage <= 1) params.delete('page')
    else params.set('page', String(nextPage))
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div>
      <div className="product-grid">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} showPrice={showPrices} />
        ))}
      </div>
      {visible.length === 0 && <p className="empty-state">No products match this search.</p>}
      {filtered.length > 0 && (
        <div className="catalog-more">
          {currentPage > 1 && (
            <button type="button" className="button button-outline" onClick={() => goToPage(currentPage - 1)}>
              Previous
            </button>
          )}
          <span className="page-status">
            {start + 1}–{start + visible.length} of {filtered.length}
          </span>
          {currentPage < totalPages && (
            <button type="button" className="button button-primary" onClick={() => goToPage(currentPage + 1)}>
              View more
            </button>
          )}
        </div>
      )}
    </div>
  )
}
