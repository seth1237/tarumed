'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Menu, ShoppingCart, X } from 'lucide-react'
import { Logo } from '@/components/logo'
import { SearchBox } from '@/components/search-box'
import { useQuoteCart } from '@/components/quote-cart'
import type { CategoryLink, SearchProduct } from '@/lib/catalog'

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
  categories,
}: {
  products: SearchProduct[]
  categories: CategoryLink[]
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { count, ready } = useQuoteCart()

  function closeMenu() {
    setOpen(false)
  }

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="site-header">
      <Suspense>
        <CloseOnNavigate onClose={closeMenu} />
      </Suspense>
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
          <Suspense fallback={<div className="search-wrap" />}>
            <SearchBox products={products} />
          </Suspense>
          <Link href="/quote" className="cart-link" aria-label={`Quote cart, ${ready ? count : 0} items`}>
            <ShoppingCart size={18} />
            {ready && count > 0 && <span className="cart-count">{count}</span>}
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
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {categories.length > 0 && (
            <Suspense>
              <MobileCategoryNav categories={categories} />
            </Suspense>
          )}
          <Link href="/quote" className="mobile-quote">
            Quote cart{count > 0 ? ` (${count})` : ''}
          </Link>
        </div>
      )}
    </header>
  )
}

function CloseOnNavigate({ onClose }: { onClose: () => void }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const route = `${pathname}?${searchParams}`
  const previous = useRef(route)

  useEffect(() => {
    if (previous.current === route) return
    previous.current = route
    onClose()
  }, [route, onClose])

  return null
}

function MobileCategoryNav({
  categories,
}: {
  categories: CategoryLink[]
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeCategory = pathname === '/shop' ? searchParams.get('category') || '' : ''
  const total = categories.reduce((sum, category) => sum + category.count, 0)

  return (
    <nav className="mobile-categories" aria-label="Product categories">
      <p>Categories</p>
      <div className="mobile-category-list">
        <Link
          href="/shop"
          className={pathname === '/shop' && !activeCategory ? 'active' : undefined}
        >
          <span>All products</span>
          <small>{total}</small>
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/shop?category=${encodeURIComponent(category.id)}`}
            className={activeCategory === category.id ? 'active' : undefined}
          >
            <span>{category.name}</span>
            <small>{category.count}</small>
          </Link>
        ))}
      </div>
    </nav>
  )
}
