'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { CatalogProduct } from '@/lib/catalog'

const STORAGE_KEY = 'tarumed-quote-cart'

export type QuoteCartItem = {
  id: string
  name: string
  slug: string
  categoryName: string
  price: number
  quantity: number
  sku?: string
  image?: string | null
}

type QuoteCartContextValue = {
  items: QuoteCartItem[]
  count: number
  ready: boolean
  has: (id: string) => boolean
  add: (product: Pick<CatalogProduct, 'id' | 'name' | 'slug' | 'categoryName' | 'price' | 'sku' | 'image'>, quantity?: number) => void
  remove: (id: string) => void
  setQuantity: (id: string, quantity: number) => void
  clear: () => void
}

const QuoteCartContext = createContext<QuoteCartContextValue | null>(null)

function readCart(): QuoteCartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item) => item && typeof item.id === 'string' && item.name && Number(item.quantity) > 0)
  } catch {
    return []
  }
}

export function QuoteCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteCartItem[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setItems(readCart())
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, ready])

  const add = useCallback((product: Pick<CatalogProduct, 'id' | 'name' | 'slug' | 'categoryName' | 'price' | 'sku' | 'image'>, quantity = 1) => {
    setItems((current) => {
      const found = current.find((item) => item.id === product.id)
      if (found) {
        return current.map((item) => (
          item.id === product.id
            ? { ...item, quantity: Math.min(1000, item.quantity + quantity) }
            : item
        ))
      }
      return [...current, {
        id: product.id,
        name: product.name,
        slug: product.slug,
        categoryName: product.categoryName,
        price: Number(product.price || 0),
        quantity: Math.max(1, quantity),
        sku: product.sku,
        image: product.image,
      }]
    })
  }, [])

  const remove = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  const setQuantity = useCallback((id: string, quantity: number) => {
    const next = Math.floor(quantity) || 0
    if (next < 1) {
      setItems((current) => current.filter((item) => item.id !== id))
      return
    }
    setItems((current) => current.map((item) => (item.id === id ? { ...item, quantity: Math.min(1000, next) } : item)))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<QuoteCartContextValue>(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    ready,
    has: (id: string) => items.some((item) => item.id === id),
    add,
    remove,
    setQuantity,
    clear,
  }), [items, ready, add, remove, setQuantity, clear])

  return <QuoteCartContext.Provider value={value}>{children}</QuoteCartContext.Provider>
}

export function useQuoteCart() {
  const context = useContext(QuoteCartContext)
  if (!context) throw new Error('useQuoteCart must be used within QuoteCartProvider')
  return context
}
