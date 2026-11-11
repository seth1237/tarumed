import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { corsHeaders, corsOrigin } from '@/lib/cors'

export function proxy(request: NextRequest) {
  const origin = corsOrigin(request.headers.get('origin'))

  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 })
    if (origin) {
      for (const [key, value] of Object.entries(corsHeaders(origin))) {
        response.headers.set(key, value)
      }
    }
    return response
  }

  const response = NextResponse.next()
  if (origin) {
    for (const [key, value] of Object.entries(corsHeaders(origin))) {
      response.headers.set(key, value)
    }
  }
  return response
}

export const config = {
  matcher: '/api/:path*',
}
