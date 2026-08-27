export type ERPProduct = {
  _id: string
  name?: string
  productName?: string
  description?: string
  sellingPrice?: number
  category?: string
  categoryName?: string
  productType?: string
  unit?: string
  imageUrl?: string
  isActive?: boolean
  currentQuantity?: number
  manufacturer?: string
}

export type ERPCategory = {
  _id: string
  name: string
  description?: string
}

const baseUrl = process.env.ERP_API_BASE_URL || 'https://backend.codewithseth.co.ke'
const orgId = process.env.ERP_ORG_ID

function requireOrgId() {
  if (!orgId) throw new Error('ERP_ORG_ID is not configured')
  return orgId
}

async function erpGet<T>(path: string): Promise<T> {
  const id = requireOrgId()
  const url = new URL(path, baseUrl)
  url.searchParams.set('orgId', id)
  const response = await fetch(url, {
    headers: { 'X-Org-Id': id },
    next: { revalidate: 120 },
  })
  if (!response.ok) {
    throw new Error(`ERP request failed (${response.status}) for ${path}`)
  }
  return response.json() as Promise<T>
}

export async function getERPProducts(categoryIds?: string[]): Promise<ERPProduct[]> {
  if (!orgId) return []
  const params = new URLSearchParams({ orgId })
  if (categoryIds?.length) params.set('categoryIds', categoryIds.join(','))
  const response = await fetch(`${baseUrl}/api/stock/public/products?${params}`, {
    headers: { 'X-Org-Id': orgId },
    next: { revalidate: 120 },
  })
  if (!response.ok) throw new Error(`ERP products request failed: ${response.status}`)
  const payload = await response.json()
  return (payload.data || []) as ERPProduct[]
}

export async function getERPProductById(id: string): Promise<ERPProduct | null> {
  if (!orgId || !id) return null
  const response = await fetch(`${baseUrl}/api/stock/public/products/${id}?orgId=${orgId}`, {
    headers: { 'X-Org-Id': orgId },
    next: { revalidate: 60 },
  })
  if (response.status === 404) return null
  if (!response.ok) throw new Error(`ERP product request failed: ${response.status}`)
  const payload = await response.json()
  return (payload.data || null) as ERPProduct | null
}

export async function getERPCategories(): Promise<ERPCategory[]> {
  if (!orgId) return []
  const payload = await erpGet<{ data?: ERPCategory[] }>('/api/stock/public/categories')
  return payload.data || []
}

export async function createERPQuote(body: {
  clientName: string
  clientNumber: string
  clientLocation: string
  contactPerson?: string
  email?: string
  items: Array<{ productId: string; quantity: number; unitPrice: number }>
}) {
  const id = requireOrgId()
  const response = await fetch(`${baseUrl}/api/stock/public/quote-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Org-Id': id },
    body: JSON.stringify({ ...body, orgId: id }),
  })
  if (!response.ok) throw new Error(`ERP quote request failed: ${response.status}`)
  return response.json()
}
