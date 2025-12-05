#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Google Calendar ID
const CALENDAR_ID = '9cbd1bb58997dc6501b56adc65e4c49cafba5902b968aa39d07e953ecdf57716@group.calendar.google.com'

// Questo script deve essere eseguito manualmente con le API Google Calendar
// Genera il JSON che può essere usato per creare gli eventi

async function generateCalendarEvents() {
  console.log('='.repeat(60))
  console.log('📅 GENERAZIONE EVENTI GOOGLE CALENDAR')
  console.log('='.repeat(60))

  // Carica sfide
  const { data: challenges } = await supabase
    .from('game_challenges')
    .select('id, challenge_number, title, start_date, description')
    .gte('start_date', '2026-02-01')
    .lte('start_date', '2026-12-31')
    .order('start_date', { ascending: true })

  // Carica indizi
  const { data: clues } = await supabase
    .from('game_clues')
    .select('id, clue_number, challenge_id, revealed_date, clue_text')
    .gte('revealed_date', '2026-02-01')
    .lte('revealed_date', '2026-12-31')
    .order('revealed_date', { ascending: true })

  console.log(`\n📊 Trovate ${challenges?.length || 0} sfide e ${clues?.length || 0} indizi\n`)

  // Mappa mesi
  const monthNames = {
    2: 'Febbraio', 3: 'Marzo', 4: 'Aprile', 5: 'Maggio', 6: 'Giugno',
    7: 'Luglio', 8: 'Agosto', 9: 'Settembre', 10: 'Ottobre', 11: 'Novembre', 12: 'Dicembre'
  }

  const events = []

  // Genera eventi per le sfide
  for (const challenge of challenges || []) {
    const date = new Date(challenge.start_date)
    const month = date.getMonth() + 1
    const monthName = monthNames[month]

    events.push({
      type: 'challenge',
      summary: `🎯 Sfida ${challenge.challenge_number} - ${monthName}`,
      start: challenge.start_date.split('T')[0],
      description: `${challenge.description}\n\n💰 Punti: 1200 (1°) - 540 (ultimo)\n📍 Location: Da definire\n\n🔐 I partecipanti devono trovare il codice segreto per validare la sfida completata.`,
      colorId: '11' // Rosso
    })
  }

  // Genera eventi per gli indizi
  for (const clue of clues || []) {
    const date = new Date(clue.revealed_date)
    const challenge = challenges?.find(c => c.id === clue.challenge_id)

    if (!challenge) continue

    events.push({
      type: 'clue',
      summary: `🔍 Indizio ${clue.clue_number} - Sfida ${challenge.challenge_number}`,
      start: clue.revealed_date.split('T')[0],
      description: `${clue.clue_text}\n\n💡 Pubblicazione automatica alle 12:00\n🔐 Codice validazione richiesto\n💰 Punti: 1000 (1°) - 450 (ultimo)`,
      colorId: '9' // Blu
    })
  }

  // Ordina per data
  events.sort((a, b) => a.start.localeCompare(b.start))

  console.log('📝 Eventi da creare:\n')

  // Stampa summary per mese
  const byMonth = {}
  for (const event of events) {
    const month = event.start.substring(0, 7)
    byMonth[month] = byMonth[month] || { challenges: 0, clues: 0 }
    byMonth[month][event.type === 'challenge' ? 'challenges' : 'clues']++
  }

  for (const [month, counts] of Object.entries(byMonth)) {
    console.log(`  ${month}: ${counts.clues} indizi, ${counts.challenges} sfida`)
  }

  console.log(`\n✅ Totale: ${events.length} eventi pronti\n`)

  // Salva in file JSON
  const fs = await import('fs')
  const outputPath = join(__dirname, 'calendar-events.json')
  fs.writeFileSync(outputPath, JSON.stringify(events, null, 2))
  console.log(`📄 Salvato in: ${outputPath}\n`)

  return events
}

generateCalendarEvents()
  .then(() => {
    console.log('='.repeat(60))
    console.log('✅ GENERAZIONE COMPLETATA')
    console.log('='.repeat(60))
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Errore:', error)
    process.exit(1)
  })
