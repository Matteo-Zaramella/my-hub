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

// Mapping: ID prodotto → nuova categoria
const categoryMapping = {
  // Integratori
  17: 'integratori',  // Proteine (whey)
  18: 'integratori',  // Vitamina D
  19: 'integratori',  // Omega 3
  15: 'integratori',  // Farina d'avena istantanea
  7: 'integratori',   // Creatina monoidrato
  8: 'integratori',   // Vitamina D (duplicato)

  // Elettronica
  3: 'elettronica',   // Nothing Ear Pro
  14: 'elettronica',  // Nothing Smartwatch

  // Elettrodomestici
  1: 'elettrodomestici', // Philips Serie 5000 frullatore

  // Sport
  4: 'sport',         // Teli in Microfibra
  5: 'sport',         // Fascia porta cellulare

  // Vestiti
  9: 'vestiti',       // Pantaloni Dickies
  10: 'vestiti',      // Maglione Uniqlo

  // Bici
  2: 'bici',          // Borsa da manubrio
}

async function fixCategories() {
  console.log('🔧 Fixing categories...\n')

  let successCount = 0
  let errorCount = 0

  for (const [itemId, newCategory] of Object.entries(categoryMapping)) {
    console.log(`Updating item ${itemId} to category: ${newCategory}`)

    const { data, error } = await supabase
      .from('wishlist_items')
      .update({ categoria: newCategory })
      .eq('id', parseInt(itemId))
      .select()

    if (error) {
      console.error(`  ❌ Error updating item ${itemId}:`, error.message)
      errorCount++
    } else if (data && data.length > 0) {
      console.log(`  ✅ Updated: ${data[0].nome} → ${newCategory}`)
      successCount++
    } else {
      console.log(`  ⚠️  Item ${itemId} not found`)
      errorCount++
    }
  }

  console.log('\n📊 Summary:')
  console.log(`  ✅ Successfully updated: ${successCount}`)
  console.log(`  ❌ Errors: ${errorCount}`)
  console.log('\n📂 New categories:')
  console.log('  - integratori: 6 items')
  console.log('  - elettronica: 2 items')
  console.log('  - elettrodomestici: 1 item')
  console.log('  - sport: 2 items')
  console.log('  - vestiti: 2 items')
  console.log('  - bici: 1 item')
  console.log('\n✨ Done!\n')
}

fixCategories()
