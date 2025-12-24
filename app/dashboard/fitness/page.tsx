import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import WorkoutSessionForm from './WorkoutSessionForm'
import FitnessList from './FitnessList'

export default async function FitnessPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ISOLATED: No auth required for dashboard
  // if (!user) {
  //   redirect('/login')
  // }

  // Fetch workout sessions (last 365 days for filtering)
  const oneYearAgo = new Date()
  oneYearAgo.setDate(oneYearAgo.getDate() - 365)

  let sessions = null
  let error = null

  if (user) {
    const result = await supabase
      .from('workout_sessions')
      .select(`
        *,
        workout_exercises (*)
      `)
      .eq('user_id', user.id)
      .gte('data', oneYearAgo.toISOString().split('T')[0])
      .order('data', { ascending: false })
      .order('created_at', { ascending: false })

    sessions = result.data
    error = result.error
  }

  if (error) {
    console.error('Error fetching workout sessions:', error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-800">
              ← Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">💪 Fitness</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Nuova Sessione
              </h2>
              <WorkoutSessionForm />
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2">
            <FitnessList initialSessions={sessions || []} />
          </div>
        </div>
      </main>
    </div>
  )
}
