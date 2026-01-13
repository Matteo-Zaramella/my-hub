import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateItems() {
  // Update Scaldacollo
  const { data: scaldacollo, error: err1 } = await supabase
    .from('wishlist_items')
    .update({
      nome: 'Scaldacollo Sci FIRSTHEAT Nero',
      descrizione: 'Scaldacollo termico per sci adulto - Decathlon',
      link: 'https://www.decathlon.it/p/scaldacollo-sci-adulto-firstheat-nero/_/R-p-12582?mc=8318100&c=nero',
      prezzo: 3.00
    })
    .eq('nome', 'Scaldacollo Invernale')
    .select()

  if (err1) {
    console.error('❌ Errore scaldacollo:', err1.message)
  } else if (scaldacollo?.length) {
    console.log('✅ Scaldacollo aggiornato: €3')
  } else {
    console.log('⚠️  Scaldacollo non trovato')
  }

  // Update Calzini
  const { data: calze, error: err2 } = await supabase
    .from('wishlist_items')
    .update({
      nome: 'Calze Lunghe RS 160 x3',
      descrizione: 'Calze lunghe adulto taglia 47 - Pack da 3 - Decathlon',
      link: 'https://www.decathlon.it/p/calze-lunghe-adulto-rs-160-blu-x3/_/R-p-300234?mc=8395032&c=nero%20fumo#selectedSize=47',
      prezzo: 6.00
    })
    .eq('nome', 'Calzini Lunghi Taglia 47/50')
    .select()

  if (err2) {
    console.error('❌ Errore calze:', err2.message)
  } else if (calze?.length) {
    console.log('✅ Calze aggiornate: €6')
  } else {
    console.log('⚠️  Calze non trovate')
  }
}

updateItems()
