import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PastoForm from './PastoForm'
import PastiList from './PastiList'

export default async function PastiPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all pasti (last 365 days for filtering)
  const oneYearAgo = new Date()
  oneYearAgo.setDate(oneYearAgo.getDate() - 365)

  const { data: pasti, error } = await supabase
    .from('pasti')
    .select('*')
    .eq('user_id', user.id)
    .gte('data', oneYearAgo.toISOString().split('T')[0])
    .order('data', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching pasti:', error)
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
            <h1 className="text-2xl font-bold text-gray-800">🍽️ Alimentazione</h1>
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
                Registra Pasto
              </h2>
              <PastoForm />
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2">
            <PastiList initialPasti={pasti || []} />
          </div>
        </div>
      </main>
    </div>
  )
}
