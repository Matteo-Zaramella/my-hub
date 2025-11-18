import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Cron job che rivela automaticamente gli indizi ogni sabato a mezzanotte
 * Viene eseguito da Vercel Cron Jobs
 */
export async function GET(request: Request) {
  // Verifica che la richiesta provenga da Vercel Cron
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()

  try {
    // Trova tutti gli indizi che:
    // 1. Non sono ancora stati rivelati (revealed_date IS NULL)
    // 2. Appartengono a sfide il cui start_date è passato
    const { data: unrevealed, error: fetchError } = await supabase
      .from('game_clues')
      .select(`
        id,
        clue_number,
        clue_text,
        revealed_date,
        game_challenges (
          id,
          challenge_number,
          title,
          start_date,
          end_date
        )
      `)
      .is('revealed_date', null)

    if (fetchError) {
      console.error('Error fetching unrevealed clues:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch clues', details: fetchError },
        { status: 500 }
      )
    }

    if (!unrevealed || unrevealed.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No clues to reveal',
        revealed: 0,
      })
    }

    const now = new Date()
    const cluestoReveal: number[] = []

    // Filtra gli indizi la cui sfida è iniziata
    for (const clue of unrevealed) {
      const challenge = Array.isArray(clue.game_challenges)
        ? clue.game_challenges[0]
        : clue.game_challenges

      if (challenge) {
        const startDate = new Date(challenge.start_date)
        if (startDate <= now) {
          cluestoReveal.push(clue.id)
        }
      }
    }

    if (cluestoReveal.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No clues ready to be revealed yet',
        revealed: 0,
      })
    }

    // Aggiorna revealed_date per gli indizi che devono essere rivelati
    const { error: updateError } = await supabase
      .from('game_clues')
      .update({ revealed_date: now.toISOString() })
      .in('id', cluestoReveal)

    if (updateError) {
      console.error('Error updating clues:', updateError)
      return NextResponse.json(
        { error: 'Failed to reveal clues', details: updateError },
        { status: 500 }
      )
    }

    console.log(`Successfully revealed ${cluestoReveal.length} clues`)

    return NextResponse.json({
      success: true,
      message: `Revealed ${cluestoReveal.length} clues`,
      revealed: cluestoReveal.length,
      clue_ids: cluestoReveal,
      timestamp: now.toISOString(),
    })
  } catch (error) {
    console.error('Unexpected error in reveal-clues cron:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
