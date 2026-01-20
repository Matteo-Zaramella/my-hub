import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const supabase = createAdminClient()

    // Ottieni tutte le sfide con i loro indizi pubblicati
    const { data: challenges, error } = await supabase
      .from('game_challenges')
      .select(`
        id,
        challenge_number,
        challenge_name,
        challenge_date,
        challenge_description,
        is_published,
        game_clues (
          id,
          clue_number,
          clue_text,
          clue_date,
          image_url,
          is_published
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

    // Filtra per mostrare solo sfide pubblicate e indizi pubblicati
    const filteredChallenges = challenges
      ?.filter(c => c.is_published)
      .map(c => ({
        ...c,
        clues: c.game_clues
          ?.filter((clue: { is_published: boolean }) => clue.is_published)
          .sort((a: { clue_number: number }, b: { clue_number: number }) => a.clue_number - b.clue_number)
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
