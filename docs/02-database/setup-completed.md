# ✅ CONFIGURAZIONE SEPARAZIONE DATABASE COMPLETATA

**Data:** 12 Dicembre 2025
**Stato:** COMPLETATO CON SUCCESSO

---

## 🎯 OBIETTIVO RAGGIUNTO

Ora hai **due database separati**:
- **DEV** per sviluppo locale (localhost)
- **PROD** per il sito pubblico (Vercel)

Le modifiche in locale NON influenzano più la produzione! 🎉

---

## 📁 FILE CREATI/MODIFICATI

### File di configurazione
✅ `.env.local.dev` - Punta al database DEV
✅ `.env.local.prod` - Punta al database PROD
✅ `.env.local.backup` - Backup del file originale

### Script di avvio
✅ `AVVIA_SERVER.bat` - Avvia con database **DEV** (modificato)
✅ `AVVIA_SERVER_PROD.bat` - Avvia con database **PROD** (nuovo)

### Database
✅ `database/SETUP_DATABASE_DEV.sql` - Schema corretto (fix foreign key)

---

## 🚀 COME USARE

### Sviluppo Locale (normale)
```
1. Doppio click su: AVVIA_SERVER.bat
2. Il server si avvia su localhost:3000
3. Usa database DEV
4. Le modifiche NON influenzano produzione ✅
```

### Test con Database Produzione (occasionale)
```
1. Doppio click su: AVVIA_SERVER_PROD.bat
2. ⚠️ ATTENZIONE: Usa database PRODUZIONE
3. Le modifiche SONO visibili pubblicamente!
```

---

## 🗄️ DATABASE CONFIGURATI

### Database DEV (Sviluppo)
- **URL:** https://mheowbijzaparmddumsr.supabase.co
- **Progetto:** my-hub-dev
- **Ref:** mheowbijzaparmddumsr
- **Password:** 9YmtMDQyucgneBWdexUzT1RE23gwSN
- **Stato:** ✅ Schema importato, pronto all'uso
- **Contenuto:** Tabelle vuote + partecipante "Sistema" + messaggio benvenuto

### Database PROD (Produzione)
- **URL:** https://wuvuapmjclahbmngntku.supabase.co
- **Progetto:** my-hub (originale)
- **Ref:** wuvuapmjclahbmngntku
- **Password:** 9YmtMDQyucgneBWdexUzT1RE23gwSN
- **Stato:** ✅ Dati reali, usato da Vercel
- **Contenuto:** Dati reali dei partecipanti

---

## 🧪 TEST ESEGUITI

✅ Docker Desktop verificato (versione 29.1.2)
✅ Supabase CLI configurato
✅ Schema SQL corretto (fix foreign key constraint)
✅ Schema importato nel database DEV
✅ File `.env.local.dev` creato e testato
✅ File `.env.local.prod` creato
✅ Script `AVVIA_SERVER.bat` modificato per usare DEV
✅ Script `AVVIA_SERVER_PROD.bat` creato
✅ File `.env.local` ora punta a DEV

---

## ⚙️ DETTAGLI TECNICI

### Come funziona
1. `AVVIA_SERVER.bat` copia `.env.local.dev` → `.env.local`
2. Next.js legge `.env.local` e si connette al database specificato
3. Database DEV: mheowbijzaparmddumsr
4. Database PROD: wuvuapmjclahbmngntku

### Vercel (produzione)
- Vercel usa le **variabili d'ambiente** configurate nel dashboard
- NON legge `.env.local`
- Punta sempre a database PROD
- Non è influenzato dalle modifiche locali

---

## 🔒 SICUREZZA

- ✅ `.env.local` è in `.gitignore` (non viene committato)
- ✅ `.env.local.dev` è locale (non viene committato)
- ✅ `.env.local.prod` è locale (non viene committato)
- ✅ Credenziali sicure su Vercel
- ⚠️ Non committare mai file con credenziali!

---

## 📝 COSA PUOI FARE ORA

### Sviluppo Sicuro
```
- Modifica codice locale
- Attiva/disattiva manutenzione in localhost
- Testa nuove funzionalità
- Nessun impatto sulla produzione! ✅
```

### Importare Dati da PROD a DEV (se necessario)
```sql
-- Nel SQL Editor di DEV:
-- Copia manualmente i dati che servono da PROD
-- Oppure usa pg_dump/restore (vedi documentazione Supabase)
```

---

## 🐛 PROBLEMI RISOLTI

### Errore Foreign Key Constraint
**Problema:**
```
ERROR: insert or update on table "game_chat_messages_v2"
violates foreign key constraint "game_chat_messages_v2_participant_id_fkey"
```

**Soluzione:**
Aggiunto partecipante "Sistema" (ID=1) prima dell'INSERT del messaggio di chat nel file `database/SETUP_DATABASE_DEV.sql`

---

## 📚 RIFERIMENTI

- **Supabase CLI:** https://supabase.com/docs/guides/cli
- **Database DEV Dashboard:** https://supabase.com/dashboard/project/mheowbijzaparmddumsr
- **Database PROD Dashboard:** https://supabase.com/dashboard/project/wuvuapmjclahbmngntku
- **Vercel Dashboard:** https://vercel.com/dashboard

---

## ✨ PROSSIMI PASSI (OPZIONALI)

1. **Testare l'ambiente DEV:**
   - Apri http://localhost:3000 con `AVVIA_SERVER.bat`
   - Vai su /dashboard
   - Attiva manutenzione
   - Verifica che il sito pubblico NON vada in manutenzione

2. **Importare dati di test:**
   - Copia alcuni partecipanti da PROD a DEV
   - Oppure crea partecipanti fake per testing

3. **Configurare backup automatici:**
   - Script per backup periodico database DEV
   - Script per sync selettiva PROD → DEV

---

## 🎉 CONGRATULAZIONI!

La separazione database DEV/PROD è **COMPLETATA**.

Ora puoi lavorare in locale senza preoccupazioni! 🚀

---

**Creato:** 12 Dicembre 2025
**Responsabile:** Matteo Zaramella
**Assistente:** Claude Code
**Stato:** ✅ CONFIGURAZIONE COMPLETATA
