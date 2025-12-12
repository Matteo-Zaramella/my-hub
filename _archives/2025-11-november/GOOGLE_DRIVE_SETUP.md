# Google Drive Setup - A Tutto Reality: La Rivoluzione

## Cartella Principale
**Link:** https://drive.google.com/drive/folders/1MvL5PGHxjR66SqkPqIalhlfM-YkidU69

## Struttura Consigliata

### 📁 /Assets
Cartella per tutte le risorse multimediali del gioco

#### /Assets/Immagini
- `/Cerimonia_Apertura` - Foto della festa di lancio, foto degli indizi fisici
- `/Sfide_Mensili` - Immagini per ogni sfida (Feb, Mar, Apr, ecc.)
- `/Sfida_Finale` - Foto della festa finale
- `/Partecipanti` - Foto dei partecipanti (opzionale)

#### /Assets/Video
- Video promozionali
- Video delle sfide completate
- Recap mensili

#### /Assets/Audio
- Tracce audio per indizi
- Musica di sottofondo per eventi

### 📁 /Backup
Backup automatici del database

#### /Backup/Database_Exports
Usa lo script: `node scripts/backup_game_data.js`

File generati:
- `game_config.json` - Configurazione generale
- `challenges.json` - Tutte le 13 sfide
- `clues.json` - Tutti i 40 indizi
- `participants.json` - Tutti i 52 partecipanti
- `scores.json` - Classifica e punteggi
- `backup_summary.json` - Riepilogo del backup

**Frequenza consigliata:** Backup settimanale o dopo ogni modifica importante

#### /Backup/Configurazioni
- Copie di sicurezza dei file .env
- Esportazioni della configurazione Vercel
- Snapshot del codice sorgente

### 📁 /Documentazione

#### File consigliati:
1. **Regolamento_Completo.pdf**
   - Regole dettagliate del gioco
   - Sistema di punteggio
   - Modalità di partecipazione alla sfida finale

2. **Lista_Partecipanti.xlsx**
   - Nome, telefono, categoria
   - Codici partecipante
   - Partner (se in coppia)

3. **Calendario_Eventi.pdf**
   - Date di tutte le sfide
   - Date di rivelazione indizi
   - Eventi speciali

4. **Istruzioni_Admin.pdf**
   - Come usare la dashboard
   - Come aggiungere/modificare sfide
   - Come gestire i partecipanti

### 📁 /Materiali_Sfide
Una sottocartella per ogni mese

```
/Febbraio_2026
  - Descrizione_Sfida.pdf
  - Location.pdf (con mappa/indirizzo)
  - Foto_Location.jpg
  - Indizi.txt (testo dei 3 indizi)

/Marzo_2026
  - ...

/Aprile_2026
  - ...
```

### 📁 /Galleria_Partecipanti (Opzionale)
Foto dei partecipanti durante le sfide, organizzate per mese

## Come Usare il Drive

### 1. Backup Automatico del Database
```bash
# Esegui lo script di backup
cd D:\my-hub
node scripts/backup_game_data.js

# I file verranno salvati in: D:\my-hub\backups\[timestamp]
# Carica manualmente su Drive > /Backup/Database_Exports
```

### 2. Caricare Risorse per le Sfide

**Prima di ogni sfida mensile:**
1. Crea una cartella con il mese (es. `/Materiali_Sfide/Febbraio_2026`)
2. Carica:
   - Descrizione della sfida
   - Foto della location
   - Testo degli indizi
   - Eventuali video o audio

3. Aggiorna la dashboard con i testi degli indizi
4. Verifica le date di rivelazione (ogni sabato)

### 3. Gestione Asset Multimediali

**Per immagini:**
- Dimensioni consigliate: 1920x1080px
- Formato: JPG o PNG
- Compressione: Media qualità per ridurre dimensioni

**Per video:**
- Risoluzione: 1080p massimo
- Formato: MP4 (H.264)
- Durata: Max 2-3 minuti per clip

**Per audio:**
- Formato: MP3
- Bitrate: 192kbps
- Durata: Max 1-2 minuti

### 4. Condivisione con Team

Se lavori con altre persone:
1. Condividi la cartella principale con permessi appropriati
2. Crea cartelle separate per ogni ruolo (Admin, Moderatori, ecc.)
3. Usa Google Docs per documenti collaborativi

### 5. Organizzazione File

**Naming convention:**
```
AAAA-MM-DD_tipo_descrizione.ext

Esempi:
2026-02-21_sfida_febbraio_location.jpg
2026-02-14_indizio_3_testo.txt
2026-01-24_cerimonia_gruppo_partecipanti.jpg
```

## Script Utili

### Backup Completo
```bash
node scripts/backup_game_data.js
```

### Export Partecipanti (da creare)
```bash
node scripts/export_participants.js
```

## Sicurezza

⚠️ **IMPORTANTE:**
- NON caricare file con password o chiavi API
- NON condividere il link pubblicamente
- Mantieni i backup criptati se contengono dati sensibili
- Fai backup regolari in più location

## Manutenzione

### Backup Consigliati
- ✅ **Settimanale:** Durante lo sviluppo
- ✅ **Prima di ogni sfida:** Backup completo
- ✅ **Dopo ogni sfida:** Backup con risultati
- ✅ **Mensile:** Backup completo + asset

### Pulizia
- Elimina backup vecchi dopo 3 mesi
- Comprimi file non utilizzati
- Archivia materiali delle sfide completate

## Accesso Rapido

### Link Diretti (da configurare nel Drive)
- 📋 [Regolamento Completo](#)
- 👥 [Lista Partecipanti](#)
- 📅 [Calendario](#)
- 💾 [Ultimo Backup](#)

---

**Ultimo aggiornamento:** 10 Novembre 2025
**Gestito da:** Matteo Zaramella
**Supporto tecnico:** Claude Code
