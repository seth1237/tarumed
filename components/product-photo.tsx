import { productImageSrc } from '@/lib/catalog'
import { isPlaceholderSrc, optimizedMediaUrl } from '@/lib/media'

export function ProductPhoto({
  src,
  alt,
  variant = 'card',
}: {
  src: string | null | undefined
  alt: string
  variant?: 'card' | 'detail' | 'thumb'
}) {
  const raw = src || productImageSrc({ image: null })
  const placeholder = isPlaceholderSrc(raw)
  const width = variant === 'detail' ? 1200 : variant === 'thumb' ? 160 : 640
  const display = optimizedMediaUrl(raw, width)
  const classes = ['product-image', variant, placeholder ? 'placeholder' : ''].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      <span className="product-image-frame" aria-hidden="true" />
      <img
        className="product-image-main"
        src={display}
        alt={alt}
        loading={variant === 'detail' ? 'eager' : 'lazy'}
        decoding="async"
      />
    </div>
  )
}
