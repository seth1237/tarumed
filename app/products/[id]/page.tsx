import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { PageShell } from '@/components/page-shell'
import { QuoteForm } from '@/components/quote-form'
import { ProductGallery } from '@/components/product-gallery'
import { TrackProductClick } from '@/components/track-product-click'
import { RelatedProducts } from '@/components/related-products'
import { formatKes, productBrand, productDescription, productHref, productSpecs } from '@/lib/catalog'
import { getCatalogProduct, getPriceVisibility, getRelatedProducts } from '@/lib/catalog-data'
import { COMPANY } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const product = await getCatalogProduct(id)
  if (!product) return { title: COMPANY.name }
  const image = product.image || COMPANY.logo
  const description = productDescription(product) || `${product.name} from ${COMPANY.name}`
  return {
    title: `${product.name} | ${COMPANY.shortName}`,
    description,
    alternates: { canonical: `${COMPANY.url}${productHref(product)}` },
    openGraph: {
      title: product.name,
      description,
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
  const description = productDescription(product)
  const brand = productBrand(product)
  const specs = productSpecs(product)

  return (
    <PageShell>
      <TrackProductClick
        productId={product.id}
        productName={product.name}
        categoryId={product.categoryId}
        categoryName={product.categoryName}
      />
      <section className="shell section product-detail">
        <Link href="/shop" className="text-link">← Back to products</Link>
        <div className="product-detail-grid">
          <ProductGallery product={product} />
          <div className="product-detail-copy">
            {brand ? <span className="kicker">{brand}</span> : null}
            <h1 className="product-title">{product.name}</h1>
            <p className="product-stock">{product.inStock ? 'In stock' : 'On request'}</p>
            {showPrices && product.price > 0 ? <p className="detail-price">{formatKes(product.price)}</p> : null}
            <QuoteForm product={product} />
            <dl className="product-specs">
              {specs.map((spec) => (
                <div key={spec.label}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
            <div className="product-copy">
              <h2>Product description</h2>
              <p className="product-details">
                {description || `${product.name} is part of ours, supplied to hospitals, clinics and laboratories across Kenya. Ask our team for specifications, installation and a formal quote.`}
              </p>
            </div>
          </div>
        </div>
      </section>
      {related.length > 0 && <RelatedProducts products={related} showPrices={showPrices} />}
    </PageShell>
  )
}
