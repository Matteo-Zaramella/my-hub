import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Dashboard - Matteo Zaramella",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user data from users table
  const { data: userData } = await supabase
    .from('users')
    .select('username')
    .eq('id', user.id)
    .single()

  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">My Hub</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Ciao, <span className="font-medium">{userData?.username || user.email}</span>
            </span>
            <form action={handleSignOut}>
              <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                Esci
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Game Management Module */}
          <Link href="/dashboard/game-management">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer border-2 border-purple-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">🎮</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">A Tutto Reality: La Rivoluzione</h2>
                  <p className="text-sm text-gray-500">Gestione sfide</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Gestisci indizi, sfide e montepremi del gioco.
              </p>
            </div>
          </Link>

          {/* Fitness Module */}
          <Link href="/dashboard/fitness">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer border-2 border-green-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">💪</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Fitness</h2>
                  <p className="text-sm text-gray-500">Workout tracker</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Monitora i tuoi allenamenti e progressi nel fitness.
              </p>
            </div>
          </Link>

          {/* Pasti Module */}
          <Link href="/dashboard/pasti">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer border-2 border-orange-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">🍽️</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Alimentazione</h2>
                  <p className="text-sm text-gray-500">Tracking pasti</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Registra i tuoi pasti e monitora la tua alimentazione.
              </p>
            </div>
          </Link>

          {/* Wishlist Module */}
          <Link href="/dashboard/wishlist">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer border-2 border-pink-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">🎁</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Wishlist</h2>
                  <p className="text-sm text-gray-500">Lista desideri</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Gestisci la tua lista dei desideri e condividila.
              </p>
            </div>
          </Link>

          {/* Profile Settings Module */}
          <Link href="/dashboard/profile">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer border-2 border-purple-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">👤</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Profilo</h2>
                  <p className="text-sm text-gray-500">Impostazioni account</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Gestisci email, password e impostazioni del tuo profilo.
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}
