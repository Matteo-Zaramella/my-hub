import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

console.log('🏋️ Cercando schede di allenamento A, B, C...\n')

// Cerca sessioni workout
const { data: sessions, error: sessionsError } = await supabase
  .from('workout_sessions')
  .select('*')
  .order('created_at', { ascending: false })

if (sessionsError) {
  console.error('❌ Errore nel recuperare workout_sessions:', sessionsError.message)
} else if (!sessions || sessions.length === 0) {
  console.log('⚠️ Nessuna sessione workout trovata nel database')
} else {
  console.log(`✅ Trovate ${sessions.length} sessioni workout\n`)

  // Raggruppa per nome scheda (A, B, C)
  const schedaA = sessions.filter(s => s.session_name?.includes('A') || s.session_name?.includes('Scheda A'))
  const schedaB = sessions.filter(s => s.session_name?.includes('B') || s.session_name?.includes('Scheda B'))
  const schedaC = sessions.filter(s => s.session_name?.includes('C') || s.session_name?.includes('Scheda C'))

  console.log(`📋 Scheda A: ${schedaA.length} sessioni`)
  console.log(`📋 Scheda B: ${schedaB.length} sessioni`)
  console.log(`📋 Scheda C: ${schedaC.length} sessioni\n`)
}

// Cerca esercizi workout
const { data: exercises, error: exercisesError } = await supabase
  .from('workout_exercises')
  .select('*')
  .order('session_id', { ascending: true })

if (exercisesError) {
  console.error('❌ Errore nel recuperare workout_exercises:', exercisesError.message)
} else if (!exercises || exercises.length === 0) {
  console.log('⚠️ Nessun esercizio trovato nel database')
} else {
  console.log(`✅ Trovati ${exercises.length} esercizi totali\n`)

  // Raggruppa per session_id
  const exercisesBySession = exercises.reduce((acc, ex) => {
    if (!acc[ex.session_id]) {
      acc[ex.session_id] = []
    }
    acc[ex.session_id].push(ex)
    return acc
  }, {})

  console.log('📝 Esercizi per sessione:')
  Object.entries(exercisesBySession).forEach(([sessionId, exs]) => {
    console.log(`\n  Session ID ${sessionId}: ${exs.length} esercizi`)
    exs.forEach((ex, idx) => {
      const sets = ex.sets || '?'
      const reps = ex.reps || '?'
      console.log(`    ${idx + 1}. ${ex.exercise_name} - ${sets} serie x ${reps} rip`)
    })
  })
}

// Cerca anche possibili tabelle alternative
console.log('\n🔍 Verificando altre tabelle fitness...')
const tables = ['fitness_exercises', 'exercises', 'workout_plans', 'training_sessions']

for (const table of tables) {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .limit(1)

  if (!error && data) {
    console.log(`✅ Tabella "${table}" esiste con dati`)
  }
}

console.log('\n✅ Ricerca completata!')
