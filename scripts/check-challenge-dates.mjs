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

console.log('📅 Checking challenge dates in database...\n')

const { data: challenges, error } = await supabase
  .from('game_challenges')
  .select('id, challenge_number, start_date')
  .gte('start_date', '2026-02-01')
  .lte('start_date', '2026-12-31')
  .order('start_date', { ascending: true })

if (error) {
  console.error('❌ Error:', error)
  process.exit(1)
}

console.log('SFIDE NEL DATABASE:\n')
challenges.forEach(c => {
  console.log(`Sfida ${c.challenge_number}: ${c.start_date}`)
})

console.log('\n\n📋 Checking clue counts...\n')

for (const challenge of challenges) {
  const { data: clues, error: cluesError } = await supabase
    .from('game_clues')
    .select('id')
    .eq('challenge_id', challenge.id)

  if (cluesError) {
    console.error(`❌ Error loading clues for challenge ${challenge.challenge_number}:`, cluesError)
  } else {
    console.log(`Sfida ${challenge.challenge_number}: ${clues.length} indizi`)
  }
}

console.log('\n✅ Done!')
process.exit(0)
