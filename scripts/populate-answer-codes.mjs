#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// =====================================================
// PASSWORD MAPPING (da PASSWORD_MAPPING_CONFIDENTIAL.md)
// =====================================================
// CRITICAL: Case-sensitive, exact match, no trim

const PASSWORD_MAP = {
  // FEBBRAIO 2026
  'FEB_CLUE_1': 'Eg2azaYN6FvmBv3SfhqZZZswKb3QyS',
  'FEB_CLUE_2': 'TCPfxTnEbmwZu4zTYUPVhmSLYyKvHY',
  'FEB_CLUE_3': 'WEQ3VHWmfyBMgkRCHcFgsxpBXtjFZ2',
  'FEB_CHALLENGE': 'FCbzg6aERC6r1857T2uBXu9G6PfRYJ',

  // MARZO 2026
  'MAR_CLUE_1': '27rj6t4mSzrTX9Gek5tX5gPdJLJYUF',
  'MAR_CLUE_2': 'peA5QVPkjZyyeHJrKMWFCzJRxnbfTr',
  'MAR_CLUE_3': 'yWQ3kwUaVQDHDWPacnx6PTH6z8tn3N',
  'MAR_CHALLENGE': 'VYmwwfkEtpPF3D3z1xePTXyJ8ZQDWy',

  // APRILE 2026
  'APR_CLUE_1': 'GGXCkFcnqTKBkhgewdv269CfuaD3Vh',
  'APR_CLUE_2': 'xdJWrh1G93VwQ52jXkrT5XhnAWqJAT',
  'APR_CLUE_3': 'ZSCEgvJpUzT2ENzPz1N3bT6RmExb2q',
  'APR_CLUE_4': 'LTBYEdwjXKnvN2z4gt4ySPenGfwLf1',
  'APR_CHALLENGE': 'HDjR8C7VhbR7MPPWP7SC4u6jB3k2Ge',

  // MAGGIO 2026
  'MAG_CLUE_1': 'TU2uQMh3rMSx2WSdQrezbWKZb43rBx',
  'MAG_CLUE_2': '83n2MwNJ9jkQCt15V5Bbba7mp9YeK9',
  'MAG_CLUE_3': '13yZfTWJvYKu62ub7J2EDmSpqH16r7',
  'MAG_CHALLENGE': 'c7hFt7HeQBfDP82cNfDZTjTVuzBb3M',

  // GIUGNO 2026
  'GIU_CLUE_1': 'v1qWyqDaE7kfVk9P7md3G5LGH1CpPj',
  'GIU_CLUE_2': 'maUUPzm4XPkTsUkMCSBkZ16uDgdyAt',
  'GIU_CLUE_3': '1Y4wEPRJCJapXqgZdv7FwYcxh3BHZL',
  'GIU_CLUE_4': 'F8meCwnnMVraWKX8dfV1TDB8ERUX5p',
  'GIU_CHALLENGE': 'EWfXP6nn7Ubd6ZR2M43qPHsprYu6Hn',

  // LUGLIO 2026
  'LUG_CLUE_1': 'R4UfQJucLuhytSdHqF6gmn43MWR2J3',
  'LUG_CLUE_2': 'aLnCT3msLHhhQRKXBLPHb24yGuz2qm',
  'LUG_CLUE_3': 'UBsxVgkf6r7uGeTSFZ2KYc1yNsB6Rr',
  'LUG_CHALLENGE': 'Mz3UAgRqfp4uwu7zMJ3TBUsWscVMtC',

  // AGOSTO 2026
  'AGO_CLUE_1': 'GLkrPpnMavYQV9p5b5Ycer4mPwRC9M',
  'AGO_CLUE_2': 'xB78XzNS3L7YcwgnrsLuUMgXpbfTSh',
  'AGO_CLUE_3': '3sSTGMkdpTDs4Tyes1vUjLumeqeYg3',
  'AGO_CHALLENGE': '56WyrV35Q8EugLcWhKUQxLXY3ntgNA',

  // SETTEMBRE 2026
  'SET_CLUE_1': 'cNN1kbua1ppYTs8s1G6guCQESCMbfk',
  'SET_CLUE_2': 'qpQbvL2Mp6NnXGgVutUJhx5Tazherm',
  'SET_CLUE_3': 'sEnwfhskGKD4FV3P61qmqghN6VkbRp',
  'SET_CLUE_4': 'FFjPrZV6AEwm2Re5bJXXbpK4sxKF31',
  'SET_CHALLENGE': '37q5PAqSLm2hxu46DN5vZhp6Bun9YZ',

  // OTTOBRE 2026
  'OTT_CLUE_1': 'CeTZrs8Y8Y98maY2vYjBe2VNnS2YqJ',
  'OTT_CLUE_2': 'R8ahjMhSFGA4azE6w8adcL1FQJ5udr',
  'OTT_CLUE_3': 'uBwrJPJZaT8TpjsQUausa7aM11p63Q',
  'OTT_CHALLENGE': 'uDxzkB3KMQsJxpD21fUbZ1bQQE4GCm',

  // NOVEMBRE 2026
  'NOV_CLUE_1': '6yfcLCcK6mDcgyvFMxK1VDpqstbkuH',
  'NOV_CLUE_2': 'haeEvfHGdEZ8QBYXWrG4QHSNmr4DtW',
  'NOV_CLUE_3': 'nHLR2psvxCQ2burEnBSvVeNcnjT6jL',
  'NOV_CHALLENGE': '66NYpTthJ18fScZAqweHr4ML1sG2FU',

  // DICEMBRE 2026
  'DIC_CLUE_1': '2J95K7YGxg5xLvLs1W2cnNzS2Th6Rv',
  'DIC_CLUE_2': 'sgwvxQcL9nPuYKtmV4PHjCRbyP83Pj',
  'DIC_CLUE_3': 'kR24Qa3t987YFuH78b6e36Ztk5qvWp',
  'DIC_CLUE_4': 'Uu9WESdTfakRPhq6yWL5e23y6tCnXM',
  'DIC_CHALLENGE': '3wjbFjLSJ1jZ7cgGpdbpp6yXnGFmef'
}

