import { NextResponse } from 'next/server'
import { assignSlugs, mergeProduct, type CatalogProduct } from '@/lib/catalog'
import { getERPProducts } from '@/lib/erp'
import { getProductMetricsMap, getProductContentMap } from '@/lib/mongodb'

export async function GET(request: Request) {
  const categoryIds = new URL(request.url).searchParams.get('categoryIds')?.split(',').filter(Boolean)
  try {
    const [products, content, metrics] = await Promise.all([
      getERPProducts(categoryIds),
      getProductContentMap().catch(() => new Map()),
      getProductMetricsMap().catch(() => new Map()),
    ])
    const data = assignSlugs(
      products
        .map((product) => mergeProduct(product, content.get(product._id)))
        .filter((product): product is CatalogProduct => Boolean(product)),
    )
      .map((product) => {
        const stats = metrics.get(product.id)
        return { ...product, clicks: stats?.clicks || 0, shares: stats?.shares || 0 }
      })
      .sort((a, b) => b.clicks - a.clicks || a.name.localeCompare(b.name))
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'ERP unavailable',
    }, { status: 502 })
  }
}
