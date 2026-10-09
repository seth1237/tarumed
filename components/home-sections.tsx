import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { DivisionIconMark } from '@/components/division-icon'
import { ABOUT_INTRO, SERVICES, WHY_TARUMED } from '@/lib/brand'
import { divisionCoverSrc, divisionHref, type StoreDivision } from '@/lib/divisions'

export function DivisionsSection({ divisions }: { divisions: StoreDivision[] }) {
  return (
    <section className="home-block" id="divisions">
      <div className="section-heading">
        <div>
          <span className="kicker">Our product divisions</span>
          <h2>Healthcare solutions by specialty</h2>
          <p className="section-lede">Browse ours the way clinical teams work — not as an inventory dump.</p>
        </div>
        <Link href="/shop" className="text-link">
          View all products <ArrowRight size={16} />
        </Link>
      </div>
      <div className="division-grid">
        {divisions.map((division) => (
          <Link
            key={division.slug}
            href={divisionHref(division.slug)}
            className="division-card"
          >
            <span className={`division-well ${division.accent}`}>
              {division.image ? (
                <img src={divisionCoverSrc(division)} alt="" />
              ) : (
                <DivisionIconMark icon={division.icon} size={22} />
              )}
            </span>
            <span className="division-card-body">
              <h3>{division.name}</h3>
              <small>{division.count} products</small>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function WhySection() {
  return (
    <section className="home-block" id="why-tarumed">
      <div className="section-heading">
        <div>
          <span className="kicker">Why Tarumed?</span>
          <h2>A partner, not only a catalogue</h2>
        </div>
      </div>
      <div className="why-grid">
        {WHY_TARUMED.map((item) => (
          <article className="info-card" key={item.title}>
            <CheckCircle2 className="info-card-icon" size={22} />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export function ServicesTeaser() {
  return (
    <section className="home-block" id="services">
      <div className="section-heading">
        <div>
          <span className="kicker">Our services</span>
          <h2>More than products</h2>
          <p className="section-lede">Supply is only the start. Tarumed also installs, trains, supports and delivers.</p>
        </div>
        <Link href="/services" className="text-link">
          All services <ArrowRight size={16} />
        </Link>
      </div>
      <div className="service-grid">
        {SERVICES.map((item) => (
          <article className="info-card" key={item.slug}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export function AboutTeaser() {
  return (
    <section className="home-block about-teaser" id="about">
      <div>
        <span className="kicker">About Tarumed</span>
        <h2>Healthcare supply from Eldoret</h2>
        <p className="section-lede">{ABOUT_INTRO}</p>
        <div className="hero-actions">
          <Link href="/about" className="button button-primary button-lg">
            Learn more
          </Link>
          <Link href="/quote" className="hero-text-link">
            Request a quote
          </Link>
        </div>
      </div>
      <ul className="about-points">
        <li>Medical equipment and hospital furniture</li>
        <li>Laboratory equipment, consumables and chemicals</li>
        <li>Maternity, theatre, dental and diagnostic solutions</li>
        <li>Installation, training, support and delivery</li>
      </ul>
    </section>
  )
}