// =====================================================
// Funzione per assegnare password agli indizi
// =====================================================
async function assignClueCodes() {
  console.log('\n🔐 Assegnazione codici agli indizi...\n')

  // Carica tutte le sfide ordinate per data
  const { data: challenges, error: challengesError } = await supabase
    .from('game_challenges')
    .select('id, challenge_number, start_date, title')
    .gte('start_date', '2026-02-01')
    .lte('start_date', '2026-12-31')
    .order('start_date', { ascending: true })

  if (challengesError) {
    console.error('❌ Errore caricamento sfide:', challengesError)
    return
  }

  console.log(`📊 Trovate ${challenges.length} sfide\n`)

  // Mappa mesi
  const monthMap = {
    2: 'FEB',
    3: 'MAR',
    4: 'APR',
    5: 'MAG',
    6: 'GIU',
    7: 'LUG',
    8: 'AGO',
    9: 'SET',
    10: 'OTT',
    11: 'NOV',
    12: 'DIC'
  }

  let totalCluesUpdated = 0

  for (const challenge of challenges) {
    const startDate = new Date(challenge.start_date)
    const month = startDate.getMonth() + 1
    const monthKey = monthMap[month]

    if (!monthKey) {
      console.log(`⚠️  Saltata sfida ${challenge.id} (mese non mappato: ${month})`)
      continue
    }

    // Carica indizi di questa sfida
    const { data: clues, error: cluesError } = await supabase
      .from('game_clues')
      .select('id, clue_number, challenge_id')
      .eq('challenge_id', challenge.id)
      .order('clue_number', { ascending: true })

    if (cluesError) {
      console.error(`❌ Errore caricamento indizi per sfida ${challenge.id}:`, cluesError)
      continue
    }

    console.log(`📍 ${monthKey} - Sfida #${challenge.challenge_number} (${clues.length} indizi)`)

    // Assegna password a ogni indizio
    for (const clue of clues) {
      const passwordKey = `${monthKey}_CLUE_${clue.clue_number}`
      const password = PASSWORD_MAP[passwordKey]

      if (!password) {
        console.log(`   ⚠️  Indizio #${clue.clue_number} - Password non trovata (${passwordKey})`)
        continue
      }

      // Update answer_code
      const { error: updateError } = await supabase
        .from('game_clues')
        .update({ answer_code: password })
        .eq('id', clue.id)

      if (updateError) {
        console.error(`   ❌ Errore update indizio ${clue.id}:`, updateError)
      } else {
        console.log(`   ✅ Indizio #${clue.clue_number} → ${password.substring(0, 10)}...`)
        totalCluesUpdated++
      }
    }

    console.log('')
  }

  console.log(`\n✅ Aggiornati ${totalCluesUpdated} indizi\n`)
}

