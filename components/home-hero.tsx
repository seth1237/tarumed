import Link from 'next/link'
import {
  Activity,
  BedDouble,
  FlaskConical,
  Heart,
  Headset,
  Stethoscope,
} from 'lucide-react'
import { HERO, HERO_IMAGE, HERO_SERVICES } from '@/lib/brand'

const serviceIcons = [Stethoscope, FlaskConical, BedDouble, Headset]

export function HomeHero({ productCount = 0 }: { productCount?: number }) {
  const catalogueLabel = productCount > 0 ? `${productCount}+` : 'Live'
  const catalogueText = productCount > 0 ? 'Products in the live catalogue' : 'Products ready to quote'

  return (
    <section className="home-hero">
      <div className="home-hero-orbs" aria-hidden="true">
        <span className="orb orb-a" />
        <span className="orb orb-b" />
        <span className="orb orb-c" />
        <span className="orb orb-d" />
      </div>
      <div className="home-hero-grid">
        <div className="home-hero-copy">
          <h1 className="hero-title">{HERO.title}</h1>
          <p className="hero-lede">{HERO.lede}</p>
          <div className="hero-actions">
            <Link href="/shop" className="button button-primary button-lg">
              Shop products
            </Link>
            <Link href="/about" className="hero-text-link">
              Learn more
            </Link>
          </div>
          <div className="hero-services">
            {HERO_SERVICES.map((item, index) => {
              const Icon = serviceIcons[index] || Stethoscope
              return (
                <Link key={item.href} href={item.href} className="hero-cta-chip">
                  <Icon size={14} strokeWidth={2.2} />
                  {item.title}
                </Link>
              )
            })}
          </div>
        </div>
        <div className="home-hero-visual">
          <div className="hero-rings" aria-hidden="true" />
          <div className="hero-photo">
            <img
              src={HERO_IMAGE}
              alt="Medical and laboratory equipment supplied by Tarumed"
              fetchPriority="high"
            />
          </div>
          <article className="hero-float hero-float-stat">
            <span className="hero-float-icon teal">
              <Activity size={18} />
            </span>
            <div>
              <strong>{catalogueLabel}</strong>
              <small>{catalogueText}</small>
            </div>
          </article>
          <article className="hero-float hero-float-clients">
            <span className="hero-float-heart" aria-hidden="true">
              <Heart size={14} />
            </span>
            <strong>Our clients</strong>
            <small>Hospitals, labs and clinics across Kenya</small>
            <span className="hero-client-pills">
              <span>Wards</span>
              <span>Labs</span>
              <span>Theatre</span>
            </span>
          </article>
        </div>
      </div>
    </section>
  )
}
