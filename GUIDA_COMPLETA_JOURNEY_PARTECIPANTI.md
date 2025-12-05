# 🎯 GUIDA COMPLETA - JOURNEY PARTECIPANTI
## A Tutto Reality: La Rivoluzione (Gen 2026 - Gen 2027)

**Documento Master:** Tutti i touchpoint dalla comunicazione iniziale alla finale
**Obiettivo:** Zero improvvisazione - Ogni partecipante sa sempre cosa fare
**Aggiornato:** 5 Dicembre 2025

---

## 📅 TIMELINE GENERALE

```
Dicembre 2025     → Preparazione e comunicazioni
11 Gennaio 2026   → Cerimonia Apertura
Gen-Dic 2026      → 12 Sfide Mensili
23 Gennaio 2027   → Serata Finale
24 Gennaio 2027   → Caccia alla Valigetta
```

---

# FASE 1: PRE-EVENTO (Dicembre 2025)

## 🎫 Step 1.1: Prima Comunicazione

**QUANDO:** Dicembre 2025 (da definire data esatta)
**CANALE:** Email + Messaggio privato
**MITTENTE:** Tu (organizzatore)

### Contenuto Email:
```
OGGETTO: 🎉 Sei stato selezionato per "A Tutto Reality: La Rivoluzione"!

Ciao [NOME],

Sei tra i 52 partecipanti selezionati per "A Tutto Reality: La Rivoluzione",
il gioco interattivo della durata di un anno!

🎯 COSA TI ASPETTA:
• Cerimonia di Apertura: 11 Gennaio 2026
• 12 sfide mensili da Febbraio 2026 a Gennaio 2027
• Indizi settimanali da scoprire
• Chat di gruppo con tutti i partecipanti
• Classifica e punteggi in tempo reale
• Premio finale: 1.000€

📝 PROSSIMO STEP:
Compila il form di registrazione entro il [DATA]:
👉 [LINK FORM GOOGLE]

Nella mail riceverai:
✅ Il tuo CODICE PARTECIPANTE univoco
✅ Istruzioni per accedere all'app
✅ Dettagli sulla Cerimonia di Apertura

Ti aspetto!
[TUO NOME]
```

**AZIONE PARTECIPANTE:** Compilare Google Form

---

## 📋 Step 1.2: Google Form Registrazione

**LINK:** https://forms.google.com/[TUO_ID]
**SCOPO:** Raccogliere dati partecipanti

### Campi Form:
1. Nome e Cognome
2. Email
3. Telefono
4. Data di Nascita
5. Taglia maglietta (S/M/L/XL)
6. Allergie/intolleranze alimentari
7. Note particolari
8. Consenso privacy

**DOPO INVIO:**
- Form si chiude automaticamente
- Dati vanno su Google Sheets
- Tu generi codici partecipante manualmente
- Popoli database Supabase

---

## ✉️ Step 1.3: Email Conferma + Codice

**QUANDO:** Entro 48h dalla compilazione form
**CANALE:** Email automatica (o manuale prima volta)

### Contenuto:
```
OGGETTO: ✅ Il tuo codice per "A Tutto Reality"

Ciao [NOME],

Grazie per aver completato la registrazione!

🎫 IL TUO CODICE PARTECIPANTE
━━━━━━━━━━━━━━━━━━━━━━
   [ABC123]
━━━━━━━━━━━━━━━━━━━━━━

⚠️ Conserva questo codice! Ti servirà per:
• Accedere all'app di gioco
• Partecipare alla Cerimonia di Apertura
• Validare i tuoi progressi

🌐 ACCEDI ALL'APP:
👉 https://[tuo-dominio].vercel.app

📅 CERIMONIA DI APERTURA
• Data: Sabato 11 Gennaio 2026
• Orario: 19:00 - 23:00
• Luogo: Fenice Green Energy Park, Padova
• Dress code: Casual elegante

🎁 LISTA NOZZE:
Se vuoi contribuire al regalo:
👉 https://[tuo-dominio].vercel.app/wishlist-public

Ci vediamo l'11 Gennaio!
[TUO NOME]
```

