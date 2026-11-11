import { NextResponse } from 'next/server'
import { getCatalog } from '@/lib/catalog-data'
import { createERPQuote } from '@/lib/erp'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.clientName || !body.clientNumber || !body.clientLocation || !Array.isArray(body.items) || !body.items.length) {
      return NextResponse.json({
        success: false,
        message: 'clientName, clientNumber, clientLocation and items are required',
      }, { status: 400 })
    }

    const catalog = await getCatalog()
    const byId = new Map(catalog.products.map((product) => [product.id, product]))
    const items: Array<{ productId: string; quantity: number; unitPrice: number }> = []

    for (const item of body.items) {
      const quantity = Number(item.quantity)
      if (!item.productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 1000) {
        return NextResponse.json({ success: false, message: 'Invalid quote item' }, { status: 400 })
      }
      const product = byId.get(String(item.productId))
      if (!product) {
        return NextResponse.json({ success: false, message: 'One or more products are no longer available' }, { status: 400 })
      }
      items.push({
        productId: product.id,
        quantity,
        unitPrice: Number(product.price || 0),
      })
    }

    return NextResponse.json(await createERPQuote({
      clientName: String(body.clientName),
      clientNumber: String(body.clientNumber),
      clientLocation: String(body.clientLocation),
      contactPerson: body.contactPerson ? String(body.contactPerson) : undefined,
      email: body.email ? String(body.email) : undefined,
      items,
    }))
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Quote request failed',
    }, { status: 502 })
  }
}
