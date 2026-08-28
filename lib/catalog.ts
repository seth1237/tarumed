import type { ERPCategory, ERPProduct } from '@/lib/erp'

export type CatalogProduct = {
  id: string
  name: string
  description: string
  details: string
  categoryId: string
  categoryName: string
  price: number
  unit: string
  stock: number
  inStock: boolean
  image: string | null
  images: string[]
  imageAssets: Array<{ publicId: string; secureUrl: string }>
  manufacturer?: string
  clicks: number
  shares: number
  slug: string
}

export type CatalogCategory = ERPCategory & { count: number }

export type Catalog = {
  products: CatalogProduct[]
  categories: CatalogCategory[]
}

export type NavProduct = { id: string; name: string; slug: string }

export type SearchProduct = {
  id: string
  name: string
  slug: string
  categoryName: string
}

export type NavCategory = {
  id: string
  name: string
  count: number
  products: NavProduct[]
}

export function buildNavCategories(catalog: Catalog): NavCategory[] {
  return catalog.categories
    .filter((category) => category.count > 0)
    .map((category) => ({
      id: category._id,
      name: category.name,
      count: category.count,
      products: catalog.products
        .filter((product) => product.categoryId === category._id)
        .map((product) => ({ id: product.id, name: product.name, slug: product.slug })),
    }))
}

const PLACEHOLDER = '/product-placeholder.svg'

export function formatKes(amount: number) {
  if (!amount) return 'Request a quote'
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function mergeProduct(product: ERPProduct, content?: {
  details?: string
  images?: Array<{ publicId?: string; secureUrl?: string }>
  secureUrl?: string
} | null): CatalogProduct | null {
  const id = product._id
  const name = String(product.productName || product.name || '').trim()
  if (!id || !name || product.isActive === false) return null
  const stock = Number(product.currentQuantity ?? 0)
  const extraAssets = (content?.images || []).filter((image): image is { publicId: string; secureUrl: string } => Boolean(image.secureUrl && image.publicId))
  const extraImages = extraAssets.map((image) => image.secureUrl)
  const images = extraImages.length ? extraImages : [content?.secureUrl, product.imageUrl].filter((url): url is string => Boolean(url))
  const details = String(content?.details || '').trim()
  return {
    id,
    name,
    description: details || String(product.description || '').trim(),
    details,
    categoryId: String(product.category || ''),
    categoryName: String(product.categoryName || 'Uncategorised'),
    price: Number(product.sellingPrice || 0),
    unit: product.unit || 'unit',
    stock,
    inStock: true,
    image: images[0] || null,
    images,
    imageAssets: extraAssets,
    manufacturer: product.manufacturer && product.manufacturer !== 'none' ? product.manufacturer : undefined,
    clicks: 0,
    shares: 0,
    slug: slugifyName(name),
  }
}

export function slugifyName(name: string) {
  return String(name || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export function assignSlugs(products: CatalogProduct[]): CatalogProduct[] {
  const used = new Set<string>()
  return products.map((product) => {
    let slug = product.slug || slugifyName(product.name) || `product-${product.id.slice(-6)}`
    if (used.has(slug)) slug = `${slug}-${product.id.slice(-6)}`
    used.add(slug)
    return { ...product, slug }
  })
}

export function productHref(product: Pick<CatalogProduct, 'slug' | 'id'>) {
  return `/products/${product.slug || product.id}`
}

export function isProductObjectId(value: string) {
  return /^[a-f0-9]{24}$/i.test(value)
}

export function productImageSrc(product: Pick<CatalogProduct, 'image'>) {
  return product.image || PLACEHOLDER
}
