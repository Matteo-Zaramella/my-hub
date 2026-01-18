import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  const correctPassword = process.env.PRIVATE_PASSWORD

  if (password === correctPassword) {
    const response = NextResponse.json({ success: true })

    // Set cookie that expires in 7 days
    response.cookies.set('private_auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    return response
  }

  return NextResponse.json({ success: false, error: 'Password errata' }, { status: 401 })
}
