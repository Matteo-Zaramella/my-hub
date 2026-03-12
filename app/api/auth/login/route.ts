import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE, Role } from '@/lib/auth'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: 'Password mancante' }, { status: 400 })
    }

    const supabase = getAdminClient()
    const { data: users } = await supabase
      .from('users')
      .select('id, username, password, role')

    if (!users?.length) {
      return NextResponse.json({ error: 'Credenziali non valide' }, { status: 401 })
    }

    // Find user whose password matches
    let matchedUser = null
    for (const user of users) {
      if (await bcrypt.compare(password, user.password)) {
        matchedUser = user
        break
      }
    }

    if (!matchedUser) {
      return NextResponse.json({ error: 'Credenziali non valide' }, { status: 401 })
    }

    const token = await signSession({
      userId: matchedUser.id,
      username: matchedUser.username,
      role: matchedUser.role as Role,
      exp: Date.now() + SESSION_MAX_AGE * 1000,
    })

    const response = NextResponse.json({ success: true, role: matchedUser.role })
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 })
  }
}
