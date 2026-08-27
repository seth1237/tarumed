import { NextResponse } from 'next/server'
import { z } from 'zod'
import { authenticateAdmin, setAdminSession } from '@/lib/auth'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json())
    const admin = await authenticateAdmin(body.email, body.password)
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 })
    }
    await setAdminSession(admin.email)
    return NextResponse.json({ success: true, email: admin.email, name: admin.name })
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 400 })
  }
}
