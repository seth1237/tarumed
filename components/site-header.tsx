import { SiteHeaderNav } from '@/components/site-header-nav'
import { getCatalog } from '@/lib/catalog-data'

export async function SiteHeader() {
  const catalog = await getCatalog()
  const products = catalog.products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    categoryName: product.categoryName,
  }))
  return <SiteHeaderNav products={products} />
}
