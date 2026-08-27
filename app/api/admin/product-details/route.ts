import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getAdminSession } from '@/lib/auth'
import { isMongoConfigured, updateProductDetails } from '@/lib/mongodb'

const schema = z.object({
  erpProductId: z.string().min(1),
  details: z.string().max(8000),
})

export async function POST(request: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ success: false, message: 'Sign in required' }, { status: 401 })
  if (!isMongoConfigured()) return NextResponse.json({ success: false, message: 'MongoDB is not configured' }, { status: 503 })
  try {
    const body = schema.parse(await request.json())
    const data = await updateProductDetails(body.erpProductId, body.details.trim())
    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, message: 'Could not save product details' }, { status: 400 })
  }
}
