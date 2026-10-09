import Link from 'next/link'
import { Logo } from '@/components/logo'
import { COMPANY } from '@/lib/utils'

export function SiteFooter() {
  return (
    <footer>
      <div className="shell footer-simple">
        <div>
          <Logo compact />
          <p>{COMPANY.tagline}. Medical equipment, laboratory solutions, hospital furniture and healthcare products for hospitals and clinics across Kenya.</p>
        </div>
        <div className="footer-col">
          <strong>Explore</strong>
          <Link href="/">Home</Link>
          <Link href="/shop">Products</Link>
          <Link href="/solutions">Solutions</Link>
          <Link href="/services">Services</Link>
          <Link href="/about">About us</Link>
        </div>
        <div className="footer-col">
          <strong>Company</strong>
          <Link href="/blog">Blog</Link>
          <Link href="/jobs">Careers</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/quote">Request a quote</Link>
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
        <a
          className="systems-by"
          href={COMPANY.builderUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {COMPANY.builderLabel}
        </a>
      </div>
    </footer>
  )
}
