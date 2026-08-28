import { SiteHeaderNav } from '@/components/site-header-nav'
import { getCatalog } from '@/lib/catalog-data'
import { buildNavCategories } from '@/lib/catalog'

export async function SiteHeader() {
  const catalog = await getCatalog()
  const products = catalog.products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    categoryName: product.categoryName,
  }))
  return <SiteHeaderNav categories={buildNavCategories(catalog)} products={products} />
}
