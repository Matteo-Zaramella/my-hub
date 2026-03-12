import { NextResponse, type NextRequest } from 'next/server'
import { verifySession, SESSION_COOKIE } from '@/lib/auth'

export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Public paths
  if (
    path === '/' ||
    path === '/private/login' ||
    path.startsWith('/api/auth/') ||
    path.startsWith('/api/')
  ) {
    return NextResponse.next()
  }

  // Protected private paths
  if (path.startsWith('/private')) {
    const token = request.cookies.get(SESSION_COOKIE)?.value
    if (!token) return redirectToLogin(request)

    const session = await verifySession(token)
    if (!session) return redirectToLogin(request)

    // limited role: only /private/wishlist
    if (session.role === 'limited' && !path.startsWith('/private/wishlist')) {
      const url = request.nextUrl.clone()
      url.pathname = '/private/wishlist'
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  }

  // Anything else -> home
  const url = request.nextUrl.clone()
  url.pathname = '/'
  return NextResponse.redirect(url)
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone()
  url.pathname = '/private/login'
  if (request.nextUrl.pathname !== '/private') {
    url.searchParams.set('from', request.nextUrl.pathname)
  }
  return NextResponse.redirect(url)
}
