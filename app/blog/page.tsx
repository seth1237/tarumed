import Link from 'next/link'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

const posts = [
  {
    tag: 'Clinical insight',
    date: '19 Aug 2026',
    title: 'Equipping laboratories for reliable diagnostics',
    summary: 'How the right consumables and equipment keep Kenyan facilities running.',
  },
  {
    tag: 'Company news',
    date: '04 Aug 2026',
    title: 'Tarumed serving hospitals from Eldoret',
    summary: 'Closer support for clinics and laboratories across the region.',
  },
]

export default function Blog() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="shell section blog-page">
        <span className="kicker">From the field</span>
        <h1 className="page-title">Ideas worth <em>sharing.</em></h1>
        <p className="hero-lede">Clinical insights, company news, and practical perspectives from the Tarumed team.</p>
        <div className="post-grid">
          {posts.map((post) => (
            <article className="post-card" key={post.title}>
              <div className="post-meta">
                <span>{post.tag}</span>
                <span>{post.date}</span>
              </div>
              <h3>{post.title}</h3>
              <p>{post.summary}</p>
            </article>
          ))}
        </div>
        <Link href="/" className="text-link">← Back to Tarumed</Link>
      </section>
      <SiteFooter />
    </main>
  )
}
