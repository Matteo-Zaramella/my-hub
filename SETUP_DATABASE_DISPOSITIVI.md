# Setup Database Dispositivi

## 📋 Passo 1: Creare la tabella `devices`

1. Apri il **SQL Editor** di Supabase:
   👉 https://supabase.com/dashboard/project/wuvuapmjclahbmngntku/sql/new

2. Copia e incolla il contenuto del file `database/devices.sql`

3. Clicca su **RUN** per eseguire lo script

4. Verifica che la tabella sia stata creata correttamente nella sezione **Table Editor**

---

## 🎯 Passo 2: Accedere all'interfaccia

1. Vai su: http://localhost:3000/dashboard

2. Clicca sulla card **"Database Dispositivi"** 🗄️

3. Inizia ad aggiungere i tuoi dispositivi!

---

## 📝 Esempi di dispositivi da inserire

### PC Components
- **Nome**: Scheda Madre | **Brand**: ASUS | **Model**: ROG STRIX B550-F
  - **Specs**: Socket: AM4, Chipset: B550, RAM: DDR4

- **Nome**: Processore | **Brand**: AMD | **Model**: Ryzen 7 5800X
  - **Specs**: Core: 8, Thread: 16, Frequenza: 3.8 GHz

- **Nome**: RAM | **Brand**: Corsair | **Model**: Vengeance RGB Pro
  - **Specs**: Capacità: 32GB, Tipo: DDR4, Frequenza: 3200MHz

- **Nome**: GPU | **Brand**: NVIDIA | **Model**: RTX 3070
  - **Specs**: VRAM: 8GB, CUDA Cores: 5888

### Periferiche
- **Nome**: Tastiera | **Brand**: Logitech | **Model**: MX Keys
  - **Specs**: Retroilluminazione: Sì, Connessione: Bluetooth/USB-C

- **Nome**: Mouse | **Brand**: Logitech | **Model**: MX Master 3
  - **Specs**: DPI: 4000, Batteria: Ricaricabile

### Bici
- **Nome**: Mountain Bike | **Brand**: Specialized | **Model**: Rockhopper
  - **Specs**: Ruote: 29", Freni: Idraulici, Cambio: Shimano Deore

### Elettronica
- **Nome**: Monitor | **Brand**: Dell | **Model**: UltraSharp U2720Q
  - **Specs**: Dimensione: 27", Risoluzione: 4K, Refresh: 60Hz

---

## ✨ Funzionalità disponibili

- ✅ **Categorie**: PC Components, Periferiche, Bici, Elettronica, Altro
- ✅ **Specifiche dinamiche**: Aggiungi tutte le specifiche che vuoi in formato chiave-valore
- ✅ **Note**: Campo libero per annotazioni
- ✅ **Data acquisto**: Tieni traccia di quando hai comprato ogni dispositivo
- ✅ **Ricerca e organizzazione**: Dispositivi raggruppati automaticamente per categoria
- ✅ **Dettagli espandibili**: Clicca "Mostra dettagli" per vedere tutte le info
- ✅ **Elimina**: Rimuovi dispositivi che non possiedi più

---

## 🔄 Sincronizzazione con Claude

Tutti i dati sono salvati nel database Supabase e possono essere consultati da Claude tramite query SQL.

Per consultare i tuoi dispositivi puoi chiedere a Claude:
- "Mostrami tutti i miei dispositivi"
- "Quali sono le specifiche del mio PC?"
- "Quando ho comprato la tastiera Logitech?"
- "Fammi un elenco di tutte le periferiche"

---

**Database pronto!** 🚀
