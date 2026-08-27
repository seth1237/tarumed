import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === '/admin/login' || pathname.startsWith('/api/auth/')) return NextResponse.next()
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const session = request.cookies.get('tarumed_admin')?.value
    if (!session) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ success: false, message: 'Sign in required' }, { status: 401 })
      }
      const login = new URL('/admin/login', request.url)
      return NextResponse.redirect(login)
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
}
