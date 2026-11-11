import { AdminProductsPanel } from '@/components/admin-products-panel'
import { getCatalog } from '@/lib/catalog-data'

export default async function AdminProductsPage() {
  const catalog = await getCatalog()
  return (
    <AdminProductsPanel
      products={catalog.products}
      categories={catalog.categories}
      title="Products"
      subtitle="Filter by photo status or category, then drop photos onto a product or open it to edit details."
    />
  )
}
