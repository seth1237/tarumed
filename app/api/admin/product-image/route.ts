import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getAdminSession } from '@/lib/auth'
import { deleteCloudinaryImage, isCloudinaryConfigured, uploadProductImage } from '@/lib/cloudinary'
import { addProductImage, isMongoConfigured, removeProductImage } from '@/lib/mongodb'

const deleteSchema = z.object({
  erpProductId: z.string().min(1),
  publicId: z.string().min(1),
})

export async function POST(request: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ success: false, message: 'Sign in required' }, { status: 401 })
  if (!isMongoConfigured()) return NextResponse.json({ success: false, message: 'MongoDB is not configured' }, { status: 503 })
  if (!isCloudinaryConfigured()) return NextResponse.json({ success: false, message: 'Cloudinary is not configured' }, { status: 503 })

  const form = await request.formData()
  const erpProductId = String(form.get('erpProductId') || '').trim()
  const files = form.getAll('file').filter((item): item is File => item instanceof File)
  if (!erpProductId || !files.length) {
    return NextResponse.json({ success: false, message: 'erpProductId and image files are required' }, { status: 400 })
  }

  try {
    const uploaded = []
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue
      if (file.size > 8 * 1024 * 1024) continue
      const buffer = Buffer.from(await file.arrayBuffer())
      const result = await uploadProductImage(buffer, erpProductId)
      uploaded.push(await addProductImage(erpProductId, {
        publicId: result.public_id,
        secureUrl: result.secure_url,
      }))
    }
    if (!uploaded.length) return NextResponse.json({ success: false, message: 'No valid images uploaded' }, { status: 400 })
    return NextResponse.json({ success: true, data: uploaded.at(-1) })
  } catch (error) {
    console.error('Product image upload failed', error)
    return NextResponse.json({ success: false, message: 'Could not upload image' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ success: false, message: 'Sign in required' }, { status: 401 })
  if (!isMongoConfigured()) return NextResponse.json({ success: false, message: 'MongoDB is not configured' }, { status: 503 })

  try {
    const body = deleteSchema.parse(await request.json())
    const existing = await removeProductImage(body.erpProductId, body.publicId)
    if (existing?.publicId && isCloudinaryConfigured()) {
      await deleteCloudinaryImage(existing.publicId).catch(() => undefined)
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, message: 'Could not remove image' }, { status: 400 })
  }
}
