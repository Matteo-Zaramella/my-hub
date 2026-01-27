import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET - Ottieni indizi risolti per squadra (o tutti per admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get('team_id')
    const isAdmin = searchParams.get('is_admin') === 'true'

    const supabase = createAdminClient()

    if (isAdmin) {
      // Admin vede tutti gli indizi risolti da tutte le squadre
      const { data, error } = await supabase
        .from('game_solved_clues')
        .select('*')
        .order('solved_at', { ascending: true })

      if (error) {
        // Tabella potrebbe non esistere, ritorna vuoto
        return NextResponse.json({ solved: [] })
      }

      return NextResponse.json({ solved: data || [] })
    }

    if (!teamId) {
      return NextResponse.json({ error: 'team_id richiesto' }, { status: 400 })
    }

    // Carica indizi risolti per la squadra specifica
    const { data, error } = await supabase
      .from('game_solved_clues')
      .select('clue_type, challenge_number')
      .eq('team_id', parseInt(teamId))

    if (error) {
      // Tabella potrebbe non esistere, ritorna vuoto
      return NextResponse.json({ solved: [] })
    }

    return NextResponse.json({
      solved: (data || []).map(d => `${d.challenge_number}_${d.clue_type}`)
    })

  } catch (error) {
    console.error('Error getting solved clues:', error)
    return NextResponse.json({ solved: [] })
  }
}

// POST - Segna indizio come risolto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { team_id, clue_type, challenge_number, solved_by_code, solved_by_nickname } = body

    if (!team_id || !clue_type || !challenge_number) {
      return NextResponse.json({
        error: 'Parametri mancanti',
        required: ['team_id', 'clue_type', 'challenge_number']
      }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Verifica se già risolto
    const { data: existing } = await supabase
      .from('game_solved_clues')
      .select('id')
      .eq('team_id', team_id)
      .eq('clue_type', clue_type)
      .eq('challenge_number', challenge_number)
      .single()

    if (existing) {
      return NextResponse.json({
        success: false,
        message: 'Indizio già risolto da questa squadra'
      })
    }

    // Inserisci record
    const { error } = await supabase
      .from('game_solved_clues')
      .insert({
        team_id,
        clue_type,
        challenge_number,
        solved_by_code,
        solved_by_nickname,
        solved_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error saving solved clue:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error saving solved clue:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
