# 🚀 GUIDA PORTE DEV/PROD

**Data:** 12 Dicembre 2025
**Configurazione:** Server separati su porte diverse

---

## 📌 CONFIGURAZIONE PORTE

| Ambiente | Porta | Database | URL |
|----------|-------|----------|-----|
| **DEV** | `3000` | mheowbijzaparmddumsr | http://localhost:3000 |
| **PROD** | `3500` | wuvuapmjclahbmngntku | http://localhost:3500 |

---

## 🎯 COME USARE

### Avviare Server DEV (sviluppo normale)

```
Doppio click: AVVIA_SERVER.bat
```

- ✅ Porta: **3000**
- ✅ Database: **DEV** (separato)
- ✅ Modifiche NON visibili in produzione
- ✅ Puoi testare liberamente

### Avviare Server PROD (test con dati reali)

```
Doppio click: AVVIA_SERVER_PROD.bat
```

- ⚠️ Porta: **3500**
- ⚠️ Database: **PRODUZIONE**
- ⚠️ Modifiche VISIBILI pubblicamente!
- ⚠️ Usare solo quando necessario

### Fermare TUTTI i Server

```
Doppio click: STOP_SERVER.bat
```

- Ferma tutti i processi Node.js
- Libera le porte 3000 e 3500
- Usa prima di riavviare i server

---

## 🔄 SCENARI COMUNI

### Scenario 1: Sviluppo Normale
```
1. AVVIA_SERVER.bat (porta 3000, database DEV)
2. Lavora sul codice
3. Testa su localhost:3000
4. Le modifiche NON influenzano produzione ✅
```

### Scenario 2: Confronto DEV vs PROD
```
1. AVVIA_SERVER.bat (porta 3000, database DEV)
2. AVVIA_SERVER_PROD.bat (porta 3500, database PROD)
3. Apri entrambi i browser:
   - localhost:3000 → Versione DEV
   - localhost:3500 → Versione PROD con dati reali
4. Confronta visivamente le differenze
```

### Scenario 3: Test con Dati di Produzione
```
1. STOP_SERVER.bat (ferma tutto)
2. AVVIA_SERVER_PROD.bat (porta 3500)
3. Testa solo su localhost:3500
4. ⚠️ ATTENZIONE: Modifiche visibili pubblicamente!
```

---

## 🛑 IMPORTANTE

### Distinguere i Server
- **Titolo finestra CMD:**
  - `My-Hub Server DEV` → Porta 3000
  - `My-Hub Server PROD` → Porta 3500

- **URL Browser:**
  - `localhost:3000` → Database DEV
  - `localhost:3500` → Database PROD

- **Manutenzione:**
  - Se vedi manutenzione attiva, controlla **quale porta** stai usando!
  - Porta 3000 (DEV) = manutenzione solo in locale
  - Porta 3500 (PROD) = manutenzione visibile pubblicamente ⚠️

---

## 🔧 TROUBLESHOOTING

### Problema: "Porta già in uso"
```
Soluzione:
1. STOP_SERVER.bat
2. Riavvia il server desiderato
```

### Problema: "Vedo manutenzione anche se non dovrei"
```
Causa: Server sbagliato in esecuzione
Soluzione:
1. Controlla l'URL nel browser (3000 o 3500?)
2. STOP_SERVER.bat
3. Riavvia SOLO AVVIA_SERVER.bat (porta 3000, DEV)
```

### Problema: "Non so quale server è attivo"
```
Verifica:
1. Guarda la barra del titolo del browser
2. Controlla le finestre CMD aperte:
   - "My-Hub Server DEV" = porta 3000
   - "My-Hub Server PROD" = porta 3500
```

---

## 📊 DIFFERENZE DATABASE

### Database DEV (porta 3000)
- ✅ Tabelle vuote (dati di test)
- ✅ Separato dalla produzione
- ✅ Modifiche sicure
- ✅ Ideale per sviluppo

### Database PROD (porta 3500)
- ⚠️ Dati reali dei partecipanti
- ⚠️ Usato dal sito pubblico (Vercel)
- ⚠️ Modifiche visibili immediatamente
- ⚠️ Usare solo per test urgenti

---

## ✅ CHECKLIST PRE-SVILUPPO

Prima di iniziare a lavorare:

- [ ] Ho fermato tutti i server? (STOP_SERVER.bat)
- [ ] Ho avviato il server corretto? (AVVIA_SERVER.bat per DEV)
- [ ] Sto su localhost:3000? (DEV, sicuro)
- [ ] Se vedo dati reali, sto usando PROD per sbaglio? ⚠️

---

## 🎓 BEST PRACTICES

1. **Usa SEMPRE DEV per sviluppo normale**
   - Porta 3000
   - Database separato
   - Nessun rischio

2. **Usa PROD solo quando strettamente necessario**
   - Test con dati reali
   - Verifica funzionalità produzione
   - Debug problemi specifici

3. **Ferma i server quando non servono**
   - Libera risorse
   - Evita confusione
   - Previeni errori

4. **Controlla sempre l'URL prima di modificare dati**
   - localhost:3000 = sicuro ✅
   - localhost:3500 = pericoloso ⚠️

---

**Creato:** 12 Dicembre 2025
**Responsabile:** Matteo Zaramella
**Assistente:** Claude Code
