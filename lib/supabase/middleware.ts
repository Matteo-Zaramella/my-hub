import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Pagine valide: / e /wishlist
  if (path === '/' || path.startsWith('/wishlist') || path.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Qualsiasi altro path -> redirect a home
  const url = request.nextUrl.clone()
  url.pathname = '/'
  return NextResponse.redirect(url)
}
