import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import Image from 'next/image'

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

  // TEMPORARY: Allow access without authentication
  // if (!user) {
  //   redirect('/login')
  // }

  // Get user data from users table
  let userData = null
  if (user) {
    const { data } = await supabase
      .from('users')
      .select('username')
      .eq('id', user.id)
      .single()
    userData = data
  }

  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black border-b border-white/10">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">My Hub</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/60">
              Ciao, <span className="font-medium text-white">{userData?.username || user?.email || 'Ospite'}</span>
            </span>
            {user && (
              <form action={handleSignOut}>
                <button className="text-sm text-red-500 hover:text-red-400 font-medium transition">
                  Esci
                </button>
              </form>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-center items-center gap-8 flex-wrap">
          {/* Game Management Module */}
          <Link href="/dashboard/game-management">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer border border-white/10 hover:border-white/20 w-64 h-64 flex items-center justify-center overflow-hidden group">
              <Image
                src="/logo.png"
                alt="A Tutto Reality: La Rivoluzione"
                width={256}
                height={256}
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>

          {/* Wishlist Module */}
          <Link href="/dashboard/wishlist">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer border border-white/10 hover:border-white/20 w-64 h-64 flex items-center justify-center group">
              <div className="text-9xl group-hover:scale-110 transition-transform duration-300">🎁</div>
            </div>
          </Link>

          {/* Todo Module */}
          <Link href="/dashboard/todo">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer border border-white/10 hover:border-white/20 w-64 h-64 flex items-center justify-center group">
              <div className="text-9xl group-hover:scale-110 transition-transform duration-300">✅</div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}
