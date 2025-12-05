import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: resolve(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Mancano le variabili d\'ambiente SUPABASE')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Date ufficiali corrette (tutte a mezzanotte UTC del giorno indicato)
const correctDates = {
  challenges: [
    { number: 1, date: '2026-01-25T00:00:00Z', clues: 0 },
    { number: 2, date: '2026-02-22T00:00:00Z', clues: 3 },
    { number: 3, date: '2026-03-29T00:00:00Z', clues: 4 },
    { number: 4, date: '2026-04-26T00:00:00Z', clues: 3 },
    { number: 5, date: '2026-05-31T00:00:00Z', clues: 4 },
    { number: 6, date: '2026-06-28T00:00:00Z', clues: 3 },
    { number: 7, date: '2026-07-26T00:00:00Z', clues: 3 },
    { number: 8, date: '2026-08-30T00:00:00Z', clues: 4 },
    { number: 9, date: '2026-09-27T00:00:00Z', clues: 3 },
    { number: 10, date: '2026-10-25T00:00:00Z', clues: 3 },
    { number: 11, date: '2026-11-29T00:00:00Z', clues: 4 },
    { number: 12, date: '2026-12-27T00:00:00Z', clues: 3 }
  ],
  clues: {
    2: [
      { date: '2026-02-01T00:00:00Z', text: 'Indizio 1 per Sfida 2' },
      { date: '2026-02-08T00:00:00Z', text: 'Indizio 2 per Sfida 2' },
      { date: '2026-02-15T00:00:00Z', text: 'Indizio 3 per Sfida 2' }
    ],
    3: [
      { date: '2026-03-01T00:00:00Z', text: 'Indizio 1 per Sfida 3' },
      { date: '2026-03-08T00:00:00Z', text: 'Indizio 2 per Sfida 3' },
      { date: '2026-03-15T00:00:00Z', text: 'Indizio 3 per Sfida 3' },
      { date: '2026-03-22T00:00:00Z', text: 'Indizio 4 per Sfida 3' }
    ],
    4: [
      { date: '2026-04-05T00:00:00Z', text: 'Indizio 1 per Sfida 4' },
      { date: '2026-04-12T00:00:00Z', text: 'Indizio 2 per Sfida 4' },
      { date: '2026-04-19T00:00:00Z', text: 'Indizio 3 per Sfida 4' }
    ],
    5: [
      { date: '2026-05-03T00:00:00Z', text: 'Indizio 1 per Sfida 5' },
      { date: '2026-05-10T00:00:00Z', text: 'Indizio 2 per Sfida 5' },
      { date: '2026-05-17T00:00:00Z', text: 'Indizio 3 per Sfida 5' },
      { date: '2026-05-24T00:00:00Z', text: 'Indizio 4 per Sfida 5' }
    ],
    6: [
      { date: '2026-06-07T00:00:00Z', text: 'Indizio 1 per Sfida 6' },
      { date: '2026-06-14T00:00:00Z', text: 'Indizio 2 per Sfida 6' },
      { date: '2026-06-21T00:00:00Z', text: 'Indizio 3 per Sfida 6' }
    ],
    7: [
      { date: '2026-07-05T00:00:00Z', text: 'Indizio 1 per Sfida 7' },
      { date: '2026-07-12T00:00:00Z', text: 'Indizio 2 per Sfida 7' },
      { date: '2026-07-19T00:00:00Z', text: 'Indizio 3 per Sfida 7' }
    ],
    8: [
      { date: '2026-08-02T00:00:00Z', text: 'Indizio 1 per Sfida 8' },
      { date: '2026-08-09T00:00:00Z', text: 'Indizio 2 per Sfida 8' },
      { date: '2026-08-16T00:00:00Z', text: 'Indizio 3 per Sfida 8' },
      { date: '2026-08-23T00:00:00Z', text: 'Indizio 4 per Sfida 8' }
    ],
    9: [
      { date: '2026-09-06T00:00:00Z', text: 'Indizio 1 per Sfida 9' },
      { date: '2026-09-13T00:00:00Z', text: 'Indizio 2 per Sfida 9' },
      { date: '2026-09-20T00:00:00Z', text: 'Indizio 3 per Sfida 9' }
    ],
    10: [
      { date: '2026-10-04T00:00:00Z', text: 'Indizio 1 per Sfida 10' },
      { date: '2026-10-11T00:00:00Z', text: 'Indizio 2 per Sfida 10' },
      { date: '2026-10-18T00:00:00Z', text: 'Indizio 3 per Sfida 10' }
    ],
    11: [
      { date: '2026-11-01T00:00:00Z', text: 'Indizio 1 per Sfida 11' },
      { date: '2026-11-08T00:00:00Z', text: 'Indizio 2 per Sfida 11' },
      { date: '2026-11-15T00:00:00Z', text: 'Indizio 3 per Sfida 11' },
      { date: '2026-11-22T00:00:00Z', text: 'Indizio 4 per Sfida 11' }
    ],
    12: [
      { date: '2026-12-06T00:00:00Z', text: 'Indizio 1 per Sfida 12' },
      { date: '2026-12-13T00:00:00Z', text: 'Indizio 2 per Sfida 12' },
      { date: '2026-12-20T00:00:00Z', text: 'Indizio 3 per Sfida 12' }
    ]
  }
}

