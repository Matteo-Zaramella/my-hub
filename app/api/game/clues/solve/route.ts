import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Risposte corrette per gli indizi
const CORRECT_ANSWERS: Record<string, Record<string, { validate: (answer: string) => boolean }>> = {
  // Sfida 1 (Febbraio 2026)
  '1': {
    calendar: {
      validate: (answer: string) => answer === '22/02/2026'
    },
    clock: {
      validate: (answer: string) => answer === '15:00'
    },
    location: {
      validate: (answer: string) => {
        const normalized = answer.toLowerCase().trim()
        return normalized.includes('prato della valle') || normalized.includes('padova')
      }
    }
  }
}

// Nomi degli indizi in italiano
const CLUE_NAMES: Record<string, string> = {
  calendar: 'data',
  clock: 'orario',
  location: 'luogo'
}

export async function POST(request: NextRequest) {
  try {
    const {
      participant_code,
      challenge_number,
      clue_type,
      answer
    } = await request.json()

    // Validazione parametri
    if (!participant_code || !challenge_number || !clue_type || !answer) {
      return NextResponse.json(
        { error: 'Parametri mancanti' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Ottieni info partecipante e squadra
    const { data: participant, error: participantError } = await supabase
      .from('game_participants')
      .select(`
        id,
        nickname,
        team_id,
        game_teams (
          id,
          team_code,
          team_name
        )
      `)
      .eq('participant_code', participant_code)
      .single()

    if (participantError || !participant) {
      return NextResponse.json(
        { error: 'Partecipante non trovato' },
        { status: 404 }
      )
    }

    if (!participant.team_id || !participant.game_teams) {
      return NextResponse.json(
        { error: 'Partecipante non assegnato a una squadra' },
        { status: 400 }
      )
    }

    const team = participant.game_teams as { id: number; team_code: string; team_name: string }

    // Verifica che l'indizio non sia gia' stato risolto dalla squadra
    const { data: existingSolved } = await supabase
      .from('game_solved_clues')
      .select('id')
      .eq('team_id', team.id)
      .eq('challenge_number', challenge_number)
      .eq('clue_type', clue_type)
      .single()

    if (existingSolved) {
      return NextResponse.json(
        { error: 'Indizio gia risolto dalla tua squadra', already_solved: true },
        { status: 400 }
      )
    }

    // Verifica la risposta
    const challengeAnswers = CORRECT_ANSWERS[String(challenge_number)]
    if (!challengeAnswers || !challengeAnswers[clue_type]) {
      return NextResponse.json(
        { error: 'Indizio non valido' },
        { status: 400 }
      )
    }

    const isCorrect = challengeAnswers[clue_type].validate(answer)

    if (!isCorrect) {
      return NextResponse.json({
        success: false,
        correct: false,
        message: 'Risposta errata'
      })
    }

    // Risposta corretta! Procedi con salvataggio

    // 1. Salva l'indizio risolto
    const { error: solvedError } = await supabase
      .from('game_solved_clues')
      .insert({
        team_id: team.id,
        challenge_number: challenge_number,
        clue_type: clue_type,
        answer: answer,
        solver_participant_id: participant.id,
        solver_nickname: participant.nickname
      })

    if (solvedError) {
      console.error('Error saving solved clue:', solvedError)
      return NextResponse.json(
        { error: 'Errore nel salvataggio' },
        { status: 500 }
      )
    }

    // 2. Assegna 5 punti al partecipante
    const { error: pointsError } = await supabase
      .from('game_points')
      .insert({
        participant_id: participant.id,
        team_id: team.id,
        points: 5,
        reason: 'clue_found',
        description: `Indovinato indizio ${CLUE_NAMES[clue_type]} sfida ${challenge_number}`
      })

    if (pointsError) {
      console.error('Error assigning points:', pointsError)
      // Non blocchiamo, i punti possono essere assegnati manualmente
    }

    // Numero indizio (1, 2, 3 basato sul tipo)
    const clueNumber = clue_type === 'calendar' ? 1 : clue_type === 'clock' ? 2 : 3

    // 3. Messaggio nella chat globale (senza rivelare la soluzione)
    await supabase
      .from('game_chat_messages_game')
      .insert({
        participant_code: null,
        team_id: null, // Chat globale
        nickname: 'Sistema',
        message: `Squadra ${team.team_name} ha trovato la soluzione per l'indizio ${clueNumber} della sfida ${challenge_number}! La squadra guadagna 5 punti.`,
        message_type: 'system'
      })

    // 4. Messaggio nella chat di squadra
    await supabase
      .from('game_chat_messages_game')
      .insert({
        participant_code: null,
        team_id: team.id, // Chat di squadra
        nickname: 'Sistema',
        message: `${participant.nickname} ha indovinato l'indizio ${clueNumber} della sfida ${challenge_number}!`,
        message_type: 'system'
      })

    return NextResponse.json({
      success: true,
      correct: true,
      message: 'Risposta corretta!',
      points_awarded: 5
    })

  } catch (error) {
    console.error('Solve clue error:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

// GET - Ottieni gli indizi risolti dalla propria squadra
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get('team_id')
    const challengeNumber = searchParams.get('challenge_number')

    if (!teamId) {
      return NextResponse.json(
        { error: 'team_id richiesto' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    let query = supabase
      .from('game_solved_clues')
      .select('*')
      .eq('team_id', parseInt(teamId))

    if (challengeNumber) {
      query = query.eq('challenge_number', parseInt(challengeNumber))
    }

    const { data: solvedClues, error } = await query

    if (error) {
      console.error('Error fetching solved clues:', error)
      return NextResponse.json(
        { error: 'Errore nel caricamento' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      solved_clues: solvedClues || []
    })

  } catch (error) {
    console.error('Get solved clues error:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
