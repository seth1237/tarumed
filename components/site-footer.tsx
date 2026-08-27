import Link from 'next/link'
import { Logo } from '@/components/logo'
import { COMPANY } from '@/lib/utils'

export function SiteFooter() {
  return (
    <footer>
      <div className="shell footer-simple">
        <div>
          <Logo compact />
          <p>{COMPANY.tagline}. Medical equipment, laboratory supplies, and clinical consumables for hospitals and clinics across Kenya.</p>
        </div>
        <div className="footer-col">
          <strong>Explore</strong>
          <Link href="/shop">Products</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/jobs">Jobs</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className="footer-col">
          <strong>Contact</strong>
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
          <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>
          <a href={`https://wa.me/${COMPANY.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp {COMPANY.phone}</a>
          <span>{COMPANY.location}</span>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} {COMPANY.name}</span>
        <a className="builder-credit" href={COMPANY.builderUrl} target="_blank" rel="noopener noreferrer">
          <span className="builder-logo-wrap">
            <img src="/codewithseth-logo.jpg" alt={COMPANY.builderName} />
          </span>
          <span>System designed, built and managed by {COMPANY.builderName}</span>
        </a>
      </div>
    </footer>
  )
}
