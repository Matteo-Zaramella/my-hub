'use client'

import { useState } from 'react'
import WorkoutSessionItem from './WorkoutSessionItem'

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

interface WorkoutSessionListProps {
  sessions: WorkoutSession[]
}

export default function WorkoutSessionList({ sessions }: WorkoutSessionListProps) {
  // Group sessions by date
  const sessionsByDate: { [key: string]: WorkoutSession[] } = {}
  sessions.forEach((session) => {
    const date = session.data
    if (!sessionsByDate[date]) {
      sessionsByDate[date] = []
    }
    sessionsByDate[date].push(session)
  })

  if (Object.keys(sessionsByDate).length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <div className="text-6xl mb-4">💪</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Nessuna sessione registrata
        </h3>
        <p className="text-gray-600">
          Inizia a tracciare i tuoi allenamenti!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {Object.entries(sessionsByDate).map(([date, sessionsGiorno]) => (
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
            {sessionsGiorno.map((session) => (
              <WorkoutSessionItem key={session.id} session={session} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
