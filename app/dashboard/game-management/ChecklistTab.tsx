'use client'

import { useState } from 'react'

interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  category: string
}

const CHECKLIST_DATA: ChecklistItem[] = [
  // Pre-Evento
  { id: '1', text: 'Confermare location della festa', completed: false, category: 'Location' },
  { id: '2', text: 'Verificare WiFi e sistema audio', completed: false, category: 'Location' },
  { id: '3', text: 'Preparare 10 indizi fisici', completed: false, category: 'Location' },

  // Partecipanti
  { id: '4', text: 'Verificare contatti tutti i 52 partecipanti', completed: false, category: 'Partecipanti' },
  { id: '5', text: 'Aggiungere numeri partner mancanti (13 persone)', completed: false, category: 'Partecipanti' },
  { id: '6', text: 'Inviare inviti formali (entro 15/01)', completed: false, category: 'Partecipanti' },
  { id: '7', text: 'Confermare presenze', completed: false, category: 'Partecipanti' },

  // Contenuti Cerimonia
  { id: '8', text: 'Completare 10 parole anagramma EVOLUZIONE', completed: false, category: 'Cerimonia' },
  { id: '9', text: 'Scrivere regolamento cerimonia', completed: false, category: 'Cerimonia' },
  { id: '10', text: 'Preparare speech introduttivo', completed: false, category: 'Cerimonia' },

  // Sfide Mensili
  { id: '11', text: 'Sfida Febbraio: definire tipo, location, 3 indizi', completed: false, category: 'Sfide' },
  { id: '12', text: 'Sfida Marzo: definire tipo, location, 3 indizi', completed: false, category: 'Sfide' },
  { id: '13', text: 'Sfida Aprile: definire tipo, location, 4 indizi', completed: false, category: 'Sfide' },
  { id: '14', text: 'Sfida Maggio: definire tipo, location, 3 indizi', completed: false, category: 'Sfide' },
  { id: '15', text: 'Sfida Giugno: definire tipo, location, 4 indizi', completed: false, category: 'Sfide' },
  { id: '16', text: 'Sfida Luglio: definire tipo, location, 3 indizi', completed: false, category: 'Sfide' },
  { id: '17', text: 'Sfida Agosto: definire tipo, location, 3 indizi', completed: false, category: 'Sfide' },
  { id: '18', text: 'Sfida Settembre: definire tipo, location, 4 indizi', completed: false, category: 'Sfide' },
  { id: '19', text: 'Sfida Ottobre: definire tipo, location, 3 indizi', completed: false, category: 'Sfide' },
  { id: '20', text: 'Sfida Novembre: definire tipo, location, 3 indizi', completed: false, category: 'Sfide' },
  { id: '21', text: 'Sfida Dicembre: definire tipo, location, 4 indizi', completed: false, category: 'Sfide' },
  { id: '22', text: 'Sfida Gennaio 2027: definire tipo, location, 3 indizi', completed: false, category: 'Sfide' },
  { id: '23', text: 'Sfida Finale: definire format e soglia punteggio', completed: false, category: 'Sfide' },

  // Sviluppo Tecnico
  { id: '24', text: 'Implementare chat di gruppo (attiva dal 26/01)', completed: false, category: 'Tecnico' },
  { id: '25', text: 'Sistema notifiche push', completed: false, category: 'Tecnico' },
  { id: '26', text: 'Automazione rivelazione indizi (sabato 00:00)', completed: false, category: 'Tecnico' },
  { id: '27', text: 'Sistema iscrizioni future partecipanti', completed: false, category: 'Tecnico' },
  { id: '28', text: 'Classifica pubblica (visibile dopo 6 mesi)', completed: false, category: 'Tecnico' },
  { id: '29', text: 'Archivio sfide e soluzioni (dopo 6 mesi)', completed: false, category: 'Tecnico' },

  // Testing
  { id: '30', text: 'Test responsive su iPhone/Android', completed: false, category: 'Testing' },
  { id: '31', text: 'Test sistema password EVOLUZIONE', completed: false, category: 'Testing' },
  { id: '32', text: 'Test chat con 50+ utenti simultanei', completed: false, category: 'Testing' },
  { id: '33', text: 'Test rivelazione automatica indizi', completed: false, category: 'Testing' },
  { id: '34', text: 'Test deployment su Vercel', completed: false, category: 'Testing' },
]

export default function ChecklistTab() {
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    // Load from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('game_checklist')
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return CHECKLIST_DATA
  })

  const [filterCategory, setFilterCategory] = useState<string>('all')

  const categories = ['Location', 'Partecipanti', 'Cerimonia', 'Sfide', 'Tecnico', 'Testing']

  const toggleItem = (id: string) => {
    const newItems = items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    )
    setItems(newItems)
    localStorage.setItem('game_checklist', JSON.stringify(newItems))
  }

  const filteredItems = filterCategory === 'all'
    ? items
    : items.filter(item => item.category === filterCategory)

  const completedCount = items.filter(i => i.completed).length
  const totalCount = items.length
  const progress = Math.round((completedCount / totalCount) * 100)

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-white">📊 Progresso Totale</h3>
          <span className="text-2xl font-bold text-white">{progress}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-4 mb-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-white/60">
          {completedCount} di {totalCount} task completati
        </p>
      </div>

      {/* Category Filter */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <label className="block text-sm font-medium text-white/80 mb-3">🏷️ Filtra per Categoria</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filterCategory === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            Tutte ({totalCount})
          </button>
          {categories.map(cat => {
            const count = items.filter(i => i.category === cat).length
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filterCategory === cat
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                {cat} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Checklist Items */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          ✅ Task da Completare
          {filterCategory !== 'all' && ` - ${filterCategory}`}
        </h3>
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className={`flex items-start gap-3 p-3 rounded-lg transition cursor-pointer ${
                item.completed
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
              onClick={() => toggleItem(item.id)}
            >
              <div className="flex-shrink-0 mt-0.5">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                    item.completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-white/30'
                  }`}
                >
                  {item.completed && <span className="text-white text-xs">✓</span>}
                </div>
              </div>
              <div className="flex-1">
                <p className={`text-sm ${item.completed ? 'text-white/60 line-through' : 'text-white'}`}>
                  {item.text}
                </p>
                <span className={`text-xs ${item.completed ? 'text-green-400' : 'text-white/40'}`}>
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map(cat => {
          const catItems = items.filter(i => i.category === cat)
          const catCompleted = catItems.filter(i => i.completed).length
          const catProgress = catItems.length > 0
            ? Math.round((catCompleted / catItems.length) * 100)
            : 0

          return (
            <div key={cat} className="bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-xs text-white/60 mb-1">{cat}</p>
              <p className="text-2xl font-bold text-white mb-1">{catProgress}%</p>
              <p className="text-xs text-white/40">
                {catCompleted}/{catItems.length}
              </p>
            </div>
          )
        })}
      </div>

      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-xs text-blue-300 leading-relaxed">
          💡 <strong>Tip:</strong> Clicca su un task per marcarlo come completato. I progressi vengono salvati automaticamente.
        </p>
      </div>
    </div>
  )
}
