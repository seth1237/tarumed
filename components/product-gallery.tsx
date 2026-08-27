'use client'

import { useState } from 'react'
import { productImageSrc, type CatalogProduct } from '@/lib/catalog'

export function ProductGallery({ product }: { product: CatalogProduct }) {
  const images = product.images.length ? product.images : [productImageSrc(product)]
  const [active, setActive] = useState(0)
  const current = images[Math.min(active, images.length - 1)]

  return (
    <div className="product-gallery">
      <div className="product-image detail">
        <img src={current} alt={product.name} />
      </div>
      {images.length > 1 && (
        <div className="gallery-thumbs">
          {images.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              className={index === active ? 'thumb active' : 'thumb'}
              onClick={() => setActive(index)}
              aria-label={`Photo ${index + 1}`}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
