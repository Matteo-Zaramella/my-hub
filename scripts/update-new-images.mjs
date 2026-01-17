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

const imageMapping = {
  'Nothing Cable (c-c) 180cm': '/wishlist-products/nothing-cable.png',
  'Nothing Power (45W) Bianco': '/wishlist-products/nothing-power-45w.png',
  'Bitdefender Ultimate Security Family': '/wishlist-products/bitdefender-ultimate.png'
}

async function updateImages() {
  console.log('Updating wishlist images...\n')

  for (const [nome, imageUrl] of Object.entries(imageMapping)) {
    const { data, error } = await supabase
      .from('wishlist_items')
      .update({ immagine_url: imageUrl })
      .eq('nome', nome)
      .select()

    if (error) {
      console.error(`Error updating "${nome}":`, error.message)
    } else if (data && data.length > 0) {
      console.log(`Updated: ${data[0].nome} -> ${imageUrl}`)
    } else {
      console.log(`Item "${nome}" not found`)
    }
  }

  console.log('\nDone!')
}

updateImages()
