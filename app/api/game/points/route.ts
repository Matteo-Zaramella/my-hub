import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// API per gestire i punti
// GET /api/game/points - Classifica
// POST /api/game/points - Assegna punti (admin)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Ottieni classifica
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'teams' // 'teams' o 'individual'

    if (type === 'individual') {
      // Classifica individuale
      const { data, error } = await supabase
        .from('game_participants')
        .select(`
          id,
          nickname,
          individual_points,
          team_id,
          game_teams (
            team_code,
            team_name,
            team_color
          )
        `)
        .gt('individual_points', 0)
        .order('individual_points', { ascending: false })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({
        type: 'individual',
        leaderboard: data
      })

    } else {
      // Classifica squadre
      const { data, error } = await supabase
        .from('game_teams')
        .select('id, team_code, team_name, team_color, total_points')
        .order('total_points', { ascending: false })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // Aggiungi conteggio membri
      const teamsWithCount = await Promise.all(
        (data || []).map(async (team) => {
          const { count } = await supabase
            .from('game_participants')
            .select('*', { count: 'exact', head: true })
            .eq('team_id', team.id)

          return {
            ...team,
            member_count: count || 0
          }
        })
      )

      return NextResponse.json({
        type: 'teams',
        leaderboard: teamsWithCount
      })
    }

  } catch (error) {
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}

// POST - Assegna punti (admin)
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const adminKey = searchParams.get('key')

    if (adminKey !== process.env.ADMIN_SECRET_KEY && adminKey !== 'cerimonia2026') {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const body = await request.json()
    const { participant_id, participant_code, team_id, points, reason, description } = body

    if (!points || !reason) {
      return NextResponse.json({
        error: 'Parametri mancanti',
        required: ['points', 'reason'],
        optional: ['participant_id', 'participant_code', 'team_id', 'description']
      }, { status: 400 })
    }

    // Risolvi participant_id da participant_code se necessario
    let finalParticipantId = participant_id
    let finalTeamId = team_id

    if (participant_code && !participant_id) {
      const { data: participant } = await supabase
        .from('game_participants')
        .select('id, team_id')
        .eq('unique_code', participant_code)
        .single()

      if (participant) {
        finalParticipantId = participant.id
        if (!team_id) {
          finalTeamId = participant.team_id
        }
      }
    } else if (participant_id && !team_id) {
      const { data: participant } = await supabase
        .from('game_participants')
        .select('team_id')
        .eq('id', participant_id)
        .single()

      if (participant) {
        finalTeamId = participant.team_id
      }
    }

    // Inserisci punti
    const { data, error } = await supabase
      .from('game_points')
      .insert({
        participant_id: finalParticipantId || null,
        team_id: finalTeamId || null,
        points,
        reason,
        description: description || null
      })
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `${points} punti assegnati`,
      data
    })

  } catch (error) {
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
