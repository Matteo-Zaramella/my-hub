'use client'

import { useState } from 'react'
import PastoItem from './PastoItem'
import jsPDF from 'jspdf'

interface Pasto {
  id: number
  data: string
  tipo_pasto: string
  descrizione: string
  created_at: string
}

interface PastiListProps {
  initialPasti: Pasto[]
}

export default function PastiList({ initialPasti }: PastiListProps) {
  const today = new Date().toISOString().split('T')[0]
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [startDate, setStartDate] = useState(thirtyDaysAgo.toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(today)

  // Filter pasti by date range
  const filteredPasti = initialPasti.filter(pasto => {
    return pasto.data >= startDate && pasto.data <= endDate
  })

  // Group by date
  const pastiByDate: { [key: string]: Pasto[] } = {}
  filteredPasti.forEach((pasto) => {
    const date = pasto.data
    if (!pastiByDate[date]) {
      pastiByDate[date] = []
    }
    pastiByDate[date].push(pasto)
  })

  const exportToPDF = () => {
    const doc = new jsPDF()

    // Title
    doc.setFontSize(20)
    doc.text('Riepilogo Alimentazione', 20, 20)

    // Date range
    doc.setFontSize(12)
    const startFormatted = new Date(startDate + 'T00:00:00').toLocaleDateString('it-IT')
    const endFormatted = new Date(endDate + 'T00:00:00').toLocaleDateString('it-IT')
    doc.text(`Periodo: ${startFormatted} - ${endFormatted}`, 20, 30)

    let yPosition = 45

    // Content
    Object.entries(pastiByDate).forEach(([date, pastiGiorno]) => {
      // Check if we need a new page
      if (yPosition > 270) {
        doc.addPage()
        yPosition = 20
      }

      // Date header
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      const dateFormatted = new Date(date + 'T00:00:00').toLocaleDateString('it-IT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      doc.text(dateFormatted, 20, yPosition)
      yPosition += 8

      // Meals
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      pastiGiorno.forEach((pasto) => {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }

        const tipoIcon = getTipoIcon(pasto.tipo_pasto)
        const tipo = pasto.tipo_pasto.charAt(0).toUpperCase() + pasto.tipo_pasto.slice(1)
        doc.text(`${tipoIcon} ${tipo}`, 25, yPosition)
        yPosition += 5

        // Split description if too long
        const splitDescription = doc.splitTextToSize(pasto.descrizione, 160)
        doc.text(splitDescription, 30, yPosition)
        yPosition += splitDescription.length * 5 + 3
      })

      yPosition += 5
    })

    // Save
    doc.save(`alimentazione_${startDate}_${endDate}.pdf`)
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'colazione': return '☕'
      case 'pranzo': return '🍝'
      case 'cena': return '🍖'
      case 'snack': return '🍎'
      default: return '🍽️'
    }
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>
          <button
            onClick={exportToPDF}
            disabled={filteredPasti.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Esporta PDF
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {filteredPasti.length} pasti nel periodo selezionato
        </p>
      </div>

      {/* List */}
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
            {initialPasti.length > 0
              ? 'Nessun pasto nel periodo selezionato. Prova a modificare le date.'
              : 'Inizia a tracciare la tua alimentazione!'}
          </p>
        </div>
      )}
    </div>
  )
}
