import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '..', '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// INDIZI REALI - Sfida 2 (Febbraio - Prato della Valle)
const SFIDA_2_CLUES = [
  {
    clue_number: 1,
    revealed_date: '2026-02-01',
    clue_text: `Nel mese più breve che l'anno riserva
tre cigni si posano lungo la via
la data nel tempo il segreto conserva
nel giorno e nel mese la stessa magia`,
    // Soluzione: 22/02 (cigno = 2, tre cigni = 22)
  },
  {
    clue_number: 2,
    revealed_date: '2026-02-08',
    clue_text: `Quando il giorno ha passato metà del cammino
ma il sole è ancora padrone del cielo
tre passi dal mezzogiorno divino
la sfida vi attende, cade ogni velo`,
    // Soluzione: 15:00 (tre ore dopo mezzogiorno)
  },
  {
    clue_number: 3,
    revealed_date: '2026-02-15',
    clue_text: `Nel grembo che Memmo strappò dalla palude
settantotto occhi di marmo vi guardano
chi cerca la via che al centro si chiude
nell'anello d'acqua le risposte si tardano`,
    // Soluzione: Prato della Valle (Memmo, 78 statue, canale ellittico)
  }
]

// INDIZI REALI - Sfida 3 (Marzo - IKEA)
const SFIDA_3_CLUES = [
  {
    clue_number: 1,
    revealed_date: '2026-03-08',
    clue_text: `Il dio della guerra sta per lasciare il trono
ventinove guerrieri lo salutano al tramonto
prima che i fiori rubino la scena e il suono
cercate quel giorno, è quasi il confronto`,
    // Soluzione: 29/03 (Marte = marzo, fiori = aprile)
  },
  {
    clue_number: 2,
    revealed_date: '2026-03-15',
    clue_text: `Il mezzo che sfida ogni strada e sentiero
porta in sé l'ora due volte nascosta
le ruote per sé stesse, il tempo è sincero
cercate quell'ora, avrete risposta`,
    // Soluzione: 16:00 (4x4 = fuoristrada, 4×4 = 16)
  },
  {
    clue_number: 3,
    revealed_date: '2026-03-22',
    clue_text: `Dal regno dei vichinghi un labirinto è arrivato
giallo come il sole, blu come il mare
un percorso senza fine dove tutto è montato
la preda si nasconde, iniziate a cercare`,
    // Soluzione: IKEA (Svezia, colori giallo/blu)
  }
]

async function updateChallengeAndClues(challengeNumber, clues, challengeInfo) {
  console.log(`\n📝 Aggiornamento Sfida ${challengeNumber}...`)

  // Trova la sfida
  const { data: challenge, error: findError } = await supabase
    .from('game_challenges')
    .select('id')
    .eq('challenge_number', challengeNumber)
    .single()

  if (findError || !challenge) {
    console.error(`❌ Sfida ${challengeNumber} non trovata:`, findError)
    return
  }

  // Aggiorna info sfida se fornite
  if (challengeInfo) {
    const { error: updateError } = await supabase
      .from('game_challenges')
      .update(challengeInfo)
      .eq('id', challenge.id)

    if (updateError) {
      console.error(`❌ Errore aggiornamento sfida:`, updateError)
    } else {
      console.log(`   ✅ Info sfida aggiornate`)
    }
  }

  // Aggiorna ogni indizio
  for (const clue of clues) {
    const { error: clueError } = await supabase
      .from('game_clues')
      .update({
        clue_text: clue.clue_text,
        revealed_date: clue.revealed_date,
        image_url: clue.image_url || null
      })
      .eq('challenge_id', challenge.id)
      .eq('clue_number', clue.clue_number)

    if (clueError) {
      console.error(`   ❌ Errore indizio ${clue.clue_number}:`, clueError)
    } else {
      console.log(`   ✅ Indizio ${clue.clue_number} aggiornato (reveal: ${clue.revealed_date})`)
    }
  }
}

async function main() {
  console.log('🚀 Popolamento indizi reali...')

  // Sfida 2 - Febbraio (Prato della Valle, 15:00, 22/02)
  await updateChallengeAndClues(2, SFIDA_2_CLUES, {
    title: 'Sfida 2 - Febbraio',
    description: 'Caccia ai QR code',
    location: 'Prato della Valle, Padova',
    start_date: '2026-02-22T15:00:00',
    answer_code: 'SPIONE'
  })

  // Sfida 3 - Marzo (IKEA, 16:00, 29/03)
  await updateChallengeAndClues(3, SFIDA_3_CLUES, {
    title: 'Sfida 3 - Marzo',
    description: 'L\'Agente - Trova la persona nascosta',
    location: 'IKEA Padova',
    start_date: '2026-03-29T16:00:00',
    answer_code: null // Da definire
  })

  console.log('\n✨ Completato!')
  console.log('\n⚠️  NOTA: Le sfide 4-12 hanno ancora testo placeholder.')
}

main()
