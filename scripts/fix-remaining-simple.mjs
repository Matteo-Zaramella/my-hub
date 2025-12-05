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

console.log('Adding missing clues...\n')

// Get all challenge IDs fresh
const { data: challenges } = await supabase
  .from('game_challenges')
  .select('id, challenge_number')
  .in('challenge_number', [4, 5, 6, 7, 8, 9, 11, 12])

const getChallenge = (num) => challenges.find(c => c.challenge_number === num)

// List of clues to add
const cluesToAdd = [
  // Sfida 4
  { challenge: 4, date: '2026-05-16', num: 4, text: 'Indizio 4 Sfida Maggio' },

  // Sfida 5
  { challenge: 5, date: '2026-05-30', num: 3, text: 'Indizio 3 Sfida Giugno' },
  { challenge: 5, date: '2026-06-20', num: 4, text: 'Indizio 4 Sfida Giugno (giorno compleanno)' },

  // Sfida 6
  { challenge: 6, date: '2026-07-25', num: 3, text: 'Indizio 3 Sfida Luglio' },

  // Sfida 7
  { challenge: 7, date: '2026-08-29', num: 3, text: 'Indizio 3 Sfida Agosto' },

  // Sfida 8
  { challenge: 8, date: '2026-09-26', num: 3, text: 'Indizio 3 Sfida Settembre' },

  // Sfida 9
  { challenge: 9, date: '2026-10-24', num: 3, text: 'Indizio 3 Sfida Ottobre' },

  // Sfida 12
  { challenge: 12, date: '2027-01-02', num: 1, text: 'Indizio 1 Serata Finale' },
  { challenge: 12, date: '2027-01-09', num: 2, text: 'Indizio 2 Serata Finale' },
  { challenge: 12, date: '2027-01-16', num: 3, text: 'Indizio 3 Serata Finale' },
]

for (const clue of cluesToAdd) {
  const challenge = getChallenge(clue.challenge)
  if (!challenge) {
    console.log(`❌ Challenge ${clue.challenge} not found`)
    continue
  }

  // Check if already exists
  const { data: existing } = await supabase
    .from('game_clues')
    .select('id')
    .eq('challenge_id', challenge.id)
    .like('revealed_date', `${clue.date}%`)

  if (existing && existing.length > 0) {
    console.log(`⏭️  Skipping ${clue.date} (already exists)`)
    continue
  }

  // Insert
  const { error } = await supabase
    .from('game_clues')
    .insert({
      challenge_id: challenge.id,
      clue_number: clue.num,
      revealed_date: `${clue.date}T12:00:00`,
      clue_text: clue.text
    })

  if (error) {
    console.log(`❌ Error adding ${clue.date}: ${error.message}`)
  } else {
    console.log(`✅ Added clue ${clue.date} for Challenge ${clue.challenge}`)
  }
}

// Remove bonus 26/12
const challenge11 = getChallenge(11)
if (challenge11) {
  const { error } = await supabase
    .from('game_clues')
    .delete()
    .eq('challenge_id', challenge11.id)
    .like('revealed_date', '2026-12-26%')

  if (!error) {
    console.log('✅ Removed 26/12 bonus clue')
  }
}

console.log('\n✅ Done!')
process.exit(0)
