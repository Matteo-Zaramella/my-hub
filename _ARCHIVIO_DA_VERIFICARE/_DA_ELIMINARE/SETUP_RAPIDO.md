# 🚀 Setup Rapido My Hub

## Da Qualsiasi Terminale

### 1. Clona il Repository
```bash
gh auth login  # Inserisci credenziali GitHub
gh repo clone Matteo-Zaramella/my-hub
cd my-hub
```

### 2. Installa Dipendenze
```bash
npm install
```

### 3. Configura Environment Variables
Crea file `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://wuvuapmjclahbmngntku.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dnVhcG1qY2xhaGJtbmdudGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MzAyNDQsImV4cCI6MjA3NjEwNjI0NH0.12asA4yGSUdP_zkfGGZyv7vOX6Ncq9GhkIpBD1tcscc
```

### 4. Avvia Server
```bash
npm run dev
```

Server attivo su: **http://localhost:3000**

---

## ✅ Accesso per Claude Code

### Credenziali MCP Supabase
Claude Code ha accesso al database tramite MCP Supabase già configurato:
- **Project Ref**: `wuvuapmjclahbmngntku`
- **URL**: https://wuvuapmjclahbmngntku.supabase.co

### Comandi Utili per Claude
```bash
# Stato progetto
git status
git log --oneline -10

# Database
# Claude può usare MCP tools direttamente:
# - mcp__supabase__list_tables
# - mcp__supabase__execute_sql
# - mcp__supabase__apply_migration

# Build e deploy
npm run build
```

---

## 📦 Stack Tecnologico
- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth
- **Styling**: Tailwind CSS
- **Hosting**: GitHub + pronto per Vercel

## 📝 Moduli Attivi
1. ✅ Wishlist
2. ✅ Alimentazione/Pasti
3. ✅ Fitness/Workout
4. 🚧 Game Prize (da implementare)

---

**Ultimo aggiornamento**: 2025-11-09
