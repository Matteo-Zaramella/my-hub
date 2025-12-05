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
console.log('🔧 CORREZIONE FINALE CALENDARIO')
console.log('='.repeat(60))

async function applyFixes() {
  // 1. MAGGIO - Spostare sfida 4 al 23/05 e aggiungere indizio 16/05
  console.log('\n📅 MAGGIO - Sfida 4')

  const { data: sfida4 } = await supabase
    .from('game_challenges')
    .select('id')
    .eq('challenge_number', 4)
    .single()

  // Sposta sfida al 23/05
  await supabase
    .from('game_challenges')
    .update({ start_date: '2026-05-23T12:00:00' })
    .eq('id', sfida4.id)
  console.log('  ✅ Sfida 4 spostata al 23/05/2026')

  // Rinumera indizi esistenti e aggiungi il 16/05
  const { data: indizi4 } = await supabase
    .from('game_clues')
    .select('id, revealed_date, clue_number')
    .eq('challenge_id', sfida4.id)
    .order('revealed_date', { ascending: true })

  // Dovrebbero essere: 25/04 (1), 02/05 (2), 09/05 (3)
  // Aggiungo 16/05 come indizio 4
  await supabase
    .from('game_clues')
    .insert({
      challenge_id: sfida4.id,
      clue_number: 4,
      revealed_date: '2026-05-16T12:00:00',
      clue_text: 'Indizio 4 per Sfida 4 (Maggio)',
      points_value: 1000
    })
  console.log('  ✅ Aggiunto Indizio 4 il 16/05/2026')

  // 2. GIUGNO - Spostare sfida al 27/06, aggiungere indizi
  console.log('\n📅 GIUGNO - Sfida 5')

  const { data: sfida5 } = await supabase
    .from('game_challenges')
    .select('id')
    .eq('challenge_number', 5)
    .single()

  // Sposta sfida al 27/06
  await supabase
    .from('game_challenges')
    .update({ start_date: '2026-06-27T12:00:00' })
    .eq('id', sfida5.id)
  console.log('  ✅ Sfida 5 spostata al 27/06/2026')

  // Aggiungi indizio 30/05
  await supabase
    .from('game_clues')
    .insert({
      challenge_id: sfida5.id,
      clue_number: 3,
      revealed_date: '2026-05-30T12:00:00',
      clue_text: 'Indizio 3 per Sfida 5 (Giugno)',
      points_value: 1000
    })
  console.log('  ✅ Aggiunto Indizio 3 il 30/05/2026')

  // Aggiungi indizio 20/06 (compleanno ragazza - giorno libero)
  await supabase
    .from('game_clues')
    .insert({
      challenge_id: sfida5.id,
      clue_number: 4,
      revealed_date: '2026-06-20T12:00:00',
      clue_text: 'Indizio 4 per Sfida 5 (Giugno)',
      points_value: 1000
    })
  console.log('  ✅ Aggiunto Indizio 4 il 20/06/2026 (compleanno)')

  // 3. LUGLIO - Aggiungere indizio 25/07
  console.log('\n📅 LUGLIO - Sfida 6')

  const { data: sfida6 } = await supabase
    .from('game_challenges')
    .select('id')
    .eq('challenge_number', 6)
    .single()

  await supabase
    .from('game_clues')
    .insert({
      challenge_id: sfida6.id,
      clue_number: 3,
      revealed_date: '2026-07-25T12:00:00',
      clue_text: 'Indizio 3 per Sfida 6 (Luglio)',
      points_value: 1000
    })
  console.log('  ✅ Aggiunto Indizio 3 il 25/07/2026')

  // 4. AGOSTO - Aggiungere indizio 29/08
  console.log('\n📅 AGOSTO - Sfida 7')

  const { data: sfida7 } = await supabase
    .from('game_challenges')
    .select('id')
    .eq('challenge_number', 7)
    .single()

  await supabase
    .from('game_clues')
    .insert({
      challenge_id: sfida7.id,
      clue_number: 3,
      revealed_date: '2026-08-29T12:00:00',
      clue_text: 'Indizio 3 per Sfida 7 (Agosto)',
      points_value: 1000
    })
  console.log('  ✅ Aggiunto Indizio 3 il 29/08/2026')

  // 5. SETTEMBRE - Aggiungere indizio 26/09
  console.log('\n📅 SETTEMBRE - Sfida 8')

  const { data: sfida8 } = await supabase
    .from('game_challenges')
    .select('id')
    .eq('challenge_number', 8)
    .single()

  await supabase
    .from('game_clues')
    .insert({
      challenge_id: sfida8.id,
      clue_number: 3,
      revealed_date: '2026-09-26T12:00:00',
      clue_text: 'Indizio 3 per Sfida 8 (Settembre)',
      points_value: 1000
    })
  console.log('  ✅ Aggiunto Indizio 3 il 26/09/2026')

  // 6. OTTOBRE - Aggiungere indizio 24/10
  console.log('\n📅 OTTOBRE - Sfida 9')

  const { data: sfida9 } = await supabase
    .from('game_challenges')
    .select('id')
    .eq('challenge_number', 9)
    .single()

  await supabase
    .from('game_clues')
    .insert({
      challenge_id: sfida9.id,
      clue_number: 3,
      revealed_date: '2026-10-24T12:00:00',
      clue_text: 'Indizio 3 per Sfida 9 (Ottobre)',
      points_value: 1000
    })
  console.log('  ✅ Aggiunto Indizio 3 il 24/10/2026')

  // 7. GENNAIO 2027 - Creare Sfida 12 (Finale)
  console.log('\n📅 GENNAIO 2027 - Sfida 12 FINALE')

  const { data: sfida12 } = await supabase
    .from('game_challenges')
    .insert({
      challenge_number: 12,
      title: 'Sfida 12 - Serata Finale',
      description: 'SERATA FINALE - Ultima sfida prima della caccia alla valigetta',
      start_date: '2027-01-23T19:00:00',
      location: 'Da definire',
      points_value: 1200
    })
    .select()
    .single()
  console.log('  ✅ Creata Sfida 12 (Finale) il 23/01/2027')

  // Aggiungi indizi per sfida 12 (esempio: 3 indizi prima)
  const indizi12 = [
    { clue_number: 1, date: '2027-01-02', text: 'Indizio 1 per Sfida Finale' },
    { clue_number: 2, date: '2027-01-09', text: 'Indizio 2 per Sfida Finale' },
    { clue_number: 3, date: '2027-01-16', text: 'Indizio 3 per Sfida Finale' }
  ]

  for (const indizio of indizi12) {
    await supabase
      .from('game_clues')
      .insert({
        challenge_id: sfida12.id,
        clue_number: indizio.clue_number,
        revealed_date: `${indizio.date}T12:00:00`,
        clue_text: indizio.text,
        points_value: 1000
      })
  }
  console.log('  ✅ Aggiunti 3 indizi per Sfida Finale')

  // Rimuovi "Indizio 5" del 26/12 (era bonus, non serve più)
  const { data: sfida11 } = await supabase
    .from('game_challenges')
    .select('id')
    .eq('challenge_number', 11)
    .single()

  await supabase
    .from('game_clues')
    .delete()
    .eq('challenge_id', sfida11.id)
    .eq('revealed_date', '2026-12-26T12:00:00')
  console.log('  ✅ Rimosso indizio bonus 26/12/2026')

  console.log('\n' + '='.repeat(60))
  console.log('✅ CORREZIONI APPLICATE')
  console.log('='.repeat(60))
}

applyFixes()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Errore:', error)
    process.exit(1)
  })
