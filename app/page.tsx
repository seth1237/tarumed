import { HashRedirect } from '@/components/hash-redirect'
import { HomeHero } from '@/components/home-hero'
import { FeaturedSection } from '@/components/featured-section'
import { AboutTeaser, WhySection } from '@/components/home-sections'
import { PageShell } from '@/components/page-shell'
import { getCatalog, getPriceVisibility } from '@/lib/catalog-data'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const [catalog, showPrices] = await Promise.all([getCatalog(), getPriceVisibility()])

  return (
    <PageShell>
      <HashRedirect />
      <HomeHero productCount={catalog.products.length} />
      <FeaturedSection products={catalog.products} categories={catalog.categories} showPrices={showPrices} />
      <WhySection />
      <AboutTeaser />
    </PageShell>
  )
}
