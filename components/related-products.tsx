'use client'

import { useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import type { CatalogProduct } from '@/lib/catalog'

export function RelatedProducts({
  products,
  showPrices,
}: {
  products: CatalogProduct[]
  showPrices: boolean
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)

  function setPaused(value: boolean) {
    pausedRef.current = value
  }

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller || products.length < 3) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    function tick() {
      if (!pausedRef.current && scroller) {
        scroller.scrollLeft += 0.45
        const loopAt = scroller.scrollWidth / 2
        if (loopAt > 0 && scroller.scrollLeft >= loopAt) {
          scroller.scrollLeft -= loopAt
        }
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [products.length])

  function scrollByCard(direction: number) {
    const scroller = scrollerRef.current
    if (!scroller) return
    setPaused(true)
    scroller.scrollBy({ left: direction * 280, behavior: 'smooth' })
    window.setTimeout(() => setPaused(false), 900)
  }

  const looped = products.length > 2 ? [...products, ...products] : products

  return (
    <section className="related-section">
      <div className="shell">
        <div className="section-heading">
          <div>
            <span className="kicker">Also of interest</span>
            <h2>Other products of interest</h2>
          </div>
          <div className="related-controls">
            <button type="button" className="related-arrow" onClick={() => scrollByCard(-1)} aria-label="Previous products">
              <ChevronLeft size={18} />
            </button>
            <button type="button" className="related-arrow" onClick={() => scrollByCard(1)} aria-label="Next products">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div
          className="related-scroller"
          ref={scrollerRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div className="related-track">
            {looped.map((item, index) => (
              <ProductCard key={`${item.id}-${index}`} product={item} showPrice={showPrices} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
