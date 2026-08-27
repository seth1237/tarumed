import Image from 'next/image'
import Link from 'next/link'
import { COMPANY } from '@/lib/utils'

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="logo" aria-label={`${COMPANY.name} home`}>
      <Image
        src="/logo.png"
        alt={`${COMPANY.name} — ${COMPANY.tagline}`}
        width={300}
        height={100}
        priority
        className={compact ? 'logo-img compact' : 'logo-img'}
      />
    </Link>
  )
}
