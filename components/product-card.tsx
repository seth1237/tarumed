'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { formatKes, productHref, productImageSrc, type CatalogProduct } from '@/lib/catalog'
import { useQuoteCart } from '@/components/quote-cart'

export function ProductCard({
  product,
  showPrice,
}: {
  product: CatalogProduct
  showPrice: boolean
}) {
  const { add, has } = useQuoteCart()
  const inCart = has(product.id)

  return (
    <article className="product-card">
      <Link href={productHref(product)} className="product-card-link">
        <div className="product-image">
          <img src={productImageSrc(product)} alt={product.name} />
          <span className="product-tag">In stock</span>
        </div>
        <div className="product-info">
          <span className="product-category">{product.categoryName}</span>
          <h3>{product.name}</h3>
          <div className="product-cta">
            <strong className={showPrice ? '' : 'price-hidden'}>
              {showPrice ? formatKes(product.price) : 'Request a quote'}
            </strong>
            <span className="view-detail">View details <ArrowRight size={14} /></span>
          </div>
        </div>
      </Link>
      <button
        type="button"
        className={inCart ? 'add-quote-btn in-cart' : 'add-quote-btn'}
        onClick={() => add(product)}
      >
        {inCart ? 'Added to quote' : 'Add to quote'}
      </button>
    </article>
  )
}
