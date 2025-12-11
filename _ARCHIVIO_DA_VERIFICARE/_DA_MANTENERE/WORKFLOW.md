# 🔄 Workflow Multi-Dispositivo - My Hub

Guida completa per lavorare su questo progetto da **qualsiasi postazione** (casa, ufficio, laptop) mantenendo tutto sincronizzato tramite Git/GitHub.

---

## 📋 Setup Iniziale (Da Fare Una Sola Volta Per Ogni Macchina)

### 1️⃣ Verifica Requisiti

```cmd
node --version    # Deve essere >= 18
npm --version     # Deve essere >= 9
git --version     # Deve essere >= 2.30
```

### 2️⃣ Clona il Repository

**Prima volta su una nuova macchina:**

```cmd
cd D:\
git clone https://github.com/Matteo-Zaramella/my-hub.git
cd my-hub
```

### 3️⃣ Configura Git (Se Non Già Fatto)

```cmd
git config --global user.name "Matteo Zaramella"
git config --global user.email "matteo.zaramella2002@gmail.com"
```

### 4️⃣ Installa Dipendenze

```cmd
npm install
```

### 5️⃣ Configura Variabili d'Ambiente

Crea il file `.env.local` con:

```env
NEXT_PUBLIC_SUPABASE_URL=https://wuvuapmjclahbmngntku.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dnVhcG1qY2xhaGJtbmdudGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3MTMzODIsImV4cCI6MjA0NjI4OTM4Mn0.U0lq7ztQZXXYUATUx6LDNkrDxq5sMfLkZ8yIV8pSjMk
```

*(Queste credenziali sono già salvate in `CREDENTIALS.md`)*

---

## 🚀 Workflow Quotidiano

### 🏠 Inizio Sessione (Da Qualsiasi Postazione)

**Ogni volta che inizi a lavorare:**

```cmd
cd D:\my-hub

REM 1. Scarica le ultime modifiche da GitHub
git pull origin main

REM 2. Controlla se ci sono conflitti
git status

REM 3. Se tutto ok, avvia il server
npm run dev
```

**Server attivo su:** http://localhost:3000

---

### 💻 Durante lo Sviluppo

**Salva spesso il tuo lavoro:**

```cmd
REM Verifica cosa hai modificato
git status

REM Vedi le differenze nel codice
git diff

REM Aggiungi file specifici
git add app/dashboard/nuova-feature.tsx

REM Oppure aggiungi tutto
git add .

REM Fai commit con messaggio descrittivo
git commit -m "Aggiungi funzionalità X al dashboard"

REM Invia su GitHub
git push origin main
```

---

### 🔚 Fine Sessione

**Prima di chiudere o cambiare postazione:**

```cmd
REM 1. Salva tutto
git add .
git commit -m "Work in progress: descrizione modifiche"

REM 2. Invia su GitHub
git push origin main

REM 3. Chiudi il server (CTRL+C nel terminale)
```

---

## 🔄 Sincronizzazione Tra Dispositivi

### Scenario: Lavori da Casa, poi Vai in Ufficio

**A Casa (Fine Sessione):**
```cmd
cd D:\my-hub
git add .
git commit -m "Implementato modulo game landing page"
git push origin main
```

**In Ufficio (Inizio Sessione):**
```cmd
cd D:\my-hub
git pull origin main
npm run dev
```

✅ **Tutto sincronizzato automaticamente!**

---

## 🆘 Gestione Conflitti

### Caso 1: Modifiche Locali Non Committate

```cmd
REM Se git pull fallisce perché hai modifiche non salvate:

REM Opzione A - Salva le modifiche
git add .
git commit -m "WIP: modifiche locali"
git pull origin main

REM Opzione B - Scarta le modifiche locali (ATTENZIONE!)
git reset --hard HEAD
git pull origin main
```

### Caso 2: Conflitti di Merge

```cmd
REM Se dopo git pull hai conflitti:

REM 1. Git ti mostrerà i file in conflitto
git status

REM 2. Apri i file e risolvi i conflitti (cerca <<<<<<, ======, >>>>>>)
REM 3. Dopo aver risolto:
git add .
git commit -m "Risolti conflitti merge"
git push origin main
```

---

## 📊 Comandi Utili

### Visualizza Stato

```cmd
git status                    # Vedi modifiche correnti
git log --oneline -10         # Ultimi 10 commit
git diff                      # Vedi differenze non salvate
git diff HEAD~1               # Confronta con commit precedente
```

### Branch e Storia

```cmd
git branch                    # Vedi branch corrente
git log --graph --oneline     # Storia visuale
git show HEAD                 # Dettagli ultimo commit
```

### Annulla Modifiche

```cmd
git checkout -- file.tsx      # Annulla modifiche a un file
git reset HEAD file.tsx       # Rimuovi file dallo stage
git reset --soft HEAD~1       # Annulla ultimo commit (mantieni modifiche)
git reset --hard HEAD~1       # Annulla ultimo commit (ELIMINA modifiche!)
```

---

## 🎯 Best Practices

### ✅ Da Fare

- **Commit frequenti** con messaggi chiari
- **Pull prima di iniziare** ogni sessione
- **Push alla fine** di ogni sessione
- **Testare localmente** prima di ogni push
- **Usare messaggi descrittivi** nei commit

### ❌ Da Evitare

- Non fare `git push --force` (distrugge storia)
- Non committare file sensibili (`.env.local` è già nel `.gitignore`)
- Non lasciare modifiche non salvate quando cambi postazione
- Non modificare lo stesso file da due postazioni contemporaneamente

---

## 📝 Template Messaggi Commit

**Feature:**
```
Aggiungi [nome feature] al [modulo]

- Dettaglio 1
- Dettaglio 2
```

**Bug Fix:**
```
Fix: risolto problema [descrizione]

Causa: [spiegazione]
Soluzione: [cosa hai fatto]
```

**Refactoring:**
```
Refactor: ottimizzato [componente/modulo]

- Miglioramento 1
- Miglioramento 2
```

**Work in Progress:**
```
WIP: lavoro su [feature] in corso

Prossimi step:
- [ ] Task 1
- [ ] Task 2
```

---

## 🔗 Collegamenti Utili

- **Repository GitHub:** https://github.com/Matteo-Zaramella/my-hub
- **Deploy Vercel:** https://matteozaramella.com
- **Supabase Dashboard:** https://supabase.com/dashboard/project/wuvuapmjclahbmngntku

---

## 🤖 Workflow con Claude Code

Claude Code vede automaticamente tutti i commit su GitHub, quindi può:

- ✅ Capire cosa hai fatto dall'ultima sessione
- ✅ Continuare da dove hai lasciato
- ✅ Vedere modifiche fatte da qualsiasi postazione
- ✅ Aiutarti a risolvere conflitti

**Quando chiedi aiuto a Claude Code, basta dire:**
> "Proseguiamo il progetto my-hub in D:"

E Claude Code:
1. Controlla lo stato Git
2. Vede tutti i commit recenti
3. Capisce su cosa stai lavorando
4. Continua da dove hai lasciato

---

## 🎓 Quick Reference

```cmd
# INIZIO SESSIONE
cd D:\my-hub
git pull origin main
npm run dev

# DURANTE LAVORO (ripeti spesso)
git add .
git commit -m "Descrizione modifiche"
git push origin main

# FINE SESSIONE
git add .
git commit -m "WIP: stato attuale"
git push origin main
# CTRL+C per fermare server
```

---

**Ultimo aggiornamento:** 2025-11-10
**Versione Progetto:** 1.0.0
