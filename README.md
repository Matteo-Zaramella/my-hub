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

### 🎮 Il Castello di Zara (NEW!)
Sistema di gioco con:
- **💬 Chat di Gruppo** - Real-time messaging tra partecipanti
- **🔍 Indizi** - Sistema indizi con rivelazione programmata
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

# Script utili Il Castello di Zara
node scripts/check-chat-table.mjs  # Verifica tabella chat
```

## 🚀 Deploy su Vercel

1. Push su GitHub
2. Importa progetto su Vercel
3. Aggiungi variabili d'ambiente
4. Deploy automatico!

## 💰 Costi

**TOTALE: €0/mese** (Vercel Hobby + Supabase Free)

---

## 🎮 Il Castello di Zara - Quick Start

### Setup Chat Database (Obbligatorio)

Per far funzionare la chat:

1. Apri: https://supabase.com/dashboard/project/wuvuapmjclahbmngntku/sql
2. Esegui lo script: `database/chat_messages_v2.sql`
3. Verifica: `node scripts/check-chat-table.mjs`

### Testing

1. Vai su: http://localhost:3000/game?password=EVOLUZIONE
2. Clicca "Accedi all'Area Game"
3. Usa codice: **VHLZX5** (Alberto Faraldi)
4. Testa le 3 sezioni: Chat, Indizi, Privato

📚 **Docs:** `README_QUICK_START.md` | `MODIFICHE_COMPLETATE.md`

---

**Versione**: 2.0.0 | **Data**: 11 Novembre 2025
