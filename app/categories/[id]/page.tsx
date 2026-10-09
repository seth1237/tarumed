import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { PageShell } from '@/components/page-shell'
import { CatalogBrowser } from '@/components/catalog-browser'
import { getCatalog, getPriceVisibility } from '@/lib/catalog-data'

export const dynamic = 'force-dynamic'

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [catalog, showPrices] = await Promise.all([getCatalog(), getPriceVisibility()])
  const category = catalog.categories.find((item) => item._id === id)
  if (!category) notFound()
  const products = catalog.products.filter((product) => product.categoryId === id)

  return (
    <PageShell>
      <section id="products" className="shell section page-intro">
        <span className="kicker">Category</span>
        <h1 className="page-title">{category.name}</h1>
        <p className="hero-lede">{category.description || `Products in ${category.name}.`} · {products.length} items</p>
        <div className="catalog-body">
          <Suspense>
            <CatalogBrowser
              catalog={{ ...catalog, products, categories: [{ ...category, count: products.length }] }}
              showPrices={showPrices}
            />
          </Suspense>
        </div>
      </section>
    </PageShell>
  )
}
