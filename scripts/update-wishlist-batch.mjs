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

async function updateAll() {
  console.log('🔄 Aggiornamento wishlist...\n')

  // 1. Aggiorna Soprapantaloni (era Coprigambe)
  const { data: sopra, error: err1 } = await supabase
    .from('wishlist_items')
    .update({
      nome: 'Soprapantaloni Impermeabili Ciclismo',
      descrizione: 'Soprapantaloni impermeabili con copriscarpe per ciclismo adulto 100 - Decathlon',
      link: 'https://www.decathlon.it/p/soprapantaloni-impermeabili-con-copriscarpe-ciclismo-adulto-100-neri/_/R-p-169380',
      prezzo: 25.00,
      immagine_url: '/wishlist-products/soprapantaloni.jpg'
    })
    .eq('nome', 'Coprigambe Impermeabile Bici')
    .select()

  if (err1) {
    console.error('❌ Errore soprapantaloni:', err1.message)
  } else if (sopra?.length) {
    console.log('✅ Soprapantaloni aggiornato: €25')
  } else {
    console.log('⚠️  Coprigambe non trovato')
  }

  // 2. Elimina Gigaset
  const { error: err2 } = await supabase
    .from('wishlist_items')
    .delete()
    .eq('nome', 'Gigaset PURE 120A Duo')

  if (err2) {
    console.error('❌ Errore eliminazione Gigaset:', err2.message)
  } else {
    console.log('🗑️  Gigaset eliminato')
  }

  // 3. Aggiorna immagini
  const imageUpdates = [
    { nome: 'Scaldacollo Sci FIRSTHEAT Nero', immagine: '/wishlist-products/scaldacollo.jpg' },
    { nome: 'Calze Lunghe RS 160 x3', immagine: '/wishlist-products/calzini.jpg' },
    { nome: 'Nothing Phone 3', immagine: '/wishlist-products/nothing phone 3.png' }
  ]

  for (const item of imageUpdates) {
    const { data, error } = await supabase
      .from('wishlist_items')
      .update({ immagine_url: item.immagine })
      .eq('nome', item.nome)
      .select()

    if (error) {
      console.error(`❌ Errore immagine ${item.nome}:`, error.message)
    } else if (data?.length) {
      console.log(`🖼️  Immagine aggiunta: ${item.nome}`)
    } else {
      console.log(`⚠️  Non trovato: ${item.nome}`)
    }
  }

  console.log('\n✨ Fatto!')
}

updateAll()
