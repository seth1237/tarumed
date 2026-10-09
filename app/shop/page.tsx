import { Suspense } from 'react'
import { PageShell } from '@/components/page-shell'
import { CatalogBrowser } from '@/components/catalog-browser'
import { getCatalog, getPriceVisibility } from '@/lib/catalog-data'

export const dynamic = 'force-dynamic'

export default async function Shop({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const params = await searchParams
  const [catalog, showPrices] = await Promise.all([
    getCatalog(params.category ? [params.category] : undefined),
    getPriceVisibility(),
  ])

  return (
    <PageShell>
      <section id="products" className="home-block page-intro">
        <span className="kicker">Product catalogue</span>
        <h1 className="page-title">All products</h1>
        <p className="hero-lede">Browse medical equipment, laboratory solutions and healthcare supplies from Tarumed.</p>
        <div className="catalog-body">
          <Suspense>
            <CatalogBrowser catalog={catalog} showPrices={showPrices} initialQuery={params.q || ''} />
          </Suspense>
        </div>
      </section>
    </PageShell>
  )
}
