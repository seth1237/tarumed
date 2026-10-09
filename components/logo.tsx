import Image from 'next/image'
import Link from 'next/link'
import { COMPANY } from '@/lib/utils'

export function Logo({ compact = false, variant = 'default' }: { compact?: boolean; variant?: 'default' | 'nav' }) {
  const nav = variant === 'nav'
  return (
    <Link href="/" className={nav ? 'logo logo-nav' : 'logo'} aria-label={`${COMPANY.name} home`}>
      <Image
        src={nav ? '/tarumed-nav-logo.png' : '/logo.png'}
        alt={`${COMPANY.name} — ${COMPANY.tagline}`}
        width={300}
        height={100}
        priority
        className={compact ? 'logo-img compact' : 'logo-img'}
      />
    </Link>
  )
}
