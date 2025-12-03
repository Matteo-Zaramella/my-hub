import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Carica variabili ambiente
dotenv.config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Mancano le credenziali Supabase')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Funzione per ottenere i sabati precedenti a una data
function getSaturdaysBeforeDate(targetDate, count = 3) {
  const saturdays = []
  const date = new Date(targetDate)

  // Trova il sabato precedente
  while (date.getDay() !== 6) {
    date.setDate(date.getDate() - 1)
  }

  // Raccogli i sabati
  for (let i = 0; i < count; i++) {
    saturdays.unshift(new Date(date))
    date.setDate(date.getDate() - 7)
  }

  return saturdays
}

// Funzione per formattare data in YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

async function populateMonthlyChallenges() {
  console.log('🚀 Inizio popolamento sfide mensili...\n')

  // Date delle 11 sfide (terzo venerdì di ogni mese da Febbraio a Dicembre 2026)
  const challengeDates = [
    '2026-02-21', // Febbraio
    '2026-03-21', // Marzo
    '2026-04-18', // Aprile
    '2026-05-16', // Maggio
    '2026-06-20', // Giugno
    '2026-07-18', // Luglio
    '2026-08-22', // Agosto
    '2026-09-19', // Settembre
    '2026-10-17', // Ottobre
    '2026-11-21', // Novembre
    '2026-12-19', // Dicembre
  ]

  try {
    // 1. Elimina sfide e indizi esistenti per evitare duplicati
    console.log('🗑️  Eliminazione sfide esistenti...')
    const { error: deleteCluesError } = await supabase
      .from('game_clues')
      .delete()
      .gte('revealed_date', '2026-01-01')

    if (deleteCluesError) {
      console.error('Errore eliminazione indizi:', deleteCluesError)
    }

    const { error: deleteChallengesError } = await supabase
      .from('game_challenges')
      .delete()
      .gte('start_date', '2026-02-01')

    if (deleteChallengesError) {
      console.error('Errore eliminazione sfide:', deleteChallengesError)
    }

    // 2. Crea le 11 sfide
    console.log('\n📝 Creazione 11 sfide mensili...')

    for (let i = 0; i < challengeDates.length; i++) {
      const challengeDate = challengeDates[i]
      const challengeNumber = i + 1

      console.log(`\n   Sfida ${challengeNumber} - ${challengeDate}`)

      // Inserisci la sfida
      const { data: challenge, error: challengeError } = await supabase
        .from('game_challenges')
        .insert({
          challenge_number: challengeNumber,
          title: `Sfida ${challengeNumber}`,
          description: `Descrizione della Sfida ${challengeNumber}`,
          start_date: challengeDate,
          end_date: challengeDate,
          location: 'Da definire',
          instructions: 'Istruzioni da completare',
          points: 100
        })
        .select()
        .single()

      if (challengeError) {
        console.error(`   ❌ Errore creazione Sfida ${challengeNumber}:`, challengeError)
        continue
      }

      console.log(`   ✅ Sfida ${challengeNumber} creata (ID: ${challenge.id})`)

      // 3. Crea i 3 indizi per questa sfida (sabati precedenti)
      const saturdays = getSaturdaysBeforeDate(challengeDate, 3)

      for (let j = 0; j < saturdays.length; j++) {
        const clueNumber = j + 1
        const revealDate = formatDate(saturdays[j])

        const { error: clueError } = await supabase
          .from('game_clues')
          .insert({
            challenge_id: challenge.id,
            clue_text: `Indizio ${clueNumber} per Sfida ${challengeNumber}`,
            revealed_date: revealDate,
            clue_number: clueNumber
          })

        if (clueError) {
          console.error(`      ❌ Errore creazione Indizio ${clueNumber}:`, clueError)
        } else {
          console.log(`      ✅ Indizio ${clueNumber} creato (reveal: ${revealDate})`)
        }
      }
    }

    console.log('\n✨ Popolamento completato con successo!\n')

    // Verifica finale
    const { data: totalChallenges } = await supabase
      .from('game_challenges')
      .select('id', { count: 'exact' })
      .gte('start_date', '2026-02-01')
      .lte('start_date', '2026-12-31')

    const { data: totalClues } = await supabase
      .from('game_clues')
      .select('id', { count: 'exact' })

    console.log('📊 Riepilogo:')
    console.log(`   - Sfide create: ${totalChallenges?.length || 0}`)
    console.log(`   - Indizi creati: ${totalClues?.length || 0}`)
    console.log('')

  } catch (error) {
    console.error('\n❌ Errore generale:', error)
    process.exit(1)
  }
}

// Esegui
populateMonthlyChallenges()
