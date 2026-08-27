'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronDown, Menu, Search, X } from 'lucide-react'
import { Logo } from '@/components/logo'
import { COMPANY } from '@/lib/utils'
import { productHref, type NavCategory } from '@/lib/catalog'

const links = [
  { href: '/shop', label: 'Products' },
  { href: '/blog', label: 'Blog' },
  { href: '/jobs', label: 'Jobs' },
  { href: '/contact', label: 'Contact' },
]

export function SiteHeaderNav({ categories }: { categories: NavCategory[] }) {
  const [open, setOpen] = useState(false)
  const [mobileCategory, setMobileCategory] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const pathname = usePathname()
  const router = useRouter()

  function closeMenu() {
    setOpen(false)
    setMobileCategory(null)
  }

  function onSearch(event: React.FormEvent) {
    event.preventDefault()
    const q = query.trim()
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop')
    closeMenu()
  }

  return (
    <header className="site-header">
      <div className="topline">
        <div className="shell flex items-center justify-between gap-4">
          <span>{COMPANY.tagline}</span>
          <span className="hidden sm:inline">{COMPANY.location} · {COMPANY.phone}</span>
        </div>
      </div>
      <div className="shell header-row">
        <Logo />
        <nav className="main-nav">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={pathname === link.href ? 'active' : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <form className="search" onSubmit={onSearch}>
            <Search size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              aria-label="Search products"
            />
          </form>
        </div>
        <button className="mobile-trigger" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <nav className="category-nav" aria-label="Product categories">
        <div className="shell category-nav-row">
          {categories.map((category) => (
            <div className="category-item" key={category.id}>
              <Link href={`/categories/${category.id}`} className="category-trigger">
                <span>{category.name}</span>
                <small>{category.count}</small>
                <ChevronDown size={14} />
              </Link>
              <div className="category-dropdown">
                <div className="shell dropdown-panel">
                  <div className="dropdown-head">
                    <div>
                      <strong>{category.name}</strong>
                      <span>{category.count} products</span>
                    </div>
                    <Link href={`/categories/${category.id}`}>View all</Link>
                  </div>
                  <div className="dropdown-products">
                    {category.products.map((product) => (
                      <Link key={product.id} href={productHref(product)}>{product.name}</Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </nav>

      {open && (
        <div className="mobile-menu shell">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={closeMenu}>{link.label}</Link>
          ))}
          <div className="mobile-categories">
            <p>Categories</p>
            {categories.map((category) => {
              const expanded = mobileCategory === category.id
              return (
                <div key={category.id} className="mobile-category">
                  <div className="mobile-category-row">
                    <Link href={`/categories/${category.id}`} onClick={closeMenu}>{category.name}</Link>
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-label={`${expanded ? 'Hide' : 'Show'} ${category.name} products`}
                      onClick={() => setMobileCategory(expanded ? null : category.id)}
                    >
                      <ChevronDown size={16} className={expanded ? 'chevron open' : 'chevron'} />
                    </button>
                  </div>
                  {expanded && (
                    <div className="mobile-products">
                      {category.products.map((product) => (
                        <Link key={product.id} href={productHref(product)} onClick={closeMenu}>{product.name}</Link>
                      ))}
                      <Link href={`/categories/${category.id}`} onClick={closeMenu} className="mobile-view-all">
                        View all {category.count} products
                      </Link>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <form className="search" onSubmit={onSearch}>
            <Search size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              aria-label="Search products"
            />
          </form>
        </div>
      )}
    </header>
  )
}
