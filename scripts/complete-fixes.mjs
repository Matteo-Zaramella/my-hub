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

console.log('Checking what was actually inserted...\n')

// Check all challenges
const { data: challenges } = await supabase
  .from('game_challenges')
  .select('*')
  .gte('challenge_number', 4)
  .order('challenge_number')

for (const c of challenges) {
  console.log(`Sfida ${c.challenge_number}: ${c.start_date}`)

  const { data: clues } = await supabase
    .from('game_clues')
    .select('*')
    .eq('challenge_id', c.id)
    .order('revealed_date')

  console.log(`  Indizi: ${clues?.length || 0}`)
  if (clues) {
    for (const cl of clues) {
      console.log(`    ${cl.clue_number}. ${cl.revealed_date}`)
    }
  }
}

process.exit(0)
