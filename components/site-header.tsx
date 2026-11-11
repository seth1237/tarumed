import { SiteHeaderNav } from '@/components/site-header-nav'
import { getCatalog } from '@/lib/catalog-data'

export async function SiteHeader() {
  const catalog = await getCatalog()
  const products = catalog.products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    categoryName: product.categoryName,
    sku: product.sku,
    manufacturer: product.manufacturer,
  }))
  const categories = catalog.categories
    .filter((category) => category.count > 0)
    .map((category) => ({
      id: category._id,
      name: category.name,
      count: category.count,
    }))
  return <SiteHeaderNav products={products} categories={categories} />
}
