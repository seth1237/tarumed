import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { ABOUT_BODY, ABOUT_INTRO, WHY_TARUMED } from '@/lib/brand'
import { COMPANY } from '@/lib/utils'

export const metadata: Metadata = {
  title: `About us | ${COMPANY.shortName}`,
  description: ABOUT_INTRO,
}

export default function AboutPage() {
  return (
    <PageShell>
      <section className="home-block page-intro">
        <span className="kicker">About us</span>
        <h1 className="page-title">Tarumed Supplies Limited</h1>
        <p className="hero-lede">{ABOUT_INTRO}</p>
      </section>
      <section className="home-block">
        <div className="shell prose-page">
          {ABOUT_BODY.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p>
            Talk to us in Eldoret on <a href={COMPANY.phoneHref}>{COMPANY.phone}</a> or {COMPANY.email}.
          </p>
          <div className="hero-actions">
            <Link href="/shop" className="button button-primary button-lg">Shop products</Link>
            <Link href="/contact" className="button button-outline button-lg">Contact us</Link>
          </div>
        </div>
      </section>
      <section className="home-block">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="kicker">Why facilities choose us</span>
              <h2>What we stand behind</h2>
            </div>
          </div>
          <div className="why-grid">
            {WHY_TARUMED.map((item) => (
              <article className="info-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  )
}
