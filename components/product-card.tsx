import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { formatKes, productHref, productImageSrc, type CatalogProduct } from '@/lib/catalog'

export function ProductCard({
  product,
  showPrice,
}: {
  product: CatalogProduct
  showPrice: boolean
}) {
  return (
    <Link href={productHref(product)} className="product-card">
      <div className="product-image">
        <img src={productImageSrc(product)} alt={product.name} />
        <span className="product-tag">{product.inStock ? 'In stock' : 'On request'}</span>
      </div>
      <div className="product-info">
        <span className="product-category">{product.categoryName}</span>
        <h3>{product.name}</h3>
        <div className="flex items-center justify-between gap-3">
          <strong className={showPrice ? '' : 'price-hidden'}>
            {showPrice ? formatKes(product.price) : 'Request a quote'}
          </strong>
          <span className="view-detail">View details <ArrowRight size={14} /></span>
        </div>
      </div>
    </Link>
  )
}
