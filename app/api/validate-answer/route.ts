import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { participantId, submittedCode } = await request.json()

    // Validazione input
    if (!participantId || !submittedCode) {
      return NextResponse.json(
        { success: false, message: 'Dati mancanti' },
        { status: 400 }
      )
    }

    // Validazione lunghezza (30 caratteri esatti)
    if (submittedCode.length !== 30) {
      return NextResponse.json({
        success: true,
        correct: false,
        message: 'Il codice deve essere esattamente 30 caratteri'
      })
    }

    const supabase = await createClient()

    // ⚠️ CRITICAL: Cerca il codice con EXACT MATCH (case-sensitive, no trim)
    // Verifica prima negli indizi
    const { data: clueMatch, error: clueError } = await supabase
      .from('game_clues')
      .select('id, challenge_id, answer_code')
      .eq('answer_code', submittedCode) // EXACT MATCH
      .single()

    if (clueError && clueError.code !== 'PGRST116') { // PGRST116 = no rows
      console.error('Error checking clues:', clueError)
    }

    // Se trovato negli indizi
    if (clueMatch && clueMatch.answer_code === submittedCode) {
      // Verifica se già validato dal partecipante
      const { data: existingSubmission } = await supabase
        .from('clue_submissions')
        .select('id')
        .eq('participant_id', participantId)
        .eq('clue_id', clueMatch.id)
        .single()

      if (existingSubmission) {
        return NextResponse.json({
          success: true,
          correct: false,
          message: 'Hai già validato questo indizio!'
        })
      }

      // Calcola rank (quanti hanno già validato questo indizio)
      const { count } = await supabase
        .from('clue_submissions')
        .select('id', { count: 'exact', head: true })
        .eq('clue_id', clueMatch.id)

      const rank = (count || 0) + 1

      // Calcola punti (100 per il primo, poi decrescente)
      const points = Math.max(100 - (rank - 1) * 5, 10)

      // Inserisci submission
      const { error: insertError } = await supabase
        .from('clue_submissions')
        .insert({
          participant_id: participantId,
          clue_id: clueMatch.id,
          submitted_code: submittedCode,
          points_earned: points,
          submission_rank: rank
        })

      if (insertError) {
        console.error('Error inserting clue submission:', insertError)
        return NextResponse.json({
          success: false,
          message: 'Errore nel salvataggio. Riprova.'
        }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        correct: true,
        points,
        rank,
        type: 'clue',
        message: `Indizio validato! Sei il/la ${rank}° a scoprirlo!`
      })
    }

    // Verifica nelle sfide
    const { data: challengeMatch, error: challengeError } = await supabase
      .from('game_challenges')
      .select('id, answer_code')
      .eq('answer_code', submittedCode) // EXACT MATCH
      .single()

    if (challengeError && challengeError.code !== 'PGRST116') {
      console.error('Error checking challenges:', challengeError)
    }

    // Se trovato nelle sfide
    if (challengeMatch && challengeMatch.answer_code === submittedCode) {
      // Verifica se già validato dal partecipante
      const { data: existingSubmission } = await supabase
        .from('challenge_submissions')
        .select('id')
        .eq('participant_id', participantId)
        .eq('challenge_id', challengeMatch.id)
        .single()

      if (existingSubmission) {
        return NextResponse.json({
          success: true,
          correct: false,
          message: 'Hai già completato questa sfida!'
        })
      }

      // Calcola rank
      const { count } = await supabase
        .from('challenge_submissions')
        .select('id', { count: 'exact', head: true })
        .eq('challenge_id', challengeMatch.id)

      const rank = (count || 0) + 1

      // Punti sfide: 200 per il primo, poi decrescente
      const points = Math.max(200 - (rank - 1) * 10, 20)

      // Inserisci submission
      const { error: insertError } = await supabase
        .from('challenge_submissions')
        .insert({
          participant_id: participantId,
          challenge_id: challengeMatch.id,
          submitted_code: submittedCode,
          points_earned: points,
          submission_rank: rank
        })

      if (insertError) {
        console.error('Error inserting challenge submission:', insertError)
        return NextResponse.json({
          success: false,
          message: 'Errore nel salvataggio. Riprova.'
        }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        correct: true,
        points,
        rank,
        type: 'challenge',
        message: `Sfida completata! Sei il/la ${rank}° a risolverla!`
      })
    }

    // Codice non trovato
    return NextResponse.json({
      success: true,
      correct: false,
      message: 'Codice non valido. Ricontrolla e riprova.'
    })

  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { success: false, message: 'Errore server. Riprova.' },
      { status: 500 }
    )
  }
}
