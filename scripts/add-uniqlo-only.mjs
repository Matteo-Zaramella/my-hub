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

const userId = '3c3da68d-f561-4224-81d4-875f6b7146e5'

const uniqloItem = {
  user_id: userId,
  nome: 'Maglione Uniqlo Cashmere',
  descrizione: 'Maglione girocollo in 100% cashmere Uniqlo',
  link: 'https://www.uniqlo.com/it/it/products/E450535-000/00?colorDisplayCode=09&sizeDisplayCode=003',
  prezzo: 89.90,
  categoria: 'vestiti',
  pubblico: true,
  immagine_url: 'https://image.uniqlo.com/UQ/ST3/eu/imagesgoods/450535/item/eugoods_09_450535.jpg',
  taglie: {
    maglie: '3XL (XXXL)',
    note: 'Preferenza colori in ordine: bianco, beige, nero, verde',
    colori_preferiti: ['bianco', 'beige', 'nero', 'verde']
  },
  colori_disponibili: [
    {
      colore: 'Nero',
      hex: '#000000',
      immagine_url: 'https://image.uniqlo.com/UQ/ST3/eu/imagesgoods/450535/item/eugoods_09_450535.jpg'
    },
    {
      colore: 'Grigio',
      hex: '#808080',
      immagine_url: 'https://image.uniqlo.com/UQ/ST3/eu/imagesgoods/450535/item/eugoods_03_450535.jpg'
    },
    {
      colore: 'Beige',
      hex: '#C9B89A',
      immagine_url: 'https://image.uniqlo.com/UQ/ST3/eu/imagesgoods/450535/item/eugoods_32_450535.jpg'
    }
  ],
  colore_selezionato: 'Nero'
}

console.log('Adding Uniqlo Cashmere sweater...')

const { error } = await supabase
  .from('wishlist_items')
  .insert([uniqloItem])

if (error) {
  console.error('Error:', error)
  process.exit(1)
} else {
  console.log('✓ Successfully added Maglione Uniqlo Cashmere!')
}
