import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Carica .env.local dalla root del progetto
dotenv.config({ path: resolve(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Mancano le variabili d\'ambiente SUPABASE')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Date ufficiali corrette (tutte a mezzanotte del giorno indicato)
const correctDates = {
  challenges: [
    { number: 1, date: '2026-01-25T00:00:00', clues: 0 },
    { number: 2, date: '2026-02-22T00:00:00', clues: 3 },
    { number: 3, date: '2026-03-29T00:00:00', clues: 4 },
    { number: 4, date: '2026-04-26T00:00:00', clues: 3 },
    { number: 5, date: '2026-05-31T00:00:00', clues: 4 },
    { number: 6, date: '2026-06-28T00:00:00', clues: 3 },
    { number: 7, date: '2026-07-26T00:00:00', clues: 3 },
    { number: 8, date: '2026-08-30T00:00:00', clues: 4 },
    { number: 9, date: '2026-09-27T00:00:00', clues: 3 },
    { number: 10, date: '2026-10-25T00:00:00', clues: 3 },
    { number: 11, date: '2026-11-29T00:00:00', clues: 4 },
    { number: 12, date: '2026-12-27T00:00:00', clues: 3 }
  ],
  clues: {
    2: ['2026-02-01T00:00:00', '2026-02-08T00:00:00', '2026-02-15T00:00:00'],
    3: ['2026-03-01T00:00:00', '2026-03-08T00:00:00', '2026-03-15T00:00:00', '2026-03-22T00:00:00'],
    4: ['2026-04-05T00:00:00', '2026-04-12T00:00:00', '2026-04-19T00:00:00'],
    5: ['2026-05-03T00:00:00', '2026-05-10T00:00:00', '2026-05-17T00:00:00', '2026-05-24T00:00:00'],
    6: ['2026-06-07T00:00:00', '2026-06-14T00:00:00', '2026-06-21T00:00:00'],
    7: ['2026-07-05T00:00:00', '2026-07-12T00:00:00', '2026-07-19T00:00:00'],
    8: ['2026-08-02T00:00:00', '2026-08-09T00:00:00', '2026-08-16T00:00:00', '2026-08-23T00:00:00'],
    9: ['2026-09-06T00:00:00', '2026-09-13T00:00:00', '2026-09-20T00:00:00'],
    10: ['2026-10-04T00:00:00', '2026-10-11T00:00:00', '2026-10-18T00:00:00'],
    11: ['2026-11-01T00:00:00', '2026-11-08T00:00:00', '2026-11-15T00:00:00', '2026-11-22T00:00:00'],
    12: ['2026-12-06T00:00:00', '2026-12-13T00:00:00', '2026-12-20T00:00:00']
  }
}

async function verifyChallenges() {
  console.log('\n🔍 VERIFICA SFIDE NEL DATABASE\n')

  const { data: challenges, error } = await supabase
    .from('game_challenges')
    .select('*')
    .order('challenge_number')

  if (error) {
    console.error('❌ Errore lettura sfide:', error.message)
    return
  }

  console.log(`Trovate ${challenges.length} sfide nel database\n`)

  let errorsFound = 0

  for (const correct of correctDates.challenges) {
    const dbChallenge = challenges.find(c => c.challenge_number === correct.number)

    if (!dbChallenge) {
      console.log(`❌ SFIDA ${correct.number} MANCANTE!`)
      console.log(`   Dovrebbe essere: ${correct.date}\n`)
      errorsFound++
      continue
    }

    let dbDate
    try {
      dbDate = new Date(dbChallenge.reveal_date).toISOString()
    } catch (e) {
      console.log(`❌ SFIDA ${correct.number} - DATA INVALIDA NEL DB`)
      console.log(`   Nel DB:    ${dbChallenge.reveal_date} (NON VALIDA)`)
      console.log(`   Corretta:  ${correct.date}\n`)
      errorsFound++
      continue
    }

    const correctDate = new Date(correct.date).toISOString()

    if (dbDate !== correctDate) {
      console.log(`❌ SFIDA ${correct.number} - DATA SBAGLIATA`)
      console.log(`   Nel DB:    ${dbDate}`)
      console.log(`   Corretta:  ${correctDate}`)
      console.log(`   Differenza: ${Math.abs(new Date(dbDate) - new Date(correctDate)) / 1000 / 60 / 60 / 24} giorni\n`)
      errorsFound++
    } else {
      console.log(`✅ SFIDA ${correct.number} - Data corretta: ${correctDate}`)
    }
  }

  return { total: correctDates.challenges.length, errors: errorsFound }
}

async function verifyClues() {
  console.log('\n\n🔍 VERIFICA INDIZI NEL DATABASE\n')

  const { data: clues, error } = await supabase
    .from('game_clues')
    .select('*')
    .order('challenge_number, clue_number')

  if (error) {
    console.error('❌ Errore lettura indizi:', error.message)
    return
  }

  console.log(`Trovati ${clues.length} indizi nel database`)
  console.log(`Dovrebbero essere: 37 indizi totali\n`)

  let errorsFound = 0
  let totalExpected = 0

  for (const [challengeNum, clueDates] of Object.entries(correctDates.clues)) {
    const challengeNumber = parseInt(challengeNum)
    totalExpected += clueDates.length

    console.log(`\n--- SFIDA ${challengeNumber} (${clueDates.length} indizi previsti) ---`)

    const dbClues = clues.filter(c => c.challenge_number === challengeNumber)

    if (dbClues.length !== clueDates.length) {
      console.log(`❌ NUMERO INDIZI SBAGLIATO: trovati ${dbClues.length}, previsti ${clueDates.length}`)
      errorsFound++
    }

    for (let i = 0; i < clueDates.length; i++) {
      const correctDate = new Date(clueDates[i]).toISOString()
      const dbClue = dbClues.find(c => c.clue_number === i + 1)

      if (!dbClue) {
        console.log(`❌ INDIZIO ${i + 1} MANCANTE!`)
        console.log(`   Dovrebbe essere: ${correctDate}`)
        errorsFound++
        continue
      }

      let dbDate
      try {
        dbDate = new Date(dbClue.reveal_date).toISOString()
      } catch (e) {
        console.log(`❌ INDIZIO ${i + 1} - DATA INVALIDA NEL DB`)
        console.log(`   Nel DB:    ${dbClue.reveal_date} (NON VALIDA)`)
        console.log(`   Corretta:  ${correctDate}`)
        errorsFound++
        continue
      }

      if (dbDate !== correctDate) {
        console.log(`❌ INDIZIO ${i + 1} - DATA SBAGLIATA`)
        console.log(`   Nel DB:    ${dbDate}`)
        console.log(`   Corretta:  ${correctDate}`)
        errorsFound++
      } else {
        console.log(`✅ INDIZIO ${i + 1} - Data corretta: ${correctDate}`)
      }
    }
  }

  return { total: totalExpected, actual: clues.length, errors: errorsFound }
}

async function checkCluesAfterChallenges() {
  console.log('\n\n🔍 VERIFICA INDIZI DOPO SFIDE (ERRORE CRITICO)\n')

  const { data: clues } = await supabase
    .from('game_clues')
    .select('challenge_number, clue_number, reveal_date')
    .order('reveal_date')

  const { data: challenges } = await supabase
    .from('game_challenges')
    .select('challenge_number, reveal_date')

  let criticalErrors = 0

  for (const clue of clues) {
    const challenge = challenges.find(c => c.challenge_number === clue.challenge_number)
    if (!challenge) continue

    const clueDate = new Date(clue.reveal_date)
    const challengeDate = new Date(challenge.reveal_date)

    if (clueDate >= challengeDate) {
      console.log(`❌ CRITICO: Indizio ${clue.challenge_number}.${clue.clue_number} DOPO la sfida!`)
      console.log(`   Indizio:  ${clueDate.toISOString()}`)
      console.log(`   Sfida:    ${challengeDate.toISOString()}\n`)
      criticalErrors++
    }
  }

  if (criticalErrors === 0) {
    console.log('✅ Nessun indizio posizionato dopo la sfida')
  }

  return criticalErrors
}

async function main() {
  console.log('=' .repeat(60))
  console.log('VERIFICA DATE DATABASE - A TUTTO REALITY: LA RIVOLUZIONE')
  console.log('=' .repeat(60))

  const challengeResults = await verifyChallenges()
  const clueResults = await verifyClues()
  const criticalErrors = await checkCluesAfterChallenges()

  console.log('\n\n' + '='.repeat(60))
  console.log('RIEPILOGO FINALE')
  console.log('='.repeat(60))

  if (challengeResults) {
    console.log(`\n📊 SFIDE:`)
    console.log(`   Totale previste: ${challengeResults.total}`)
    console.log(`   Errori trovati: ${challengeResults.errors}`)
    console.log(`   Status: ${challengeResults.errors === 0 ? '✅ OK' : '❌ DA CORREGGERE'}`)
  }

  if (clueResults) {
    console.log(`\n📊 INDIZI:`)
    console.log(`   Totale previsti: ${clueResults.total}`)
    console.log(`   Totale nel DB: ${clueResults.actual}`)
    console.log(`   Errori trovati: ${clueResults.errors}`)
    console.log(`   Status: ${clueResults.errors === 0 ? '✅ OK' : '❌ DA CORREGGERE'}`)
  }

  console.log(`\n📊 ERRORI CRITICI:`)
  console.log(`   Indizi dopo sfide: ${criticalErrors}`)
  console.log(`   Status: ${criticalErrors === 0 ? '✅ OK' : '❌ DA CORREGGERE'}`)

  const totalErrors = (challengeResults?.errors || 0) + (clueResults?.errors || 0) + criticalErrors

  console.log(`\n\n${totalErrors === 0 ? '✅' : '❌'} TOTALE ERRORI: ${totalErrors}`)

  if (totalErrors > 0) {
    console.log(`\n⚠️  AZIONE RICHIESTA: Eseguire script di correzione date`)
  } else {
    console.log(`\n🎉 Tutte le date sono corrette!`)
  }

  console.log('\n' + '='.repeat(60))
}

main()
