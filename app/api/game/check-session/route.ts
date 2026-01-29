import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'

export async function GET() {
  const supabaseAdmin = createAdminClient()
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
        is_admin,
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
      // Handle both array and object responses from Supabase
      const gameTeams = participant.game_teams as unknown as {
        id: number
        team_code: string
        team_name: string
        team_color: string
      } | {
        id: number
        team_code: string
        team_name: string
        team_color: string
      }[]
      const teamData = Array.isArray(gameTeams) ? gameTeams[0] : gameTeams

      if (teamData) {
        team = {
          id: teamData.id,
          code: teamData.team_code,
          name: teamData.team_name,
          color: teamData.team_color
        }
      }
    }

    return NextResponse.json({
      valid: true,
      nickname: participant.nickname,
      code: participant.participant_code,
      team: team,
      isAdmin: participant.is_admin || false
    })
  } catch {
    return NextResponse.json({ valid: false })
  }
}
