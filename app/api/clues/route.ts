import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const supabase = createAdminClient()

    // Data corrente per il controllo (server-side, non manipolabile dal client)
    const now = new Date().toISOString().split('T')[0] // YYYY-MM-DD

    // Ottieni tutte le sfide con i loro indizi
    // Colonne reali: title, start_date, description, revealed_date
    const { data: challenges, error } = await supabase
      .from('game_challenges')
      .select(`
        id,
        challenge_number,
        title,
        start_date,
        description,
        location,
        game_clues (
          id,
          clue_number,
          clue_text,
          revealed_date,
          image_url
        )
      `)
      .order('challenge_number', { ascending: true })

    if (error) {
      console.error('Error fetching challenges:', error)
      return NextResponse.json(
        { error: 'Errore nel caricamento' },
        { status: 500 }
      )
    }

    // SICUREZZA: Filtra SERVER-SIDE in base alla data
    // - Sfide: visibili solo se start_date <= oggi
    // - Indizi: visibili solo se revealed_date <= oggi
    // Questo impedisce ai furbi di vedere contenuti futuri
    const filteredChallenges = challenges
      ?.filter(c => {
        if (!c.start_date) return false
        const challengeDate = c.start_date.split('T')[0]
        return challengeDate <= now
      })
      .map(c => ({
        id: c.id,
        challenge_number: c.challenge_number,
        title: c.title,
        start_date: c.start_date,
        description: c.description,
        location: c.location,
        // Filtra indizi per data - NESSUN indizio futuro viene esposto
        clues: (c.game_clues || [])
          .filter((clue: { revealed_date: string | null }) => {
            if (!clue.revealed_date) return false
            const clueDate = clue.revealed_date.split('T')[0]
            return clueDate <= now
          })
          .sort((a: { clue_number: number }, b: { clue_number: number }) => a.clue_number - b.clue_number)
          .map((clue: { id: number; clue_number: number; clue_text: string; revealed_date: string; image_url: string | null }) => ({
            id: clue.id,
            clue_number: clue.clue_number,
            clue_text: clue.clue_text,
            revealed_date: clue.revealed_date,
            image_url: clue.image_url
          }))
      }))

    return NextResponse.json({
      challenges: filteredChallenges || []
    })

  } catch (error) {
    console.error('Get clues error:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
