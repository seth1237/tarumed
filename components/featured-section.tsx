'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CategorySidebar } from '@/components/category-sidebar'
import { ProductCard } from '@/components/product-card'
import type { CatalogCategory, CatalogProduct } from '@/lib/catalog'
import { mostViewedProducts, readRecentViewIds, selectFeaturedProducts } from '@/lib/recent-views'

export function FeaturedSection({
  products,
  categories,
  showPrices,
}: {
  products: CatalogProduct[]
  categories: CatalogCategory[]
  showPrices: boolean
}) {
  const [featured, setFeatured] = useState(() => mostViewedProducts(products, 8))
  const [categoryId, setCategoryId] = useState('')

  useEffect(() => {
    const recentIds = readRecentViewIds()
    setFeatured(selectFeaturedProducts(products, recentIds, 8))
  }, [products])

  const visible = useMemo(() => {
    if (!categoryId) return featured
    return products.filter((product) => product.categoryId === categoryId).slice(0, 8)
  }, [categoryId, featured, products])

  if (!featured.length) return null

  const shopHref = categoryId ? `/shop?category=${encodeURIComponent(categoryId)}` : '/shop'

  return (
    <section className="home-block" id="featured">
      <div className="section-heading" data-reveal>
        <div>
          <h2>Our Catalogue</h2>
        </div>
        <Link href={shopHref} className="text-link">
          View all <ArrowRight size={16} />
        </Link>
      </div>
      <div className="catalog-layout">
        <CategorySidebar
          categories={categories}
          totalCount={products.length}
          activeId={categoryId}
          onSelect={(id) => setCategoryId(id || '')}
        />
        <div className="catalog-results">
          <div className="product-grid featured-grid">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} showPrice={showPrices} />
            ))}
          </div>
          {visible.length === 0 && (
            <div className="empty-state">
              <p>No products in this category yet.</p>
              <button type="button" className="button button-outline" onClick={() => setCategoryId('')}>
                View all
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
