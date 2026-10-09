import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { SOLUTIONS } from '@/lib/brand'
import { getCatalog } from '@/lib/catalog-data'
import { buildStoreDivisions, divisionHref } from '@/lib/divisions'
import { COMPANY } from '@/lib/utils'

export const metadata: Metadata = {
  title: `Solutions | ${COMPANY.shortName}`,
  description: 'Healthcare solutions across hospital, laboratory, maternity, theatre, dental and diagnostic divisions.',
}

export const dynamic = 'force-dynamic'

export default async function SolutionsPage() {
  const catalog = await getCatalog()
  const live = new Set(buildStoreDivisions(catalog).map((division) => divisionHref(division.slug)))

  return (
    <PageShell>
      <section className="home-block page-intro">
        <span className="kicker">Solutions</span>
        <h1 className="page-title">Healthcare solutions by setting</h1>
        <p className="hero-lede">
          Whether you are equipping a ward, a laboratory, a theatre or a clinic, Tarumed groups products the way healthcare teams work.
        </p>
      </section>
      <section className="home-block">
        <div className="shell solution-grid">
          {SOLUTIONS.map((item) => {
            const available = live.has(item.href)
            return (
              <article className="info-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                {available ? (
                  <Link href={item.href} className="text-link">Explore this division</Link>
                ) : (
                  <Link href="/shop" className="text-link">Browse products</Link>
                )}
              </article>
            )
          })}
        </div>
      </section>
    </PageShell>
  )
}
