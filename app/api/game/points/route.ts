import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// API per gestire i punti
// GET /api/game/points - Classifica
// POST /api/game/points - Assegna punti (admin)

// GET - Ottieni classifica
export async function GET(request: Request) {
  const supabase = createAdminClient()
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
        .neq('nickname', 'Samantha') // Escludi Samantha
        .order('individual_points', { ascending: false })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({
        type: 'individual',
        leaderboard: data
      })

    } else {
      // Classifica squadre - calcola totale dinamicamente
      const { data: teams, error: teamsError } = await supabase
        .from('game_teams')
        .select('id, team_code, team_name, team_color')

      if (teamsError) {
        return NextResponse.json({ error: teamsError.message }, { status: 500 })
      }

      // Per ogni squadra, calcola il totale punti e conta i membri (esclusa Samantha)
      const teamsWithStats = await Promise.all(
        (teams || []).map(async (team) => {
          // Ottieni tutti i membri della squadra (esclusa Samantha)
          const { data: members, error: membersError } = await supabase
            .from('game_participants')
            .select('individual_points')
            .eq('team_id', team.id)
            .neq('nickname', 'Samantha')

          if (membersError) {
            console.error('Error fetching members:', membersError)
            return { ...team, total_points: 0, member_count: 0 }
          }

          // Calcola somma punti e conta membri
          const total_points = (members || []).reduce((sum, m) => sum + (m.individual_points || 0), 0)
          const member_count = members?.length || 0

          return {
            ...team,
            total_points,
            member_count
          }
        })
      )

      // Ordina per punti totali (decrescente)
      teamsWithStats.sort((a, b) => b.total_points - a.total_points)

      return NextResponse.json({
        type: 'teams',
        leaderboard: teamsWithStats
      })
    }

  } catch (error) {
    console.error('Points GET error:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}

// POST - Assegna punti
export async function POST(request: Request) {
  const supabase = createAdminClient()
  try {
    const { searchParams } = new URL(request.url)
    const adminKey = searchParams.get('key')

    if (adminKey !== process.env.ADMIN_SECRET_KEY && adminKey !== 'cerimonia2026') {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const body = await request.json()
    const { participant_id, participant_code, nickname, team_id, points, reason, description } = body

    if (!points || !reason) {
      return NextResponse.json({
        error: 'Parametri mancanti',
        required: ['points', 'reason'],
        optional: ['participant_id', 'participant_code', 'nickname', 'team_id', 'description']
      }, { status: 400 })
    }

    // Risolvi participant_id
    let finalParticipantId = participant_id
    let finalTeamId = team_id

    // Cerca per participant_code
    if (participant_code && !participant_id) {
      const { data: participant } = await supabase
        .from('game_participants')
        .select('id, team_id')
        .eq('participant_code', participant_code)
        .single()

      if (participant) {
        finalParticipantId = participant.id
        if (!team_id) finalTeamId = participant.team_id
      }
    }

    // Cerca per nickname
    if (nickname && !finalParticipantId) {
      const { data: participant } = await supabase
        .from('game_participants')
        .select('id, team_id')
        .eq('nickname', nickname)
        .single()

      if (participant) {
        finalParticipantId = participant.id
        if (!team_id) finalTeamId = participant.team_id
      }
    }

    // Se abbiamo participant_id ma non team_id, recuperalo
    if (finalParticipantId && !finalTeamId) {
      const { data: participant } = await supabase
        .from('game_participants')
        .select('team_id')
        .eq('id', finalParticipantId)
        .single()

      if (participant) {
        finalTeamId = participant.team_id
      }
    }

    // 1. Registra la transazione nel log
    const { error: logError } = await supabase
      .from('game_points')
      .insert({
        participant_id: finalParticipantId || null,
        team_id: finalTeamId || null,
        points,
        reason,
        description: description || null
      })

    if (logError) {
      console.error('Error logging points:', logError)
      return NextResponse.json({ error: logError.message }, { status: 500 })
    }

    // 2. Aggiorna i punti individuali del partecipante (se specificato)
    if (finalParticipantId) {
      const { error: updateError } = await supabase.rpc('increment_participant_points', {
        p_id: finalParticipantId,
        p_points: points
      })

      // Se la funzione RPC non esiste, fai l'update manuale
      if (updateError) {
        // Fallback: update manuale
        const { data: current } = await supabase
          .from('game_participants')
          .select('individual_points')
          .eq('id', finalParticipantId)
          .single()

        const newPoints = (current?.individual_points || 0) + points

        await supabase
          .from('game_participants')
          .update({ individual_points: newPoints })
          .eq('id', finalParticipantId)
      }
    }

    return NextResponse.json({
      success: true,
      message: `${points} punti assegnati`,
      participant_id: finalParticipantId,
      team_id: finalTeamId
    })

  } catch (error) {
    console.error('Points POST error:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
