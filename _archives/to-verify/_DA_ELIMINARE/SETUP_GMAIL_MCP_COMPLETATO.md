# ✅ Setup Gmail MCP - Istruzioni Post-Riavvio

**Data:** 12 Novembre 2025
**Status:** Configurazione completata, in attesa di riavvio Claude Desktop

---

## 🎯 COSA È STATO FATTO

✅ **Configurazione MCP Gmail aggiunta** a `claude_desktop_config.json`
✅ **Backup creato** in `claude_desktop_config.json.backup`
✅ **Server MCP scelto:** `@gongrzhe/server-gmail-autoauth-mcp`
✅ **Capabilities:** Lettura + Scrittura email (send_email, read_email, search_emails, etc.)

---

## 🔄 PROSSIMI PASSI (Dopo Riavvio)

### Step 1: Verifica Tool Gmail Disponibili

Quando riapri Claude Desktop in una nuova chat, chiedi:

```
Mostrami tutti i tool Gmail disponibili (cerca tool che iniziano con "mcp__gmail" o "gmail")
```

**Risposta attesa:**
Dovresti vedere tool come:
- `mcp__gmail__send_email` o `send_email`
- `mcp__gmail__read_email` o `read_email`
- `mcp__gmail__search_emails` o `search_emails`
- `mcp__gmail__draft_email` o `draft_email`
- E altri...

---

### Step 2: Autenticazione Gmail (se richiesta)

Se i tool Gmail NON appaiono o ricevi errori di autenticazione:

**Opzione A - Autenticazione via terminale:**

Apri PowerShell/CMD e esegui:
```bash
npx @gongrzhe/server-gmail-autoauth-mcp auth
```

Questo:
1. Aprirà il browser
2. Ti chiederà di fare login con Google
3. Richiederà permessi per accedere a Gmail
4. Salverà le credenziali in `~/.gmail-mcp/credentials.json`

**Opzione B - Se hai già credenziali Google Cloud:**

Se hai già un progetto Google Cloud con Gmail API abilitata:
1. Scarica il file JSON delle credenziali OAuth
2. Salvalo come `gcp-oauth.keys.json` nella directory home
3. Esegui: `npx @gongrzhe/server-gmail-autoauth-mcp auth`

---

### Step 3: Test Funzionalità Gmail

Una volta autenticato, testa con:

```
Cerca le ultime 5 email nella mia inbox
```

Se funziona, vedrai le tue email! ✅

---

## 📧 TASK PRINCIPALE: Invio Email ai Locali Padova

### Email da Inviare

Il testo dell'email è pronto in: `D:\my-hub\EMAIL_RICHIESTA_LOCALI_PADOVA.md`

### Destinatari (8 locali):

**PRIORITÀ ALTA:**
1. **Conamara Irish Pub** - https://conamara.pub/
2. **Casa Tormene** - https://casatormene.com/
3. **White Pony Pub** - Cerca su Google Maps
4. **La Busa dei Briganti** - Via Vicenza 15, Padova

**PRIORITÀ MEDIA:**
5. **Le Village by CA** - https://www.levillagebycatriveneto.it/
6. **Jolly Roger** - Cerca su Google Maps
7. **Antica Cascina Dal Pozzo** - https://www.cascinadalpozzo.it/
8. **Wimbledon Cocktail** - Cerca su Google Maps

---

## 🤖 COMANDI DA DARE A CLAUDE (Nuova Chat)

### 1. Primo comando - Verifica setup:
```
Ciao! Ho appena riavviato Claude Desktop dopo aver configurato Gmail MCP.
Verifica se hai accesso ai tool Gmail e dimmi quali funzioni sono disponibili.
```

### 2. Secondo comando - Cerca contatti:
```
Cerca online gli indirizzi email/contatti di questi 8 locali a Padova:
1. Conamara Irish Pub
2. Casa Tormene
3. White Pony Pub
4. La Busa dei Briganti
5. Le Village by Crédit Agricole Triveneto
6. Jolly Roger (ex Birreria da Umbe)
7. Antica Cascina Dal Pozzo
8. Wimbledon Cocktail & Bistrot

Per ciascuno trova: email, telefono, form contatto sul sito.
Salva tutto in un file CONTATTI_LOCALI_PADOVA.md
```

### 3. Terzo comando - Invia email:
```
Leggi il testo email da EMAIL_RICHIESTA_LOCALI_PADOVA.md e invialo a tutti gli 8 locali
di cui hai trovato l'email. Usa i tool Gmail MCP.

Parametri email:
- Mittente: [il tuo account Gmail autenticato]
- Oggetto: "Richiesta Disponibilità e Preventivo - Evento Privato 24 Gennaio 2026"
- Corpo: il testo dal file .md (sostituisci [INSERIRE NUMERO] e [INSERIRE EMAIL] con i miei dati)

Dopo ogni invio, segna in un file LOG_INVII_EMAIL.md:
- A chi hai inviato
- Quando (data/ora)
- Status (inviato/errore)
```

