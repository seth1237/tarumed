import { Suspense } from 'react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
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
    <main className="min-h-screen">
      <SiteHeader />
      <section id="products" className="shell section">
        <span className="kicker">ERP catalogue · Live inventory</span>
        <h1 className="page-title">All <em>products.</em></h1>
        <p className="hero-lede">Browse medical equipment and supplies currently listed in the Tarumed ERP.</p>
        <div className="mt-10">
          <Suspense>
            <CatalogBrowser catalog={catalog} showPrices={showPrices} initialQuery={params.q || ''} />
          </Suspense>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
