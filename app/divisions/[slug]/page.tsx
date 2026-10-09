import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { CatalogBrowser } from '@/components/catalog-browser'
import { PageShell } from '@/components/page-shell'
import { getCatalog, getPriceVisibility } from '@/lib/catalog-data'
import { getDivision } from '@/lib/divisions'
import { COMPANY } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const catalog = await getCatalog()
  const division = getDivision(catalog, slug)
  if (!division) return { title: COMPANY.name }
  return {
    title: `${division.name} | ${COMPANY.shortName}`,
    description: division.description,
  }
}

export default async function DivisionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [catalog, showPrices] = await Promise.all([getCatalog(), getPriceVisibility()])
  const division = getDivision(catalog, slug)
  if (!division) notFound()

  return (
    <PageShell>
      <section id="products" className="shell section page-intro">
        <Link href="/shop" className="text-link">← All products</Link>
        <span className="kicker">Product division</span>
        <h1 className="page-title">{division.name}</h1>
        <p className="hero-lede">{division.description} · {division.count} products</p>
        <div className="catalog-body">
          <Suspense>
            <CatalogBrowser
              catalog={{ ...catalog, products: division.products }}
              showPrices={showPrices}
            />
          </Suspense>
        </div>
      </section>
    </PageShell>
  )
}
