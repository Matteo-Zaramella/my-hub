import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import GameManagement from './GameManagement'

export default async function GameManagementPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch game config
  const { data: gameConfig } = await supabase
    .from('game_prize_config')
    .select('*')
    .single()

  // Fetch all challenges
  const { data: challenges } = await supabase
    .from('game_challenges')
    .select(`
      *,
      game_clues (*)
    `)
    .order('challenge_number', { ascending: true })

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-white/60 hover:text-white">
              ← Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-white">🎮 Gestione Il Castello di Zara</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GameManagement
          gameConfig={gameConfig}
          challenges={challenges || []}
        />
      </main>
    </div>
  )
}
