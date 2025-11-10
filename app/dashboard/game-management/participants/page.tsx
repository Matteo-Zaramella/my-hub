import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ParticipantsManagement from './ParticipantsManagement'

export default async function ParticipantsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: participants } = await supabase
    .from('game_participants')
    .select('*')
    .eq('user_id', user.id)
    .order('participant_name', { ascending: true })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/game" className="text-gray-600 hover:text-gray-900">
              ← Torna al Game
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">👥 Gestione Partecipanti</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-200/50">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Lista Partecipanti</h2>
            <p className="text-gray-600 text-sm">
              Gestisci i partecipanti al gioco. Ogni partecipante riceve un codice univoco.
            </p>
          </div>

          <ParticipantsManagement initialParticipants={participants || []} userId={user.id} />
        </div>
      </main>
    </div>
  )
}
