import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PastoForm from './PastoForm'
import PastoItem from './PastoItem'

export default async function PastiPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch pasti (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: pasti, error } = await supabase
    .from('pasti')
    .select('*')
    .eq('user_id', user.id)
    .gte('data', thirtyDaysAgo.toISOString().split('T')[0])
    .order('data', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching pasti:', error)
  }

  // Group by date
  const pastiByDate: { [key: string]: typeof pasti } = {}
  pasti?.forEach((pasto) => {
    const date = pasto.data
    if (!pastiByDate[date]) {
      pastiByDate[date] = []
    }
    pastiByDate[date].push(pasto)
  })

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
            <div className="space-y-6">
              {Object.keys(pastiByDate).length > 0 ? (
                Object.entries(pastiByDate).map(([date, pastiGiorno]) => (
                  <div key={date}>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">
                      📅 {new Date(date + 'T00:00:00').toLocaleDateString('it-IT', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </h3>
                    <div className="space-y-3">
                      {pastiGiorno.map((pasto) => (
                        <PastoItem key={pasto.id} pasto={pasto} />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <div className="text-6xl mb-4">🍽️</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Nessun pasto registrato
                  </h3>
                  <p className="text-gray-600">
                    Inizia a tracciare la tua alimentazione!
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
