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

  const { data: pasti } = await supabase
    .from('pasti')
    .select('*')
    .eq('user_id', user.id)
    .gte('data', oneYearAgo.toISOString().split('T')[0])
    .order('data', { ascending: false })
    .order('created_at', { ascending: false })

  // Fetch meal presets
  const { data: presets } = await supabase
    .from('meal_presets')
    .select('*')
    .eq('user_id', user.id)
    .order('meal_type', { ascending: true })

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              ← Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">🍽️ Alimentazione</h1>
          </div>
          <Link 
            href="/dashboard/pasti/preset" 
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium text-sm"
          >
            ⚙️ Gestisci Preset
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 sticky top-24 border border-orange-200/50">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Registra Pasto
              </h2>
              <PastoForm presets={presets || []} />
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
