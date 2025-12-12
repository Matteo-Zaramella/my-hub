# My Hub

Hub personale per la gestione di attività, fitness, alimentazione e giochi.

## 🚀 Stack Tecnologico

- **Framework**: Next.js 16 (App Router)
- **Linguaggio**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase PostgreSQL
- **Autenticazione**: Supabase Auth
- **Hosting**: Vercel (gratuito)

## 📦 Moduli Disponibili

### 🎮 A Tutto Reality: La Rivoluzione (NEW!)
Sistema di gioco con:
- **🎬 Terminal Welcome** - Animazione benvenuto stile command prompt (prima visita)
- **💬 Chat di Gruppo** - Real-time messaging tra partecipanti
- **🔍 Indizi con Immagini** - Card quadrate con lucchetti, rivelazione graduale
- **🔒 Privato** - Sezione esclusiva con countdown
- **Login con codici** - Autenticazione tramite codici partecipante
- **Date activation** - Attivazione automatica 26/01/2026

### 🏆 Game Prize
Sistema di sfide e premi per il compleanno.

### 💪 Fitness
Tracker completo per allenamenti con sessioni ed esercizi.

### 🍽️ Alimentazione
Monitoraggio pasti giornalieri.

### 🎁 Wishlist
Lista desideri condivisibile.

## 🛠️ Installazione

### Setup Automatico per Claude Code
```bash
gh repo clone Matteo-Zaramella/my-hub
cd my-hub
npm install
npm run setup-claude
npm run dev
```

### Setup Manuale
```bash
# Installa dipendenze
npm install

# Crea .env.local (vedi SETUP_RAPIDO.md)

# Avvia in sviluppo
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

---

## 🔧 Sviluppo Locale - Database DEV/PROD

**Configurazione:** Dicembre 2025 - Database separati per sviluppo e produzione

### 🚀 Quick Start

**Per sviluppo normale (database DEV):**
```bash
# Doppio click su:
.admin/dev-server.bat

# Oppure da terminale:
npm run dev  # porta 3000, database DEV
```

**Per test con dati reali (database PROD):**
```bash
# Doppio click su:
.admin/prod-server.bat

# ⚠️ Usa solo quando strettamente necessario!
```

### 📋 Script Amministrativi

Tutti gli script sono in `.admin/`:
- `dev-server.bat` - Avvia server DEV (porta 3000, database DEV)
- `prod-server.bat` - Avvia server PROD (porta 3500, database PROD)
- `stop-servers.bat` - Ferma tutti i server
- `dev-server-background.bat` - Avvia DEV in background (no finestre)
- `prod-server-background.bat` - Avvia PROD in background (no finestre)
- `export-schema.bat` - Esporta schema database

### 📚 Documentazione Completa

Tutta la documentazione è organizzata in `/docs/`:

**[📖 Vai alla Documentazione Completa](./docs/README.md)**

- **[🚀 Getting Started](./docs/01-getting-started/)** - Guide per iniziare
- **[🗄️ Database](./docs/02-database/)** - Setup e gestione database
- **[🎮 Game](./docs/03-game/)** - Documentazione gioco 2026
- **[🔧 Maintenance](./docs/04-maintenance/)** - Manutenzione progetto

### ⚠️ IMPORTANTE

- **Sviluppo:** Usa sempre database DEV (porta 3000)
- **Produzione:** Database PROD (porta 3500) solo per test urgenti
- **Vercel:** Usa automaticamente database PROD (variabili env dashboard)

---

## 📁 Struttura Progetto

```
my-hub/
├── .admin/              # Script amministrativi e sviluppo
│   ├── dev-server.bat   # Avvia server DEV (porta 3000)
│   ├── prod-server.bat  # Avvia server PROD (porta 3500)
│   └── ...
├── docs/                # Documentazione completa
│   ├── 01-getting-started/
│   ├── 02-database/
│   ├── 03-game/
│   └── 04-maintenance/
├── database/            # Script SQL
├── app/                 # Next.js App Router
├── public/              # Asset pubblici
├── scripts/             # Utility scripts
├── _archives/           # Archivi storici
│   ├── 2025-11-november/
│   └── to-verify/
├── README.md            # Questo file
└── package.json
```

**[📖 Vedi Struttura Completa](./docs/README.md)**

---

## 🌍 Variabili d'Ambiente

Il file `.env.local` contiene:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🗄️ Database

Database Supabase con tabelle per:
- Utenti e preferenze
- Wishlist, Pasti, Workout
- Game Prize (10 tabelle)

## 📝 Script

```bash
npm run dev    # Sviluppo (localhost:3000)
npm run build  # Build produzione
npm start      # Avvio produzione
npm run lint   # Lint

# Script utili A Tutto Reality: La Rivoluzione
node scripts/check-chat-table.mjs             # Verifica tabella chat
node scripts/check-challenge-clues.mjs 2      # Verifica immagini sfida 2
node scripts/update-clue-image.mjs 2 1 img.jpg # Aggiorna immagine indizio
```

## 🚀 Deploy su Vercel

1. Push su GitHub
2. Importa progetto su Vercel
3. Aggiungi variabili d'ambiente
4. Deploy automatico!

## 💰 Costi

**TOTALE: €0/mese** (Vercel Hobby + Supabase Free)

---

## 🎮 A Tutto Reality: La Rivoluzione - Quick Start

### Features Recenti (Dicembre 2025)

**🎬 Terminal Welcome Animation**
- Animazione stile command prompt alla prima visita
- Testo verde su nero con typing effect
- 4 messaggi: "Eccoti." → "Sei invitato a una festa." → "Durante la serata, un gioco coinvolgente." → "Dove e quando? Naviga il sito."
- Cursore lampeggiante, skip button, localStorage per mostrare solo una volta

**🖼️ Sistema Indizi con Immagini**
- 3 card quadrate per ogni sfida
- Lucchetto 🔒 su immagini fino al lunedì successivo
- Testo indizio sempre visibile
- Cartella: `public/game-clues/`
- Scripts: `check-challenge-clues.mjs`, `update-clue-image.mjs`

### Setup Chat Database (Obbligatorio)

Per far funzionare la chat:

1. Apri: https://supabase.com/dashboard/project/wuvuapmjclahbmngntku/sql
2. Esegui lo script: `database/chat_messages_v2.sql`
3. Verifica: `node scripts/check-chat-table.mjs`

### Testing

1. Vai su: http://localhost:3000/ (terminal welcome animation)
2. Poi: http://localhost:3000/game?password=EVOLUZIONE
3. Clicca "Accedi all'Area Game"
4. Usa codice: **VHLZX5** (Alberto Faraldi)
5. Testa le 3 sezioni: Chat, Indizi (con immagini), Privato

📚 **Docs:** `ONBOARDING_DOMANI_4_DIC_2025.md` | `GUIDA_COMPLETA_JOURNEY_PARTECIPANTI.md`

---

**Versione**: 2.3.0 | **Data**: 12 Dicembre 2025 | **Update**: Riorganizzazione completa progetto, struttura docs/, script in .admin/
