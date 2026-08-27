import type { MetadataRoute } from 'next'
import { productHref } from '@/lib/catalog'
import { getCatalog } from '@/lib/catalog-data'
import { COMPANY } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = COMPANY.url
  const pages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${base}/jobs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]

  try {
    const catalog = await getCatalog()
    for (const product of catalog.products) {
      pages.push({
        url: `${base}${productHref(product)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      })
    }
    for (const category of catalog.categories) {
      pages.push({
        url: `${base}/categories/${category._id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.5,
      })
    }
  } catch {
    return pages
  }

  return pages
}
