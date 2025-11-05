import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import WishlistForm from './WishlistForm'
import WishlistItem from './WishlistItem'

export default async function WishlistPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch wishlist items
  const { data: items, error } = await supabase
    .from('wishlist')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching wishlist:', error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-800">
              ← Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">🎁 Wishlist</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Aggiungi Item
              </h2>
              <WishlistForm />
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items && items.length > 0 ? (
                items.map((item) => (
                  <WishlistItem key={item.id} item={item} />
                ))
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <div className="text-6xl mb-4">🎁</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Nessun item nella wishlist
                  </h3>
                  <p className="text-gray-600">
                    Aggiungi il tuo primo desiderio usando il form a sinistra!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
