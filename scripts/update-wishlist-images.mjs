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

// Mapping: ID prodotto → nome file immagine
const imageMapping = {
  1: 'frullatore philips.jpg',      // Philips Serie 5000 frullatore
  4: 'telo microfibra.avif',        // Teli in Microfibra
  5: 'fascia porta cellulare.avif', // Fascia porta cellulare
  9: 'dickies.webp',                // Pantaloni Dickies Original 874
  14: 'nothing watch.webp',         // Nothing Smartwatch
  15: 'farina-avena-istantanea.jpg',// Farina d'avena istantanea
  17: 'whey.jpg',                   // Proteine
  18: 'vitamina-d3.jpg',            // Vitamina D
  19: 'omega-3.jpg',                // Omega 3
}

async function updateWishlistImages() {
  console.log('🖼️  Updating wishlist images...\n')

  let successCount = 0
  let errorCount = 0

  for (const [itemId, imageName] of Object.entries(imageMapping)) {
    const imageUrl = `/wishlist-products/${imageName}`

    console.log(`Updating item ${itemId} with image: ${imageUrl}`)

    const { data, error } = await supabase
      .from('wishlist_items')
      .update({ immagine_url: imageUrl })
      .eq('id', parseInt(itemId))
      .select()

    if (error) {
      console.error(`  ❌ Error updating item ${itemId}:`, error.message)
      errorCount++
    } else if (data && data.length > 0) {
      console.log(`  ✅ Updated: ${data[0].nome}`)
      successCount++
    } else {
      console.log(`  ⚠️  Item ${itemId} not found`)
      errorCount++
    }
  }

  console.log('\n📊 Summary:')
  console.log(`  ✅ Successfully updated: ${successCount}`)
  console.log(`  ❌ Errors: ${errorCount}`)
  console.log('\n✨ Done!\n')
}

updateWishlistImages()
