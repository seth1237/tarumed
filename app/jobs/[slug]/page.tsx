import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageShell } from '@/components/page-shell'
import { getJobBySlug } from '@/lib/mongodb'
import { COMPANY } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const job = await getJobBySlug(slug).catch(() => null)
  if (!job || !job.published) return { title: COMPANY.name }
  return {
    title: `${job.title} | ${COMPANY.shortName} careers`,
    description: job.summary || job.description.slice(0, 160),
  }
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const job = await getJobBySlug(slug)
  if (!job || !job.published) notFound()
  const apply = `mailto:${job.applyEmail || COMPANY.careersEmail}?subject=${encodeURIComponent(`Application: ${job.title}`)}`

  return (
    <PageShell>
      <section className="home-block job-detail">
        <Link href="/jobs" className="text-link">← All roles</Link>
        {job.image && (
          <div className="job-hero">
            <img src={job.image.secureUrl} alt="" />
          </div>
        )}
        <span className="kicker">{job.department || 'Careers'}</span>
        <h1 className="page-title">{job.title}</h1>
        <p className="hero-lede">{job.location} · {job.employmentType}</p>
        {job.summary && <p className="job-summary">{job.summary}</p>}
        <div className="job-copy">
          <h2>The role</h2>
          <p>{job.description}</p>
        </div>
        {job.requirements && (
          <div className="job-copy">
            <h2>What we look for</h2>
            <p>{job.requirements}</p>
          </div>
        )}
        <a href={apply} className="button button-primary">Apply</a>
      </section>
    </PageShell>
  )
}