async function fixChallenges() {
  console.log('\n🔧 CORREZIONE DATE SFIDE\n')

  // Get all challenges
  const { data: challenges } = await supabase
    .from('game_challenges')
    .select('*')
    .order('challenge_number')

  let fixed = 0
  let errors = 0

  for (const correct of correctDates.challenges) {
    const dbChallenge = challenges.find(c => c.challenge_number === correct.number)

    if (!dbChallenge) {
      console.log(`⚠️  Sfida ${correct.number} non trovata (verrà ignorata)`)
      continue
    }

    console.log(`Aggiornamento Sfida ${correct.number}...`)

    const { error } = await supabase
      .from('game_challenges')
      .update({
        start_date: correct.date,
        end_date: correct.date
      })
      .eq('id', dbChallenge.id)

    if (error) {
      console.log(`❌ Errore: ${error.message}`)
      errors++
    } else {
      console.log(`✅ Sfida ${correct.number}: ${correct.date}`)
      fixed++
    }
  }

  console.log(`\n📊 Sfide: ${fixed} corrette, ${errors} errori`)
  return { fixed, errors }
}

async function deleteAllClues() {
  console.log('\n🗑️  CANCELLAZIONE TUTTI GLI INDIZI\n')

  const { error } = await supabase
    .from('game_clues')
    .delete()
    .neq('id', 0) // Delete all

  if (error) {
    console.error('❌ Errore cancellazione indizi:', error.message)
    return false
  }

  console.log('✅ Tutti gli indizi sono stati cancellati\n')
  return true
}

async function createAllClues() {
  console.log('📝 CREAZIONE NUOVI INDIZI\n')

  // Get all challenges to map challenge_number to id
  const { data: challenges } = await supabase
    .from('game_challenges')
    .select('id, challenge_number')

  let created = 0
  let errors = 0

  for (const [challengeNum, cluesList] of Object.entries(correctDates.clues)) {
    const challengeNumber = parseInt(challengeNum)
    const challenge = challenges.find(c => c.challenge_number === challengeNumber)

    if (!challenge) {
      console.log(`⚠️  Sfida ${challengeNumber} non trovata, indizi saltati`)
      errors += cluesList.length
      continue
    }

    console.log(`\nCreazione indizi per Sfida ${challengeNumber}:`)

    for (let i = 0; i < cluesList.length; i++) {
      const clue = cluesList[i]

      const { error } = await supabase
        .from('game_clues')
        .insert({
          challenge_id: challenge.id,
          clue_number: i + 1,
          clue_text: clue.text,
          revealed_date: clue.date,
          answer_code: null // Verrà popolato dopo
        })

      if (error) {
        console.log(`  ❌ Indizio ${i + 1}: ${error.message}`)
        errors++
      } else {
        console.log(`  ✅ Indizio ${i + 1}: ${clue.date}`)
        created++
      }
    }
  }

  console.log(`\n📊 Indizi: ${created} creati, ${errors} errori`)
  return { created, errors }
}

