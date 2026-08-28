'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BarChart3, Briefcase, ImagePlus, LayoutDashboard, LogOut, Package, Settings } from 'lucide-react'

const nav = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/images', label: 'Images', icon: ImagePlus },
  { href: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/admin/performance', label: 'Performance', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a href="/" className="admin-logo"><img src="/logo.png" alt="Tarumed" /></a>
        <div className="admin-label">Workspace</div>
        {nav.map((item) => {
          const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href} className={active ? 'admin-nav active' : 'admin-nav'}>
              <Icon size={17} /> {item.label}
            </Link>
          )
        })}
        <div className="admin-sidebar-bottom">
          <p className="admin-user-email">{email}</p>
          <button className="admin-nav" onClick={logout}><LogOut size={17} /> Sign out</button>
        </div>
      </aside>
      <section className="admin-main">{children}</section>
    </main>
  )
}
