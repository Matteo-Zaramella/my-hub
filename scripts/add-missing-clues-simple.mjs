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

console.log('🔧 Adding missing clues (without is_revealed field)...\n')

// Get all challenges
const { data: challenges } = await supabase
  .from('game_challenges')
  .select('*')
  .order('challenge_number')

// Clues to add
const cluesToAdd = [
  // Sfida 2 - needs clues 4 and 5
  { challenge_number: 2, clue_number: 4, date: '2026-03-21', text: 'Indizio 4 per Sfida 2' },
  { challenge_number: 2, clue_number: 5, date: '2026-03-28', text: 'Indizio 5 per Sfida 2' },

  // Sfida 3 - needs clue 4
  { challenge_number: 3, clue_number: 4, date: '2026-04-25', text: 'Indizio 4 per Sfida 3' },

  // Sfida 10 - needs clue 4
  { challenge_number: 10, clue_number: 4, date: '2026-11-21', text: 'Indizio 4 per Sfida 10' },

  // Sfida 11 - needs clues 4 and 5
  { challenge_number: 11, clue_number: 4, date: '2026-12-19', text: 'Indizio 4 per Sfida 11' },
  { challenge_number: 11, clue_number: 5, date: '2026-12-26', text: 'Indizio 5 per Sfida 11' }
]

for (const clueToAdd of cluesToAdd) {
  const challenge = challenges.find(c => c.challenge_number === clueToAdd.challenge_number)

  if (!challenge) {
    console.log(`❌ Challenge ${clueToAdd.challenge_number} not found`)
    continue
  }

  console.log(`📝 Adding Sfida ${clueToAdd.challenge_number}, Indizio ${clueToAdd.clue_number} (${clueToAdd.date})`)

  const { error } = await supabase
    .from('game_clues')
    .insert({
      challenge_id: challenge.id,
      clue_number: clueToAdd.clue_number,
      clue_text: clueToAdd.text,
      revealed_date: `${clueToAdd.date}T12:00:00`
    })

  if (error) {
    console.error(`   ❌ Error:`, error)
  } else {
    console.log(`   ✅ Added!`)
  }
}

console.log('\n✅ All missing clues added!')
process.exit(0)
