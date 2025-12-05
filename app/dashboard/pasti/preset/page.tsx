import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PresetManagement from './PresetManagement'

export default async function PresetPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user's presets
  const { data: presets } = await supabase
    .from('meal_presets')
    .select('*')
    .eq('user_id', user.id)
    .order('meal_type', { ascending: true })
    .order('day_type', { ascending: true })

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200/50 sticky top-0 z-10">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/pasti" className="text-gray-600 hover:text-gray-900">
              ← Torna ai Pasti
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">⚙️ Gestione Preset Pasti</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-orange-200/50">
          <h2 className="text-lg font-bold text-gray-800 mb-2">ℹ️ Come funziona</h2>
          <p className="text-gray-600 text-sm mb-3">
            Crea e gestisci i tuoi pasti predefiniti per velocizzare la registrazione giornaliera.
          </p>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li><strong>Tipo Pasto:</strong> Colazione, Pranzo, Cena, Snack, o Pizza</li>
            <li><strong>Tipo Giorno:</strong> Allenamento o Riposo (opzionale per Snack e Pizza)</li>
            <li><strong>Descrizione:</strong> Cosa include il pasto (ingredienti, quantità, note)</li>
          </ul>
        </div>

        <PresetManagement initialPresets={presets || []} userId={user.id} />
      </main>
    </div>
  )
}
