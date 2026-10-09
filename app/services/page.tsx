import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { SERVICES } from '@/lib/brand'
import { COMPANY } from '@/lib/utils'

export const metadata: Metadata = {
  title: `Services | ${COMPANY.shortName}`,
  description: 'Equipment supply, installation, training, technical support, delivery and laboratory solutions from Tarumed Supplies Limited.',
}

export default function ServicesPage() {
  return (
    <PageShell>
      <section className="home-block page-intro">
        <span className="kicker">Our services</span>
        <h1 className="page-title">More than products</h1>
        <p className="hero-lede">
          Tarumed supplies equipment and consumables, and stays with the facility through installation, training, support and delivery.
        </p>
      </section>
      <section className="home-block">
        <div className="shell service-page-grid">
          {SERVICES.map((item) => (
            <article className="info-card" key={item.slug} id={item.slug}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="home-block">
        <div className="hero-actions">
          <Link href="/contact" className="button button-primary button-lg">Talk to our team</Link>
          <Link href="/shop" className="button button-outline button-lg">Browse products</Link>
        </div>
      </section>
    </PageShell>
  )
}
