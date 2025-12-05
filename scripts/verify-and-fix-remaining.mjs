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

console.log('Fixing remaining issues and adding Sfida 12...\n')

// Get challenge IDs
const { data: sfida4 } = await supabase.from('game_challenges').select('id').eq('challenge_number', 4).single()
const { data: sfida5 } = await supabase.from('game_challenges').select('id').eq('challenge_number', 5).single()
const { data: sfida6 } = await supabase.from('game_challenges').select('id').eq('challenge_number', 6).single()
const { data: sfida7 } = await supabase.from('game_challenges').select('id').eq('challenge_number', 7).single()
const { data: sfida8 } = await supabase.from('game_challenges').select('id').eq('challenge_number', 8).single()
const { data: sfida9 } = await supabase.from('game_challenges').select('id').eq('challenge_number', 9).single()
const { data: sfida11 } = await supabase.from('game_challenges').select('id').eq('challenge_number', 11).single()

// Check if Sfida 12 exists
let { data: sfida12 } = await supabase.from('game_challenges').select('id').eq('challenge_number', 12).single()

if (!sfida12) {
  console.log('Creating Sfida 12...')
  const { data } = await supabase
    .from('game_challenges')
    .insert({
      challenge_number: 12,
      title: 'Serata Finale',
      description: 'SERATA FINALE - Ultima sfida prima della caccia alla valigetta con i soldi',
      start_date: '2027-01-23T19:00:00',
      location: 'Da definire',
      points_value: 1200
    })
    .select()
    .single()
  sfida12 = data
  console.log('✅ Sfida 12 created')
} else {
  console.log('✅ Sfida 12 already exists')
}

// Check what clues exist
console.log('\nChecking existing clues...')
const challenges = [
  { num: 4, id: sfida4.id, name: 'Maggio' },
  { num: 5, id: sfida5.id, name: 'Giugno' },
  { num: 6, id: sfida6.id, name: 'Luglio' },
  { num: 7, id: sfida7.id, name: 'Agosto' },
  { num: 8, id: sfida8.id, name: 'Settembre' },
  { num: 9, id: sfida9.id, name: 'Ottobre' },
  { num: 11, id: sfida11.id, name: 'Dicembre' },
  { num: 12, id: sfida12.id, name: 'Finale' }
]

for (const ch of challenges) {
  const { data: clues, count } = await supabase
    .from('game_clues')
    .select('*', { count: 'exact' })
    .eq('challenge_id', ch.id)

  console.log(`Sfida ${ch.num} (${ch.name}): ${count} indizi`)
}

console.log('\nNow I will manually check and add missing clues...')

// Sfida 4: Should have 4 clues (25/04, 02/05, 09/05, 16/05)
const {data: clues4} = await supabase.from('game_clues').select('revealed_date').eq('challenge_id', sfida4.id)
const has16May = clues4.some(c => c.revealed_date.startsWith('2026-05-16'))
if (!has16May) {
  await supabase.from('game_clues').insert({
    challenge_id: sfida4.id,
    clue_number: 4,
    revealed_date: '2026-05-16T12:00:00',
    clue_text: 'Indizio 4 per Sfida Maggio',
    points_value: 1000
  })
  console.log('✅ Added 16/05 clue for Sfida 4')
}

// Sfida 5: Should have 4 clues (06/06, 13/06, 30/05, 20/06)
const {data: clues5} = await supabase.from('game_clues').select('revealed_date').eq('challenge_id', sfida5.id)
const has30May = clues5.some(c => c.revealed_date.startsWith('2026-05-30'))
const has20Jun = clues5.some(c => c.revealed_date.startsWith('2026-06-20'))

if (!has30May) {
  await supabase.from('game_clues').insert({
    challenge_id: sfida5.id,
    clue_number: 3,
    revealed_date: '2026-05-30T12:00:00',
    clue_text: 'Indizio 3 per Sfida Giugno',
    points_value: 1000
  })
  console.log('✅ Added 30/05 clue for Sfida 5')
}

if (!has20Jun) {
  await supabase.from('game_clues').insert({
    challenge_id: sfida5.id,
    clue_number: 4,
    revealed_date: '2026-06-20T12:00:00',
    clue_text: 'Indizio 4 per Sfida Giugno (giorno compleanno)',
    points_value: 1000
  })
  console.log('✅ Added 20/06 clue for Sfida 5')
}

// Sfida 6-9: Add 3rd clue
const toAdd = [
  { sfida: sfida6.id, date: '2026-07-25', num: 6, name: 'Luglio' },
  { sfida: sfida7.id, date: '2026-08-29', num: 7, name: 'Agosto' },
  { sfida: sfida8.id, date: '2026-09-26', num: 8, name: 'Settembre' },
  { sfida: sfida9.id, date: '2026-10-24', num: 9, name: 'Ottobre' }
]

for (const item of toAdd) {
  const {data: existing} = await supabase.from('game_clues').select('id').eq('challenge_id', item.sfida).eq('revealed_date', `${item.date}T12:00:00`)
  if (!existing || existing.length === 0) {
    await supabase.from('game_clues').insert({
      challenge_id: item.sfida,
      clue_number: 3,
      revealed_date: `${item.date}T12:00:00`,
      clue_text: `Indizio 3 per Sfida ${item.name}`,
      points_value: 1000
    })
    console.log(`✅ Added ${item.date} clue for Sfida ${item.num}`)
  }
}

// Sfida 12: Add 3 clues
const {data: clues12} = await supabase.from('game_clues').select('id', {count: 'exact'}).eq('challenge_id', sfida12.id)
if (!clues12 || clues12.length === 0) {
  const indizi12 = [
    { clue_number: 1, date: '2027-01-02T12:00:00', text: 'Indizio 1 per Serata Finale' },
    { clue_number: 2, date: '2027-01-09T12:00:00', text: 'Indizio 2 per Serata Finale' },
    { clue_number: 3, date: '2027-01-16T12:00:00', text: 'Indizio 3 per Serata Finale' }
  ]

  for (const ind of indizi12) {
    await supabase.from('game_clues').insert({
      challenge_id: sfida12.id,
      clue_number: ind.clue_number,
      revealed_date: ind.date,
      clue_text: ind.text,
      points_value: 1000
    })
  }
  console.log('✅ Added 3 clues for Sfida 12')
}

// Remove bonus clue 26/12 from Sfida 11
await supabase.from('game_clues').delete().eq('challenge_id', sfida11.id).like('revealed_date', '2026-12-26%')
console.log('✅ Removed 26/12 bonus clue')

console.log('\n✅ All fixes applied!')
process.exit(0)
