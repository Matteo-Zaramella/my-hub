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

console.log('Checking first ceremony clue...\n')

// Get first clue (order_number = 1)
const { data: firstClue, error } = await supabase
  .from('ceremony_clue_riddles')
  .select('*')
  .eq('order_number', 1)
  .single()

if (error) {
  console.log(`❌ Error: ${error.message}`)
  process.exit(1)
}

console.log(`Current first clue: ${firstClue.clue_word}`)

if (firstClue.clue_word === 'ENTOMOLOGIA') {
  console.log('❌ Wrong! Should be ENIGMA\n')
  console.log('Updating to ENIGMA...')

  const { error: updateError } = await supabase
    .from('ceremony_clue_riddles')
    .update({
      clue_word: 'ENIGMA',
      updated_at: new Date().toISOString()
    })
    .eq('id', firstClue.id)

  if (updateError) {
    console.log(`❌ Error updating: ${updateError.message}`)
    process.exit(1)
  }

  console.log('✅ Updated to ENIGMA!')
} else if (firstClue.clue_word === 'ENIGMA') {
  console.log('✅ Already correct: ENIGMA')
} else {
  console.log(`⚠️  Unexpected value: ${firstClue.clue_word}`)
  console.log('   Should be: ENIGMA')
}

console.log('\n✅ Done!')
process.exit(0)