// =====================================================
// Funzione per assegnare password alle sfide
// =====================================================
async function assignChallengeCodes() {
  console.log('\n🎯 Assegnazione codici alle sfide...\n')

  // Carica tutte le sfide ordinate per data
  const { data: challenges, error: challengesError } = await supabase
    .from('game_challenges')
    .select('id, challenge_number, start_date, title')
    .gte('start_date', '2026-02-01')
    .lte('start_date', '2026-12-31')
    .order('start_date', { ascending: true })

  if (challengesError) {
    console.error('❌ Errore caricamento sfide:', challengesError)
    return
  }

  console.log(`📊 Trovate ${challenges.length} sfide\n`)

  // Mappa mesi
  const monthMap = {
    2: 'FEB',
    3: 'MAR',
    4: 'APR',
    5: 'MAG',
    6: 'GIU',
    7: 'LUG',
    8: 'AGO',
    9: 'SET',
    10: 'OTT',
    11: 'NOV',
    12: 'DIC'
  }

  let totalChallengesUpdated = 0

  for (const challenge of challenges) {
    const startDate = new Date(challenge.start_date)
    const month = startDate.getMonth() + 1
    const monthKey = monthMap[month]

    if (!monthKey) {
      console.log(`⚠️  Saltata sfida ${challenge.id} (mese non mappato: ${month})`)
      continue
    }

    const passwordKey = `${monthKey}_CHALLENGE`
    const password = PASSWORD_MAP[passwordKey]

    if (!password) {
      console.log(`⚠️  Sfida ${monthKey} - Password non trovata (${passwordKey})`)
      continue
    }

    // Update answer_code
    const { error: updateError } = await supabase
      .from('game_challenges')
      .update({ answer_code: password })
      .eq('id', challenge.id)

    if (updateError) {
      console.error(`❌ Errore update sfida ${challenge.id}:`, updateError)
    } else {
      console.log(`✅ ${monthKey} Sfida #${challenge.challenge_number} → ${password.substring(0, 10)}...`)
      totalChallengesUpdated++
    }
  }

  console.log(`\n✅ Aggiornate ${totalChallengesUpdated} sfide\n`)
}

// =====================================================
// Funzione di verifica
// =====================================================
async function verifyAssignments() {
  console.log('\n🔍 Verifica assegnazioni...\n')

  // Verifica indizi
  const { data: cluesWithCodes, error: cluesError } = await supabase
    .from('game_clues')
    .select('id, clue_number, answer_code, challenge_id')
    .not('answer_code', 'is', null)
    .order('challenge_id', { ascending: true })
    .order('clue_number', { ascending: true })

  if (cluesError) {
    console.error('❌ Errore verifica indizi:', cluesError)
  } else {
    console.log(`✅ Indizi con codice: ${cluesWithCodes.length}/36`)
  }

  // Verifica sfide
  const { data: challengesWithCodes, error: challengesError } = await supabase
    .from('game_challenges')
    .select('id, challenge_number, answer_code')
    .not('answer_code', 'is', null)
    .gte('start_date', '2026-02-01')
    .lte('start_date', '2026-12-31')
    .order('start_date', { ascending: true })

  if (challengesError) {
    console.error('❌ Errore verifica sfide:', challengesError)
  } else {
    console.log(`✅ Sfide con codice: ${challengesWithCodes.length}/11`)
  }

  console.log('\n✅ Verifica completata\n')
}

// =====================================================
// Main
// =====================================================
async function main() {
  console.log('='.repeat(60))
  console.log('🔐 POPOLAMENTO DATABASE - CODICI VALIDAZIONE')
  console.log('='.repeat(60))

  await assignClueCodes()
  await assignChallengeCodes()
  await verifyAssignments()

  console.log('='.repeat(60))
  console.log('✅ PROCESSO COMPLETATO')
  console.log('='.repeat(60))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Errore fatale:', error)
    process.exit(1)
  })
