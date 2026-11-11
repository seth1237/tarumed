'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { productHref, productMatchesQuery, type SearchProduct } from '@/lib/catalog'

export function SearchBox({
  products,
  onNavigate,
}: {
  products: SearchProduct[]
  onNavigate?: () => void
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const wrapRef = useRef<HTMLDivElement>(null)
  const urlQuery = pathname === '/shop' ? searchParams.get('q') || '' : ''
  const [query, setQuery] = useState(urlQuery)
  const [open, setOpen] = useState(false)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (!dirty) setQuery(urlQuery)
  }, [urlQuery, dirty])

  const matches = useMemo(() => {
    const q = query.trim()
    if (q.length < 1) return []
    return products.filter((product) => productMatchesQuery(product, q)).slice(0, 8)
  }, [products, query])

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  useEffect(() => {
    if (pathname !== '/shop' || !dirty) return
    const q = query.trim()
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (q) params.set('q', q)
      else params.delete('q')
      params.delete('page')
      const qs = params.toString()
      router.replace(qs ? `/shop?${qs}` : '/shop', { scroll: false })
    }, 120)
    return () => window.clearTimeout(timer)
  }, [query, pathname, router, dirty, searchParams])

  function goToResults() {
    const q = query.trim()
    if (pathname === '/shop') {
      const params = new URLSearchParams(searchParams.toString())
      if (q) params.set('q', q)
      else params.delete('q')
      params.delete('page')
      const qs = params.toString()
      router.push(qs ? `/shop?${qs}` : '/shop')
    } else {
      router.push(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop')
    }
    setOpen(false)
    onNavigate?.()
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    goToResults()
  }

  return (
    <div className="search-wrap" ref={wrapRef}>
      <form className="search" onSubmit={onSubmit} role="search">
        <Search size={16} />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setDirty(true)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search products"
          aria-label="Search products"
          aria-autocomplete="list"
          autoComplete="off"
          inputMode="search"
          enterKeyHint="search"
        />
      </form>
      {open && query.trim() && (
        <div className="search-results" role="listbox">
          {matches.length === 0 && <p className="search-empty">No matching products</p>}
          {matches.map((product) => (
            <Link
              key={product.id}
              href={productHref(product)}
              className="search-result"
              onClick={() => {
                setOpen(false)
                onNavigate?.()
              }}
            >
              <strong>{product.name}</strong>
              {product.sku ? <small>{product.sku}</small> : null}
            </Link>
          ))}
          <button type="button" className="search-all" onClick={goToResults}>
            View all results
          </button>
        </div>
      )}
    </div>
  )
}
