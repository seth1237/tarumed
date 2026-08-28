import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { QuoteForm } from '@/components/quote-form'
import { ProductGallery } from '@/components/product-gallery'
import { TrackProductClick } from '@/components/track-product-click'
import { RelatedProducts } from '@/components/related-products'
import { formatKes, productHref } from '@/lib/catalog'
import { getCatalogProduct, getPriceVisibility, getRelatedProducts } from '@/lib/catalog-data'
import { COMPANY } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const product = await getCatalogProduct(id)
  if (!product) return { title: COMPANY.name }
  const image = product.image || COMPANY.logo
  return {
    title: `${product.name} | ${COMPANY.shortName}`,
    description: product.description || `${product.name} from ${COMPANY.name}`,
    alternates: { canonical: `${COMPANY.url}${productHref(product)}` },
    openGraph: {
      title: product.name,
      description: product.description || `${product.name} from ${COMPANY.name}`,
      url: `${COMPANY.url}${productHref(product)}`,
      images: [{ url: image.startsWith('http') ? image : COMPANY.logo, alt: product.name }],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getCatalogProduct(id)
  if (!product) notFound()
  if (product.slug && product.slug !== decodeURIComponent(id)) {
    redirect(productHref(product))
  }
  const [showPrices, related] = await Promise.all([
    getPriceVisibility(),
    getRelatedProducts(product, 10),
  ])

  return (
    <main className="min-h-screen">
      <TrackProductClick
        productId={product.id}
        productName={product.name}
        categoryId={product.categoryId}
        categoryName={product.categoryName}
      />
      <SiteHeader />
      <section className="shell section product-detail">
        <Link href="/shop" className="text-link">← Back to products</Link>
        <div className="product-detail-grid">
          <ProductGallery product={product} />
          <div>
            <span className="kicker">{product.categoryName}</span>
            <h1 className="page-title">{product.name}</h1>
            <p className="hero-lede product-details">{product.description || 'Professional medical supply from the Tarumed ERP catalogue.'}</p>
            <p className="detail-price">{showPrices ? formatKes(product.price) : 'Request a quote'}</p>
            {product.manufacturer && <p className="text-muted-foreground">Manufacturer: {product.manufacturer}</p>}
            <QuoteForm product={product} />
          </div>
        </div>
      </section>
      {related.length > 0 && <RelatedProducts products={related} showPrices={showPrices} />}
      <SiteFooter />
    </main>
  )
}
