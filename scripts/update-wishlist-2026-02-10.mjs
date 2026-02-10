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

async function updateWishlist() {
  console.log('🔄 Aggiornamento wishlist 10/02/2026...\n')

  // 1. Aggiorna calzini: da "Calze Lunghe RS 160 x3" a "Calze Trekking HIKE 100 High"
  const { data: calze, error: err1 } = await supabase
    .from('wishlist_items')
    .update({
      nome: 'Calze Trekking HIKE 100 High x2',
      descrizione: 'Calze trekking alte mimetiche e beige - 2 paia - Taglia 47 - Decathlon',
      link: 'https://www.decathlon.it/p/calze-trekking-hike-100-high-mimetiche-e-beige-2-paia/_/R-p-334359?mc=8665857&c=nero%20fumo#selectedSize=47',
      immagine_url: '/wishlist-products/calzini.jpg'
    })
    .eq('id', 33)
    .select()

  if (err1) {
    console.error('❌ Errore aggiornamento calze:', err1.message)
  } else if (calze?.length) {
    console.log('✅ Calze aggiornate: "Calze Trekking HIKE 100 High x2"')
  } else {
    console.log('⚠️  Calze (ID 33) non trovate')
  }

  // 2. Elimina Soprapantaloni Impermeabili Ciclismo
  const { error: err2 } = await supabase
    .from('wishlist_items')
    .delete()
    .eq('id', 32)

  if (err2) {
    console.error('❌ Errore eliminazione soprapantaloni:', err2.message)
  } else {
    console.log('🗑️  Soprapantaloni Impermeabili Ciclismo eliminati')
  }

  console.log('\n✨ Fatto!')
}

updateWishlist()
