import { Mail, MapPin, Phone, Clock } from 'lucide-react'
import { ContactForm } from '@/components/contact-form'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { COMPANY } from '@/lib/utils'

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section id="contact" className="shell section contact-page">
        <span className="kicker">Get in touch</span>
        <h1 className="page-title">Contact <em>us.</em></h1>
        <p className="hero-lede">Reach Tarumed Supplies Limited in Eldoret for equipment, laboratory supplies, and quotes.</p>
        <div className="contact-grid">
          <div className="contact-details">
            <article>
              <MapPin size={18} />
              <div>
                <strong>Address</strong>
                <p>{COMPANY.location}</p>
              </div>
            </article>
            <article>
              <Phone size={18} />
              <div>
                <strong>Phone</strong>
                <p><a href={COMPANY.phoneHref}>{COMPANY.phone}</a></p>
              </div>
            </article>
            <article>
              <Mail size={18} />
              <div>
                <strong>Email</strong>
                <p><a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></p>
              </div>
            </article>
            <article>
              <Clock size={18} />
              <div>
                <strong>Hours</strong>
                <p>{COMPANY.hours}</p>
              </div>
            </article>
          </div>
          <ContactForm />
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
