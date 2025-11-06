'use client'

import { useState } from 'react'
import WorkoutSessionItem from './WorkoutSessionItem'
import jsPDF from 'jspdf'

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
  note: string | null
  created_at: string
  workout_exercises: WorkoutExercise[]
}

interface FitnessListProps {
  initialSessions: WorkoutSession[]
}

export default function FitnessList({ initialSessions }: FitnessListProps) {
  const today = new Date().toISOString().split('T')[0]
  const sixtyDaysAgo = new Date()
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

  const [startDate, setStartDate] = useState(sixtyDaysAgo.toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(today)

  // Filter sessions by date range
  const filteredSessions = initialSessions.filter(session => {
    return session.data >= startDate && session.data <= endDate
  })

  // Group by date
  const sessionsByDate: { [key: string]: WorkoutSession[] } = {}
  filteredSessions.forEach((session) => {
    const date = session.data
    if (!sessionsByDate[date]) {
      sessionsByDate[date] = []
    }
    sessionsByDate[date].push(session)
  })

  const exportToPDF = () => {
    const doc = new jsPDF()

    // Title
    doc.setFontSize(20)
    doc.text('Riepilogo Allenamenti', 20, 20)

    // Date range
    doc.setFontSize(12)
    const startFormatted = new Date(startDate + 'T00:00:00').toLocaleDateString('it-IT')
    const endFormatted = new Date(endDate + 'T00:00:00').toLocaleDateString('it-IT')
    doc.text(`Periodo: ${startFormatted} - ${endFormatted}`, 20, 30)

    let yPosition = 45

    // Content
    Object.entries(sessionsByDate).forEach(([date, sessionsGiorno]) => {
      sessionsGiorno.forEach((session) => {
        // Check if we need a new page
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }

        // Date and workout type header
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        const dateFormatted = new Date(date + 'T00:00:00').toLocaleDateString('it-IT', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
        doc.text(`${dateFormatted} - Scheda ${session.workout_type}`, 20, yPosition)
        yPosition += 8

        // Group exercises by name
        const exercisesByName: { [key: string]: WorkoutExercise[] } = {}
        session.workout_exercises.forEach((ex) => {
          if (!exercisesByName[ex.esercizio]) {
            exercisesByName[ex.esercizio] = []
          }
          exercisesByName[ex.esercizio].push(ex)
        })

        // Exercises
        doc.setFontSize(11)
        doc.setFont('helvetica', 'normal')
        Object.entries(exercisesByName).forEach(([nome, exercises]) => {
          if (yPosition > 270) {
            doc.addPage()
            yPosition = 20
          }

          doc.setFont('helvetica', 'bold')
          doc.text(nome, 25, yPosition)
          yPosition += 5

          doc.setFont('helvetica', 'normal')
          exercises.forEach((ex) => {
            if (yPosition > 270) {
              doc.addPage()
              yPosition = 20
            }
            doc.text(`  Serie ${ex.serie_numero}: ${ex.ripetizioni} reps x ${ex.peso}kg`, 30, yPosition)
            yPosition += 5
          })

          yPosition += 2
        })

        // Notes
        if (session.note) {
          if (yPosition > 270) {
            doc.addPage()
            yPosition = 20
          }
          doc.setFont('helvetica', 'italic')
          doc.setFontSize(10)
          const splitNotes = doc.splitTextToSize(`Note: ${session.note}`, 160)
          doc.text(splitNotes, 25, yPosition)
          yPosition += splitNotes.length * 5
        }

        yPosition += 8
      })
    })

    // Save
    doc.save(`allenamenti_${startDate}_${endDate}.pdf`)
  }

  if (Object.keys(sessionsByDate).length === 0 && initialSessions.length === 0) {
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
      {/* Date Range Filter */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Inizio
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Fine
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              max={today}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
            />
          </div>
          <button
            onClick={exportToPDF}
            disabled={filteredSessions.length === 0}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Esporta PDF
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {filteredSessions.length} sessioni nel periodo selezionato
        </p>
      </div>

      {/* List */}
      {Object.keys(sessionsByDate).length > 0 ? (
        Object.entries(sessionsByDate).map(([date, sessionsGiorno]) => (
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
        ))
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">💪</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Nessuna sessione nel periodo selezionato
          </h3>
          <p className="text-gray-600">
            Prova a modificare le date.
          </p>
        </div>
      )}
    </div>
  )
}
