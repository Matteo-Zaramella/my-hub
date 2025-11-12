// Script per aggiornare categorie partecipanti
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wuvuapmjclahbmngntku.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dnVhcG1qY2xhaGJtbmdudGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MzAyNDQsImV4cCI6MjA3NjEwNjI0NH0.12asA4yGSUdP_zkfGGZyv7vOX6Ncq9GhkIpBD1tcscc'

const supabase = createClient(supabaseUrl, supabaseKey)

const updates = [
  { search: 'Angelica Bettella', category: 'Mortise' },
  { search: 'Benedetta', category: 'Arcella' },
  { search: 'Elena', category: 'Severi' },
  { search: 'Elisa Volpatti', category: 'Severi' },
  { search: 'Emanuele Pedroni', category: 'Arcella' },
  { search: 'Colombin', category: 'Vigodarzere' },
  { search: 'Pasini', category: 'Severi' },
  { search: 'Corricelli', category: 'Famiglia' },
  { search: 'Giulia', category: 'Mare' },
  { search: 'Giulio', category: 'Arcella' },
  { search: 'Bortolami', category: 'Arcella' },
  { search: 'Barnaba', category: 'Vigodarzere' },
  { search: 'Sara Giacometti', category: 'Arcella' },
  { search: 'Sophia Gardin', category: 'Severi' }
]

async function updateCategories() {
  console.log('🚀 Inizio aggiornamento categorie...\n')

  // Get all participants first
  const { data: allParticipants } = await supabase
    .from('game_participants')
    .select('*')

  console.log(`📊 Totale partecipanti: ${allParticipants?.length}\n`)

  for (const update of updates) {
    console.log(`🔍 Cercando: ${update.search}`)

    // Find participant by name (case insensitive)
    const participant = allParticipants?.find(p =>
      p.participant_name.toLowerCase().includes(update.search.toLowerCase())
    )

    if (participant) {
      console.log(`   ✓ Trovato: ${participant.participant_name}`)

      const { error } = await supabase
        .from('game_participants')
        .update({ category: update.category })
        .eq('id', participant.id)

      if (error) {
        console.error(`   ✗ Errore:`, error.message)
      } else {
        console.log(`   ✅ Aggiornato a: ${update.category}\n`)
      }
    } else {
      console.log(`   ⚠️  NON TROVATO\n`)
    }
  }

  console.log('🎉 Aggiornamento completato!')
}

updateCategories()
