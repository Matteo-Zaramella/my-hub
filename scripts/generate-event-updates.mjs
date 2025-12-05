#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '..', '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('Generating correct descriptions for all events...\n')

// Get all challenges
const { data: challenges } = await supabase
  .from('game_challenges')
  .select('id, challenge_number, title')
  .order('challenge_number', { ascending: true })

// Get all clues
const { data: clues } = await supabase
  .from('game_clues')
  .select('id, challenge_id, clue_number, revealed_date')

console.log('📋 CORRECT EVENT DESCRIPTIONS:\n')
console.log('=' .repeat(80))

// Generate descriptions for clues
for (const clue of clues) {
  const challenge = challenges.find(c => c.id === clue.challenge_id)
  if (!challenge) continue

  const date = new Date(clue.revealed_date)
  const dateStr = date.toISOString().split('T')[0]

  console.log(`\n🔍 Indizio ${clue.clue_number} - ${challenge.title}`)
  console.log(`Date: ${dateStr}`)
  console.log(`Description:`)
  console.log(`Indizio ${clue.clue_number} per ${challenge.title}

💡 Pubblicazione automatica alle 00:00 del giorno successivo
🔐 Validazione richiesta sul sito`)
  console.log('-'.repeat(80))
}

console.log('\n\n')
console.log('=' .repeat(80))
console.log('SFIDE DESCRIPTIONS:')
console.log('=' .repeat(80))

// Generate descriptions for challenges
for (const challenge of challenges) {
  console.log(`\n🎯 ${challenge.title}`)
  console.log(`Description:`)
  console.log(`Descrizione della ${challenge.title}

📍 Location: Da definire

🔐 I partecipanti devono trovare il codice segreto per validare la sfida completata.`)
  console.log('-'.repeat(80))
}

console.log('\n\n✅ Template generated!')
console.log('\nNOTE: All clue events publish at 00:00 of the NEXT day (midnight)')
console.log('Example: Event on 10/10/2026 → Published at 00:00 on 11/10/2026')
console.log('\nAll points references should be REMOVED from descriptions.')

process.exit(0)
