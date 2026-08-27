import { Suspense } from 'react'
import { CatalogBrowser } from '@/components/catalog-browser'
import { HashRedirect } from '@/components/hash-redirect'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { getCatalog, getPriceVisibility } from '@/lib/catalog-data'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const [catalog, showPrices] = await Promise.all([getCatalog(), getPriceVisibility()])

  return (
    <main className="min-h-screen">
      <HashRedirect />
      <SiteHeader />
      <section id="products" className="catalog-section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="kicker">ERP catalogue · Live inventory</span>
              <h2>All products</h2>
            </div>
            <span className="result-count">{catalog.products.length} products</span>
          </div>
          <Suspense>
            <CatalogBrowser catalog={catalog} showPrices={showPrices} />
          </Suspense>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
