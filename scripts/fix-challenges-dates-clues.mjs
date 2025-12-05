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

console.log('🔧 Fixing challenge dates and missing clues...\n')

// Fix Sfida 4 date
console.log('📅 Fixing Sfida 4 date: 2026-05-23 → 2026-05-16')
const { error: fix4Error } = await supabase
  .from('game_challenges')
  .update({ start_date: '2026-05-16T00:00:00' })
  .eq('challenge_number', 4)

if (fix4Error) {
  console.error('❌ Error fixing Sfida 4:', fix4Error)
} else {
  console.log('✅ Sfida 4 fixed!')
}

// Fix Sfida 5 date
console.log('\n📅 Fixing Sfida 5 date: 2026-06-27 → 2026-06-20')
const { error: fix5Error } = await supabase
  .from('game_challenges')
  .update({ start_date: '2026-06-20T00:00:00' })
  .eq('challenge_number', 5)

if (fix5Error) {
  console.error('❌ Error fixing Sfida 5:', fix5Error)
} else {
  console.log('✅ Sfida 5 fixed!')
}

// Get all challenges to add missing clues
const { data: challenges } = await supabase
  .from('game_challenges')
  .select('*')
  .order('challenge_number')

// Expected clue counts based on CALENDARIO_DATE_COMPLETE.md
const expectedClueCounts = {
  1: 3,
  2: 5,
  3: 4,
  4: 3,
  5: 3,
  6: 3,
  7: 3,
  8: 3,
  9: 3,
  10: 4,
  11: 5
}

// Expected clue dates for each challenge
const clueSchedule = {
  2: ['2026-02-28', '2026-03-07', '2026-03-14', '2026-03-21', '2026-03-28'],
  3: ['2026-04-04', '2026-04-11', '2026-04-18', '2026-04-25'],
  10: ['2026-10-31', '2026-11-07', '2026-11-14', '2026-11-21'],
  11: ['2026-11-28', '2026-12-05', '2026-12-12', '2026-12-19', '2026-12-26']
}

console.log('\n\n🔍 Checking and adding missing clues...\n')

for (const challenge of challenges) {
  const expectedCount = expectedClueCounts[challenge.challenge_number]

  // Get current clues
  const { data: currentClues } = await supabase
    .from('game_clues')
    .select('*')
    .eq('challenge_id', challenge.id)
    .order('revealed_date')

  const currentCount = currentClues.length

  if (currentCount < expectedCount) {
    console.log(`\n📝 Sfida ${challenge.challenge_number}: has ${currentCount} clues, needs ${expectedCount}`)

    const missingCount = expectedCount - currentCount
    const schedule = clueSchedule[challenge.challenge_number]

    if (schedule) {
      // Add missing clues
      for (let i = currentCount; i < expectedCount; i++) {
        const clueDate = schedule[i]
        const clueNumber = i + 1

        console.log(`   Adding Indizio ${clueNumber} on ${clueDate}`)

        const { error: addError } = await supabase
          .from('game_clues')
          .insert({
            challenge_id: challenge.id,
            clue_number: clueNumber,
            clue_text: `Indizio ${clueNumber} per Sfida ${challenge.challenge_number}`,
            revealed_date: `${clueDate}T12:00:00`,
            is_revealed: false
          })

        if (addError) {
          console.error(`   ❌ Error adding clue ${clueNumber}:`, addError)
        } else {
          console.log(`   ✅ Indizio ${clueNumber} added!`)
        }
      }
    }
  } else {
    console.log(`✅ Sfida ${challenge.challenge_number}: has correct number of clues (${currentCount}/${expectedCount})`)
  }
}

console.log('\n\n✅ All fixes completed!')
process.exit(0)
