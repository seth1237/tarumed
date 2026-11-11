import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PageShell } from '@/components/page-shell'
import { CatalogBrowser } from '@/components/catalog-browser'
import { getCatalog, getPriceVisibility } from '@/lib/catalog-data'
import { COMPANY } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: `Shop | ${COMPANY.shortName}`,
  description: 'Browse medical equipment, laboratory solutions and healthcare supplies from Tarumed.',
}

export default async function Shop({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const params = await searchParams
  const [catalog, showPrices] = await Promise.all([getCatalog(), getPriceVisibility()])
  const selected = catalog.categories.find((category) => category._id === params.category)

  return (
    <PageShell>
      <section id="products" className="home-block page-intro">
        <span className="kicker">Shop</span>
        <h1 className="page-title">{selected ? selected.name : 'All products'}</h1>
        <p className="hero-lede">
          {selected
            ? `${selected.count} products in this category. Add items to a quote and send one request.`
            : 'Browse medical equipment, laboratory solutions and healthcare supplies. Add items to a quote and send one request.'}
        </p>
        <div className="catalog-body">
          <Suspense>
            <CatalogBrowser
              catalog={catalog}
              showPrices={showPrices}
              initialQuery={params.q || ''}
              showFilters
            />
          </Suspense>
        </div>
      </section>
    </PageShell>
  )
}
