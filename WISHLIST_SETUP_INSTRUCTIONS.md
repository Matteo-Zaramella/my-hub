# Istruzioni Setup Wishlist con Categorie

## Modifiche Implementate

### 1. Database
- Aggiunti campi alla tabella `wishlist_items`:
  - `categoria` (VARCHAR): elettrodomestici, bici, integratori, vestiti, altro
  - `taglie` (JSONB): informazioni taglie per vestiti
  - `colori_disponibili` (JSONB): array di varianti colore con immagini
  - `colore_selezionato` (VARCHAR): colore preferito

### 2. Frontend
- **Wishlist Pubblica** (`/wishlist-public`):
  - Raggruppamento per categorie
  - Selettore colori interattivo per articoli con varianti
  - Visualizzazione taglie per vestiti
  - Layout responsive

- **Dashboard Admin** (`/dashboard/wishlist`):
  - Selector categoria nel form di aggiunta
  - Supporto per nuovi campi

### 3. Articoli Vestiti Preparati
- **Dickies Original 874** (Pantaloni):
  - Colori: Bianco, Beige, Nero, Verde Oliva
  - Taglia: IT56
  - Link e immagini per ogni colore

- **Uniqlo Cashmere** (Maglione):
  - Colori: Nero, Grigio, Beige
  - Taglia: 3XL
  - Link e immagini

## Passi da Completare

### Step 1: Applicare Migration SQL al Database

1. Vai su **Supabase Dashboard** → **SQL Editor**
2. Copia e incolla il seguente SQL:

\`\`\`sql
-- Add category and clothing-specific fields to wishlist_items table

ALTER TABLE wishlist_items
ADD COLUMN IF NOT EXISTS categoria VARCHAR(50) DEFAULT 'altro',
ADD COLUMN IF NOT EXISTS taglie JSONB,
ADD COLUMN IF NOT EXISTS colori_disponibili JSONB,
ADD COLUMN IF NOT EXISTS colore_selezionato VARCHAR(50);

CREATE INDEX IF NOT EXISTS idx_wishlist_categoria ON wishlist_items(categoria);
\`\`\`

3. Clicca su **Run**

### Step 2: Popolare Articoli Vestiti

Esegui lo script Node.js per aggiungere gli articoli:

\`\`\`bash
cd D:\\Claude\\my-hub
node scripts/add-clothing-items.mjs
\`\`\`

Questo aggiungerà:
- Pantaloni Dickies con 4 varianti colore
- Maglione Uniqlo con 3 varianti colore

### Step 3: Categorizzare Articoli Esistenti

Vai su **Supabase Dashboard** → **Table Editor** → `wishlist_items`

Aggiorna la colonna `categoria` per gli articoli esistenti:
- Borsa da manubrio → `bici`
- Elettrodomestici → `elettrodomestici`
- Integratori → `integratori`
- Altro → `altro`

### Step 4: Testare

1. Vai su `http://localhost:3000/wishlist-public`
2. Verifica:
   - Articoli raggruppati per categoria
   - Selettore colori funzionante per vestiti
   - Taglie visualizzate correttamente

## Prossimi Passi (Opzionali)

### Aggiungere Immagini agli Articoli Senza Foto

Per articoli senza immagine, puoi:
1. Cercare l'immagine del prodotto online
2. Copiaril URL dell'immagine
3. Aggiornare il campo `immagine_url` nel database

### Aggiungere Altri Vestiti

Usa lo stesso formato JSON per `colori_disponibili`:

\`\`\`json
[
  {
    "colore": "Bianco",
    "hex": "#FFFFFF",
    "immagine_url": "https://..."
  },
  {
    "colore": "Nero",
    "hex": "#000000",
    "immagine_url": "https://..."
  }
]
\`\`\`

E per `taglie`:

\`\`\`json
{
  "pantaloni": "IT56 (EU 40, US 32, UK 32)",
  "maglie": "3XL (XXXL)",
  "tshirt": "2XL (XXL)",
  "note": "Preferenza colori: bianco, beige, nero, verde",
  "colori_preferiti": ["bianco", "beige", "nero", "verde"]
}
\`\`\`

## Troubleshooting

### Errore: colonna non esiste
→ Assicurati di aver eseguito la migration SQL (Step 1)

### Articoli non categorizzati
→ Imposta manualmente la categoria nel database o via form admin

### Colori non visibili
→ Verifica che `colori_disponibili` sia un array JSON valido con almeno 2 elementi

## File Modificati

- `app/wishlist-public/page.tsx` - Nuova visualizzazione categorie
- `app/dashboard/wishlist/WishlistForm.tsx` - Aggiunto selector categoria
- `supabase/migrations/20251127_add_wishlist_categories.sql` - Migration
- `scripts/add-clothing-items.mjs` - Script popolazione vestiti
