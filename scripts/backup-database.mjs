import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { writeFileSync } from 'fs'

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

async function backupDatabase() {
  console.log('📦 BACKUP DATABASE IN CORSO...\n')

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupDir = resolve(__dirname, '..', 'database', 'backups')

  try {
    // Backup game_challenges
    console.log('Backup game_challenges...')
    const { data: challenges, error: chalError } = await supabase
      .from('game_challenges')
      .select('*')
      .order('challenge_number')

    if (chalError) throw chalError

    writeFileSync(
      resolve(backupDir, `game_challenges_${timestamp}.json`),
      JSON.stringify(challenges, null, 2)
    )
    console.log(`✅ Salvate ${challenges.length} sfide`)

    // Backup game_clues
    console.log('Backup game_clues...')
    const { data: clues, error: clueError } = await supabase
      .from('game_clues')
      .select('*')
      .order('revealed_date')

    if (clueError) throw clueError

    writeFileSync(
      resolve(backupDir, `game_clues_${timestamp}.json`),
      JSON.stringify(clues, null, 2)
    )
    console.log(`✅ Salvati ${clues.length} indizi`)

    console.log(`\n✅ BACKUP COMPLETATO!`)
    console.log(`📁 File salvati in: database/backups/`)
    console.log(`   - game_challenges_${timestamp}.json`)
    console.log(`   - game_clues_${timestamp}.json`)

    return timestamp

  } catch (error) {
    console.error('\n❌ ERRORE durante il backup:', error.message)
    process.exit(1)
  }
}

backupDatabase()
