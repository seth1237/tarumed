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

  useEffect(() => {
    const recentIds = readRecentViewIds()
    setVisible(selectFeaturedProducts(products, recentIds, 8))
  }, [products])

  if (!visible.length) return null

  return (
    <section className="home-block" id="featured">
      <div className="section-heading">
          <div>
            <h2>Our Catalogue</h2>
          </div>
          <Link href="/shop" className="text-link">
            View all <ArrowRight size={16} />
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
