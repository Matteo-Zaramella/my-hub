# 👥 Distinzione Partecipanti: Principali vs Partner

**Data:** 21 Novembre 2025
**Aggiornamento:** Sistema partecipanti con tipo e colori categorie

---

## 📋 LOGICA INVITI

### Invitati Principali
- Persone invitate direttamente da Matteo
- Riceveranno l'invito ufficiale
- Possono portare un partner se lo desiderano
- **Totale stimato:** ~30 persone

### Partner
- Accompagnatori degli invitati principali
- Non ricevono invito diretto
- Possono partecipare al gioco se presenti
- Registrati nel database ma come "partner"
- **Totale stimato:** ~22 persone

### Totale Massimo
- **52 partecipanti** (30 principali + 22 partner)

---

## 🎨 COLORI CATEGORIE

| Categoria | Colore | Hex Code | Descrizione |
|-----------|--------|----------|-------------|
| **Mare** | 🔵 Blu | #3B82F6 | Amici del mare |
| **Arcella** | 🟢 Verde | #10B981 | Quartiere Arcella |
| **Severi** | 🟣 Viola | #8B5CF6 | Via Severi |
| **Mortise** | 🟠 Arancione | #F59E0B | Mortise |
| **Famiglia** | 🔴 Rosso | #EF4444 | Familiari |
| **Colleghi** | 🔷 Indaco | #6366F1 | Colleghi lavoro |
| **Amici** | 🌸 Rosa | #EC4899 | Altri amici |
| **Vigodarzere** | 🐚 Teal | #14B8A6 | Vigodarzere |

---

## 👫 LISTA PARTNER (22 persone)

### Partner con Nome Completo (11 persone)
1. **Andrea Zotta** - partner di Silvia Zaramella
2. **Angelica Bettella** - partner di qualcuno (Mortise)
3. **Anna Gianaselli** - partner di qualcuno
4. **Benedetta Ferronato** - partner di qualcuno
5. **Elena Ardito** - partner di qualcuno (Severi)
6. **Elisa Volpatti** - partner di qualcuno (Severi)
7. **Emanuele Pedron** - partner di qualcuno (Arcella)
8. **Francesca Pasini** - partner di qualcuno (Severi)
9. **Francesco Corricelli** - partner di qualcuno (Famiglia)
10. **Sophia Gardin** - partner di qualcuno (Severi)
11. **Vittoria Bocchese** - partner di qualcuno

### Partner da Identificare (11 persone)
12. **Ragazza di Daniele Gasparin**
13. **Ragazza di Davide Boscolo**
14. **Ragazza di Enrico Geron**
15. **Ragazza di Enrico Maragno**
16. **Marito di Francesca Gasparin**
17. **Ragazzo di Francesca Colombin**
18. **Ragazza di Francesco Marsilio**
19. **Ragazza di Gabriele Zambon**
20. **Ragazzo di Irene Toffanin**
21. **Ragazzo di Marta Geron**
22. **Ragazza di Roberto Pietrantonj**

---

## 📊 STATISTICHE

### Per Tipo
- **Invitati Principali:** ~30
- **Partner:** 22 (11 identificati + 11 da identificare)
- **Totale:** 52 partecipanti massimo

### Per Status Identificazione
- **Partner con nome completo:** 11
- **Partner da identificare:** 11
- **Totale partner:** 22

---

## 🔧 MODIFICHE DATABASE

### Nuova Colonna: participant_type
```sql
ALTER TABLE game_participants
ADD COLUMN participant_type TEXT DEFAULT 'principale'
CHECK (participant_type IN ('principale', 'partner'));
```

**Valori:**
- `'principale'` - Invitato diretto
- `'partner'` - Accompagnatore

### Nuova Tabella: category_colors
```sql
CREATE TABLE category_colors (
  category TEXT PRIMARY KEY,
  color_hex TEXT NOT NULL,
  color_name TEXT NOT NULL
);
```

**Scopo:** Assegnare colori visivi alle categorie nell'UI

---

## 📝 AZIONI DA ESEGUIRE

### Su Supabase SQL Editor
1. Eseguire: `database/add_participant_type_and_category_colors.sql`
2. Verificare conteggi partecipanti per tipo
3. Verificare assegnazione colori categorie

### Sul Codice
1. Aggiornare componente ParticipantsTab per:
   - Mostrare colonna "Tipo" (Principale/Partner)
   - Applicare badge colorati per categoria
   - Filtrare per tipo partecipante
2. Aggiornare dashboard per distinguere visivamente principali da partner

---

## 🎯 IMPATTO FUNZIONALE

### Invio Email
- Solo gli invitati **principali** riceveranno l'email con il link/invito
- I partner verranno menzionati come "puoi portare il tuo partner"

### Partecipazione Gioco
- **Tutti** possono partecipare (principali + partner)
- **Tutti** possono guadagnare punti
- **Tutti** visibili nella classifica finale

### Comunicazioni
- Inviti/reminder → solo principali
- Chat di gruppo → tutti (dopo registrazione)
- Notifiche sfide → tutti (se registrati)

---

## 📅 TIMELINE

- **21/11/2025:** Definizione logica principali vs partner
- **22/11/2025:** Esecuzione script SQL su Supabase
- **23/11/2025:** Aggiornamento UI dashboard
- **Dicembre 2025:** Invio inviti ai principali
- **Gennaio 2026:** Raccolta nomi partner mancanti

---

**Note:**
- I partner generici verranno identificati man mano che gli invitati principali confermano
- Il database supporta 52 partecipanti totali ma potrebbero essere meno se non tutti portano il partner
- I colori categorie migliorano la leggibilità nella dashboard admin

---

*Documento creato: 21 Novembre 2025*
*Responsabile: Matteo Zaramella*
