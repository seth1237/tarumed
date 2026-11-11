import type { Metadata } from 'next'
import { PageShell } from '@/components/page-shell'
import { QuoteCartPanel } from '@/components/quote-cart-panel'
import { COMPANY } from '@/lib/utils'

export const metadata: Metadata = {
  title: `Quote cart | ${COMPANY.shortName}`,
  description: 'Review products and send one quote request to Tarumed.',
}

export default function QuotePage() {
  return (
    <PageShell>
      <section className="home-block page-intro">
        <span className="kicker">Quote cart</span>
        <h1 className="page-title">Request a quote</h1>
        <p className="hero-lede">Add products from the shop, then send one request for everything you need.</p>
        <div className="catalog-body">
          <QuoteCartPanel />
        </div>
      </section>
    </PageShell>
  )
}
