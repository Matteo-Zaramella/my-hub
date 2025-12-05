# 🚨 SESSIONE CORREZIONE DATE - 04/12/2025

**STATO:** DA COMPLETARE DOMANI
**PRIORITÀ:** CRITICA - ERRORI GRAVI NEL DATABASE

---

## ❌ ERRORI GRAVI COMMESSI

Durante la sessione odierna sono stati commessi **errori gravissimi** nella gestione delle date e degli indizi:

### Problemi identificati:

1. **Date sfide completamente sbagliate** - Le date nel database NON corrispondono al calendario reale
2. **Indizi nel giorno della sfida** - Gli indizi NON devono essere pubblicati lo stesso giorno della sfida
3. **Numero indizi sbagliato** - Ho aggiunto indizi a caso senza seguire il calendario corretto
4. **Mesi sbagliati** - Le sfide sono state posizionate nei mesi sbagliati

### Esempio errore grave:
- Screenshot mostra: "Sfida 21/03/2026 - 0/5 indizi rivelati"
- Problema 1: Gli indizi sono 5 ma l'ultimo è il 28/03, DOPO la sfida del 21/03
- Problema 2: Ho messo indizi anche nel giorno della sfida stessa

---

## 📋 DOCUMENTO UFFICIALE DATE

**File:** `DATE_SFIDE_UFFICIALI.txt` (copiato da Downloads)

⚠️ **QUESTO FILE È LA FONTE UNICA DI VERITÀ - NON MODIFICARLO MAI**

### Struttura corretta dal file ufficiale:

**REGOLA FONDAMENTALE:** Tutti gli eventi partono da MEZZANOTTE tra il giorno precedente e quello scritto.

#### SFIDA 1 (Cerimonia Apertura)
- **25/01/26**: SFIDA 1 (cerimonia apertura)

#### SFIDA 2
- **01/02**: Indizio 1
- **08/02**: Indizio 2
- **15/02**: Indizio 3
- **22/02**: SFIDA 2 (3 indizi totali)

#### SFIDA 3
- **01/03**: Indizio 1
- **08/03**: Indizio 2
- **15/03**: Indizio 3
- **22/03**: Indizio 4
- **29/03**: SFIDA 3 (4 indizi totali)

#### SFIDA 4
- **05/04**: Indizio 1
- **12/04**: Indizio 2
- **19/04**: Indizio 3
- **26/04**: SFIDA 4 (3 indizi totali)

#### SFIDA 5
- **03/05**: Indizio 1
- **10/05**: Indizio 2
- **17/05**: Indizio 3
- **24/05**: Indizio 4
- **31/05**: SFIDA 5 (4 indizi totali)

#### SFIDA 6
- **07/06**: Indizio 1
- **14/06**: Indizio 2
- **21/06**: Indizio 3
- **28/06**: SFIDA 6 (3 indizi totali)

#### SFIDA 7
- **05/07**: Indizio 1
- **12/07**: Indizio 2
- **19/07**: Indizio 3
- **26/07**: SFIDA 7 (3 indizi totali)

#### SFIDA 8
- **02/08**: Indizio 1
- **09/08**: Indizio 2
- **16/08**: Indizio 3
- **23/08**: Indizio 4
- **30/08**: SFIDA 8 (4 indizi totali)

#### SFIDA 9
- **06/09**: Indizio 1
- **13/09**: Indizio 2
- **20/09**: Indizio 3
- **27/09**: SFIDA 9 (3 indizi totali)

#### SFIDA 10
- **04/10**: Indizio 1
- **11/10**: Indizio 2
- **18/10**: Indizio 3
- **25/10**: SFIDA 10 (3 indizi totali)

#### SFIDA 11
- **01/11**: Indizio 1
- **08/11**: Indizio 2
- **15/11**: Indizio 3
- **22/11**: Indizio 4
- **29/11**: SFIDA 11 (4 indizi totali)

#### SFIDA 12
- **06/12**: Indizio 1
- **13/12**: Indizio 2
- **20/12**: Indizio 3
- **27/12**: SFIDA 12 (3 indizi totali)

#### FINALE
- **28/12**: Comunicazione globale (dettagli serata finale 23/01/2027)
- **23/01/2027**: Serata finale
- **24/01/2027**: Caccia alla valigetta (tutto il giorno)

---

## 📊 ANALISI CORRETTA

### Totale sfide: 12 (non 11!)
- Sfida 1: 25/01/26 (Cerimonia)
- Sfida 2-12: Febbraio 2026 - Dicembre 2026

