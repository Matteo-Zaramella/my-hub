'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeviceCardProps {
  device: {
    id: string
    category: string
    name: string
    brand?: string
    model?: string
    specs: Record<string, string>
    notes?: string
    purchase_date?: string
    created_at: string
  }
}

export default function DeviceCard({ device }: DeviceCardProps) {
  const router = useRouter()
  const [showDetails, setShowDetails] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Sei sicuro di voler eliminare "${device.name}"?`)) {
      return
    }

    setDeleting(true)

    try {
      const response = await fetch(`/api/devices/${device.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete device')
      }

      router.refresh()
    } catch (error) {
      console.error('Error deleting device:', error)
      alert('Errore durante l\'eliminazione del dispositivo')
      setDeleting(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition border-l-4 border-blue-500">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            {device.name}
          </h3>
          {(device.brand || device.model) && (
            <p className="text-sm text-gray-600">
              {device.brand && <span className="font-medium">{device.brand}</span>}
              {device.brand && device.model && ' - '}
              {device.model && <span>{device.model}</span>}
            </p>
          )}
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-red-600 hover:text-red-700 disabled:text-gray-400 text-sm font-medium ml-4"
        >
          {deleting ? 'Eliminazione...' : '🗑️'}
        </button>
      </div>

      {/* Purchase Date */}
      {device.purchase_date && (
        <div className="text-xs text-gray-500 mb-3">
          📅 Acquistato: {formatDate(device.purchase_date)}
        </div>
      )}

      {/* Specs Preview */}
      {Object.keys(device.specs).length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-2">
            {Object.entries(device.specs).slice(0, 3).map(([key, value]) => (
              <span
                key={key}
                className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                <strong className="mr-1">{key}:</strong> {value}
              </span>
            ))}
            {Object.keys(device.specs).length > 3 && (
              <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{Object.keys(device.specs).length - 3} altre
              </span>
            )}
          </div>
        </div>
      )}

      {/* Notes Preview */}
      {device.notes && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          💬 {device.notes}
        </p>
      )}

      {/* Toggle Details */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        {showDetails ? '▼ Nascondi dettagli' : '▶ Mostra dettagli'}
      </button>

      {/* Full Details */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
          {/* All Specs */}
          {Object.keys(device.specs).length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Specifiche Tecniche:
              </h4>
              <div className="space-y-1">
                {Object.entries(device.specs).map(([key, value]) => (
                  <div key={key} className="text-sm text-gray-600 flex">
                    <span className="font-medium min-w-[120px]">{key}:</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Notes */}
          {device.notes && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">
                Note:
              </h4>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {device.notes}
              </p>
            </div>
          )}

          {/* Created At */}
          <div className="text-xs text-gray-400 pt-2 border-t">
            Aggiunto il: {formatDate(device.created_at)}
          </div>
        </div>
      )}
    </div>
  )
}
