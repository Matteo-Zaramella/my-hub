# ⚙️ Admin Scripts

Script amministrativi per la gestione e sviluppo del progetto My Hub.

---

## 🚀 Server Development

### `dev-server.bat`
Avvia il server di sviluppo con database DEV.

**Usa quando:**
- Sviluppo quotidiano
- Test nuove funzionalità
- Modifiche al codice

**Configurazione:**
- Porta: `3000`
- Database: DEV (mheowbijzaparmddumsr)
- File env: `.env.local.dev` → `.env.local`

**Esecuzione:**
```bash
# Doppio click sul file
# Oppure:
.admin/dev-server.bat
```

**Output:**
- Apre automaticamente http://localhost:3000
- Mostra finestra CMD con log del server
- Modifiche al codice ricaricano automaticamente

---

### `prod-server.bat`
Avvia il server con database di PRODUZIONE.

**⚠️ ATTENZIONE: Usa solo quando strettamente necessario!**

**Usa quando:**
- Test con dati reali necessari
- Debug problemi specifici di produzione
- Verifica funzionalità con dati completi

**Configurazione:**
- Porta: `3500`
- Database: PROD (wuvuapmjclahbmngntku)
- File env: `.env.local.prod` → `.env.local`

**Esecuzione:**
```bash
.admin/prod-server.bat
```

**⚠️ IMPORTANTE:**
- Le modifiche ai dati sono REALI e VISIBILI pubblicamente
- Fare sempre backup prima di modifiche importanti
- Usare solo per test urgenti

---

### `stop-servers.bat`
Ferma tutti i server Node.js in esecuzione.

**Usa quando:**
- Vuoi switchare tra DEV e PROD
- Devi liberare le porte
- Server bloccato o non risponde

**Esecuzione:**
```bash
.admin/stop-servers.bat
```

**Cosa fa:**
- Ferma tutti i processi Node.js
- Libera le porte 3000 e 3500
- Mostra conferma operazione

---

## 🔧 Background Mode

### `dev-server-background.bat`
Avvia il server DEV in background (no finestre visibili).

**Usa quando:**
- Vuoi tenere il server attivo senza finestre aperte
- Lavori con Claude Code che gestisce i processi

**Nota:** Per monitorare l'output usa Claude Code o controlla i log.

---

### `prod-server-background.bat`
Avvia il server PROD in background (no finestre visibili).

**⚠️ Stesse avvertenze di `prod-server.bat`**

---

## 🗄️ Database

### `export-schema.bat`
Esporta lo schema del database.

**Usa quando:**
- Vuoi fare backup dello schema
- Devi documentare la struttura database
- Prima di modifiche importanti

**Output:**
- File SQL nella cartella `database/`
- Contiene struttura completa delle tabelle

---

### `prod-server.ps1`
Script PowerShell per avvio server PROD con variabili d'ambiente.

**Uso:** Chiamato automaticamente da `prod-server.bat`
**Non eseguire direttamente** - usa `prod-server.bat` invece

---

## 📋 Workflow Consigliato

### Sviluppo Normale
```bash
1. .admin/dev-server.bat
2. Apri http://localhost:3000
3. Lavora sul codice
4. .admin/stop-servers.bat quando finisci
```

### Test con Dati Reali
```bash
1. .admin/stop-servers.bat (se server attivo)
2. .admin/prod-server.bat
3. Apri http://localhost:3500
4. ⚠️ Fai attenzione alle modifiche!
5. .admin/stop-servers.bat quando finisci
```

### Confronto DEV vs PROD
```bash
1. .admin/dev-server.bat (porta 3000)
2. .admin/prod-server.bat (porta 3500)  # NOTA: Non funziona per limitazione Next.js
3. Apri entrambi i browser
```

**Nota:** Next.js non supporta due istanze dev dalla stessa cartella. Usa un server alla volta.

---

## 🐛 Troubleshooting

### "Porta già in uso"
```bash
Soluzione:
.admin/stop-servers.bat
# Poi riavvia il server desiderato
```

### "Server non si avvia"
```bash
Verifica:
1. Node.js installato? (node --version)
2. Dipendenze installate? (npm install)
3. File .env.local esiste?
4. Docker Desktop attivo? (per alcune operazioni)
```

### "Non so quale server è attivo"
```bash
Controlla:
1. Titolo finestra CMD: "My-Hub Server DEV" o "My-Hub Server PROD"
2. URL browser: localhost:3000 (DEV) o localhost:3500 (PROD)
3. Chiudi tutto e riavvia quello che ti serve
```

---

## ⬆️ Torna a

- [🏠 Root del Progetto](../README.md)
- [📚 Documentazione](../docs/README.md)

---

**Ultima revisione:** 12 Dicembre 2025
