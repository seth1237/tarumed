import Link from 'next/link'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export default function Blog() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="shell section">
        <span className="kicker">From the field</span>
        <h1 className="page-title">Ideas worth <em>sharing.</em></h1>
        <p className="hero-lede">Clinical insights, company news, and practical perspectives from the Tarumed team.</p>
        <div className="post-grid mt-12">
          <article className="post-card">
            <div className="post-meta"><span>Clinical insight</span><span>19 Aug 2026</span></div>
            <h3>Equipping laboratories for reliable diagnostics</h3>
            <p className="text-muted-foreground mt-3">How the right consumables and equipment keep Kenyan facilities running.</p>
          </article>
          <article className="post-card">
            <div className="post-meta"><span>Company news</span><span>04 Aug 2026</span></div>
            <h3>Tarumed serving hospitals from Eldoret</h3>
            <p className="text-muted-foreground mt-3">Closer support for clinics and laboratories across the region.</p>
          </article>
        </div>
        <Link href="/" className="text-link mt-10 inline-flex">← Back to Tarumed</Link>
      </section>
      <SiteFooter />
    </main>
  )
}
