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

// USAGE: node scripts/update-clue-image.mjs <challenge_number> <clue_number> <image_filename>
// Example: node scripts/update-clue-image.mjs 2 1 indizio-2-1.jpg

const [challengeNum, clueNum, imageFilename] = process.argv.slice(2)

if (!challengeNum || !clueNum || !imageFilename) {
  console.log('❌ Usage: node scripts/update-clue-image.mjs <challenge_number> <clue_number> <image_filename>')
  console.log('\nEsempi:')
  console.log('  node scripts/update-clue-image.mjs 2 1 sfida-2-indizio-1.jpg')
  console.log('  node scripts/update-clue-image.mjs 3 2 sfida-3-indizio-2.png')
  console.log('\n📝 Le immagini devono essere nella cartella public/game-clues/')
  process.exit(1)
}

async function updateClueImage() {
  console.log('🔍 Ricerca indizio...\n')

  // Trova la sfida
  const { data: challenge } = await supabase
    .from('game_challenges')
    .select('id, challenge_number, start_date')
    .eq('challenge_number', parseInt(challengeNum))
    .single()

  if (!challenge) {
    console.error(`❌ Sfida ${challengeNum} non trovata`)
    process.exit(1)
  }

  console.log(`✅ Sfida trovata: #${challenge.challenge_number} (${new Date(challenge.start_date).toLocaleDateString('it-IT')})`)

  // Trova l'indizio
  const { data: clue } = await supabase
    .from('game_clues')
    .select('*')
    .eq('challenge_id', challenge.id)
    .eq('clue_number', parseInt(clueNum))
    .single()

  if (!clue) {
    console.error(`❌ Indizio ${clueNum} per sfida ${challengeNum} non trovato`)
    process.exit(1)
  }

  console.log(`✅ Indizio trovato: #${clue.clue_number} (${new Date(clue.revealed_date).toLocaleDateString('it-IT')})`)

  // Update image URL
  const imagePath = `/game-clues/${imageFilename}`
  const { error } = await supabase
    .from('game_clues')
    .update({ image_url: imagePath })
    .eq('id', clue.id)

  if (error) {
    console.error(`\n❌ Errore aggiornamento: ${error.message}`)
    process.exit(1)
  }

  console.log(`\n🎉 SUCCESSO!`)
  console.log(`   Sfida: ${challengeNum}`)
  console.log(`   Indizio: ${clueNum}`)
  console.log(`   Immagine: ${imagePath}`)
  console.log(`\n💡 Assicurati che il file esista in: public${imagePath}`)
}

updateClueImage()
