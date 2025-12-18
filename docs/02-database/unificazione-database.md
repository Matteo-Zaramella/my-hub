# ✅ UNIFICAZIONE DATABASE COMPLETATA

**Data:** 18 Dicembre 2025
**Stato:** COMPLETATO

---

## 🎯 OBIETTIVO RAGGIUNTO

Ora c'è **un solo database** per tutto:
- **Sviluppo locale** (localhost) → usa database PROD
- **Produzione Vercel** → usa database PROD

**Niente più confusione tra DEV e PROD!** ✅

---

## 📁 COSA È STATO FATTO

### 1. Aggiornato `.env.local`
✅ Modificato per puntare al database PROD (`wuvuapmjclahbmngntku`)
✅ Stesso database usato da Vercel in produzione

### 2. File obsoleti (da ignorare)
- `.env.local.dev` - Non più utilizzato
- `.env.local.prod` - Non più necessario
- Script `dev-server.bat` e `prod-server.bat` - Non più necessari

### 3. Nuovo workflow semplificato
```bash
npm run dev
```
Avvia il server su `localhost:3000` connesso a database PROD

---

## 🗄️ DATABASE UNIFICATO

### Database PROD (unico database ora)
- **URL:** https://wuvuapmjclahbmngntku.supabase.co
- **Progetto:** my-hub
- **Ref:** wuvuapmjclahbmngntku
- **Dashboard:** https://supabase.com/dashboard/project/wuvuapmjclahbmngntku
- **Contenuto:** Dati reali dei partecipanti + tutte le tabelle del gioco

---

## ⚠️ IMPORTANTE

### Le modifiche in locale si riflettono in produzione
- Quando modifichi dati in localhost, **cambiano anche su Vercel**
- Fai attenzione quando inserisci/modifichi/cancelli dati
- Usa sempre dati di test quando necessario

### Vantaggi dell'unificazione
✅ Nessuna confusione tra database
✅ Stesso ambiente ovunque
✅ Non serve più sincronizzare dati
✅ Workflow semplificato

### Svantaggi (da tenere a mente)
⚠️ Non c'è più un ambiente "sicuro" per test distruttivi
⚠️ Gli errori in locale possono influenzare la produzione

---

## 📋 CHECKLIST POST-UNIFICAZIONE

### Da fare manualmente su Supabase
Esegui questo SQL su: https://supabase.com/dashboard/project/wuvuapmjclahbmngntku/sql/new

```sql
INSERT INTO game_settings (setting_key, setting_value, description)
VALUES ('participant_auth_enabled', true, 'Controls if participant authentication screen is shown on landing page')
ON CONFLICT (setting_key)
DO UPDATE SET description = EXCLUDED.description;
```

Questo aggiunge il setting per il bypass dell'autenticazione partecipanti.

---

## 🚀 COME USARE ORA

### Sviluppo Locale
```bash
npm run dev
```
- Server su `localhost:3000`
- Database PROD
- Le modifiche sono visibili anche su Vercel

### Produzione Vercel
- Deploy automatico da GitHub
- Usa stesso database (PROD)
- Sincronizzato con localhost

---

## 🔧 CONFIGURAZIONE TECNICA

### `.env.local` (localhost)
```env
NEXT_PUBLIC_SUPABASE_URL=https://wuvuapmjclahbmngntku.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Vercel Environment Variables
Le variabili in Vercel puntano allo stesso database:
- `NEXT_PUBLIC_SUPABASE_URL`: https://wuvuapmjclahbmngntku.supabase.co
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (stessa chiave)

---

## 📚 FILE DI RIFERIMENTO

- Script SQL: `/database/ADD_PARTICIPANT_AUTH_SETTING.sql`
- Configurazione: `/.env.local`
- Questa guida: `/docs/02-database/unificazione-database.md`

---

**Versione:** 1.0
**Ultimo aggiornamento:** 18 Dicembre 2025