**AZIONE PARTECIPANTE:**
- Salva codice
- Esplora app (opzionale)
- Vede wishlist (opzionale)

---

## 🔒 Step 1.4: Homepage con Countdown

**URL:** https://[tuo-dominio].vercel.app
**STATO:** Attivo da subito
**VISIBILE:** Pubblico

### Cosa vedono:
```
┌──────────────────────────────────┐
│   🎮 A TUTTO REALITY             │
│      La Rivoluzione              │
│                                  │
│   [COUNTDOWN DINAMICO]           │
│   XX giorni XX ore XX minuti     │
│                                  │
│   ⏰ Cerimonia: 11/01/2026       │
│   📍 Padova                      │
│                                  │
│   [GRIGLIA 10x10 CERCHI]         │
│   • Cerchio 1: 🎁 Wishlist       │
│   • Cerchio 2: 📝 Registrazione  │
│   • Altri: Neri/inattivi         │
└──────────────────────────────────┘
```

**CERCHI ATTIVI (pre-evento):**
- **Cerchio 1** → `/wishlist-public` (sempre visibile)
- **Cerchio 2** → Form registrazione (fino a chiusura)
- **Cerchio 10** → `/login` (Admin, sempre attivo)
- **Cerchio 100** → Barra password game (attiva dal 26/01)

---

# FASE 2: CERIMONIA APERTURA (11 Gen 2026)

## 🎪 Step 2.1: Giorno Prima (10 Gen)

**QUANDO:** 10 Gennaio 2026, ore 18:00
**CANALE:** Email + Messaggio gruppo (se esiste)

### Contenuto Email:
```
OGGETTO: 🎉 Domani è il grande giorno!

Ciao [NOME],

Domani inizia "A Tutto Reality: La Rivoluzione"!

📍 DOVE:
Fenice Green Energy Park
Via [INDIRIZZO COMPLETO]
Padova

🕖 QUANDO:
Sabato 11 Gennaio 2026
Ore 19:00 (arrivo dalle 18:45)

🎫 PORTA CON TE:
• Il tuo codice: [ABC123]
• Documento d'identità
• Voglia di divertirti!

🎯 PROGRAMMA SERATA:
19:00 - Arrivo e welcome drink
19:30 - Presentazione gioco e regole
20:00 - CACCIA AGLI INDIZI (10 indizi nascosti)
21:30 - Buffet e networking
22:30 - Rivelazione classifica iniziale
23:00 - Fine serata

💡 PRIMO MINI-GIOCO:
Durante la serata dovrai trovare 10 PAROLE nascoste
nel parco/chalet. Le prime 5 persone che completano
la lista ricevono bonus punti!

Ci vediamo domani! 🎊
[TUO NOME]
```

---

## 🔍 Step 2.2: Durante la Cerimonia

### A. Check-in (19:00 - 19:30)

**SETUP:**
- Tavolo registrazione all'ingresso
- Laptop con database aperto
- Badge nominativi

**PROCEDURA:**
1. Partecipante arriva
2. Dice nome o mostra codice
3. Tu verifichi su lista
4. Consegni badge + spieghi brevemente

**COSA SPIEGHI:**
- "Stasera ci sono 10 indizi nascosti"
- "Usa l'app per inserire le parole"
- "Prime 5 persone = bonus punti"
- "Divertiti!"

---

### B. Presentazione (19:30 - 20:00)

**LOCATION:** Area centrale / Chalet
**DURATA:** 30 minuti max

**SCALETTA:**
1. **Benvenuto** (5 min)
   - Ringraziamenti
   - Overview evento

2. **Regole Gioco** (10 min)
   - 12 sfide mensili (Feb-Gen)
   - Sistema indizi settimanali
   - Punteggi e classifica
   - Premio finale 1.000€

3. **Demo App** (10 min)
   - Login con codice
   - Tab Indizi
   - Tab Sfide
   - Chat di gruppo
   - Classifica

4. **Caccia Indizi Stasera** (5 min)
   - 10 parole nascoste nel parco
   - Come inserirle nell'app
   - Prime 5 = 500 punti bonus
   - Via libera!

---

### C. Caccia agli Indizi (20:00 - 21:30)