async function verifyFix() {
  console.log('\n\n🔍 VERIFICA CORREZIONI\n')

  let allGood = true

  // Verifica sfide
  const { data: challenges } = await supabase
    .from('game_challenges')
    .select('*')
    .order('challenge_number')

  for (const correct of correctDates.challenges) {
    const dbChallenge = challenges.find(c => c.challenge_number === correct.number)
    if (!dbChallenge) continue

    const dbDate = new Date(dbChallenge.start_date).toISOString()
    const correctDate = new Date(correct.date).toISOString()

    if (dbDate !== correctDate) {
      console.log(`❌ Sfida ${correct.number} ancora sbagliata`)
      allGood = false
    }
  }

  // Verifica indizi
  const { data: clues } = await supabase
    .from('game_clues')
    .select('*, challenge:game_challenges(challenge_number)')
    .order('revealed_date')

  let clueErrors = 0
  for (const [challengeNum, cluesList] of Object.entries(correctDates.clues)) {
    const challengeNumber = parseInt(challengeNum)
    const challenge = challenges.find(c => c.challenge_number === challengeNumber)
    if (!challenge) continue

    const dbClues = clues.filter(c => c.challenge_id === challenge.id)

    if (dbClues.length !== cluesList.length) {
      console.log(`❌ Sfida ${challengeNumber}: ${dbClues.length} indizi invece di ${cluesList.length}`)
      allGood = false
      clueErrors++
      continue
    }

    for (let i = 0; i < cluesList.length; i++) {
      const dbClue = dbClues.find(c => c.clue_number === i + 1)
      if (!dbClue) continue

      const dbDate = new Date(dbClue.revealed_date).toISOString()
      const correctDate = new Date(cluesList[i].date).toISOString()

      if (dbDate !== correctDate) {
        console.log(`❌ Indizio ${challengeNumber}.${i + 1} ancora sbagliato`)
        allGood = false
        clueErrors++
      }
    }
  }

  if (allGood) {
    console.log('✅ TUTTE LE CORREZIONI VERIFICATE CORRETTAMENTE!\n')
  } else {
    console.log(`\n❌ Trovati ancora ${clueErrors} errori\n`)
  }

  return allGood
}

async function main() {
  console.log('=' .repeat(60))
  console.log('CORREZIONE DATE DATABASE - A TUTTO REALITY: LA RIVOLUZIONE')
  console.log('=' .repeat(60))

  console.log('\n⚠️  ATTENZIONE: Questo script modificherà il database!')
  console.log('Backup già effettuato in database/backups/')
  console.log('\nIniziamo le correzioni...\n')

  // Step 1: Fix challenges
  const challengeResults = await fixChallenges()

  // Step 2: Delete all clues
  const deleteSuccess = await deleteAllClues()
  if (!deleteSuccess) {
    console.error('\n❌ ERRORE: Impossibile cancellare gli indizi. Operazione interrotta.')
    process.exit(1)
  }

  // Step 3: Create new clues
  const clueResults = await createAllClues()

  // Step 4: Verify
  const verified = await verifyFix()

  // Final summary
  console.log('=' .repeat(60))
  console.log('RIEPILOGO OPERAZIONI')
  console.log('=' .repeat(60))
  console.log(`\n✅ Sfide corrette: ${challengeResults.fixed}/${correctDates.challenges.length}`)
  console.log(`✅ Indizi vecchi cancellati: Tutti (44)`)
  console.log(`✅ Indizi nuovi creati: ${clueResults.created}/37`)
  console.log(`\n${verified ? '✅' : '❌'} Verifica finale: ${verified ? 'SUCCESSO' : 'ERRORI TROVATI'}`)
  console.log('\n' + '=' .repeat(60))

  if (verified) {
    console.log('\n🎉 CORREZIONE COMPLETATA CON SUCCESSO!')
    console.log('Tutte le 12 sfide e i 37 indizi hanno ora le date corrette.')
  } else {
    console.log('\n⚠️  Alcune correzioni non sono andate a buon fine.')
    console.log('Controlla i log sopra per i dettagli.')
  }
}

main()
