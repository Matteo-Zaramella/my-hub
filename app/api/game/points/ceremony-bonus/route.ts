import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// API per assegnare i 50 punti bonus della cerimonia
// POST /api/game/points/ceremony-bonus

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    // Verifica authorization (semplice per ora)
    const { searchParams } = new URL(request.url)
    const adminKey = searchParams.get('key')

    if (adminKey !== process.env.ADMIN_SECRET_KEY && adminKey !== 'cerimonia2026') {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    // Ottieni tutti i partecipanti con squadra assegnata
    const { data: participants, error: fetchError } = await supabase
      .from('game_participants')
      .select('id, nickname, team_id')
      .not('team_id', 'is', null)

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    if (!participants || participants.length === 0) {
      return NextResponse.json({ error: 'Nessun partecipante trovato' }, { status: 404 })
    }

    // Verifica se i punti cerimonia sono già stati assegnati
    const { data: existingBonus } = await supabase
      .from('game_points')
      .select('id')
      .eq('reason', 'ceremony_bonus')
      .limit(1)

    if (existingBonus && existingBonus.length > 0) {
      return NextResponse.json({
        error: 'Punti cerimonia già assegnati',
        message: 'I 50 punti bonus sono già stati distribuiti'
      }, { status: 400 })
    }

    // Assegna 50 punti a ogni partecipante
    const pointsToInsert = participants.map(p => ({
      participant_id: p.id,
      team_id: p.team_id,
      points: 50,
      reason: 'ceremony_bonus',
      description: 'Bonus cerimonia apertura 24/01/2026'
    }))

    const { error: insertError } = await supabase
      .from('game_points')
      .insert(pointsToInsert)

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // Calcola punti totali per squadra
    const teamPoints: Record<number, number> = {}
    participants.forEach(p => {
      teamPoints[p.team_id] = (teamPoints[p.team_id] || 0) + 50
    })

    return NextResponse.json({
      success: true,
      message: `50 punti assegnati a ${participants.length} partecipanti`,
      details: {
        totalParticipants: participants.length,
        pointsPerPerson: 50,
        totalPointsDistributed: participants.length * 50,
        teamBreakdown: teamPoints
      }
    })

  } catch (error) {
    console.error('Errore assegnazione punti cerimonia:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}

// GET per verificare stato
export async function GET() {
  try {
    // Conta punti cerimonia già assegnati
    const { data: bonusPoints, error } = await supabase
      .from('game_points')
      .select('participant_id, points')
      .eq('reason', 'ceremony_bonus')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const assigned = bonusPoints?.length || 0
    const totalPoints = bonusPoints?.reduce((sum, p) => sum + p.points, 0) || 0

    return NextResponse.json({
      ceremonyBonusAssigned: assigned > 0,
      participantsWithBonus: assigned,
      totalBonusPoints: totalPoints
    })

  } catch (error) {
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
