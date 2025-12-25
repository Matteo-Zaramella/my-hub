import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DeviceForm from './DeviceForm'
import DeviceCard from './DeviceCard'

export default async function DispositiviPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ISOLATED: No auth required for dashboard
  // if (!user) {
  //   redirect('/login')
  // }

  // Fetch devices grouped by category
  let devices = null
  let error = null

  if (user) {
    const result = await supabase
      .from('devices')
      .select('*')
      .eq('user_id', user.id)
      .order('category', { ascending: true })
      .order('created_at', { ascending: false })

    devices = result.data
    error = result.error
  }

  if (error) {
    console.error('Error fetching devices:', error)
  }

  // Group devices by category
  const groupedDevices = devices?.reduce((acc: any, device: any) => {
    if (!acc[device.category]) {
      acc[device.category] = []
    }
    acc[device.category].push(device)
    return acc
  }, {} as Record<string, any[]>)

  const categories = [
    { name: 'PC Components', emoji: '🖥️', color: 'blue' },
    { name: 'Periferiche', emoji: '⌨️', color: 'purple' },
    { name: 'Bici', emoji: '🚴', color: 'green' },
    { name: 'Elettronica', emoji: '📱', color: 'yellow' },
    { name: 'Altro', emoji: '📦', color: 'gray' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-800">
              ← Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">🗄️ Database Dispositivi</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Form Section - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Aggiungi Dispositivo
              </h2>
              <DeviceForm />
            </div>
          </div>

          {/* Devices List Section */}
          <div className="lg:col-span-3 space-y-8">
            {categories.map((category) => {
              const categoryDevices = groupedDevices?.[category.name] || []

              return (
                <div key={category.name}>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                    <span>{category.emoji}</span>
                    <span>{category.name}</span>
                    <span className="text-sm font-normal text-gray-500">
                      ({categoryDevices.length})
                    </span>
                  </h2>

                  {categoryDevices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categoryDevices.map((device: any) => (
                        <DeviceCard key={device.id} device={device} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow p-8 text-center border-2 border-dashed border-gray-200">
                      <p className="text-gray-500">
                        Nessun dispositivo in questa categoria
                      </p>
                    </div>
                  )}
                </div>
              )
            })}

            {!devices || devices.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">🗄️</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Database vuoto
                </h3>
                <p className="text-gray-600">
                  Aggiungi il tuo primo dispositivo usando il form a sinistra!
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  )
}