### Distribuzione indizi corretta:
- Sfida 1: 0 indizi (è la cerimonia)
- Sfida 2: 3 indizi
- Sfida 3: 4 indizi
- Sfida 4: 3 indizi
- Sfida 5: 4 indizi
- Sfida 6: 3 indizi
- Sfida 7: 3 indizi
- Sfida 8: 4 indizi
- Sfida 9: 3 indizi
- Sfida 10: 3 indizi
- Sfida 11: 4 indizi
- Sfida 12: 3 indizi

**TOTALE INDIZI:** 37 indizi

### Pattern temporale:
- **Tutti gli eventi sono di SABATO**
- **Cadenza settimanale:** ogni 7 giorni esatti
- **Gli indizi sono PRIMA della sfida, MAI lo stesso giorno**
- **Ultima sfida prima di Natale:** 27/12/2026

---

## 🔧 OPERAZIONI DA FARE DOMANI

### 1. BACKUP DATABASE
Prima di qualsiasi modifica, fare backup completo di:
- `game_challenges`
- `game_clues`

### 2. CANCELLARE TUTTI GLI INDIZI SBAGLIATI
Eliminare TUTTI gli indizi dal database perché sono completamente sbagliati.

### 3. CORREGGERE DATE SFIDE
Aggiornare tutte le date delle sfide secondo il file `DATE_SFIDE_UFFICIALI.txt`:

**Date corrette sfide:**
```
Sfida 1:  2026-01-25 00:00:00
Sfida 2:  2026-02-22 00:00:00
Sfida 3:  2026-03-29 00:00:00
Sfida 4:  2026-04-26 00:00:00
Sfida 5:  2026-05-31 00:00:00
Sfida 6:  2026-06-28 00:00:00
Sfida 7:  2026-07-26 00:00:00
Sfida 8:  2026-08-30 00:00:00
Sfida 9:  2026-09-27 00:00:00
Sfida 10: 2026-10-25 00:00:00
Sfida 11: 2026-11-29 00:00:00
Sfida 12: 2026-12-27 00:00:00
```

### 4. RICREARE TUTTI GLI INDIZI CORRETTI
Inserire gli indizi esattamente come specificato nel file DATE_SFIDE_UFFICIALI.txt:

**Esempio per Sfida 2:**
```sql
INSERT INTO game_clues (challenge_id, clue_number, clue_text, revealed_date)
VALUES
  (id_sfida_2, 1, 'Indizio 1 per Sfida 2', '2026-02-01 00:00:00'),
  (id_sfida_2, 2, 'Indizio 2 per Sfida 2', '2026-02-08 00:00:00'),
  (id_sfida_2, 3, 'Indizio 3 per Sfida 2', '2026-02-15 00:00:00');
```

**ATTENZIONE:**
- Tutti gli orari devono essere `00:00:00` (mezzanotte)
- Gli indizi devono essere PRIMA della data della sfida
- Il numero di indizi deve corrispondere esattamente al calendario

### 5. VERIFICARE CERIMONIA APERTURA
La cerimonia del 24/01/2026 deve rimanere come evento separato (NON è Sfida 1).
La Sfida 1 è il 25/01/2026.

### 6. CREARE SFIDA 12
Nel database attualmente ci sono solo 11 sfide. Manca la Sfida 12 (27/12/2026).

### 7. AGGIORNARE CALENDARIO_DATE_COMPLETE.md
Riscrivere completamente il documento con le date corrette.

### 8. VERIFICARE UI
Dopo le correzioni, verificare che nella pagina `/game/area`:
- Tutte le date delle sfide siano corrette
- Il numero di indizi sia corretto per ogni sfida
- Gli indizi siano SEMPRE prima della sfida

---

## 🗂️ FILE COINVOLTI

### File da modificare:
1. `database/game_challenges` - Correggere tutte le date
2. `database/game_clues` - Eliminare e ricreare tutti
3. `CALENDARIO_DATE_COMPLETE.md` - Riscrivere completamente
4. `scripts/` - Creare script di correzione

### File da NON toccare:
- ❌ `DATE_SFIDE_UFFICIALI.txt` - QUESTO È IL FILE MASTER, NON MODIFICARE MAI

---

## 📝 SCRIPT DA CREARE DOMANI

### 1. `backup-database.mjs`
Backup completo di challenges e clues prima delle modifiche.

### 2. `delete-all-wrong-clues.mjs`
Eliminare TUTTI gli indizi dal database (sono tutti sbagliati).

### 3. `fix-all-challenge-dates.mjs`
Aggiornare tutte le 12 sfide con le date corrette da DATE_SFIDE_UFFICIALI.txt.

