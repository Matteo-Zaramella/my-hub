'use client'

import { useState } from 'react'

interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  category: string
  priority?: 'urgent' | 'high' | 'medium' | 'low'
  deadline?: string
}

const CHECKLIST_DATA: ChecklistItem[] = [
  // ✅ COMPLETATI
  { id: '0', text: '✅ Fix generazione codici partecipanti (3 lettere + 3 numeri)', completed: true, category: 'Tecnico' },
  { id: '00', text: '✅ Aggiornamento codici 5 partecipanti (Gaia, Tommaso, Enrico, Marta, Francesca)', completed: true, category: 'Tecnico' },
  { id: '8', text: '✅ Creati 10 indizi anagramma EVOLUZIONE', completed: true, category: 'Cerimonia' },
  { id: '35', text: '✅ Setup sistema email automatiche (Resend + template)', completed: true, category: 'Tecnico' },
  { id: '36', text: '✅ Form registrazione partecipanti integrato', completed: true, category: 'Partecipanti' },

  // 🔴 URGENTE - Scadenza: 16/11/2025
  { id: '1', text: 'Confermare location festa a Padova (in attesa - preparazione invariata)', completed: false, category: 'Location', priority: 'low', deadline: '20/01' },

  // 🟡 ALTA PRIORITÀ - Scadenza: 30/11/2025
  { id: '11', text: 'Sfida Febbraio: definire tipo, location, 3 indizi (21-22/02)', completed: false, category: 'Sfide', priority: 'high', deadline: '30/11' },
  { id: '12', text: 'Sfida Marzo: definire tipo, location, 3 indizi (21-22/03)', completed: false, category: 'Sfide', priority: 'high', deadline: '05/12' },
  { id: '24', text: 'Chat di gruppo - Miglioramenti (moderazione, reactions, online users)', completed: false, category: 'Tecnico', priority: 'high', deadline: '10/12' },
  { id: '25', text: 'Sistema notifiche push (Web Push API)', completed: false, category: 'Tecnico', priority: 'high', deadline: '15/12' },

  // 🟢 MEDIA PRIORITÀ - Dicembre 2025
  { id: '3', text: 'Stampare e preparare 10 indizi fisici (formato A5)', completed: false, category: 'Location', priority: 'medium', deadline: '20/12' },
  { id: '13', text: 'Sfida Aprile: definire tipo, location, 4 indizi (25-26/04)', completed: false, category: 'Sfide', priority: 'medium', deadline: '31/12' },
  { id: '14', text: 'Sfida Maggio: definire tipo, location, 3 indizi (23-24/05)', completed: false, category: 'Sfide', priority: 'medium', deadline: '31/12' },
  { id: '15', text: 'Sfida Giugno: definire tipo, location, 4 indizi (27-28/06)', completed: false, category: 'Sfide', priority: 'medium' },
  { id: '16', text: 'Sfida Luglio: definire tipo, location, 3 indizi (25-26/07)', completed: false, category: 'Sfide', priority: 'medium' },
  { id: '17', text: 'Sfida Agosto: definire tipo, location, 3 indizi (22-23/08)', completed: false, category: 'Sfide', priority: 'medium' },
  { id: '18', text: 'Sfida Settembre: definire tipo, location, 4 indizi (26-27/09)', completed: false, category: 'Sfide', priority: 'medium' },
  { id: '19', text: 'Sfida Ottobre: definire tipo, location, 3 indizi (24-25/10)', completed: false, category: 'Sfide', priority: 'medium' },
  { id: '20', text: 'Sfida Novembre: definire tipo, location, 3 indizi (21-22/11)', completed: false, category: 'Sfide', priority: 'medium' },
  { id: '21', text: 'Sfida Dicembre: definire tipo, location, 4 indizi (26-27/12)', completed: false, category: 'Sfide', priority: 'medium' },
  { id: '23', text: 'Sfida Finale: definire format e soglia punteggio (24/01/27)', completed: false, category: 'Sfide', priority: 'medium' },
  { id: '26', text: 'Cron jobs: rivelazione indizi automatica (sabato 00:00)', completed: false, category: 'Tecnico', priority: 'medium', deadline: '15/01' },
  { id: '37', text: 'Vercel Edge Functions: reveal-clue, send-notification, calculate-leaderboard', completed: false, category: 'Tecnico', priority: 'medium', deadline: '15/01' },

  // 🔵 TEST - Gennaio 2026
  { id: '30', text: 'Test responsive su iPhone/Android/iPad/Desktop', completed: false, category: 'Testing', priority: 'medium', deadline: '10/01' },
  { id: '31', text: 'Test sistema password EVOLUZIONE', completed: false, category: 'Testing', priority: 'medium', deadline: '10/01' },
  { id: '32', text: 'Test carico chat con 50+ utenti simultanei', completed: false, category: 'Testing', priority: 'medium', deadline: '10/01' },
  { id: '33', text: 'Test rivelazione automatica indizi', completed: false, category: 'Testing', priority: 'medium', deadline: '10/01' },
  { id: '34', text: 'Test deployment e stabilità su Vercel', completed: false, category: 'Testing', priority: 'medium', deadline: '10/01' },

  // ⚪ BASSA PRIORITÀ - Gennaio 2026
  { id: '2', text: 'Setup location: verifica WiFi, sistema audio, spazi indizi', completed: false, category: 'Location', priority: 'low', deadline: '20/01' },
  { id: '4', text: 'Raccolta dati: verifica email di tutti i 52 partecipanti', completed: false, category: 'Partecipanti', priority: 'low', deadline: '15/01' },
  { id: '5', text: 'Raccolta dati: 13 partecipanti prioritari senza contatti', completed: false, category: 'Partecipanti', priority: 'high', deadline: '15/01' },
  { id: '6', text: 'Inviare inviti formali con dettagli evento', completed: false, category: 'Partecipanti', priority: 'low', deadline: '15/01' },
  { id: '7', text: 'Confermare presenze finali', completed: false, category: 'Partecipanti', priority: 'low', deadline: '20/01' },
  { id: '9', text: 'Scrivere regolamento cerimonia e stamparlo', completed: false, category: 'Cerimonia', priority: 'low', deadline: '20/01' },
  { id: '10', text: 'Preparare speech introduttivo cerimonia apertura', completed: false, category: 'Cerimonia', priority: 'low', deadline: '22/01' },
  { id: '27', text: 'Sistema iscrizioni future partecipanti post-cerimonia', completed: false, category: 'Tecnico', priority: 'low' },
  { id: '28', text: 'Classifica pubblica (visibile dopo 6 mesi - 26/07/26)', completed: false, category: 'Tecnico', priority: 'low' },
  { id: '29', text: 'Archivio sfide e soluzioni (visibile dopo 6 mesi)', completed: false, category: 'Tecnico', priority: 'low' },
  { id: '38', text: 'Dashboard admin: moderazione chat, statistiche, export dati', completed: false, category: 'Tecnico', priority: 'low', deadline: '20/01' },
  { id: '39', text: 'Miglioramenti UX/UI: animazioni, loading states, dark mode', completed: false, category: 'Tecnico', priority: 'low', deadline: '22/01' },
  { id: '40', text: 'Security: rate limiting, sanitizzazione input, backup automatici', completed: false, category: 'Tecnico', priority: 'low', deadline: '23/01' },
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
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs ${item.completed ? 'text-green-400' : 'text-white/40'}`}>
                    {item.category}
                  </span>
                  {item.priority && (
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      item.priority === 'urgent' ? 'bg-red-500/20 text-red-300' :
                      item.priority === 'high' ? 'bg-orange-500/20 text-orange-300' :
                      item.priority === 'medium' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>
                      {item.priority === 'urgent' ? '🔴 URGENTE' :
                       item.priority === 'high' ? '🟡 ALTA' :
                       item.priority === 'medium' ? '🟢 MEDIA' :
                       '⚪ BASSA'}
                    </span>
                  )}
                  {item.deadline && (
                    <span className="text-xs text-yellow-400">
                      ⏰ {item.deadline}
                    </span>
                  )}
                </div>
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
