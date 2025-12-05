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

console.log('='.repeat(60))
console.log('📅 VERIFICA DATE MAGGIO-DICEMBRE')
console.log('='.repeat(60))

// Carica sfide 4-11
const { data: challenges } = await supabase
  .from('game_challenges')
  .select('id, challenge_number, start_date, title')
  .gte('challenge_number', 4)
  .lte('challenge_number', 11)
  .order('challenge_number', { ascending: true })

for (const challenge of challenges) {
  const sfidaDate = new Date(challenge.start_date)

  console.log(`\n📍 SFIDA ${challenge.challenge_number} - ${sfidaDate.toLocaleDateString('it-IT')}`)

  const { data: clues } = await supabase
    .from('game_clues')
    .select('clue_number, revealed_date')
    .eq('challenge_id', challenge.id)
    .order('revealed_date', { ascending: true })

  console.log(`   Indizi trovati: ${clues?.length || 0}`)

  if (clues && clues.length > 0) {
    for (const clue of clues) {
      const clueDate = new Date(clue.revealed_date)
      console.log(`   - Indizio ${clue.clue_number}: ${clueDate.toLocaleDateString('it-IT')}`)
    }
  }
}

console.log('\n' + '='.repeat(60))
console.log('✅ VERIFICA COMPLETATA')
console.log('='.repeat(60))

process.exit(0)
