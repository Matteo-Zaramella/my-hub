import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createAdminClient()
  try {
    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get('team_id')

    if (!teamId) {
      return NextResponse.json({ error: 'team_id richiesto' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('game_participants')
      .select('nickname, individual_points')
      .eq('team_id', parseInt(teamId))
      .eq('is_admin', false)
      .neq('nickname', 'Samantha') // Escludi Samantha dalla classifica
      .order('individual_points', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      members: data || []
    })

  } catch (error) {
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
