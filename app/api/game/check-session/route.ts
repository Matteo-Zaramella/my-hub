import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const cookieStore = await cookies()
    const participantCode = cookieStore.get('game_participant')?.value

    if (!participantCode) {
      return NextResponse.json({ valid: false })
    }

    // Verifica che il codice sia ancora valido nel database
    const { data: participant, error } = await supabaseAdmin
      .from('game_participants')
      .select('participant_code, nickname')
      .eq('participant_code', participantCode)
      .single()

    if (error || !participant) {
      return NextResponse.json({ valid: false })
    }

    return NextResponse.json({
      valid: true,
      nickname: participant.nickname,
      code: participant.participant_code
    })
  } catch {
    return NextResponse.json({ valid: false })
  }
}
