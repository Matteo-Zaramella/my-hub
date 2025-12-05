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

// Get Sfida 12
const { data: sfida12 } = await supabase
  .from('game_challenges')
  .select('*')
  .eq('challenge_number', 12)
  .single()

if (!sfida12) {
  console.log('❌ Sfida 12 not found!')
  process.exit(1)
}

console.log(`✅ Found Sfida 12: ${sfida12.title}`)
console.log(`   Date: ${sfida12.start_date}`)

// Add 3 clues
const clues = [
  { num: 1, date: '2027-01-02', text: 'Indizio 1 per Serata Finale' },
  { num: 2, date: '2027-01-09', text: 'Indizio 2 per Serata Finale' },
  { num: 3, date: '2027-01-16', text: 'Indizio 3 per Serata Finale' }
]

for (const clue of clues) {
  const { error } = await supabase
    .from('game_clues')
    .insert({
      challenge_id: sfida12.id,
      clue_number: clue.num,
      revealed_date: `${clue.date}T12:00:00`,
      clue_text: clue.text
    })

  if (error) {
    console.log(`❌ Error adding clue ${clue.num}: ${error.message}`)
  } else {
    console.log(`✅ Added clue ${clue.num} on ${clue.date}`)
  }
}

// Remove bonus 26/12
const { data: sfida11 } = await supabase
  .from('game_challenges')
  .select('id')
  .eq('challenge_number', 11)
  .single()

const { error: delError } = await supabase
  .from('game_clues')
  .delete()
  .eq('challenge_id', sfida11.id)
  .like('revealed_date', '2026-12-26%')

if (!delError) {
  console.log('✅ Removed 26/12 bonus clue')
} else {
  console.log(`❌ Error removing bonus: ${delError.message}`)
}

console.log('\n✅ Done!')
process.exit(0)
