import { NextResponse } from 'next/server'
import { getERPCategories } from '@/lib/erp'

export async function GET() {
  try {
    const data = await getERPCategories()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'ERP unavailable',
    }, { status: 502 })
  }
}
