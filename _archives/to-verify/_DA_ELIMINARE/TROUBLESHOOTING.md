# 🔧 Troubleshooting - My Hub

Guida alla risoluzione dei problemi comuni del progetto.

---

## 🚨 Problema: Errore SSL/Certificati su Windows

### Sintomi
- Errore `CRYPT_E_NO_REVOCATION_CHECK (0x80092012)`
- Impossibile accedere a siti HTTPS (Cloudflare, Resend, ecc.)
- Curl fallisce con errori di certificato
- Browser mostrano errori SSL

### Causa
Windows non riesce a verificare i certificati SSL perché:
- Orologio di sistema non sincronizzato
- Cache dei certificati corrotta
- Servizi Windows di certificazione non funzionanti

### ✅ Soluzione (Richiede Privilegi Amministratore)

**1. Apri PowerShell come Amministratore:**
- Premi `Win + X`
- Clicca su **"Windows PowerShell (amministratore)"** o **"Terminale (amministratore)"**

**2. Esegui questi comandi in ordine:**

```powershell
# 1. Sincronizza l'orologio di sistema
w32tm /resync

# 2. Pulisci cache DNS
ipconfig /flushdns

# 3. Reimposta Winsock (connessioni di rete)
netsh winsock reset

# 4. Reimposta TCP/IP
netsh int ip reset

# 5. Riavvia il servizio di certificati
net stop cryptsvc
net start cryptsvc
```

**3. Riavvia il PC**

Dopo il riavvio, il problema dovrebbe essere completamente risolto.

**4. Verifica che funzioni:**
```bash
curl -I https://www.google.com
curl -I https://resend.com
```

Dovresti ricevere risposte HTTP 200/301 senza errori.

---

## 📧 Problema: Email di Conferma Non Inviate

### Sintomi
- Registrazione completata ma nessuna email ricevuta
- Errore 500 da Resend
- Console mostra errori nell'invio email

### Possibili Cause

**A. Resend non configurato**
1. Verifica che esista la variabile `RESEND_API_KEY` in `.env.local`
2. Controlla che la chiave API sia valida (non scaduta)

**B. Server Resend offline**
- Verifica su https://resend.com/status
- Attendi che il servizio torni online

**C. Email in spam**
- Controlla la cartella spam/junk
- Aggiungi `onboarding@resend.dev` ai contatti fidati

### Soluzione

**1. Ottieni API Key da Resend:**
```
1. Vai su https://resend.com/signup
2. Crea account gratuito
3. Vai su "API Keys"
4. Crea nuova chiave
5. Copia la chiave
```

**2. Configura `.env.local`:**
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
```

**3. Riavvia il server:**
```bash
# CTRL+C per fermare
npm run dev
```

---

## 🗄️ Problema: Database Supabase Non Connesso

### Sintomi
- Errore "Failed to fetch" nelle query
- Console mostra errori Supabase
- Dati non vengono caricati

### Verifica Connessione

**1. Controlla credenziali in `.env.local`:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://wuvuapmjclahbmngntku.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**2. Verifica che Supabase sia online:**
- Vai su https://supabase.com/dashboard
- Controlla lo stato del progetto `wuvuapmjclahbmngntku`

**3. Testa connessione con MCP:**
```bash
# In Claude Code
mcp__supabase__list_tables
```

---

## 🖼️ Problema: Immagini Non Visualizzate (Wishlist Pubblica)

### Sintomi
- Card prodotti mostrano sfondo nero
- Immagini non si caricano
- Console mostra errori CORS

### Causa
Problemi CORS con domini esterni o configurazione Next.js Image

### Soluzione

**1. Verifica configurazione in `next.config.ts`:**
```typescript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'm.media-amazon.com' },
    { protocol: 'https', hostname: 'contents.mediadecathlon.com' },
    { protocol: 'https', hostname: 'cdn.shopify.com' },
    { protocol: 'https', hostname: 'www.fitmarket.it' },
  ],
}
```

**2. Riavvia il server dopo modifiche a next.config.ts:**
```bash
# CTRL+C per fermare
npm run dev
```

**3. Verifica URL immagini nel database:**
```sql
SELECT id, nome, immagine_url
FROM wishlist_items
WHERE pubblico = true;
```

---

## 🔄 Problema: Server Next.js Non Si Avvia

### Sintomi
- `npm run dev` fallisce
- Porta 3000 già in uso
- Errori di compilazione TypeScript

### Soluzioni

**A. Porta 3000 già occupata:**
```bash
# Windows - Trova processo sulla porta 3000
netstat -ano | findstr :3000

# Termina processo (sostituisci PID)
taskkill /PID <PID> /F
```

**B. Dipendenze corrotte:**
```bash
# Reinstalla dipendenze
rm -rf node_modules package-lock.json
npm install
```

**C. Cache Next.js corrotta:**
```bash
# Pulisci cache
rm -rf .next
npm run dev
```

---

## 🐛 Problema: Errori TypeScript

### Sintomi
- Errori di tipo in fase di compilazione
- "Cannot find module" errors
- Props mancanti nei componenti

### Soluzioni

**1. Riavvia TypeScript server (in VS Code):**
- `CTRL+SHIFT+P`
- Cerca "TypeScript: Restart TS Server"

**2. Verifica imports:**
```typescript
// Corretto
import { createClient } from '@/lib/supabase/client'

// Errato
import { createClient } from '../lib/supabase/client'
```

**3. Rigenera types Supabase:**
```bash
# In Claude Code
mcp__supabase__generate_typescript_types
```

---

## 📝 Log Utili per Debug

### Console Browser (F12)
```javascript
// Vedi errori JavaScript
console.error()

// Vedi network requests
Network tab → Filter: XHR/Fetch
```

### Server Next.js Terminal
```bash
# Vedi richieste API
GET /api/send-confirmation 200 in 123ms

# Vedi errori server
Error in API route: ...
```

### Database Supabase
```sql
-- Vedi ultimi 10 errori
SELECT * FROM logs
ORDER BY created_at DESC
LIMIT 10;
```

---

## 🆘 Quando Chiedere Aiuto

Se dopo aver provato queste soluzioni il problema persiste:

1. **Raccogli informazioni:**
   - Messaggio di errore completo
   - Stack trace (se disponibile)
   - Passi per riprodurre il problema
   - Screenshot (se rilevante)

2. **Verifica versioni:**
   ```bash
   node --version    # >= 18
   npm --version     # >= 9
   git --version     # >= 2.30
   ```

3. **Controlla stato servizi:**
   - https://status.supabase.com
   - https://resend.com/status
   - https://www.cloudflarestatus.com

4. **Consulta documentazione:**
   - `README.md` - Setup iniziale
   - `WORKFLOW.md` - Workflow git multi-dispositivo
   - `PROJECT_STATUS.md` - Stato features implementate
   - `QUICK_START.md` - Comandi rapidi

---

**Ultimo aggiornamento:** 18 Novembre 2025
**Versione:** 1.0.0
