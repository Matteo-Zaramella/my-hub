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
npm run dev    # Sviluppo
npm run build  # Build produzione
npm start      # Avvio produzione
npm run lint   # Lint
```

## 🚀 Deploy su Vercel

1. Push su GitHub
2. Importa progetto su Vercel
3. Aggiungi variabili d'ambiente
4. Deploy automatico!

## 💰 Costi

**TOTALE: €0/mese** (Vercel Hobby + Supabase Free)

---

**Versione**: 1.0.0 | **Data**: Novembre 2025