**SETUP TECNICO:**
```
Tabella database: ceremony_clues
┌─────┬─────────────┬───────┬──────────────┐
│ id  │ word        │ order │ location_hint│
├─────┼─────────────┼───────┼──────────────┤
│ 1   │ ENIGMA      │ 1     │ Chalet       │
│ 2   │ VULCANO     │ 2     │ Albero       │
│ 3   │ OBELISCO    │ 3     │ Panchina     │
│ ...│ ...         │ ...   │ ...          │
│ 10  │ ERMETICO    │ 10    │ Ingresso     │
└─────┴─────────────┴───────┴──────────────┘
```

**MECCANICA:**
1. Partecipante trova biglietto fisico
2. Legge la PAROLA (es. "ENIGMA")
3. Apre app → `/game/area`
4. Tab "🎪 Caccia Parole"
5. Inserisce parola
6. Sistema valida + assegna punti
7. Vede quante ne ha trovate (X/10)

**PUNTEGGI:**
- Parola corretta: 100 punti
- Primi 5 a completare: +500 punti bonus
- Classifica live visibile nell'app

---

### D. Buffet & Networking (21:30 - 22:30)

**COSA SUCCEDE:**
- Partecipanti mangiano/bevono
- Socializzano
- Continuano a cercare indizi
- Tu circoli e rispondi a domande

**DOMANDE FREQUENTI (preparati):**
- "Quando parte la prima sfida?" → 25 Gennaio 2026
- "Come funzionano gli indizi?" → Pubblicati ogni sabato sull'app
- "Posso giocare in gruppo?" → Sì, ma punteggi individuali
- "Cosa succede se non partecipo a una sfida?" → 0 punti ma resto in gioco

---

### E. Classifica Finale (22:30 - 23:00)

**SETUP:**
- Proiettore / TV grande
- Apri `/game/area` → Tab Classifica
- Mostra TOP 10 live

**MOMENTO CLOU:**
```
📊 CLASSIFICA SERATA

🥇 1° [NOME] - 1.100 punti
🥈 2° [NOME] - 1.100 punti
🥉 3° [NOME] - 1.000 punti
4° [NOME] - 900 punti
5° [NOME] - 900 punti
...
```

**ANNUNCIO IMPORTANTE:**
- "La prima sfida inizia il **25 Gennaio**"
- "Da domani sera, ogni sabato alle 00:00, nuovi indizi nell'app"
- "Tenete d'occhio Instagram per sorprese"
- "Chattiamo nel gruppo dell'app!"
- "Grazie e buona fortuna!" 🎉

---

## 📱 Step 2.3: Dopo la Cerimonia (12 Gen)

**CANALE:** Email post-evento

### Contenuto:
```
OGGETTO: 🎊 Grazie per la serata fantastica!

Ciao [NOME],

Ieri sera è stato spettacolare! 🎉

📊 LA TUA SERATA:
• Parole trovate: [X/10]
• Punti guadagnati: [XXX]
• Posizione classifica: [XX/52]

🎮 PROSSIMI PASSI:

1️⃣ PRIMA SFIDA: 25 Gennaio 2026
   Tema: [TBD]
   Controlla l'app per dettagli

2️⃣ INDIZI SETTIMANALI:
   Ogni sabato alle 00:00 → nuovi indizi nell'app
   Le immagini si sbloccano il lunedì dopo

3️⃣ CHAT DI GRUPPO:
   Nell'app puoi chattare con tutti i partecipanti!
   Tab 💬 Chat

4️⃣ CLASSIFICA LIVE:
   Aggiornata in tempo reale
   Tab 🏆 Classifica

📸 FOTO DELLA SERATA:
[Link Google Drive con foto]

Ci vediamo online e al 25 Gennaio!
[TUO NOME]
```

---

# FASE 3: PRE-PRIMA SFIDA (12 Gen - 24 Gen 2026)

## 🔐 Step 3.1: Attivazione Password Game (26 Gen)

**QUANDO:** 26 Gennaio 2026, ore 00:00 (automatico)
**COSA CAMBIA:** Cerchio 100 diventa cliccabile

