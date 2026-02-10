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
  console.log('🔄 Aggiornamento wishlist 10/02/2026 (batch 2)...\n')

  // 1. Aggiorna prezzo calze trekking: €9.99
  const { data: calze, error: err1 } = await supabase
    .from('wishlist_items')
    .update({ prezzo: 9.99 })
    .eq('id', 33)
    .select('nome')

  if (err1) console.error('❌ Errore calze:', err1.message)
  else if (calze?.length) console.log('✅ Calze Trekking: prezzo aggiornato a €9.99')
  else console.log('⚠️  Calze (ID 33) non trovate')

  // 2. Elimina fascia portacellulare (ID 5)
  const { error: err2 } = await supabase
    .from('wishlist_items')
    .delete()
    .eq('id', 5)

  if (err2) console.error('❌ Errore eliminazione fascia:', err2.message)
  else console.log('🗑️  Fascia porta cellulare eliminata')

  // 3. Aggiorna prezzo cavo ethernet: €39.99
  const { data: cavo, error: err3 } = await supabase
    .from('wishlist_items')
    .update({ prezzo: 39.99 })
    .eq('id', 23)
    .select('nome')

  if (err3) console.error('❌ Errore cavo:', err3.message)
  else if (cavo?.length) console.log('✅ Cavo Ethernet: prezzo aggiornato a €39.99')
  else console.log('⚠️  Cavo Ethernet (ID 23) non trovato')

  // 4. Dickies: da bianchi a beige/cachi
  const { data: dickies, error: err4 } = await supabase
    .from('wishlist_items')
    .update({
      nome: 'Pantaloni Dickies Original 874 - Beige',
      link: 'https://eu.dickies.com/it-it/products/pantaloni-da-lavoro-original-874-unisex-dk0a4xk6khk1-cachi?variant=52373654569227',
      prezzo: 75.00,
      colore_selezionato: 'Cachi'
    })
    .eq('id', 9)
    .select('nome')

  if (err4) console.error('❌ Errore Dickies:', err4.message)
  else if (dickies?.length) console.log('✅ Dickies aggiornati: Bianco → Beige/Cachi')
  else console.log('⚠️  Dickies (ID 9) non trovati')

  // 5. CMF Watch: prezzo da 69 a 79
  const { data: watch, error: err5 } = await supabase
    .from('wishlist_items')
    .update({ prezzo: 79.00 })
    .eq('id', 14)
    .select('nome')

  if (err5) console.error('❌ Errore CMF Watch:', err5.message)
  else if (watch?.length) console.log('✅ CMF Watch 3 Pro: prezzo aggiornato a €79')
  else console.log('⚠️  CMF Watch (ID 14) non trovato')

  console.log('\n✨ Fatto!')
}

updateWishlist()
