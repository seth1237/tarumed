import type { CatalogProduct } from '@/lib/catalog'

export const RECENT_VIEWS_KEY = 'tarumed-recent-products'
const STORE_LIMIT = 16
const FEATURED_LIMIT = 8

export function readRecentViewIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const parsed = JSON.parse(window.localStorage.getItem(RECENT_VIEWS_KEY) || '[]')
    if (!Array.isArray(parsed)) return []
    return parsed.filter((id): id is string => typeof id === 'string' && id.length > 0)
  } catch {
    return []
  }
}

export function recordRecentView(productId: string) {
  if (typeof window === 'undefined' || !productId) return
  try {
    const ids = readRecentViewIds().filter((id) => id !== productId)
    ids.unshift(productId)
    window.localStorage.setItem(RECENT_VIEWS_KEY, JSON.stringify(ids.slice(0, STORE_LIMIT)))
  } catch {}
}

export function mostViewedProducts(products: CatalogProduct[], limit = FEATURED_LIMIT): CatalogProduct[] {
  return [...products]
    .sort((a, b) => b.clicks - a.clicks || a.name.localeCompare(b.name))
    .slice(0, limit)
}

export function selectFeaturedProducts(
  products: CatalogProduct[],
  recentIds: string[],
  limit = FEATURED_LIMIT,
): CatalogProduct[] {
  const byId = new Map(products.map((product) => [product.id, product]))
  const picked: CatalogProduct[] = []
  const seen = new Set<string>()

  function take(product: CatalogProduct | undefined) {
    if (!product || seen.has(product.id)) return
    seen.add(product.id)
    picked.push(product)
  }

  for (const id of recentIds) {
    take(byId.get(id))
    if (picked.length >= limit) return picked
  }

  for (const product of mostViewedProducts(products, products.length)) {
    take(product)
    if (picked.length >= limit) break
  }

  return picked
}
