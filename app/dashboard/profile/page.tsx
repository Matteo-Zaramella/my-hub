import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ProfileForm from './ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              ← Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">👤 Profilo e Impostazioni</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-purple-200/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.email?.[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Il Tuo Profilo</h2>
              <p className="text-gray-600 text-sm">Gestisci le tue credenziali e impostazioni</p>
            </div>
          </div>

          {/* Current Info */}
          <div className="bg-purple-50 rounded-lg p-4 mb-6 border border-purple-200">
            <h3 className="font-semibold text-gray-800 mb-2">📧 Email Attuale</h3>
            <p className="text-gray-700">{user.email}</p>
            <p className="text-xs text-gray-500 mt-1">User ID: {user.id}</p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex gap-2 items-start">
              <div className="text-blue-600 text-xl">ℹ️</div>
              <div className="text-sm text-gray-700">
                <p className="font-semibold text-gray-800 mb-2">Come funziona:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Puoi cambiare email e/o password quando vuoi</li>
                  <li><strong>Tutti i tuoi dati rimangono al sicuro:</strong> wishlist, pasti, allenamenti, game progress</li>
                  <li>Per cambiare l&apos;email riceverai un&apos;email di conferma al nuovo indirizzo</li>
                  <li>La password richiede almeno 6 caratteri</li>
                </ul>
              </div>
            </div>
          </div>

          <ProfileForm currentEmail={user.email || ''} />
        </div>

        {/* Data Info */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-200/50">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🔒 I Tuoi Dati Sono Protetti</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-4 border border-pink-200">
              <div className="text-2xl mb-2">🎁</div>
              <h4 className="font-semibold text-gray-800">Wishlist</h4>
              <p className="text-sm text-gray-600">Tutti i tuoi desideri salvati</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-200">
              <div className="text-2xl mb-2">🍽️</div>
              <h4 className="font-semibold text-gray-800">Alimentazione</h4>
              <p className="text-sm text-gray-600">Storico pasti e preset</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <div className="text-2xl mb-2">💪</div>
              <h4 className="font-semibold text-gray-800">Fitness</h4>
              <p className="text-sm text-gray-600">Sessioni e progressi</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
              <div className="text-2xl mb-2">🎮</div>
              <h4 className="font-semibold text-gray-800">The Game</h4>
              <p className="text-sm text-gray-600">Progressi e punteggi</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
