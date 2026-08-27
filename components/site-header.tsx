import { SiteHeaderNav } from '@/components/site-header-nav'
import { getCatalog } from '@/lib/catalog-data'
import { buildNavCategories } from '@/lib/catalog'

export async function SiteHeader() {
  const catalog = await getCatalog()
  return <SiteHeaderNav categories={buildNavCategories(catalog)} />
}
