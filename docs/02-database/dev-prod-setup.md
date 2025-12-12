# 📋 ONBOARDING - SEPARAZIONE DATABASE DEV/PROD

**Data creazione:** 12 Dicembre 2025
**Obiettivo:** Separare database di sviluppo (localhost) da produzione per evitare interferenze
**Problema originale:** Attivando manutenzione in localhost si attivava anche in produzione

---

## 🎯 PROBLEMA IDENTIFICATO

Attualmente **localhost e produzione** usano lo **stesso database Supabase**:
- URL Database Produzione: `https://wuvuapmjclahbmngntku.supabase.co`
- File `.env.local` punta allo stesso database
- **Conseguenza:** Ogni modifica in locale (es. modalità manutenzione) si riflette immediatamente sul sito pubblico

---

## ✅ COSA È STATO FATTO

### 1. Creato nuovo progetto Supabase DEV
- **Nome progetto:** my-hub-dev
- **URL:** `https://mheowbijzaparmddumsr.supabase.co`
- **Database Password:** `9YmtMDQyucgneBWdexUzT1RE23gwSN`
- **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oZW93YmlqemFwYXJtZGR1bXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MTI2NzYsImV4cCI6MjA4MTA4ODY3Nn0.7H1Z3ztz4TqZ3QqAV9Prl6_6KvK4XIFL-zSDEubLBsc`
- **Service Role Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oZW93YmlqemFwYXJtZGR1bXNyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTUxMjY3NiwiZXhwIjoyMDgxMDg4Njc2fQ.MWtKOQxwcWKxgih-Xofzt-bJmzWl5YfI8t7m_QvaKns`

### 2. Configurato Supabase CLI (parzialmente)
- **Access Token creato:** `sbp_981d4a77b5ed57a68eca7cf2fd77a6a3a911af0c`
- **Progetto DEV linkato con CLI:** ✅ Completato
- **Comando eseguito:** `npx supabase link --project-ref mheowbijzaparmddumsr`

