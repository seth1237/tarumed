import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { COMPANY } from '@/lib/utils'

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

export const metadata: Metadata = {
  title: `Blog | ${COMPANY.shortName}`,
  description: 'Clinical insights, company news, and practical perspectives from the Tarumed team.',
}

export default function Blog() {
  return (
    <PageShell>
      <section className="home-block page-intro blog-page">
        <span className="kicker">From the field</span>
        <h1 className="page-title">Ideas worth sharing</h1>
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
    </PageShell>
  )
}
