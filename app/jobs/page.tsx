import Link from 'next/link'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { COMPANY } from '@/lib/utils'

export default function Jobs() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="shell section">
        <span className="kicker">Make an impact</span>
        <h1 className="page-title">Open <em>roles.</em></h1>
        <p className="hero-lede">Join a team helping healthcare professionals do their best work.</p>
        <div className="admin-card mt-12">
          <div className="card-title">
            <div>
              <h3>Sales & Clinical Support</h3>
              <span>Eldoret · Full time</span>
            </div>
            <Link href={`mailto:${COMPANY.careersEmail}`} className="button button-primary">Apply</Link>
          </div>
          <p className="text-muted-foreground">Help hospitals select and implement medical equipment and laboratory supplies.</p>
        </div>
        <div className="admin-card mt-4">
          <div className="card-title">
            <div>
              <h3>Service Technician</h3>
              <span>Eldoret · Full time</span>
            </div>
            <Link href={`mailto:${COMPANY.careersEmail}`} className="button button-primary">Apply</Link>
          </div>
          <p className="text-muted-foreground">Keep critical equipment performing with responsive technical care.</p>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
