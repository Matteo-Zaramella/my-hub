import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

console.log('🏋️ Recuperando schede di allenamento complete...\n')

// 1. Prima recupera le sessioni
const { data: sessions, error: sessionsError } = await supabase
  .from('workout_sessions')
  .select('*')
  .order('id', { ascending: true })

if (sessionsError) {
  console.error('❌ Errore sessioni:', sessionsError.message)
  process.exit(1)
}

console.log(`✅ Trovate ${sessions.length} sessioni\n`)

// Mostra dettagli sessioni
sessions.forEach((session, idx) => {
  console.log(`\n=== SESSIONE ${idx + 1} ===`)
  console.log(JSON.stringify(session, null, 2))
})

// 2. Recupera tutti gli esercizi
const { data: exercises, error: exercisesError } = await supabase
  .from('workout_exercises')
  .select('*')
  .order('session_id, id', { ascending: true })

if (exercisesError) {
  console.error('❌ Errore esercizi:', exercisesError.message)
  process.exit(1)
}

console.log(`\n\n✅ Trovati ${exercises.length} esercizi totali\n`)

// Mostra primi 5 esercizi raw
console.log('Primi 5 esercizi (raw data):')
exercises.slice(0, 5).forEach(ex => {
  console.log(JSON.stringify(ex, null, 2))
})

// Raggruppa per sessione
const bySession = {}
sessions.forEach(s => {
  bySession[s.id] = {
    session: s,
    exercises: exercises.filter(ex => ex.session_id === s.id)
  }
})

console.log('\n\n📋 SCHEDE COMPLETE:\n')

Object.values(bySession).forEach((data, idx) => {
  const session = data.session
  const exs = data.exercises

  console.log(`\n${'='.repeat(60)}`)
  console.log(`SCHEDA ${idx + 1}: ${session.session_name || 'Senza nome'}`)
  console.log(`Data: ${session.session_date || 'Non specificata'}`)
  console.log(`Note: ${session.notes || 'Nessuna'}`)
  console.log(`${'='.repeat(60)}`)

  if (exs.length === 0) {
    console.log('  (Nessun esercizio)')
  } else {
    exs.forEach((ex, i) => {
      // Prova tutti i possibili nomi di campo
      const name = ex.exercise_name || ex.name || ex.exercise || 'Esercizio senza nome'
      const sets = ex.sets || ex.serie || '?'
      const reps = ex.reps || ex.ripetizioni || ex.repetitions || '?'
      const weight = ex.weight || ex.peso || null
      const rest = ex.rest_time || ex.recupero || null

      let line = `  ${i + 1}. ${name}`
      if (sets && reps) {
        line += ` - ${sets} serie x ${reps} rip`
      }
      if (weight) {
        line += ` @ ${weight}kg`
      }
      if (rest) {
        line += ` (recupero: ${rest}s)`
      }

      console.log(line)
    })
  }
})

console.log('\n\n✅ Analisi completata!')
