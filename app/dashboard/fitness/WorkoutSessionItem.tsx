'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface WorkoutExercise {
  id: number
  esercizio: string
  serie_numero: number
  ripetizioni: number
  peso: number
  note: string | null
}

interface WorkoutSession {
  id: number
  data: string
  workout_type: string
  completato: boolean
  created_at: string
  workout_exercises: WorkoutExercise[]
}

interface WorkoutSessionItemProps {
  session: WorkoutSession
}

export default function WorkoutSessionItem({ session }: WorkoutSessionItemProps) {
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm('Eliminare questa sessione di allenamento?')) return

    setLoading(true)

    // Delete exercises first (cascade should handle this, but being explicit)
    const { error: exercisesError } = await supabase
      .from('workout_exercises')
      .delete()
      .eq('session_id', session.id)

    if (exercisesError) {
      alert('Errore durante l\'eliminazione degli esercizi')
      console.error(exercisesError)
      setLoading(false)
      return
    }

    // Delete session
    const { error: sessionError } = await supabase
      .from('workout_sessions')
      .delete()
      .eq('id', session.id)

    if (sessionError) {
      alert('Errore durante l\'eliminazione della sessione')
      console.error(sessionError)
      setLoading(false)
    } else {
      router.refresh()
    }
  }

  const getWorkoutTypeColor = (type: string) => {
    switch (type) {
      case 'A':
        return 'bg-red-100 text-red-800'
      case 'B':
        return 'bg-blue-100 text-blue-800'
      case 'C':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Group exercises by name
  const exercisesByName: { [key: string]: WorkoutExercise[] } = {}
  session.workout_exercises.forEach((ex) => {
    if (!exercisesByName[ex.esercizio]) {
      exercisesByName[ex.esercizio] = []
    }
    exercisesByName[ex.esercizio].push(ex)
  })

  const totalExercises = Object.keys(exercisesByName).length
  const totalSets = session.workout_exercises.length

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition">
      {/* Header */}
      <div
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${getWorkoutTypeColor(session.workout_type)}`}>
                🏋️ Scheda {session.workout_type}
              </span>
              <span className="text-xs text-gray-500">
                {totalExercises} esercizi · {totalSets} serie totali
              </span>
            </div>

            {/* Preview (first 2 exercises) */}
            {!expanded && (
              <div className="text-sm text-gray-600">
                {Object.keys(exercisesByName).slice(0, 2).map((nome, idx) => (
                  <span key={idx}>
                    {nome}
                    {idx < Math.min(1, Object.keys(exercisesByName).length - 1) && ', '}
                  </span>
                ))}
                {totalExercises > 2 && <span> e altri {totalExercises - 2}...</span>}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setExpanded(!expanded)
              }}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              title={expanded ? 'Comprimi' : 'Espandi'}
            >
              <svg
                className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDelete()
              }}
              disabled={loading}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 flex-shrink-0"
              title="Elimina"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-4 pb-4 border-t">
          <div className="mt-4 space-y-4">
            {Object.entries(exercisesByName).map(([nome, exercises]) => (
              <div key={nome} className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-medium text-gray-800 mb-2 text-sm">{nome}</h4>
                <div className="space-y-1">
                  {exercises.map((ex) => (
                    <div key={ex.id} className="text-xs text-gray-600 flex justify-between">
                      <span>
                        Serie {ex.serie_numero}: {ex.ripetizioni} reps × {ex.peso}kg
                      </span>
                      {ex.note && <span className="italic text-gray-500">{ex.note}</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
