import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Codice richiesto' }, { status: 400 })
    }

    // Verifica che il codice esista nel database
    const { data: participant, error } = await supabaseAdmin
      .from('game_participants')
      .select('participant_code, nickname')
      .eq('participant_code', code.toUpperCase())
      .single()

    if (error || !participant) {
      return NextResponse.json({ error: 'Codice non valido' }, { status: 401 })
    }

    // Imposta un cookie per ricordare l'accesso
    const cookieStore = await cookies()
    cookieStore.set('game_participant', participant.participant_code, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 anno
      path: '/'
    })

    return NextResponse.json({
      success: true,
      nickname: participant.nickname
    })
  } catch {
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 })
  }
}
