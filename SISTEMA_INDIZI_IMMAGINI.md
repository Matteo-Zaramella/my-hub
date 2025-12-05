# 🖼️ Sistema Indizi con Immagini

**Data implementazione:** 5 Dicembre 2025
**Versione:** 1.0

---

## 📋 Panoramica

Sistema di visualizzazione indizi completamente ridisegnato con:
- **3 card quadrate** affiancate (responsive: 1 colonna su mobile, 3 su desktop)
- **Lucchetto** fino al lunedì successivo alla data di rivelazione
- **Immagini** che si rivelano automaticamente il lunedì
- **Upload semplice** tramite script command-line

---

## 🎯 Logica di Rivelazione

### Date Indizi
Gli indizi hanno una `revealed_date` nel database (es. Sabato 01/02/2026 00:00)

### Visualizzazione Immagini
Le immagini si rivelano il **primo lunedì successivo** alla `revealed_date`:

| revealed_date (Sabato) | Immagine visibile da (Lunedì) |
|------------------------|-------------------------------|
| 01/02/2026             | 03/02/2026                    |
| 08/02/2026             | 10/02/2026                    |
| 15/02/2026             | 17/02/2026                    |

### Motivazione
Dare tempo a tutti i partecipanti di vedere l'indizio e tentare la soluzione **prima** che l'immagine venga rivelata. Questo mantiene il gioco competitivo ed equilibrato.

---

## 🎨 Stati Visualizzazione

### 1. **Lucchettato** 🔒
Prima del lunedì successivo:
- Sfondo grigio scuro
- Icona lucchetto grande
- Testo: "Disponibile dal XX/XX"
- Non mostra l'immagine

### 2. **Rivelato con Immagine** ✅
Dopo il lunedì:
- Mostra l'immagine caricata
- Overlay con numero indizio e data
- Border verde al hover

### 3. **Rivelato senza Immagine** 📷
Se `image_url` è NULL:
- Placeholder viola/rosa
- Icona fotocamera
- Testo: "Immagine non ancora caricata"
- Permette di procedere senza bloccare il gioco

---

## 📁 Struttura File

```
public/
└── indizi/
    ├── README.txt
    ├── sfida-2-indizio-1.jpg
    ├── sfida-2-indizio-2.jpg
    ├── sfida-2-indizio-3.jpg
    ├── sfida-3-indizio-1.png
    └── ... (altre immagini)
```

**Convenzione nomi:**
- `sfida-{N}-indizio-{M}.{ext}`
- Esempio: `sfida-2-indizio-1.jpg`, `sfida-3-indizio-2.png`

---

## 🔧 Database

### Migrazione SQL

```sql
ALTER TABLE game_clues
ADD COLUMN IF NOT EXISTS image_url TEXT;

COMMENT ON COLUMN game_clues.image_url IS
  'URL o path dell''immagine dell''indizio.
   L''immagine viene rivelata solo il lunedì successivo alla revealed_date';
```

**File:** `database/add_image_url_to_clues.sql`

### Schema Colonna

| Colonna    | Tipo | Nullable | Default | Descrizione                           |
|------------|------|----------|---------|---------------------------------------|
| image_url  | TEXT | YES      | NULL    | Path relativo es. `/indizi/img.jpg`   |

---

## 📝 Come Caricare Immagini

### 1. Aggiungi l'Immagine

Posiziona il file in `public/indizi/`:

```bash
# Copia l'immagine nella cartella corretta
cp /percorso/mia-immagine.jpg D:\Claude\my-hub\public\indizi\sfida-2-indizio-1.jpg
```

### 2. Aggiorna il Database

Usa lo script helper:

```bash
node scripts/update-clue-image.mjs <sfida> <indizio> <filename>
```

**Esempi:**

```bash
# Indizio 1 della Sfida 2
node scripts/update-clue-image.mjs 2 1 sfida-2-indizio-1.jpg

# Indizio 3 della Sfida 5
node scripts/update-clue-image.mjs 5 3 sfida-5-indizio-3.png

# Indizio 4 della Sfida 11
node scripts/update-clue-image.mjs 11 4 natale-speciale.jpg
```

### 3. Verifica

Apri `/game/area` e controlla che:
- Prima del lunedì: card lucchettata 🔒
- Dopo il lunedì: immagine visibile ✅

---

## 🛠️ Script Disponibili

### `update-clue-image.mjs`

**Sintassi:**
```bash
node scripts/update-clue-image.mjs <challenge_number> <clue_number> <image_filename>
```

**Funzionalità:**
- Trova la sfida tramite `challenge_number`
- Trova l'indizio tramite `clue_number`
- Aggiorna `image_url` con il path `/indizi/{filename}`
- Mostra conferma con dettagli