### Homepage Aggiornata:
```
┌──────────────────────────────────┐
│   🎮 A TUTTO REALITY             │
│                                  │
│   [GRIGLIA 10x10]                │
│   • Cerchio 100: 🔴 Attivo!      │
│     (animazione pulse)           │
│                                  │
│   Clicca per accedere →          │
│   Inserisci il tuo codice        │
└──────────────────────────────────┘
```

**AZIONE PARTECIPANTE:**
1. Clicca cerchio 100
2. Appare barra input
3. Inserisce codice (es. ABC123)
4. Redirect a `/game/area`
5. Vede:
   - Tab 🔍 Indizi (vuoti ancora)
   - Tab 🎯 Sfide (Sfida 1 visibile)
   - Tab 💬 Chat
   - Tab 🏆 Classifica

---

# FASE 4: SISTEMA MENSILE (Feb 2026 - Gen 2027)

## 📅 Step 4.1: Schema Tipo Mese

**ESEMPIO: Febbraio 2026 (Sfida 2)**

### Sabato 01/02 - Ore 00:00 - INDIZIO 1

**COSA SUCCEDE (AUTOMATICO):**
- Indizio 1 appare in `/game/area` → Tab Indizi
- Card LUCCHETTATA 🔒
- Testo indizio visibile
- Immagine nascosta fino al lunedì 03/02

**NOTIFICA PARTECIPANTI (opzionale):**
- Push notification (se implementata)
- Post Instagram Story con hint visivo

**CONTENUTO INDIZIO 1:**
```
📍 INDIZIO 1 - SFIDA FEBBRAIO

[TESTO INDIZIO]
Es: "Il tempo corre, ma non per tutti..."

🖼️ [Immagine lucchettata]
   Disponibile dal: Lunedì 03/02/2026
```

---

### Lunedì 03/02 - Ore 00:00 - IMMAGINE 1 SBLOCCATA

**COSA SUCCEDE (AUTOMATICO):**
- Indizio 1 si sblocca
- Immagine visibile (es. cronometro)
- Partecipanti possono studiarla

**NESSUNA AZIONE DA PARTE TUA**

---

### Sabato 08/02 - Ore 00:00 - INDIZIO 2

**RIPETI SCHEMA:**
- Indizio 2 appare (lucchettato)
- Testo visibile subito
- Immagine dal lunedì 10/02

---

### Sabato 15/02 - Ore 00:00 - INDIZIO 3

**RIPETI SCHEMA:**
- Indizio 3 appare (lucchettato)
- Testo visibile subito
- Immagine dal lunedì 17/02

---

### Sabato 22/02 - Ore 00:00 - SFIDA ATTIVA

**COSA SUCCEDE:**
- Sfida 2 diventa ATTIVA nell'app
- Tutti possono partecipare
- Timer/deadline visibile

**ESEMPIO SFIDA 2: Mini-Giochi Saetta McQueen**

#### Instagram Story (14 Febbraio):
```
📸 Storia Instagram:
┌─────────────────────┐
│  🏎️ Saetta McQueen │
│     Numero 95       │
│                     │
│  Riconosci questo?  │
└─────────────────────┘
```

#### Meccanica Sfida:
1. Partecipante vede storia Instagram
2. Capisce: cerchio 95 sulla homepage!
3. Torna su https://[dominio].vercel.app
4. Clicca cerchio 95 (ora rosso, attivo)
5. Redirect a `/minigames`
6. Completa 5 mini-giochi:
   - Memory (12 carte, 90s)
   - Puzzle Slider (4x4, 180s)
   - Sequence (6 livelli)
   - Clicker (50 click, 60s)
   - Quiz (10 domande)
7. Completa tutto → 1.000 punti
8. Classifica si aggiorna

---

### Domenica 23/02 - Email Riepilogo

**QUANDO:** Giorno dopo la sfida
**CANALE:** Email

```
OGGETTO: 🏁 Sfida Febbraio - Risultati

Ciao [NOME],

La Sfida di Febbraio è terminata!

🎮 I TUOI RISULTATI:
• Hai partecipato: [SÌ/NO]
• Punti guadagnati: [XXX]
• Nuova posizione: [XX/52]

📊 TOP 3:
🥇 [NOME] - [PUNTI] punti
🥈 [NOME] - [PUNTI] punti
🥉 [NOME] - [PUNTI] punti

🎯 PROSSIMA SFIDA:
• Data: 29 Marzo 2026
• Tema: [TBD]
• Primi indizi: 01/03, 08/03, 15/03, 22/03

Controlla l'app per gli indizi!
[TUO NOME]
```

