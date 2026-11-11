import { ScrollReveal } from '@/components/scroll-reveal'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen">
      <ScrollReveal />
      <SiteHeader />
      <div className="page-frame">{children}</div>
      <SiteFooter />
    </main>
  )
}
