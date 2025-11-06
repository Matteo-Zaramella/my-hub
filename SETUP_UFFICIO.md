# 🏢 Setup Completo My Hub - Postazione Ufficio

Queste sono le istruzioni complete per configurare l'ambiente di lavoro My Hub in ufficio, sincronizzato con casa.

## 📋 Prerequisiti

Assicurati di avere installato:
- Git
- Node.js (v18 o superiore)
- npm
- Claude Code CLI (opzionale ma consigliato)

---

## 🚀 PARTE 1: Setup Progetto

### 1. Clona il Repository

```bash
git clone https://github.com/Matteo-Zaramella/my-hub.git
cd my-hub
```

### 2. Installa le Dipendenze

```bash
npm install
```

### 3. Configura Environment Variables

```bash
# Copia il template
cp .env.example .env.local
```

Modifica `.env.local` con questi valori:

```env
NEXT_PUBLIC_SUPABASE_URL=https://wuvuapmjclahbmngntku.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dnVhcG1qY2xhaGJtbmdudGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MzAyNDQsImV4cCI6MjA3NjEwNjI0NH0.12asA4yGSUdP_zkfGGZyv7vOX6Ncq9GhkIpBD1tcscc
```

### 4. Configura Git (se necessario)

```bash
git config --global user.email "matteo.zaramella2002@gmail.com"
git config --global user.name "Matteo Zaramella"
```

### 5. Avvia il Server di Sviluppo

```bash
npm run dev
```

Apri il browser su: http://localhost:3000

---

## 🔧 PARTE 2: Setup Claude Code + MCP Servers (Opzionale)

Se vuoi avere gli stessi strumenti MCP disponibili anche in ufficio:

### Prerequisiti Claude Code

```bash
# Verifica che Claude Code sia installato
claude --version
```

### 1. Configura MCP: Supabase

```bash
claude mcp add --transport http supabase "https://mcp.supabase.com/mcp?project_ref=wuvuapmjclahbmngntku"
```

### 2. Configura MCP: GitHub

**Prima crea un GitHub Personal Access Token:**
- Vai su: https://github.com/settings/tokens?type=beta
- Crea token con permessi: Repository (Contents, Issues, Pull Requests, Metadata, Workflows)
- Copia il token

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp -H "Authorization: Bearer TUO_GITHUB_TOKEN"
```

### 3. Configura MCP: Vercel

**Prima crea un Vercel API Token:**
- Vai su: https://vercel.com/account/tokens
- Crea un nuovo token
- Copia il token

```bash
claude mcp add --transport http vercel https://mcp.vercel.com/ -H "Authorization: Bearer TUO_VERCEL_TOKEN"
```

### 4. Configura MCP: Cloudflare (Opzionale)

**Prima crea un Cloudflare API Token:**
- Vai su: https://dash.cloudflare.com/profile/api-tokens
- Crea token con permessi completi
- Copia il token

```bash
# Observability
claude mcp add --transport http cloudflare-observability https://observability.mcp.cloudflare.com/mcp -H "Authorization: Bearer TUO_CLOUDFLARE_TOKEN"

# Workers
claude mcp add --transport http cloudflare-workers https://bindings.mcp.cloudflare.com/mcp -H "Authorization: Bearer TUO_CLOUDFLARE_TOKEN"

# Browser Rendering
claude mcp add --transport http cloudflare-browser https://browser.mcp.cloudflare.com/mcp -H "Authorization: Bearer TUO_CLOUDFLARE_TOKEN"

# Radar
claude mcp add --transport http cloudflare-radar https://radar.mcp.cloudflare.com/mcp -H "Authorization: Bearer TUO_CLOUDFLARE_TOKEN"
```

### 5. Verifica Connessioni MCP

```bash
claude mcp list
```

Dovresti vedere tutti i server con lo stato "✓ Connected".

---

## 🔄 PARTE 3: Workflow Quotidiano Casa ↔ Ufficio

### 📥 All'Inizio della Giornata (in Ufficio)

```bash
cd my-hub
git pull origin main
npm install  # Solo se ci sono nuove dipendenze
npm run dev
```

### 📤 Alla Fine della Giornata (in Ufficio)

```bash
# 1. Salva tutto il lavoro
git add .
git commit -m "Descrizione delle modifiche fatte oggi"

# 2. Pusha su GitHub
git push origin main

