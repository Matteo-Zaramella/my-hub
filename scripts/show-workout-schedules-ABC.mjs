import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

console.log('🏋️ SCHEDE DI ALLENAMENTO A, B, C - DETTAGLIO COMPLETO\n')
console.log('='.repeat(70))

// Recupera sessioni
const { data: sessions } = await supabase
  .from('workout_sessions')
  .select('*')
  .order('workout_type, data', { ascending: true })

// Recupera esercizi
const { data: exercises } = await supabase
  .from('workout_exercises')
  .select('*')
  .order('session_id, id')

// Raggruppa per tipo workout (A, B, C)
const schedaA = sessions.filter(s => s.workout_type === 'A')
const schedaB = sessions.filter(s => s.workout_type === 'B')
const schedaC = sessions.filter(s => s.workout_type === 'C')

// Funzione per raggruppare esercizi per nome
function groupExercises(sessionId) {
  const sessionExercises = exercises.filter(ex => ex.session_id === sessionId)
  const grouped = {}

  sessionExercises.forEach(ex => {
    const name = ex.esercizio
    if (!grouped[name]) {
      grouped[name] = []
    }
    grouped[name].push({
      serie: ex.serie_numero,
      reps: ex.ripetizioni,
      peso: ex.peso,
      note: ex.note
    })
  })

  return grouped
}

// Funzione per stampare scheda
function printScheda(nome, sessionList) {
  console.log(`\n\n${'█'.repeat(70)}`)
  console.log(`█  SCHEDA ${nome}`)
  console.log(`${'█'.repeat(70)}`)

  if (sessionList.length === 0) {
    console.log('\n⚠️ Nessuna sessione trovata per questa scheda\n')
    return
  }

  // Prendi l'ultima sessione (più recente)
  const latestSession = sessionList[sessionList.length - 1]
  const grouped = groupExercises(latestSession.id)

  console.log(`\nUltima sessione: ${latestSession.data}`)
  console.log(`Totale esercizi: ${Object.keys(grouped).length}\n`)

  let exerciseNumber = 1

  Object.entries(grouped).forEach(([exerciseName, sets]) => {
    console.log(`\n${exerciseNumber}. ${exerciseName.toUpperCase()}`)
    console.log('   ' + '-'.repeat(60))

    sets.forEach(set => {
      const serieInfo = set.serie ? `Serie ${set.serie}` : 'Serie ?'
      const repsInfo = set.reps ? `${set.reps} rip` : '? rip'
      const pesoInfo = set.peso ? `${set.peso} kg` : 'Corpo libero'

      console.log(`   ${serieInfo}: ${repsInfo} @ ${pesoInfo}`)
    })

    exerciseNumber++
  })

  console.log('\n')
}

// Stampa tutte le schede
printScheda('A', schedaA)
printScheda('B', schedaB)
printScheda('C', schedaC)

console.log('='.repeat(70))
console.log('✅ Analisi completata!')
console.log('='.repeat(70))
