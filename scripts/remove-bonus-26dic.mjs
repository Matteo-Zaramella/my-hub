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

// Get Sfida 11
const { data: sfida11 } = await supabase
  .from('game_challenges')
  .select('id')
  .eq('challenge_number', 11)
  .single()

console.log(`Sfida 11 ID: ${sfida11.id}`)

// Find and delete 26/12 clue
const { data: toDelete } = await supabase
  .from('game_clues')
  .select('*')
  .eq('challenge_id', sfida11.id)
  .gte('revealed_date', '2026-12-26')
  .lt('revealed_date', '2026-12-27')

console.log(`Found ${toDelete?.length || 0} clues to delete`)

if (toDelete && toDelete.length > 0) {
  for (const clue of toDelete) {
    console.log(`Deleting clue ${clue.id}: ${clue.revealed_date}`)
    const { error } = await supabase
      .from('game_clues')
      .delete()
      .eq('id', clue.id)

    if (error) {
      console.log(`❌ Error: ${error.message}`)
    } else {
      console.log(`✅ Deleted`)
    }
  }
}

console.log('\n✅ Done!')
process.exit(0)
