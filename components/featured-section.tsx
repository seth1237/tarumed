'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import type { CatalogProduct } from '@/lib/catalog'
import { mostViewedProducts, readRecentViewIds, selectFeaturedProducts } from '@/lib/recent-views'

export function FeaturedSection({
  products,
  showPrices,
}: {
  products: CatalogProduct[]
  showPrices: boolean
}) {
  const [visible, setVisible] = useState(() => mostViewedProducts(products, 8))
  const [hasHistory, setHasHistory] = useState(false)

  useEffect(() => {
    const recentIds = readRecentViewIds()
    const known = new Set(products.map((product) => product.id))
    setHasHistory(recentIds.some((id) => known.has(id)))
    setVisible(selectFeaturedProducts(products, recentIds, 8))
  }, [products])

  if (!visible.length) return null

  return (
    <section className="home-block" id="featured">
      <div className="section-heading">
          <div>
            <h2>Ours</h2>
            <p className="section-lede">
              {hasHistory
                ? 'Products you have looked at, together with the items facilities view most.'
                : 'The products facilities look at most. Items you open will show up here next time.'}
            </p>
          </div>
          <Link href="/shop" className="text-link">
            Browse ours <ArrowRight size={16} />
          </Link>
        </div>
        <div className="product-grid featured-grid">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} showPrice={showPrices} />
          ))}
        </div>
    </section>
  )
}
