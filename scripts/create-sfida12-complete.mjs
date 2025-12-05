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

console.log('Creating Sfida 12...\n')

// Create Sfida 12
const { data: sfida12, error: createError } = await supabase
  .from('game_challenges')
  .insert({
    challenge_number: 12,
    title: 'Serata Finale',
    description: 'SERATA FINALE - Ultima sfida prima della caccia alla valigetta. Il giorno dopo (24/01/2027) ci sarà la caccia fino a mezzanotte per trovare il contenitore con i soldi.',
    start_date: '2027-01-23T19:00:00',
    location: 'Da definire'
  })
  .select()
  .single()

if (createError) {
  // Maybe already exists?
  const { data: existing } = await supabase
    .from('game_challenges')
    .select('*')
    .eq('challenge_number', 12)
    .single()

  if (existing) {
    console.log('✅ Sfida 12 already exists')
    console.log(`   ID: ${existing.id}`)
    console.log(`   Date: ${existing.start_date}`)

    // Use existing
    const sfida12id = existing.id

    // Add clues
    const clues = [
      { num: 1, date: '2027-01-02', text: 'Indizio 1 per Serata Finale' },
      { num: 2, date: '2027-01-09', text: 'Indizio 2 per Serata Finale' },
      { num: 3, date: '2027-01-16', text: 'Indizio 3 per Serata Finale' }
    ]

    for (const clue of clues) {
      // Check if already exists
      const { data: existingClue } = await supabase
        .from('game_clues')
        .select('id')
        .eq('challenge_id', sfida12id)
        .eq('clue_number', clue.num)

      if (existingClue && existingClue.length > 0) {
        console.log(`⏭️  Clue ${clue.num} already exists`)
        continue
      }

      const { error } = await supabase
        .from('game_clues')
        .insert({
          challenge_id: sfida12id,
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
  } else {
    console.log(`❌ Error creating Sfida 12: ${createError.message}`)
    process.exit(1)
  }
} else {
  console.log('✅ Created Sfida 12')
  console.log(`   ID: ${sfida12.id}`)
  console.log(`   Date: ${sfida12.start_date}`)

  // Add clues
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
  console.log(`Note: Bonus clue might already be removed or not exist`)
}

console.log('\n✅ Done!')
process.exit(0)