# 3. Verifica
git status
```

### 🏠 A Casa

Stesso identico processo:
```bash
cd "Desktop/My Hub"
git pull origin main
npm install
npm run dev
```

---

## 🗄️ Database e Dati

### ✅ Configurazione Attuale

- **Database Condiviso**: Entrambi gli ambienti (casa e ufficio) usano lo stesso database Supabase
- **Sincronizzazione Automatica**: I dati sono aggiornati in tempo reale ovunque
- **Nessuna configurazione extra**: Funziona subito dopo il setup

### ⚠️ Attenzione

- Le modifiche al database sono **immediate** e **visibili ovunque**
- Testa sempre in locale (`npm run dev`) prima di modifiche importanti
- I file `.sql` nella cartella del progetto sono backup/migrations - NON vanno committati su Git

---

## 📝 Comandi Utili

### Git

```bash
# Vedere lo stato corrente
git status

# Vedere la storia dei commit
git log --oneline

# Scaricare modifiche senza merge
git fetch

# Annullare modifiche non committate
git restore <file>

# Vedere differenze
git diff
```

### NPM

```bash
# Avviare sviluppo
npm run dev

# Fare build di produzione
npm run build

# Avviare in produzione
npm start

# Linting
npm run lint
```

### Claude Code

```bash
# Lista server MCP
claude mcp list

# Dettagli di un server
claude mcp get <nome-server>

# Rimuovere un server
claude mcp remove <nome-server>
```

---

## 🆘 Risoluzione Problemi Comuni

### "Your branch is behind"

```bash
git pull origin main
```

### "Merge conflict"

```bash
# 1. Apri i file in conflitto e risolvili manualmente
# 2. Aggiungi i file risolti
git add .
git commit -m "Risolti conflitti"
git push
```

### "npm ERR! missing dependencies"

```bash
rm -rf node_modules package-lock.json
npm install
```

### "Port 3000 is already in use"

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <process_id> /F

# Oppure usa porta diversa
npm run dev -- -p 3001
```

### "Cannot find module" o errori TypeScript

```bash
npm install
# Se persiste:
rm -rf .next
npm run dev
```

---

## 📞 Informazioni di Supporto

### Link Utili

- **Repository GitHub**: https://github.com/Matteo-Zaramella/my-hub
- **Supabase Dashboard**: https://supabase.com/dashboard/project/wuvuapmjclahbmngntku
- **Documentazione Next.js**: https://nextjs.org/docs
- **Documentazione Supabase**: https://supabase.com/docs

### Token e Credenziali

⚠️ **IMPORTANTE**: I token API NON vanno mai committati su Git!

I token che devi rigenerare per l'ufficio:
- GitHub Personal Access Token
- Vercel API Token
- Cloudflare API Token (opzionale)

I token Supabase (in `.env.local`) sono OK da usare perché sono pubblici (anon key).

---

## ✅ Checklist Setup Completo

### Setup Iniziale
- [ ] Repository clonato
- [ ] Dipendenze installate (`npm install`)
- [ ] `.env.local` configurato
- [ ] Git configurato con email/nome
- [ ] Server di sviluppo funzionante (`npm run dev`)

### Setup Claude Code (Opzionale)
- [ ] Claude Code installato
- [ ] MCP Supabase connesso
- [ ] MCP GitHub connesso (con nuovo token)
- [ ] MCP Vercel connesso (con nuovo token)
- [ ] MCP Cloudflare connesso (opzionale)

### Test Finale
- [ ] `npm run dev` funziona
- [ ] Accesso a http://localhost:3000 OK
- [ ] Login funzionante
- [ ] `git pull` e `git push` funzionanti
- [ ] `claude mcp list` mostra server connessi (se configurato)

---

## 🎯 Prossimi Passi

Dopo aver completato il setup:

1. **Testa il workflow**: Fai una piccola modifica, committa e pusha
2. **Familiarizza con i comandi**: Prova i comandi Git e npm
3. **Configura l'editor**: Installa estensioni per TypeScript/React se necessario
4. **Inizia a sviluppare**: Sei pronto per lavorare!

---

**Setup creato il**: 2025-11-06
**Versione**: 1.0
**Ambiente**: Casa ↔ Ufficio

*Per qualsiasi problema, consulta la sezione "Risoluzione Problemi Comuni" o il file WORKFLOW_CASA_UFFICIO.md*
