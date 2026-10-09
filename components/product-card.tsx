'use client'

import Link from 'next/link'
import { formatKes, productBrand, productHref, productImageSrc, type CatalogProduct } from '@/lib/catalog'
import { ProductPhoto } from '@/components/product-photo'
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
  const brand = productBrand(product)

  return (
    <article className="product-card">
      <Link href={productHref(product)} className="product-card-link">
        <ProductPhoto src={productImageSrc(product)} alt={product.name} />
        <div className="product-info">
          {brand ? <span className="product-category">{brand}</span> : null}
          <h3>{product.name}</h3>
          {showPrice && product.price > 0 ? <strong>{formatKes(product.price)}</strong> : null}
        </div>
      </Link>
      <div className="product-actions">
        <Link href={productHref(product)} className="view-detail">View product</Link>
        <button
          type="button"
          className={inCart ? 'add-quote-btn in-cart' : 'add-quote-btn'}
          onClick={() => add(product)}
        >
          {inCart ? 'Added to quote' : 'Add to quote'}
        </button>
      </div>
    </article>
  )
}