---

## 🔄 Step 4.2: Ripetizione per 11 Mesi

**DA REPLICARE PER:**
- Marzo 2026 (Sfida 3) - 4 indizi
- Aprile 2026 (Sfida 4) - 3 indizi
- Maggio 2026 (Sfida 5) - 4 indizi
- Giugno 2026 (Sfida 6) - 3 indizi
- Luglio 2026 (Sfida 7) - 3 indizi
- Agosto 2026 (Sfida 8) - 4 indizi
- Settembre 2026 (Sfida 9) - 3 indizi
- Ottobre 2026 (Sfida 10) - 3 indizi
- Novembre 2026 (Sfida 11) - 4 indizi
- Dicembre 2026 (Sfida 12) - 3 indizi

**OGNI MESE:**
1. Indizi pubblicati automaticamente (sabato 00:00)
2. Immagini sbloccate automaticamente (lunedì 00:00)
3. Sfida attiva l'ultimo sabato del mese
4. Email riepilogo il giorno dopo

---

# FASE 5: POST-SFIDA 12 (28 Dic 2026)

## 📢 Step 5.1: Comunicazione Serata Finale

**QUANDO:** 28 Dicembre 2026
**CANALE:** Email + Post app + Instagram

### Contenuto Email:
```
OGGETTO: 🎊 È quasi finita! Serata Finale 23 Gennaio 2027

Ciao [NOME],

L'ultima sfida è terminata! Ora manca solo il FINALE! 🎉

📅 SERATA FINALE:
• Data: Venerdì 23 Gennaio 2027
• Orario: 20:00 - 01:00
• Luogo: [LOCATION PADOVA]
• Dress code: Elegante

🏆 IN PALIO:
• 1° Classificato: 1.000€
• 2° Classificato: [TBD]
• 3° Classificato: [TBD]

📊 CLASSIFICA ATTUALE:
Controlla la tua posizione nell'app!
Tab 🏆 Classifica

🎁 SORPRESA FINALE:
Durante la serata ci sarà una ULTIMA PROVA
per ribaltare la classifica! Stay tuned...

CONFERMA PRESENZA entro il 10 Gennaio:
👉 [Link form conferma]

Ci vediamo al 23 Gennaio!
[TUO NOME]
```

---

## ✅ Step 5.2: Form Conferma Presenza

**LINK:** Google Form nuovo
**CAMPI:**
- Nome
- Parteciperò: Sì/No
- Porterò accompagnatore: Sì/No
- Nome accompagnatore (se sì)
- Note dietetiche

**DEADLINE:** 10 Gennaio 2027

---

# FASE 6: SERATA FINALE (23 Gen 2027)

## 🎊 Step 6.1: Email Giorno Prima (22 Gen)

```
OGGETTO: 🎉 Domani è la Serata Finale!

Ciao [NOME],

Domani ci vediamo per l'ultima volta!

📍 DOVE:
[Location precisa]
[Indirizzo completo]
Padova

🕗 QUANDO:
Venerdì 23 Gennaio 2027
Ore 20:00 (arrivo dalle 19:45)

🎫 PORTA:
• Documento identità
• Il tuo smartphone con app
• Tanto entusiasmo!

🎯 PROGRAMMA:
20:00 - Aperitivo
20:30 - Cena
22:00 - ULTIMA SFIDA (a sorpresa!)
23:00 - Proclamazione vincitori
23:30 - Premiazione
00:00 - Festeggiamenti

A domani! 🥳
[TUO NOME]
```

---

## 🏆 Step 6.2: Durante la Serata

### A. Aperitivo & Cena (20:00 - 22:00)
- Networking
- Proiezione foto dell'anno
- Video riepilogo sfide

