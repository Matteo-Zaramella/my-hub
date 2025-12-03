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

// Admin user ID (from database)
const ADMIN_USER_ID = '3c3da68d-f561-4224-81d4-875f6b7146e5'

async function addClothingItems() {
  console.log('Adding clothing items to wishlist...')

  const userId = ADMIN_USER_ID

  const clothingItems = [
    {
      user_id: userId,
      nome: 'Pantaloni Dickies Original 874 - Bianco',
      descrizione: 'Pantaloni da lavoro classici Dickies Original 874, disponibili in vari colori',
      link: 'https://eu.dickies.com/it-it/products/pantaloni-da-lavoro-original-874-unisex-dk0a4xk6whx1-bianco',
      prezzo: 65.00,
      categoria: 'vestiti',
      pubblico: true,
      immagine_url: 'https://eu.dickies.com/dw/image/v2/BDFN_PRD/on/demandware.static/-/Sites-master-catalog-dickies/default/dwc0f5e5e8/images/large/DK0A4XK6WHX1_F1.jpg',
      taglie: {
        pantaloni: 'IT56 (EU 40, US 32, UK 32)',
        note: 'Preferenza colori in ordine: bianco, beige, nero, verde',
        colori_preferiti: ['bianco', 'beige', 'nero', 'verde']
      },
      colori_disponibili: [
        {
          colore: 'Bianco',
          hex: '#FFFFFF',
          immagine_url: 'https://eu.dickies.com/dw/image/v2/BDFN_PRD/on/demandware.static/-/Sites-master-catalog-dickies/default/dwc0f5e5e8/images/large/DK0A4XK6WHX1_F1.jpg'
        },
        {
          colore: 'Beige',
          hex: '#D4C5B9',
          immagine_url: 'https://eu.dickies.com/dw/image/v2/BDFN_PRD/on/demandware.static/-/Sites-master-catalog-dickies/default/dw1a0c5e5e8/images/large/DK0A4XK6KHK1_F1.jpg'
        },
        {
          colore: 'Nero',
          hex: '#000000',
          immagine_url: 'https://eu.dickies.com/dw/image/v2/BDFN_PRD/on/demandware.static/-/Sites-master-catalog-dickies/default/dw5c0f5e5e8/images/large/DK0A4XK6BLK1_F1.jpg'
        },
        {
          colore: 'Verde Oliva',
          hex: '#4A5D3F',
          immagine_url: 'https://eu.dickies.com/dw/image/v2/BDFN_PRD/on/demandware.static/-/Sites-master-catalog-dickies/default/dw2a0c5e5e8/images/large/DK0A4XK6OGR1_F1.jpg'
        }
      ],
      colore_selezionato: 'Bianco'
    },
    {
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
  ]

  for (const item of clothingItems) {
    console.log(`Adding: ${item.nome}...`)

    const { error } = await supabase
      .from('wishlist_items')
      .insert([item])

    if (error) {
      console.error(`Error adding ${item.nome}:`, error)
    } else {
      console.log(`✓ Added ${item.nome}`)
    }
  }

  console.log('Clothing items added successfully!')
}

addClothingItems()
