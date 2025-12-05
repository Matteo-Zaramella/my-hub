import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: resolve(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const challengeNum = process.argv[2] || 2

console.log(`\n🔍 STATO INDIZI SFIDA ${challengeNum}\n`)

// Trova sfida
const { data: challenge } = await supabase
  .from('game_challenges')
  .select('id, challenge_number, start_date')
  .eq('challenge_number', parseInt(challengeNum))
  .single()

if (!challenge) {
  console.log(`❌ Sfida ${challengeNum} non trovata`)
  process.exit(1)
}

console.log(`📅 Sfida ${challenge.challenge_number}: ${new Date(challenge.start_date).toLocaleDateString('it-IT')}\n`)

// Trova indizi
const { data: clues } = await supabase
  .from('game_clues')
  .select('*')
  .eq('challenge_id', challenge.id)
  .order('clue_number', { ascending: true })

if (!clues || clues.length === 0) {
  console.log('❌ Nessun indizio trovato')
  process.exit(0)
}

console.log(`Trovati ${clues.length} indizi:\n`)

for (const clue of clues) {
  const revealDate = new Date(clue.revealed_date)
  const hasImage = clue.image_url ? '✅' : '❌'

  console.log(`${hasImage} Indizio ${clue.clue_number}`)
  console.log(`   Data rivelazione: ${revealDate.toLocaleDateString('it-IT')}`)
  console.log(`   Testo: ${clue.clue_text.substring(0, 50)}...`)
  console.log(`   Immagine: ${clue.image_url || 'NON CARICATA'}`)
  console.log()
}

const withImages = clues.filter(c => c.image_url).length
console.log(`📊 Riepilogo: ${withImages}/${clues.length} immagini caricate`)