### 3. File SQL preparati
- ✅ `database/SETUP_DATABASE_DEV.sql` - Schema completo per database DEV (pronto all'uso)
- ✅ `ISTRUZIONI_SUPABASE_CLI.md` - Guida configurazione CLI

### 4. Script batch creati
- ✅ `.admin/dev-server.bat` - Avvia localhost:3000 automaticamente

---

## ❌ COSA MANCA (BLOCCANTI)

### 1. Docker Desktop NON installato
**Problema:** La CLI di Supabase richiede Docker per esportare/importare lo schema
**Errore riscontrato:**
```
failed to inspect docker image: error during connect
Docker Desktop is a prerequisite for local development
```

**Soluzione richiesta:**
1. Scaricare Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Installare Docker Desktop per Windows
3. Riavviare il PC
4. Avviare Docker Desktop (deve rimanere in esecuzione)

### 2. Schema database DEV non ancora importato
**Cosa serve:**
- Eseguire lo script `database/SETUP_DATABASE_DEV.sql` nel SQL Editor del database DEV
- Oppure usare CLI una volta installato Docker

### 3. File `.env.local.dev` non creato
**Cosa serve:**
- Creare file che punta al database DEV invece che PROD
- Configurare script di avvio per usarlo

---

## 📝 PASSI DA COMPLETARE AL RITORNO

### STEP 1: Installare Docker Desktop ⚠️ PRIORITÀ MASSIMA

1. Vai su: https://www.docker.com/products/docker-desktop/
2. Scarica Docker Desktop per Windows
3. Installa con le opzioni di default
4. Riavvia il computer
5. Avvia Docker Desktop
6. Verifica installazione: apri PowerShell e digita:
   ```powershell
   docker --version
   ```
   Dovresti vedere: `Docker version XX.XX.XX, build XXXXX`

---

### STEP 2: Esportare schema da database PRODUZIONE

Una volta Docker installato, esegui:

```bash
cd D:\Claude\my-hub

# Imposta access token
set SUPABASE_ACCESS_TOKEN=sbp_981d4a77b5ed57a68eca7cf2fd77a6a3a911af0c

# Esporta schema da produzione
npx supabase db dump --db-url "postgresql://postgres.wuvuapmjclahbmngntku:9YmtMDQyucgneBWdexUzT1RE23gwSN@aws-0-eu-central-1.pooler.supabase.com:6543/postgres" --schema public -f schema_prod.sql
```

**Output atteso:** File `schema_prod.sql` creato in `D:\Claude\my-hub`

---

### STEP 3: Importare schema nel database DEV

**Opzione A - Via CLI (se Docker installato):**
```bash
cd D:\Claude\my-hub

# Link al progetto DEV
set SUPABASE_ACCESS_TOKEN=sbp_981d4a77b5ed57a68eca7cf2fd77a6a3a911af0c
npx supabase link --project-ref mheowbijzaparmddumsr

# Importa schema
npx supabase db push --db-url "postgresql://postgres.mheowbijzaparmddumsr:9YmtMDQyucgneBWdexUzT1RE23gwSN@aws-0-eu-central-1.pooler.supabase.com:6543/postgres" --file schema_prod.sql
```

**Opzione B - Manuale (funziona sempre):**
1. Apri SQL Editor database DEV: https://supabase.com/dashboard/project/mheowbijzaparmddumsr/sql
2. Copia TUTTO il contenuto di `database/SETUP_DATABASE_DEV.sql`
3. Incolla nell'editor
4. Clicca **"RUN"**
5. Verifica che non ci siano errori

---

### STEP 4: Creare file `.env.local.dev`

Crea il file `D:\Claude\my-hub\.env.local.dev` con:

```env
# Supabase DEV Configuration (localhost only)
NEXT_PUBLIC_SUPABASE_URL=https://mheowbijzaparmddumsr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oZW93YmlqemFwYXJtZGR1bXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MTI2NzYsImV4cCI6MjA4MTA4ODY3Nn0.7H1Z3ztz4TqZ3QqAV9Prl6_6KvK4XIFL-zSDEubLBsc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oZW93YmlqemFwYXJtZGR1bXNyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTUxMjY3NiwiZXhwIjoyMDgxMDg4Njc2fQ.MWtKOQxwcWKxgih-Xofzt-bJmzWl5YfI8t7m_QvaKns
```

---

### STEP 5: Modificare script .admin/dev-server.bat

Sostituisci il contenuto di `.admin/dev-server.bat` con:

```batch
@echo off
echo ========================================
echo   AVVIO SERVER MY-HUB (AMBIENTE DEV)
echo ========================================
echo.
echo Configurazione database DEV...
echo.

cd /d D:\Claude\my-hub

REM Copia env dev su env local
copy /Y .env.local.dev .env.local

echo Database: https://mheowbijzaparmddumsr.supabase.co
echo Ambiente: SVILUPPO (separato da produzione)
echo.
echo Avvio server Next.js su localhost:3000...
echo.

REM Avvia il server in background
start "My-Hub Server DEV" cmd /c "npm run dev"

REM Attendi 5 secondi
echo Attendo 5 secondi per l'avvio del server...
timeout /t 5 /nobreak >nul

REM Apri il browser
echo Apertura browser...
start http://localhost:3000

echo.
echo ========================================
echo Server DEV avviato!
echo Database: DEV (separato da produzione)
echo Browser aperto su http://localhost:3000
echo.
echo Per fermare il server, chiudi la finestra
echo "My-Hub Server DEV" oppure premi CTRL+C
echo ========================================
echo.
pause
```

---

### STEP 6: Creare script per ripristinare PROD (opzionale ma utile)

Crea `.admin/prod-server.bat`:

```batch
@echo off
echo ========================================
echo   AVVIO SERVER MY-HUB (AMBIENTE PROD)
echo ========================================
echo.
echo ⚠️  ATTENZIONE: STAI USANDO IL DATABASE DI PRODUZIONE!
echo.

cd /d D:\Claude\my-hub

REM Backup env attuale
if exist .env.local.dev (
    copy /Y .env.local.prod .env.local
) else (
    echo Errore: .env.local.prod non trovato!
    pause
    exit
)

echo Database: https://wuvuapmjclahbmngntku.supabase.co
echo Ambiente: PRODUZIONE
echo.

start "My-Hub Server PROD" cmd /c "npm run dev"
timeout /t 5 /nobreak >nul
start http://localhost:3000

echo.
echo ========================================
echo Server PROD avviato!
echo ⚠️  ATTENZIONE: Modifiche visibili in produzione!
echo ========================================
echo.
pause
```

E crea anche `.env.local.prod` (backup del file originale):

```env
# Supabase PRODUCTION Configuration
NEXT_PUBLIC_SUPABASE_URL=https://wuvuapmjclahbmngntku.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dnVhcG1qY2xhaGJtbmdudGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MzAyNDQsImV4cCI6MjA3NjEwNjI0NH0.12asA4yGSUdP_zkfGGZyv7vOX6Ncq9GhkIpBD1tcscc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dnVhcG1qY2xhaGJtbmdudGt1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDUzMDI0NCwiZXhwIjoyMDc2MTA2MjQ0fQ.c1eqO_Y2NH_bgV-VC6KJyk3H8LZEYza6Z0bBrKI1Zac
```

---

### STEP 7: Testare tutto

1. **Test ambiente DEV:**
   ```
   - Doppio click su .admin/dev-server.bat
   - Vai su http://localhost:3000
   - Vai su /dashboard
   - Attiva modalità manutenzione
   - Verifica che il sito pubblico NON vada in manutenzione
   ```

2. **Test ambiente PROD (se necessario):**
   ```
   - Doppio click su .admin/prod-server.bat
   - Vai su http://localhost:3000
   - Verifica che usi database produzione
   - ATTENZIONE: Modifiche visibili pubblicamente!
   ```

3. **Verifica separazione:**
   ```
   - Inserisci dati di test in DEV
   - Controlla che NON appaiano in produzione
   - Se tutto ok, separazione completata ✅
   ```

---

## 📊 STATO ATTUALE PROGETTO

### Database PRODUZIONE
- ✅ URL: `https://wuvuapmjclahbmngntku.supabase.co`
- ✅ Password: `9YmtMDQyucgneBWdexUzT1RE23gwSN`
- ✅ Contiene dati reali
- ✅ Usato dal sito pubblico su Vercel

### Database DEV
- ✅ URL: `https://mheowbijzaparmddumsr.supabase.co`
- ✅ Password: `9YmtMDQyucgneBWdexUzT1RE23gwSN`
- ❌ Schema NON ancora importato (vuoto)
- ❌ NON ancora configurato in `.env.local.dev`

### Supabase CLI
- ✅ Access Token: `sbp_981d4a77b5ed57a68eca7cf2fd77a6a3a911af0c`
- ✅ Progetto DEV linkato
- ❌ Docker NON installato (richiesto per dump/push)

---

## 🎯 OBIETTIVO FINALE

Al termine della configurazione:

```
LOCALHOST (npm run dev)
    ↓
.env.local → Database DEV
    ↓
https://mheowbijzaparmddumsr.supabase.co
    ↓
Modifiche NON visibili in produzione ✅


VERCEL (sito pubblico)
    ↓
Variabili env Vercel → Database PROD
    ↓
https://wuvuapmjclahbmngntku.supabase.co
    ↓
Dati reali, accessibili pubblicamente ✅
```

---

## 🔐 CREDENZIALI DA SALVARE

### Supabase Access Token (CLI)
```
sbp_981d4a77b5ed57a68eca7cf2fd77a6a3a911af0c
```

### Database PRODUZIONE
```
URL: https://wuvuapmjclahbmngntku.supabase.co
Password: 9YmtMDQyucgneBWdexUzT1RE23gwSN
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dnVhcG1qY2xhaGJtbmdudGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MzAyNDQsImV4cCI6MjA3NjEwNjI0NH0.12asA4yGSUdP_zkfGGZyv7vOX6Ncq9GhkIpBD1tcscc
Service Role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dnVhcG1qY2xhaGJtbmdudGt1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDUzMDI0NCwiZXhwIjoyMDc2MTA2MjQ0fQ.c1eqO_Y2NH_bgV-VC6KJyk3H8LZEYza6Z0bBrKI1Zac
```

### Database DEV
```
URL: https://mheowbijzaparmddumsr.supabase.co
Password: 9YmtMDQyucgneBWdexUzT1RE23gwSN
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oZW93YmlqemFwYXJtZGR1bXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MTI2NzYsImV4cCI6MjA4MTA4ODY3Nn0.7H1Z3ztz4TqZ3QqAV9Prl6_6KvK4XIFL-zSDEubLBsc
Service Role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oZW93YmlqemFwYXJtZGR1bXNyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTUxMjY3NiwiZXhwIjoyMDgxMDg4Njc2fQ.MWtKOQxwcWKxgih-Xofzt-bJmzWl5YfI8t7m_QvaKns
```

---

## 📂 FILE CREATI/MODIFICATI

### Nuovi file creati
- ✅ `.admin/dev-server.bat` - Script avvio server
- ✅ `database/SETUP_DATABASE_DEV.sql` - Schema completo database DEV
- ✅ `ISTRUZIONI_SUPABASE_CLI.md` - Guida CLI Supabase
- ✅ `ONBOARDING_SEPARAZIONE_DATABASE_DEV_PROD.md` - Questo documento

### File da creare al ritorno
- ❌ `.env.local.dev` - Configurazione database DEV
- ❌ `.env.local.prod` - Backup configurazione database PROD
- ❌ `.admin/prod-server.bat` - Script avvio con database PROD

### File esistenti da NON modificare
- `.env.local` - Verrà sovrascritto dagli script batch (backup consigliato)
- `supabase/config.toml` - Configurazione Supabase CLI (già linkato a DEV)

---

## ⚡ QUICK START AL RITORNO

```bash
# 1. Installa Docker Desktop
https://www.docker.com/products/docker-desktop/

# 2. Riavvia PC

# 3. Apri PowerShell in D:\Claude\my-hub

# 4. Esporta schema PROD
set SUPABASE_ACCESS_TOKEN=sbp_981d4a77b5ed57a68eca7cf2fd77a6a3a911af0c
npx supabase db dump --db-url "postgresql://postgres.wuvuapmjclahbmngntku:9YmtMDQyucgneBWdexUzT1RE23gwSN@aws-0-eu-central-1.pooler.supabase.com:6543/postgres" -f schema_prod.sql

# 5. Vai su SQL Editor DEV e esegui database/SETUP_DATABASE_DEV.sql
# https://supabase.com/dashboard/project/mheowbijzaparmddumsr/sql

# 6. Crea .env.local.dev (vedi STEP 4)

# 7. Modifica .admin/dev-server.bat (vedi STEP 5)

# 8. Test: doppio click su .admin/dev-server.bat
```

---

## 💡 NOTE FINALI

- ✅ La separazione è ESSENZIALE per evitare disastri in produzione
- ✅ Una volta completato, potrai lavorare offline senza paura
- ✅ Il sito pubblico rimarrà sempre isolato dalle tue modifiche locali
- ⚠️ Docker è OBBLIGATORIO per CLI Supabase - senza non funziona
- 💾 Fai sempre backup prima di modifiche importanti

---

**Prossima sessione:** Installare Docker e completare STEP 1-7

**Tempo stimato:** 30-45 minuti (inclusa installazione Docker)

**Priorità:** 🔴 ALTA - Fondamentale per sviluppo sicuro

---

**Creato:** 12 Dicembre 2025
**Responsabile:** Matteo Zaramella
**Assistente:** Claude Code
