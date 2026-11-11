import Link from 'next/link'
import { PageShell } from '@/components/page-shell'

export default function NotFound() {
  return (
    <PageShell>
      <section className="home-block page-intro">
        <span className="kicker">404</span>
        <h1 className="page-title">Page not found</h1>
        <p className="hero-lede">That page is not in our shop. Browse products or send us a quote request.</p>
        <div className="hero-actions">
          <Link href="/shop" className="button button-primary button-lg">Shop products</Link>
          <Link href="/contact" className="button button-outline button-lg">Contact us</Link>
        </div>
      </section>
    </PageShell>
  )
}