### 4. `create-sfida-12.mjs`
Creare la Sfida 12 (27/12/2026) che manca.

### 5. `populate-all-clues-correct.mjs`
Ricreare TUTTI i 37 indizi con le date corrette.

### 6. `verify-all-dates.mjs`
Verificare che tutto sia corretto:
- 12 sfide con date corrette
- 37 indizi con date corrette
- Nessun indizio nello stesso giorno della sfida
- Tutti gli eventi di sabato

---

## 🔍 CHECKLIST VERIFICA FINALE

Dopo aver completato tutte le correzioni, verificare:

- [ ] 12 sfide nel database (non 11)
- [ ] Date sfide corrette (tutti sabati)
- [ ] 37 indizi totali nel database
- [ ] Nessun indizio nello stesso giorno della sfida
- [ ] Tutti gli eventi alle ore 00:00:00
- [ ] UI mostra date corrette
- [ ] UI mostra conteggio indizi corretto
- [ ] Cerimonia apertura (24/01/26) separata da Sfida 1 (25/01/26)
- [ ] Sfida 12 presente (27/12/26)
- [ ] Comunicazione finale (28/12/26) configurata

---

## 💾 STATO ATTUALE DATABASE (SBAGLIATO)

### Date sfide nel DB (TUTTE SBAGLIATE):
```
Sfida 1: 2026-02-21 ❌ (dovrebbe essere 2026-01-25)
Sfida 2: 2026-03-21 ❌ (dovrebbe essere 2026-02-22)
Sfida 3: 2026-04-18 ❌ (dovrebbe essere 2026-03-29)
Sfida 4: 2026-05-16 ❌ (dovrebbe essere 2026-04-26)
Sfida 5: 2026-06-20 ❌ (dovrebbe essere 2026-05-31)
Sfida 6: 2026-07-18 ❌ (dovrebbe essere 2026-06-28)
Sfida 7: 2026-08-22 ❌ (dovrebbe essere 2026-07-26)
Sfida 8: 2026-09-19 ❌ (dovrebbe essere 2026-08-30)
Sfida 9: 2026-10-17 ❌ (dovrebbe essere 2026-09-27)
Sfida 10: 2026-11-21 ❌ (dovrebbe essere 2026-10-25)
Sfida 11: 2026-12-19 ❌ (dovrebbe essere 2026-11-29)
Sfida 12: MANCANTE ❌ (dovrebbe essere 2026-12-27)
```

### Conteggio indizi (ALCUNI SBAGLIATI):
```
Sfida 1: 3 indizi ❌ (dovrebbe essere 0 - è la cerimonia)
Sfida 2: 5 indizi ❌ (dovrebbe essere 3)
Sfida 3: 4 indizi ✅ (corretto)
Sfida 4: 4 indizi ❌ (dovrebbe essere 3)
Sfida 5: 4 indizi ✅ (corretto)
Sfida 6: 3 indizi ✅ (corretto)
Sfida 7: 3 indizi ✅ (corretto)
Sfida 8: 3 indizi ❌ (dovrebbe essere 4)
Sfida 9: 3 indizi ✅ (corretto)
Sfida 10: 4 indizi ❌ (dovrebbe essere 3)
Sfida 11: 5 indizi ❌ (dovrebbe essere 4)
Sfida 12: MANCANTE ❌ (dovrebbe essere 3)
```

**CONCLUSIONE:** Praticamente TUTTO è sbagliato. Serve una correzione completa.

---

## 🎯 APPROCCIO DOMANI

1. **NON improvvisare** - Seguire ESATTAMENTE il file DATE_SFIDE_UFFICIALI.txt
2. **NON fare assunzioni** - Se qualcosa non è chiaro, chiedere all'utente
3. **Verificare ogni passo** - Dopo ogni modifica, controllare che sia corretta
4. **Usare il file ufficiale come unica fonte** - Ignorare tutti i calendari precedenti

---

## 📌 NOTE IMPORTANTI

- La **Cerimonia di Apertura** (24/01/26) e la **Sfida 1** (25/01/26) sono eventi separati
- La Sfida 1 NON ha indizi (è l'evento di apertura)
- Ci sono **12 sfide** totali (non 11)
- Gli indizi sono **sempre sabato**, **sempre prima** della sfida
- **Mezzanotte** significa 00:00:00 del giorno indicato
- L'ultimo evento del gioco è la **Caccia alla Valigetta** (24/01/2027)

---

**STATO:** Tutto pronto per la sessione di domani. NON procedere con modifiche al database oggi.

**PROSSIMI PASSI:** Domani mattina iniziare con backup database e poi seguire punto per punto le operazioni elencate sopra.
