'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, ShoppingCart, X } from 'lucide-react'
import { Logo } from '@/components/logo'
import { SearchBox } from '@/components/search-box'
import { useQuoteCart } from '@/components/quote-cart'
import type { SearchProduct } from '@/lib/catalog'

const links = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Products' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About Us' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export function SiteHeaderNav({
  products,
}: {
  products: SearchProduct[]
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { count } = useQuoteCart()

  function closeMenu() {
    setOpen(false)
  }

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <header className="site-header">
      <div className="nav-island">
        <Logo variant="nav" />
        <nav className="main-nav" aria-label="Primary">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={isActive(link.href) ? 'active' : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <SearchBox products={products} />
          <Link href="/quote" className="cart-link" aria-label={`Quote cart, ${count} items`}>
            <ShoppingCart size={18} />
            {count > 0 && <span className="cart-count">{count}</span>}
          </Link>
        </div>
        <button className="mobile-trigger" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="mobile-menu" role="dialog" aria-label="Menu">
          <nav className="mobile-nav" aria-label="Mobile">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={isActive(link.href) ? 'active' : undefined}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link href="/quote" className="mobile-quote" onClick={closeMenu}>
            Quote cart{count > 0 ? ` (${count})` : ''}
          </Link>
        </div>
      )}
    </header>
  )
}
