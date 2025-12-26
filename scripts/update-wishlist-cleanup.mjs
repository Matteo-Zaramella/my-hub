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

async function cleanupWishlist() {
  console.log('🧹 Pulizia wishlist...\n')

  // 1. Elimina "Teli in Microfibra" (ID 4)
  console.log('❌ Eliminando "Teli in Microfibra"...')
  const { error: err1 } = await supabase
    .from('wishlist_items')
    .delete()
    .eq('id', 4)

  if (err1) console.error('  Errore:', err1.message)
  else console.log('  ✓ Eliminato')

  // 2. Elimina "Vitamina D" (ID 18)
  console.log('❌ Eliminando "Vitamina D"...')
  const { error: err2 } = await supabase
    .from('wishlist_items')
    .delete()
    .eq('id', 18)

  if (err2) console.error('  Errore:', err2.message)
  else console.log('  ✓ Eliminato')

  // 3. Elimina "Proteine" (ID 17)
  console.log('❌ Eliminando "Proteine"...')
  const { error: err3 } = await supabase
    .from('wishlist_items')
    .delete()
    .eq('id', 17)

  if (err3) console.error('  Errore:', err3.message)
  else console.log('  ✓ Eliminato')

  // 4. Aggiorna immagine "Fascia porta cellulare" (ID 5)
  console.log('🖼️ Aggiornando immagine "Fascia porta cellulare"...')
  const { error: err4 } = await supabase
    .from('wishlist_items')
    .update({ immagine_url: '/fascia-portacellulare.jpg' })
    .eq('id', 5)

  if (err4) console.error('  Errore:', err4.message)
  else console.log('  ✓ Immagine aggiornata')

  // Verifica finale
  console.log('\n📊 Verifica wishlist aggiornata:')
  const { data, error } = await supabase
    .from('wishlist_items')
    .select('id, nome, categoria, immagine_url')
    .eq('pubblico', true)
    .order('categoria')

  if (error) {
    console.error('Errore verifica:', error)
  } else {
    console.log(`\nTotale items: ${data.length}\n`)
    data.forEach(item => {
      console.log(`  - ${item.nome} (${item.categoria})${item.immagine_url ? ' [img]' : ''}`)
    })
  }

  console.log('\n✅ Pulizia completata!')
}

cleanupWishlist()