### B. Ultima Sfida (22:00 - 23:00)
**SORPRESA:** Quiz finale con domande sull'anno
- 20 domande
- Chi risponde corretto = punti bonus
- Può cambiare posizioni finali!

### C. Proclamazione (23:00 - 23:30)
**MOMENTO CLOU:**
1. Proietti classifica finale
2. Countdown TOP 3
3. Annunci vincitori
4. Applausi!

### D. Premiazione (23:30 - 00:00)
- 1° posto: Busta con 1.000€
- 2° posto: [TBD]
- 3° posto: [TBD]
- Foto di gruppo
- Brindisi finale

---

## 📧 Step 6.3: Email Post-Finale (24 Gen)

```
OGGETTO: 🏆 Grazie per quest'anno incredibile!

Ciao [NOME],

Ieri sera è stata magica! 🎊

📊 CLASSIFICA FINALE:
[Classifica completa top 10]

📸 FOTO & VIDEO:
[Link Google Drive]

🙏 GRAZIE:
Grazie per aver partecipato a "A Tutto Reality: La Rivoluzione"!
È stato un anno indimenticabile grazie a voi.

🎁 SORPRESA FINALE:
Domani, 24 Gennaio, alle 14:00...
CACCIA ALLA VALIGETTA DI EZEKIEL! 💼

Dettagli alle 12:00 nell'app.

A domani per l'ultimo colpo di scena!
[TUO NOME]
```

---

# FASE 7: CACCIA ALLA VALIGETTA (24 Gen 2027)

## 💼 Step 7.1: Annuncio Caccia (24 Gen - 12:00)

**CANALE:** Notifica push app + Email

```
🚨 ULTIMA AVVENTURA!

Oggi alle 14:00 inizia la CACCIA ALLA VALIGETTA!

📍 Ritrovo: Prato della Valle, Padova
🕑 Orario: 14:00
🎁 Premio: Valigetta di Ezekiel (sorpresa inside!)

REGOLE:
• Prima persona a trovare la valigetta vince
• Indizi pubblicati ogni 30 minuti nell'app
• Vale anche per chi non ha vinto ieri!

Ci vediamo alle 14:00! 🏃‍♂️💨
```

---

## 🗺️ Step 7.2: Meccanica Caccia (14:00 - 18:00)

### Indizio 1 (14:00):
```
"Dove l'acqua riflette il cielo,
e i gradini portano al mistero..."
```

### Indizio 2 (14:30):
```
"Cerca tra le statue antiche,
dove i filosofi sussurrano segreti..."
```

### Indizio 3 (15:00):
```
[Foto con dettaglio specifico]
```

**FINALE:**
- Qualcuno trova valigetta
- Chiama organizzatore
- Verifica posizione
- **VINCITORE!**

---

## 🎁 Step 7.3: Apertura Valigetta (sul posto)

**CONTENUTO VALIGETTA:**
- Lettera di Ezekiel
- Gift card / buono / sorpresa
- Foto ricordo

**VIDEO/FOTO:**
- Cattura il momento
- Posta su Instagram
- Tagga tutti

---

## 📧 Step 7.4: Email Conclusiva (25 Gen)

```
OGGETTO: 🎬 Fine di "A Tutto Reality: La Rivoluzione"

Ciao [NOME],

Ieri si è conclusa ufficialmente la nostra avventura! 🎊

🏆 VINCITORE CACCIA VALIGETTA:
[NOME] ha trovato la valigetta di Ezekiel!

📸 TUTTI I RICORDI:
[Link album completo Google Drive]
• Cerimonia Apertura (11/01/26)
• Le 12 sfide mensili
• Serata Finale (23/01/27)
• Caccia Valigetta (24/01/27)

📊 STATISTICHE FINALI:
• Partecipanti attivi: [XX/52]
• Sfide completate: [XXX]
• Indizi risolti: [XXX]
• Chat messaggi: [XXXX]
• Km percorsi (caccie): [XXX]

🙏 GRAZIE ANCORA:
Questo progetto non sarebbe stato possibile senza di voi.
Grazie per l'energia, la partecipazione e l'amicizia.

🎮 PROSSIMAMENTE:
Stay tuned per future avventure... 😉

Con affetto,
[TUO NOME]

P.S. L'app rimarrà online come ricordo!
```