**Output:**
```
🔍 Ricerca indizio...

✅ Sfida trovata: #2 (22/02/2026)
✅ Indizio trovato: #1 (01/02/2026)

🎉 SUCCESSO!
   Sfida: 2
   Indizio: 1
   Immagine: /indizi/sfida-2-indizio-1.jpg

💡 Assicurati che il file esista in: public/indizi/sfida-2-indizio-1.jpg
```

---

## 🧪 Testing

### Test Logica Lunedì

```javascript
// Test 1: Sabato 01/02 → Lunedì 03/02
const reveal1 = new Date('2026-02-01T00:00:00Z')
const monday1 = getNextMonday(reveal1)
console.log(monday1) // 2026-02-03

// Test 2: Domenica 02/02 → Lunedì 03/02
const reveal2 = new Date('2026-02-02T00:00:00Z')
const monday2 = getNextMonday(reveal2)
console.log(monday2) // 2026-02-03

// Test 3: Lunedì 03/02 → Lunedì 10/02
const reveal3 = new Date('2026-02-03T00:00:00Z')
const monday3 = getNextMonday(reveal3)
console.log(monday3) // 2026-02-10
```

### Test Visuale

1. Apri `http://localhost:3000/game/area`
2. Login con codice test (es. `VHLZX5`)
3. Vai al tab "🔍 Indizi"
4. Espandi "Sfida 22/02/2026"
5. Verifica:
   - 3 card affiancate (desktop)
   - Card lucchettate se prima del lunedì
   - Placeholder se immagine mancante
   - Immagine corretta se caricata e lunedì passato

---

## 📊 Statistiche Indizi

| Sfida | Data Sfida | Indizi | Stato Immagini        |
|-------|------------|--------|------------------------|
| 1     | 25/01/2026 | 0      | N/A                    |
| 2     | 22/02/2026 | 3      | ❌ Da caricare         |
| 3     | 29/03/2026 | 4      | ❌ Da caricare         |
| 4     | 26/04/2026 | 3      | ❌ Da caricare         |
| 5     | 31/05/2026 | 4      | ❌ Da caricare         |
| 6     | 28/06/2026 | 3      | ❌ Da caricare         |
| 7     | 26/07/2026 | 3      | ❌ Da caricare         |
| 8     | 30/08/2026 | 4      | ❌ Da caricare         |
| 9     | 27/09/2026 | 3      | ❌ Da caricare         |
| 10    | 25/10/2026 | 3      | ❌ Da caricare         |
| 11    | 29/11/2026 | 4      | ❌ Da caricare         |
| 12    | 27/12/2026 | 3      | ❌ Da caricare         |

**Totale:** 37 immagini da creare/caricare

---

## 🎯 Prossimi Step

### Immediate (Prossimi 7 giorni)
- [ ] Eseguire migrazione SQL: `add_image_url_to_clues.sql`
- [ ] Creare prime 3 immagini per Sfida 2 (Febbraio)
- [ ] Testare caricamento con script
- [ ] Verificare visualizzazione su mobile/desktop

### Breve Termine (Entro Gennaio 2026)
- [ ] Creare tutte le 37 immagini indizi
- [ ] Caricare batch prima della cerimonia
- [ ] Test completo sistema rivelazione
- [ ] Backup immagini su cloud storage

### Miglioramenti Futuri (Opzionali)
- [ ] Upload immagini da dashboard admin (drag & drop)
- [ ] Resize automatico immagini (ottimizzazione)
- [ ] Watermark automatico con logo
- [ ] Anteprima prima del caricamento
- [ ] Gallery view di tutte le immagini

---

## 🔒 Sicurezza & Performance

### Validazione File
- Accettare solo: `.jpg`, `.jpeg`, `.png`, `.webp`
- Max size: 5 MB per immagine
- Dimensioni consigliate: 1080x1080px (quadrato)

### Ottimizzazione
- Compressione immagini con TinyPNG o similar
- Formato WebP per browser moderni
- Lazy loading automatico (Next.js)

### Backup
- Commit immagini su GitHub (se < 100 MB totali)
- Oppure: Cloudinary/ImgIx/Supabase Storage per hosting esterno

---

## 📝 Fix Implementati

### Fix Hydration Error
**Problema:** Attributo `data-np-intersection-state` da estensione browser causava mismatch

**Soluzione:**
```tsx
<input
  ...
  autoComplete="off"
  suppressHydrationWarning
/>
```

**File:** `app/game/ParticipantLogin.tsx:89-90`

---

## 📚 Documentazione Correlata

- `DATE_SFIDE_UFFICIALI.txt` - Date ufficiali tutte le sfide
- `SESSIONE_CORREZIONE_DATE_04DIC2025.md` - Correzione date database
- `database/add_image_url_to_clues.sql` - Migrazione SQL
- `scripts/update-clue-image.mjs` - Script upload immagini

---

**Responsabile:** Matteo Zaramella
**Ultima modifica:** 5 Dicembre 2025
