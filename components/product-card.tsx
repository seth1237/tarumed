'use client'

import { memo, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { formatKes, productBrand, productHref, productImageSrc, type CatalogProduct } from '@/lib/catalog'
import { ProductPhoto } from '@/components/product-photo'
import { useQuoteCart } from '@/components/quote-cart'

type ProductCardProps = {
  product: CatalogProduct
  showPrice: boolean
}

function ProductCardBase({ product, showPrice }: ProductCardProps) {
  const { add, has, ready } = useQuoteCart()

  const inCart = ready && has(product.id)
  const brand = productBrand(product)
  const href = useMemo(() => productHref(product), [product])
  const imageSrc = useMemo(() => productImageSrc(product), [product])
  const hasPrice = product.price > 0

  const handleAdd = useCallback(() => add(product), [add, product])

  return (
    <article
      className="product-card"
      data-in-stock={product.inStock ? 'true' : 'false'}
      data-in-cart={inCart ? 'true' : 'false'}
    >
      {/* Single primary link for the image + info block.
          aria-label gives screen readers one clear destination name. */}
      <Link href={href} className="product-card-link" aria-label={product.name}>
        <ProductPhoto src={imageSrc} alt={product.name} />
        <div className="product-info">
          {brand ? <span className="product-category">{brand}</span> : null}
          <h3 title={product.name}>{product.name}</h3>
          <span
            className={product.inStock ? 'product-availability' : 'product-availability out'}
          >
            <span className="product-availability-dot" aria-hidden="true" />
            {product.inStock ? 'In stock' : 'On request'}
          </span>
          {showPrice ? (
            hasPrice ? (
              <strong>{formatKes(product.price)}</strong>
            ) : (
              <span className="product-price-note">Price on request</span>
            )
          ) : null}
        </div>
      </Link>

      <div className="product-actions">
        {/* Duplicate destination for sighted users; hidden from the tab order
            and screen readers since the card link above already covers it. */}
        <Link href={href} className="view-detail" tabIndex={-1} aria-hidden="true">
          View product
        </Link>
        <button
          type="button"
          className={inCart ? 'add-quote-btn in-cart' : 'add-quote-btn'}
          onClick={handleAdd}
          aria-pressed={inCart}
          aria-label={
            inCart
              ? `${product.name} is added to your quote`
              : `Add ${product.name} to quote`
          }
        >
          <span aria-hidden="true" className="add-quote-icon">
            {inCart ? '✓' : '+'}
          </span>
          {inCart ? 'Added to quote' : 'Add to quote'}
        </button>
        {/* Announces the state change without moving focus */}
        <span className="sr-only" role="status" aria-live="polite">
          {inCart ? `${product.name} added to quote` : ''}
        </span>
      </div>
    </article>
  )
}

export const ProductCard = memo(ProductCardBase)