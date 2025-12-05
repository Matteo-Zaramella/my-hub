# 📅 Status Popolamento Google Calendar

**Data:** 4 Dicembre 2025
**Calendario:** A Tutto Reality: La Rivoluzione

---

## ✅ Eventi Creati (6/51)

### Cerimonia Apertura
- ✅ 11 Gennaio 2026, 19:00-23:00 - **Cerimonia Apertura**

### Febbraio 2026 (5/5)
- ✅ 07 Feb - 🔍 Indizio 1 - Sfida 1
- ✅ 14 Feb - 🔍 Indizio 2 - Sfida 1
- ✅ 21 Feb - 🎯 Sfida 1 - Febbraio
- ✅ 21 Feb - 🔍 Indizio 3 - Sfida 1
- ✅ 28 Feb - 🔍 Indizio 1 - Sfida 2

---

## ⏳ Eventi da Creare (45)

### Marzo 2026 (4 eventi)
- 07 Mar - 🔍 Indizio 2 - Sfida 2
- 14 Mar - 🔍 Indizio 3 - Sfida 2
- 21 Mar - 🎯 Sfida 2 - Marzo
- 21 Mar - 🔍 Indizio 4 - Sfida 2

### Aprile 2026 (5 eventi)
- 28 Mar - 🔍 Indizio 5 - Sfida 2
- 04 Apr - 🔍 Indizio 1 - Sfida 3
- 11 Apr - 🔍 Indizio 2 - Sfida 3
- 18 Apr - 🎯 Sfida 3 - Aprile
- 18 Apr - 🔍 Indizio 3 - Sfida 3

### Maggio 2026 - Dicembre 2026
- **Totale:** 36 eventi rimanenti (indizi + sfide)

---

## 📊 Riepilogo

| Mese | Indizi | Sfide | Totale | Status |
|------|--------|-------|--------|--------|
| Gen 2026 | 0 | 1 cerimonia | 1 | ✅ Completato |
| Feb 2026 | 4 | 1 | 5 | ✅ Completato |
| Mar 2026 | 4 | 1 | 5 | ⏳ Da fare |
| Apr 2026 | 4 | 1 | 5 | ⏳ Da fare |
| Mag 2026 | 3 | 1 | 4 | ⏳ Da fare |
| Giu 2026 | 3 | 1 | 4 | ⏳ Da fare |
| Lug 2026 | 3 | 1 | 4 | ⏳ Da fare |
| Ago 2026 | 3 | 1 | 4 | ⏳ Da fare |
| Set 2026 | 3 | 1 | 4 | ⏳ Da fare |
| Ott 2026 | 4 | 1 | 5 | ⏳ Da fare |
| Nov 2026 | 4 | 1 | 5 | ⏳ Da fare |
| Dic 2026 | 4 | 1 | 5 | ⏳ Da fare |

**Totale:** 6/51 eventi creati (11.7%)

---

## 🔄 Come Completare il Popolamento

### Opzione A: Script Automatico (Consigliato)

Dato il limite di rate delle API Google Calendar, è meglio creare un Node script che:
1. Legge `scripts/calendar-events.json`
2. Controlla quali eventi esistono già
3. Crea gli eventi mancanti con delay tra richieste

### Opzione B: Manuale

Puoi usare questo comando per continuare:
```javascript
// Per ogni evento in calendar-events.json a partire dall'indice 5
mcp__google-calendar__create-event({
  calendarId: "9cbd1bb58997dc6501b56adc65e4c49cafba5902b968aa39d07e953ecdf57716@group.calendar.google.com",
  summary: event.summary,
  start: event.start,
  end: nextDay(event.start),
  description: event.description,
  colorId: event.colorId,
  sendUpdates: "none"
})
```

### Opzione C: Import CSV

Esporta gli eventi come CSV e importa direttamente su Google Calendar:
1. Converti `calendar-events.json` in formato CSV
2. Vai su Google Calendar > Impostazioni > Importa
3. Carica il file CSV

---

## 📝 Note Importanti

### Colori Eventi
- **Blu (9):** 🔍 Indizi
- **Rosso (11):** 🎯 Sfide
- **Viola (24):** 🎭 Eventi speciali (Cerimonia)

### Formato Date
- Eventi all-day: `YYYY-MM-DD`
- End date: +1 giorno dalla start date
- Timezone: Europe/Rome

### File Dati
- **Source:** `scripts/calendar-events.json` (50 eventi)
- **Database:** Supabase `game_challenges` + `game_clues`

---

## ✅ Prossimi Step

1. **Decidere metodo popolamento:**
   - Script automatico con delay (5-10 eventi per volta)
   - Oppure import CSV bulk

2. **Verificare calendario:**
   - Aprire Google Calendar
   - Controllare che gli eventi creati siano corretti

3. **Aggiungere evento festa finale:**
   - 31 Maggio 2026
   - Evento conclusivo matrimonio

---

**Ultima modifica:** 4 Dicembre 2025, 09:00
**Status:** In corso - 11.7% completato
