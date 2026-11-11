import Link from 'next/link'
import { ArrowRight, Headset, Package, ShieldCheck, Truck, Wrench } from 'lucide-react'
import { DivisionIconMark } from '@/components/division-icon'
import { ABOUT_INTRO, WHY_TARUMED } from '@/lib/brand'
import { divisionCoverSrc, divisionHref, type StoreDivision } from '@/lib/divisions'

const WHY_ICONS = [ShieldCheck, Package, Headset, Wrench, Truck]

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
      <div className="section-heading" data-reveal>
        <div>
          <span className="kicker">Why Tarumed?</span>
          <h2>We are partners</h2>
        </div>
      </div>
      <div className="why-grid">
        {WHY_TARUMED.map((item, index) => {
          const Icon = WHY_ICONS[index] || ShieldCheck
          return (
            <article
              className="info-card why-tile"
              key={item.title}
              data-reveal
              data-reveal-delay={String(index * 70)}
            >
              <span className="info-card-icon" aria-hidden="true">
                <Icon size={20} strokeWidth={2.1} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export function AboutTeaser() {
  return (
    <section className="home-block about-teaser" id="about" data-reveal>
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
