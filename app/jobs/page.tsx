import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { jobHref } from '@/lib/jobs'
import { listJobs } from '@/lib/mongodb'
import { COMPANY } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: `Careers | ${COMPANY.shortName}`,
  description: 'Join a team helping healthcare professionals do their best work.',
}

export default async function Jobs() {
  const jobs = await listJobs(true).catch(() => [])

  return (
    <PageShell>
      <section className="home-block page-intro">
        <span className="kicker">Careers</span>
        <h1 className="page-title">Open roles</h1>
        <p className="hero-lede">Join a team helping healthcare professionals do their best work.</p>
        {jobs.length === 0 && <p className="empty-state">No open roles right now.</p>}
        <div className="job-grid">
          {jobs.map((job) => (
            <Link key={job._id} href={jobHref(job)} className="job-card">
              <div className="job-card-image">
                {job.image ? <img src={job.image.secureUrl} alt="" /> : <span />}
              </div>
              <div className="job-card-body">
                <span className="job-meta">{job.location} · {job.employmentType}</span>
                <h3>{job.title}</h3>
                {job.summary && <p>{job.summary}</p>}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