---

# 📊 RIEPILOGO TOUCHPOINT

## Email/Comunicazioni Necessarie:

| # | QUANDO | TIPO | OGGETTO |
|---|--------|------|---------|
| 1 | Dic 2025 | Email | Prima comunicazione + link form |
| 2 | Post-form | Email | Conferma + codice partecipante |
| 3 | 10 Gen 2026 | Email | Reminder cerimonia domani |
| 4 | 12 Gen 2026 | Email | Grazie + prossimi step |
| 5 | Ogni mese (x12) | Email | Riepilogo sfida + classifica |
| 6 | 28 Dic 2026 | Email | Annuncio serata finale |
| 7 | 22 Gen 2027 | Email | Reminder finale domani |
| 8 | 24 Gen 2027 | Email | Grazie finale + caccia valigetta |
| 9 | 24 Gen 12:00 | Push | Annuncio caccia valigetta |
| 10 | 25 Gen 2027 | Email | Chiusura definitiva |

**TOTALE: 10 comunicazioni principali + 12 email mensili = 22 email**

---

# 🛠️ AUTOMAZIONI NECESSARIE

## Già Implementate: ✅
- Countdown homepage
- Login con codici
- Sistema indizi (pubblicazione sabato 00:00)
- Rivelazione immagini (lunedì 00:00)
- Chat di gruppo
- Classifica live
- Caccia parole cerimonia

## Da Implementare: ⚠️
- [ ] Push notifications (opzionale)
- [ ] Email automatiche post-sfida
- [ ] Backup database automatico
- [ ] Export classifica mensile

## Da Fare Manualmente: 👤
- [ ] Email prima comunicazione
- [ ] Generazione codici partecipanti
- [ ] Popolamento database iniziale
- [ ] Creazione contenuti sfide
- [ ] Creazione immagini indizi (37 totali)
- [ ] Post Instagram Stories
- [ ] Organizzazione eventi fisici
- [ ] Premiazioni

---

# 🎯 CHECKLIST PRE-LANCIO

## Dicembre 2025:

### Contenuti:
- [ ] Definire tutte le 12 sfide (temi, prove, location)
- [ ] Creare 37 immagini indizi
- [ ] Scrivere testi indizi (37 totali)
- [ ] Preparare quiz/mini-giochi

### Comunicazione:
- [ ] Scrivere email prima comunicazione
- [ ] Creare Google Form registrazione
- [ ] Preparare template email conferma
- [ ] Pianificare calendario Instagram Stories

### Tecnico:
- [ ] Caricare tutte immagini in `public/game-clues/`
- [ ] Aggiornare database con image_url
- [ ] Testare sistema indizi
- [ ] Testare rivelazione lunedì
- [ ] Verificare chat funzionante
- [ ] Test mobile responsive

### Eventi:
- [ ] Confermare location Ferimonia Apertura (11 Gen)
- [ ] Booking Fenice Green Energy Park
- [ ] Preparare 10 indizi fisici da nascondere
- [ ] Preparare badge nominativi

---

# 📋 DOMANDE FREQUENTI PARTECIPANTI

**"Devo partecipare a tutte le sfide?"**
→ No, puoi saltarne alcune. Ma zero punti per quelle saltate.

**"Posso recuperare sfide perse?"**
→ No, ogni sfida ha una finestra temporale.

**"Come funzionano gli indizi?"**
→ Pubblicati ogni sabato 00:00. Immagini lunedì 00:00.

**"Posso giocare in gruppo?"**
→ Sì, ma punteggi individuali. Collaborare è ok!

**"Cosa succede se non ho smartphone?"**
→ App funziona anche da PC/tablet.

**"Posso invitare amici?"**
→ No, lista chiusa a 52 partecipanti.

**"Premio è divisibile?"**
→ No, 1.000€ al primo classificato.

**"Posso ritirarmi?"**
→ Sì, ma non puoi rientrare dopo.

---

**DOCUMENTO CREATO:** 5 Dicembre 2025
**PROSSIMO AGGIORNAMENTO:** Dopo definizione tutte le 12 sfide
**RESPONSABILE:** Matteo Zaramella
