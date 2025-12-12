# 🧭 Navigazione Rapida - My Hub

Guida rapida per trovare tutto nel progetto.

---

## 🚀 VOGLIO...

### ...Avviare il Server di Sviluppo
```bash
.admin/dev-server.bat
```
→ Porta 3000, database DEV

### ...Avviare il Server di Produzione
```bash
.admin/prod-server.bat
```
→ Porta 3500, database PROD ⚠️

### ...Fermare Tutti i Server
```bash
.admin/stop-servers.bat
```

### ...Vedere Tutti gli Script Disponibili
```bash
📁 .admin/README.md
```

---

## 📚 VOGLIO LEGGERE...

### ...Come Iniziare
```bash
📁 docs/01-getting-started/
   └── quick-start.md
```

### ...Configurazione Database
```bash
📁 docs/02-database/
   ├── dev-prod-setup.md      # Setup DEV/PROD
   ├── setup-completed.md      # Cosa è stato fatto
   ├── supabase-cli.md         # Come usare CLI
   └── sql-quick-guide.md      # Comandi SQL
```

### ...Documentazione Gioco 2026
```bash
📁 docs/03-game/
   ├── flowchart-2026.md       # Diagramma flusso
   ├── calendario-2026.md      # Date eventi
   ├── cerimonia-apertura.md   # Serata apertura
   └── ai-entities.md          # Entità AI
```

### ...Guide Manutenzione
```bash
📁 docs/04-maintenance/
   ├── ports-guide.md                # Porte DEV/PROD
   ├── cleanup-2025-12-12.md         # Pulizia progetto
   └── reorganization-2025-12-12.md  # Riorganizzazione
```

---

## 🗄️ VOGLIO GESTIRE...

### ...Il Database
```bash
📁 database/
   ├── SETUP_DATABASE_DEV.sql        # Setup database DEV
   ├── FIX_GAME_SETTINGS_DEV.sql     # Fix settings
   ├── FIX_MISSING_TABLES_DEV.sql    # Fix tabelle
   └── ... (altri script SQL)
```

### ...Script Utility
```bash
📁 scripts/
   ├── check-chat-table.mjs          # Verifica chat
   ├── add-clothing-items.mjs        # Aggiungi abbigliamento
   └── ... (altri script)
```

---

## 📦 VOGLIO CERCARE...

### ...File Vecchi/Storici
```bash
📁 _archives/
   ├── 2025-11-november/             # Docs novembre 2025
   │   └── README_ARCHIVIO.md        # Indice archivio
   └── to-verify/                     # Da verificare
```

### ...Credenziali e Configurazioni
```bash
📄 PASSWORD_MAPPING_CONFIDENTIAL.md  # Password partecipanti
📁 docs/02-database/
   └── setup-completed.md             # Credenziali database
```

---

## 🗺️ MAPPA COMPLETA

```
my-hub/
│
├── 📁 .admin/              → Script amministrativi
│   ├── dev-server.bat
│   ├── prod-server.bat
│   ├── stop-servers.bat
│   └── README.md           → GUIDA SCRIPT
│
├── 📁 docs/                → Documentazione
│   ├── README.md           → INDICE PRINCIPALE
│   ├── 01-getting-started/
│   ├── 02-database/
│   ├── 03-game/
│   └── 04-maintenance/
│
├── 📁 database/            → SQL scripts
├── 📁 scripts/             → Utility scripts
├── 📁 _archives/           → File storici
│
├── 📁 app/                 → Next.js App
├── 📁 public/              → Asset pubblici
├── 📁 lib/                 → Librerie
│
├── 📄 README.md            → DOCUMENTO PRINCIPALE
├── 📄 NAVIGATION.md        → Questo file
└── 📄 package.json         → Configurazione npm
```

---

## 🎯 PUNTI DI PARTENZA

### Primo Accesso
1. Leggi `/README.md`
2. Vai a `/docs/01-getting-started/quick-start.md`
3. Avvia server con `.admin/dev-server.bat`

### Sviluppo
1. Avvia `.admin/dev-server.bat`
2. Apri http://localhost:3000
3. Modifica codice in `/app/`
4. Leggi docs in `/docs/` se necessario

### Manutenzione
1. Leggi `/docs/04-maintenance/`
2. Usa script in `.admin/`
3. Consulta `/docs/02-database/` per database

---

## 🔗 Link Rapidi

| Cosa | Dove |
|------|------|
| **Avvia DEV** | `.admin/dev-server.bat` |
| **Avvia PROD** | `.admin/prod-server.bat` |
| **Ferma Server** | `.admin/stop-servers.bat` |
| **Docs Database** | `docs/02-database/` |
| **Docs Gioco** | `docs/03-game/` |
| **Script SQL** | `database/` |
| **Archivi** | `_archives/` |
| **Guida Script** | `.admin/README.md` |
| **Indice Docs** | `docs/README.md` |

---

## 💡 Tips

- **Usa i README**: Ogni cartella importante ha un README.md
- **Segui i link**: In fondo ad ogni documento ci sono link di navigazione
- **Naming consistente**: Tutto in kebab-case, tutto minuscolo
- **Cerca per data**: File di manutenzione hanno date nel nome

---

**Ultima revisione:** 12 Dicembre 2025
**Versione:** 2.3.0
