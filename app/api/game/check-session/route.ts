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

    // Verifica che il codice sia ancora valido nel database e carica info squadra
    const { data: participant, error } = await supabaseAdmin
      .from('game_participants')
      .select(`
        participant_code,
        nickname,
        team_id,
        game_teams (
          id,
          team_code,
          team_name,
          team_color
        )
      `)
      .eq('participant_code', participantCode)
      .single()

    if (error || !participant) {
      return NextResponse.json({ valid: false })
    }

    // Prepara info squadra
    let team = null
    if (participant.game_teams) {
      const teamData = participant.game_teams as unknown as {
        id: number
        team_code: string
        team_name: string
        team_color: string
      }
      team = {
        id: teamData.id,
        code: teamData.team_code,
        name: teamData.team_name,
        color: teamData.team_color
      }
    }

    return NextResponse.json({
      valid: true,
      nickname: participant.nickname,
      code: participant.participant_code,
      team: team
    })
  } catch {
    return NextResponse.json({ valid: false })
  }
}
