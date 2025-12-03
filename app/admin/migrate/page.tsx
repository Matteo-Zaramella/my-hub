'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function MigratePage() {
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const runMigration = async () => {
    setLoading(true)
    setStatus('Running migration...')

    try {
      const supabase = createClient()

      // Execute migration SQL
      const { error } = await supabase.rpc('exec_migration_minigame_progress')

      if (error) {
        setStatus(`Error: ${error.message}`)
      } else {
        setStatus('✓ Migration completed successfully!')
      }
    } catch (err: any) {
      setStatus(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Database Migration</h1>
        <p className="text-gray-600 mb-6">
          This will add the minigame_progress column to game_participants table.
        </p>

        <button
          onClick={runMigration}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Running...' : 'Run Migration'}
        </button>

        {status && (
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <pre className="text-sm">{status}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