---

## 📋 CHECKLIST PRE-INVIO EMAIL

Prima di inviare, assicurati di avere:
- [ ] Tool Gmail MCP funzionanti
- [ ] Autenticazione Gmail completata
- [ ] Contatti email di almeno 5-6 locali trovati
- [ ] Testo email verificato e personalizzato
- [ ] Numero telefono e email inseriti nel testo

---

## 🔧 TROUBLESHOOTING

### Problema: Tool Gmail non appaiono dopo riavvio

**Soluzione:**
1. Verifica che il file config sia corretto:
   ```bash
   cat "C:/Users/offic/AppData/Roaming/Claude/claude_desktop_config.json"
   ```
2. Chiudi COMPLETAMENTE Claude Desktop (anche da system tray)
3. Riapri Claude Desktop
4. Se ancora non funziona, esegui manualmente:
   ```bash
   npx @gongrzhe/server-gmail-autoauth-mcp auth
   ```

### Problema: Errore di autenticazione Gmail

**Soluzione:**
1. Esegui autenticazione manuale:
   ```bash
   npx @gongrzhe/server-gmail-autoauth-mcp auth
   ```
2. Segui il flusso OAuth nel browser
3. Accetta tutti i permessi richiesti
4. Riavvia Claude Desktop

### Problema: npx non trovato

**Soluzione:**
Installa Node.js se non presente:
1. Download da: https://nodejs.org/
2. Versione LTS consigliata
3. Riavvia terminale dopo installazione

### Problema: Email non vengono inviate

**Soluzione:**
1. Verifica autenticazione: cerca una email di test
2. Controlla formato email destinatario
3. Verifica limiti Gmail (max 500 email/giorno)
4. Controlla log errori in Claude Desktop

---

## 📁 FILE DI RIFERIMENTO

Tutti i file sono in `D:\my-hub\`:

1. **LOCATION_PADOVA_OPZIONI.md** - 9 locali trovati con dettagli
2. **EMAIL_RICHIESTA_LOCALI_PADOVA.md** - Testo email + istruzioni
3. **PROMPT_RICERCA_LOCALE_PADOVA.md** - Prompt originale per ricerca
4. **CHECKLIST_UNIFICATA_PRIORITA.md** - Tutte le task del progetto
5. **SETUP_GMAIL_MCP_COMPLETATO.md** - Questo file

---

## 🎯 OBIETTIVO FINALE

**Entro oggi/domani:**
- ✅ Inviare email a tutti gli 8 locali (o almeno ai top 5)
- ✅ Segnare in un log a chi hai scritto
- ✅ Impostare reminder per follow-up dopo 2-3 giorni

**Entro 16/11:**
- Follow-up telefonico ai locali che non rispondono
- Raccogliere preventivi

**Entro 25/11:**
- ✅ Location confermata e contratto firmato

---

## 💡 TIPS PER USARE GMAIL MCP

### Cercare email:
```
Cerca email da "conamara.pub" negli ultimi 7 giorni
```

### Leggere email:
```
Leggi l'email con ID: <message_id>
```

### Inviare email:
```
Invia email a: info@casatormene.com
Oggetto: Test
Corpo: Questa è una email di test
```

### Creare bozza:
```
Crea bozza email per: pub@example.com
Oggetto: Richiesta info
Corpo: [testo]
```

---

## ✅ STATO ATTUALE PROGETTO

### Completato:
- ✅ Fix codici partecipanti (12/11/2025)
- ✅ Aggiornamento 5 codici database
- ✅ Ricerca location Padova (9 opzioni trovate)
- ✅ Setup Gmail MCP configurato

### In Corso:
- 🔄 Invio email ai locali (richiede riavvio Claude)
- 🔄 Checklist webapp aggiornata con nuove task

### Prossime Task Urgenti:
1. 🔴 Confermare location (scadenza: 16/11)
2. 🔴 Creare 9 indizi EVOLUZIONE (scadenza: 20/11)
3. 🔴 Setup email automatiche Resend (scadenza: 20/11)
4. 🔴 Form raccolta dati (scadenza: 22/11)

---

## 🚀 PRONTO PER IL RIAVVIO!

Quando sei pronto:
1. Salva/chiudi questa conversazione
2. Chiudi completamente Claude Desktop
3. Riapri Claude Desktop
4. Apri nuova chat
5. Inizia con il comando di verifica tool Gmail
6. Procedi con invio email ai locali!

---

**Buona fortuna! 🎉**

*File creato: 12 Novembre 2025, ore 21:30*
*Tutto è pronto per la prossima sessione!*
