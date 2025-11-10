import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import GameArea from './GameArea'

export default async function GamePage({
  searchParams,
}: {
  searchParams: { password?: string }
}) {
  const supabase = await createClient()

  // Check if user is authenticated (optional - game can be public with password)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Verify password (for now, we'll set a temporary password)
  // TODO: Store the game password in database or environment variable
  const GAME_PASSWORD = 'thegame2026' // This will be revealed at the ceremony

  const password = searchParams.password

  if (!password || password !== GAME_PASSWORD) {
    // Redirect back to home if password is wrong
    redirect('/')
  }

  // Fetch game configuration
  const { data: gameConfig } = await supabase
    .from('game_prize_config')
    .select('*')
    .single()

  // Fetch all challenges
  const { data: challenges } = await supabase
    .from('game_challenges')
    .select('*')
    .order('challenge_number', { ascending: true })

  // Fetch leaderboard
  const { data: leaderboard } = await supabase
    .from('game_user_scores')
    .select(`
      user_id,
      points,
      users (username)
    `)
    .order('points', { ascending: false })
    .limit(10)

  return (
    <GameArea
      gameConfig={gameConfig}
      challenges={challenges || []}
      leaderboard={leaderboard || []}
      user={user}
    />
  )
}
