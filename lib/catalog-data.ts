import 'server-only'

import { cache } from 'react'
import { getERPCategories, getERPProductById, getERPProducts, type ERPCategory, type ERPProduct } from '@/lib/erp'
import { assignSlugs, mergeProduct, slugifyName, type Catalog, type CatalogProduct } from '@/lib/catalog'
import { getProductMetricsMap, getProductContentMap, getRelatedProductIds, getSiteSettings, type ProductContent } from '@/lib/mongodb'

const getCatalogBase = cache(async (categoryKey: string): Promise<Catalog> => {
  const categoryIds = categoryKey ? categoryKey.split(',') : undefined
  const [products, categories, content] = await Promise.all([
    getERPProducts(categoryIds).catch(() => [] as ERPProduct[]),
    getERPCategories().catch(() => [] as ERPCategory[]),
    getProductContentMap().catch(() => new Map<string, ProductContent>()),
  ])

  const merged = assignSlugs(
    products
      .map((product) => mergeProduct(product, content.get(product._id)))
      .filter((product): product is CatalogProduct => Boolean(product)),
  )

  const counts = new Map<string, number>()
  for (const product of merged) {
    counts.set(product.categoryId, (counts.get(product.categoryId) || 0) + 1)
  }

  const categoryList = categories
    .map((category) => ({ ...category, count: counts.get(category._id) || 0 }))
    .filter((category) => category.count > 0 || !categoryIds?.length)

  return { products: merged, categories: categoryList }
})

export async function getCatalog(categoryIds?: string[]): Promise<Catalog> {
  const [base, metrics] = await Promise.all([
    getCatalogBase(categoryIds?.slice().sort().join(',') || ''),
    getProductMetricsMap().catch(() => new Map()),
  ])

  const products = base.products
    .map((product) => {
      const stats = metrics.get(product.id)
      return { ...product, clicks: stats?.clicks || 0, shares: stats?.shares || 0 }
    })
    .sort((a, b) => b.clicks - a.clicks || a.name.localeCompare(b.name))

  return { products, categories: base.categories }
}

export async function getCatalogProduct(idOrSlug: string): Promise<CatalogProduct | null> {
  const key = decodeURIComponent(idOrSlug || '').trim()
  if (!key) return null
  const catalog = await getCatalog()
  const slugKey = slugifyName(key)
  const match = catalog.products.find((product) => product.id === key || product.slug === key || product.slug === slugKey)
  if (match) return match

  const [product, content, metrics] = await Promise.all([
    getERPProductById(key),
    getProductContentMap().catch(() => new Map<string, ProductContent>()),
    getProductMetricsMap().catch(() => new Map()),
  ])
  if (!product) return null
  const merged = mergeProduct(product, content.get(product._id))
  if (!merged) return null
  const stats = metrics.get(merged.id)
  return { ...merged, slug: slugifyName(merged.name) || merged.id, clicks: stats?.clicks || 0, shares: stats?.shares || 0 }
}

export async function getRelatedProducts(product: CatalogProduct, limit = 8): Promise<CatalogProduct[]> {
  const [catalog, nextIds] = await Promise.all([
    getCatalog(),
    getRelatedProductIds(product.id, limit).catch(() => [] as string[]),
  ])
  const seen = new Set<string>([product.id])
  const related: CatalogProduct[] = []

  for (const id of nextIds) {
    const match = catalog.products.find((item) => item.id === id)
    if (!match || seen.has(match.id)) continue
    seen.add(match.id)
    related.push(match)
    if (related.length >= limit) return related
  }

  for (const item of catalog.products) {
    if (item.categoryId !== product.categoryId || seen.has(item.id)) continue
    seen.add(item.id)
    related.push(item)
    if (related.length >= limit) break
  }

  return related
}

export async function getPriceVisibility() {
  const settings = await getSiteSettings().catch(() => ({ showPrices: true }))
  return settings.showPrices !== false
}
