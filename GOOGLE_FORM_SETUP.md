# 📋 Setup Google Form - Raccolta Dati Partecipanti "Il Castello di Zara"

**Data creazione:** 19 Novembre 2025
**Scadenza raccolta:** 15 Gennaio 2026
**Partecipanti target:** 52 totali (13 prioritari senza contatti)

---

## 🎯 Obiettivo

Raccogliere email, telefono e Instagram di tutti i 52 partecipanti per:
- Confermare partecipazione al gioco
- Avere canali di comunicazione completi
- Aggiornare database Supabase

---

## 📝 Struttura Google Form

### Setup Iniziale
1. Vai su https://forms.google.com
2. Clicca "+ Nuovo" (Plus icon)
3. Titolo form: **"Il Castello di Zara - Conferma Partecipazione"**
4. Descrizione:
   ```
   Benvenuto a Il Castello di Zara! 🎮

   Sei stato invitato a partecipare al gioco interattivo della durata di un anno (24/01/2026 - 24/01/2027).

   Per confermare la tua partecipazione e ricevere il codice di accesso personale, compila questo modulo con i tuoi dati.

   ⏰ Scadenza: 15 Gennaio 2026
   🎯 Cerimonia apertura: 24 Gennaio 2026 ore 22:00
   📍 Location: Oste Divino, Caselle di Selvazzano (PD)
   ```

---

## 📋 Domande del Form

### Domanda 1: Nome *
- **Tipo:** Risposta breve
- **Obbligatoria:** ✅ Sì
- **Validazione:** Lunghezza minima 2 caratteri
- **Descrizione:** "Il tuo nome (es: Mario)"

### Domanda 2: Cognome *
- **Tipo:** Risposta breve
- **Obbligatoria:** ✅ Sì
- **Validazione:** Lunghezza minima 2 caratteri
- **Descrizione:** "Il tuo cognome (es: Rossi)"

### Domanda 3: Email *
- **Tipo:** Risposta breve
- **Obbligatoria:** ✅ Sì
- **Validazione:** Indirizzo email
- **Descrizione:** "Email principale per comunicazioni sul gioco"

### Domanda 4: Numero di Telefono
- **Tipo:** Risposta breve
- **Obbligatoria:** ❌ No (opzionale ma consigliato)
- **Validazione:** Numero (opzionale)
- **Descrizione:** "Numero di telefono (utile per comunicazioni urgenti)"
- **Esempio:** "+39 345 1234567"

### Domanda 5: Instagram Handle
- **Tipo:** Risposta breve
- **Obbligatoria:** ❌ No (opzionale)
- **Validazione:** Nessuna
- **Descrizione:** "Il tuo username Instagram (senza @)"
- **Esempio:** "mario.rossi"

### Domanda 6: Conferma Partecipazione *
- **Tipo:** Scelta multipla (obbligatoria)
- **Obbligatoria:** ✅ Sì
- **Opzioni:**
  - ✅ Confermo la mia partecipazione a Il Castello di Zara
  - ❌ Non posso partecipare
- **Descrizione:** "Confermando accetti di partecipare al gioco della durata di un anno"

### Domanda 7: Privacy *
- **Tipo:** Caselle di controllo
- **Obbligatoria:** ✅ Sì (almeno 1 opzione)
- **Opzioni:**
  - ☑️ Acconsento al trattamento dei miei dati per la gestione del gioco *
  - ☐ Acconsento a ricevere comunicazioni promozionali (opzionale)
- **Descrizione:**
  ```
  I tuoi dati saranno utilizzati esclusivamente per:
  - Gestione del gioco e comunicazioni relative
  - Invio codice di accesso personale
  - Notifiche su sfide ed eventi

  Potrai richiedere la cancellazione dei dati in qualsiasi momento.
  ```

### Domanda 8: Note/Preferenze (Opzionale)
- **Tipo:** Paragrafo
- **Obbligatoria:** ❌ No
- **Descrizione:** "Eventuali note, preferenze alimentari per eventi, o messaggi per gli organizzatori"

---

## ⚙️ Impostazioni Form

### Impostazioni Generali
1. Clicca sull'icona ⚙️ (Impostazioni) in alto a destra
2. **Generale:**
   - ✅ Raccogli indirizzi email
   - ❌ Limita a 1 risposta (non selezionare, permettere modifiche)
   - ✅ Consenti di modificare dopo l'invio
3. **Presentazione:**
   - ✅ Mostra barra di avanzamento
   - ✅ Mescola domande: NO
   - Messaggio conferma:
     ```
     🎉 Grazie per la conferma!

     Riceverai il tuo codice di accesso personale via email entro il 20 Gennaio 2026.

     📅 Segna sul calendario:
     - 24/01/2026 ore 22:00: Cerimonia di apertura
     - Location: Oste Divino, Via Pelosa 50, Caselle di Selvazzano (PD)

     Ci vediamo lì! 🎮
     ```
4. **Quiz:**
   - ❌ Non trasformare in quiz

### Tema e Design
1. Clicca sull'icona 🎨 (Personalizza tema)
2. **Colore intestazione:** Verde scuro (#1a4d2e) - tema Il Castello di Zara
3. **Stile sfondo:** Bianco/grigio chiaro
4. **Stile testo:** Roboto/Arial

---

## 📧 Condivisione Form

### Ottieni Link
1. Clicca "Invia" in alto a destra
2. Seleziona tab 🔗 (Link)
3. ✅ Seleziona "Abbrevia URL"
4. Copia il link (formato: https://forms.gle/XXXXXXX)

### Salva Link
Salva il link in un posto sicuro:
- Nel file `.env.local` (se necessario)
- In un documento condiviso
- Nella email template sotto

---

## 📨 Email Template per Invio

**Oggetto:** 🎮 Il Castello di Zara - Conferma la tua partecipazione entro il 15/01

```html
Ciao [NOME],

Sei tra i 52 partecipanti selezionati per "Il Castello di Zara", il gioco interattivo della durata di un anno!

🎯 COSA TI ASPETTA:
- 12 sfide mensili dal Febbraio 2026 a Gennaio 2027
- Indizi settimanali da scoprire
- Classifica e punteggi
- Premio finale: 1.000€
- Evento finale con caccia al tesoro

📅 DATE IMPORTANTI:
- Cerimonia apertura: 24 Gennaio 2026, ore 22:00
- Location: Oste Divino, Via Pelosa 50, Caselle di Selvazzano (PD)
- Fine gioco: 24 Gennaio 2027

✅ PROSSIMI PASSI:
1. Compila questo form per confermare la partecipazione:
   👉 [INSERISCI LINK GOOGLE FORM]

2. Riceverai via email il tuo codice di accesso personale
   entro il 20 Gennaio 2026

3. Usa il codice per accedere alla piattaforma di gioco:
   https://my-hub-chi.vercel.app

⏰ SCADENZA: 15 Gennaio 2026

Per qualsiasi domanda o dubbio, rispondi a questa email.

Ci vediamo il 24 Gennaio! 🎮

Matteo Zaramella
Organizzatore Il Castello di Zara
```

---

## 📊 Monitoraggio Risposte

### Accesso Risposte
1. Apri il form da Google Forms
2. Clicca sul tab "Risposte"
3. Visualizza:
   - Numero risposte totali
   - Grafici per domanda
   - Risposte individuali

### Export in Excel/Sheets
1. Tab "Risposte"
2. Clicca icona Excel (verde) oppure
3. Clicca sui 3 puntini → "Seleziona destinazione delle risposte"
4. Scegli:
   - **Nuovo foglio di calcolo** oppure
   - **Foglio di calcolo esistente**
5. Nome foglio: "Il Castello di Zara - Risposte Partecipanti"

Le risposte si aggiorneranno in tempo reale nel foglio Google Sheets!

---

## 📋 Tracking List - 13 Partecipanti Prioritari

Questi partecipanti NON hanno contatti completi - priorità ALTA:

| # | Nome Completo | Email | Telefono | Instagram | Status |
|---|---------------|-------|----------|-----------|--------|
| 1 | Anna Maggi | ⏳ | ⏳ | ⏳ | Da contattare |
| 2 | Carola Pagnin | ⏳ | ⏳ | ⏳ | Da contattare |
| 3 | Davide Boscolo | ⏳ | ⏳ | ⏳ | Da contattare |
| 4 | Enrico Geron | ⏳ | ⏳ | ⏳ | Da contattare |
| 5 | Enrico Maragno | ⏳ | ⏳ | ⏳ | Da contattare |
| 6 | Francesca Colombin | ⏳ | ⏳ | ⏳ | Da contattare |
| 7 | Francesca Gasparin | ⏳ | ⏳ | ⏳ | Da contattare |
| 8 | Francesco Marsilio | ⏳ | ⏳ | ⏳ | Da contattare |
| 9 | Gabriele Zambon | ⏳ | ⏳ | ⏳ | Da contattare |
| 10 | Giulia | ⏳ | ⏳ | ⏳ | Da contattare |
| 11 | Ippolito Lavorati | ⏳ | ⏳ | ⏳ | Da contattare |
| 12 | Marta Geron | ⏳ | ⏳ | ⏳ | Da contattare |
| 13 | Roberto Pietrantonj | ⏳ | ⏳ | ⏳ | Da contattare |

**Come contattarli:**
- Se hai loro email personali: invia email diretta
- Se hai contatti social: DM su Instagram/Facebook
- Se hai loro numero: messaggio WhatsApp
- Come ultima opzione: chiedi ad amici in comune

---

## 📈 Obiettivi di Raccolta

### Target Minimo
- ✅ 100% partecipanti fornisce email (52/52)
- ✅ 90% partecipanti fornisce telefono (47/52)
- ✅ 70% partecipanti fornisce Instagram (37/52)
- ✅ 100% conferma partecipazione (52/52)

### Milestone
- **25 Novembre:** Almeno 20 risposte (38%)
- **1 Dicembre:** Almeno 35 risposte (67%)
- **15 Dicembre:** Almeno 45 risposte (86%)
- **15 Gennaio:** 52 risposte (100%) ✅

---

## 🔄 Piano di Follow-up

### Timeline Email
1. **19/11 (oggi):** Invio email iniziale a tutti i 52
2. **26/11 (+7 giorni):** Primo reminder a chi non ha risposto
3. **10/12 (+21 giorni):** Secondo reminder
4. **27/12 (+38 giorni):** Reminder finale urgente
5. **10/01 (+52 giorni):** Ultimo appello (5 giorni prima scadenza)

### Template Reminder
```
Oggetto: ⏰ Reminder: Conferma partecipazione a Il Castello di Zara

Ciao [NOME],

Ti ricordo che mancano solo [X] giorni alla scadenza per confermare
la tua partecipazione a Il Castello di Zara!

Se hai già compilato il form, ignora questo messaggio.

Altrimenti, bastano 2 minuti:
👉 [LINK FORM]

Scadenza: 15 Gennaio 2026

Grazie!
Matteo
```

---

## 📥 Import Dati in Supabase

### Dopo Raccolta Completa (16/01/2026)

1. **Export da Google Sheets:**
   - Vai sul foglio risposte collegato
   - File → Scarica → CSV (.csv)

2. **Pulisci dati:**
   - Rimuovi intestazioni se necessario
   - Verifica formati email/telefono
   - Rimuovi duplicati

3. **Import in Supabase:**

Opzione A - SQL Import:
```sql
-- Aggiorna email e contatti partecipanti esistenti
UPDATE game_participants
SET
  email = '[EMAIL_DA_FORM]',
  phone_number = '[TELEFONO_DA_FORM]',
  instagram_handle = '[INSTAGRAM_DA_FORM]'
WHERE name = '[NOME_COGNOME_DA_FORM]';
```

Opzione B - Script Node.js:
Creare uno script che legge il CSV e aggiorna il database automaticamente.

4. **Verifica:**
```sql
-- Controlla quanti partecipanti hanno email
SELECT COUNT(*) FROM game_participants WHERE email IS NOT NULL;

-- Controlla partecipanti senza contatti
SELECT name, email, phone_number, instagram_handle
FROM game_participants
WHERE email IS NULL OR phone_number IS NULL;
```

---

## ✅ Checklist Completa

### Setup Form (oggi - 30 min)
- [ ] Creare Google Form con 8 domande
- [ ] Configurare impostazioni e validazioni
- [ ] Personalizzare tema (verde Il Castello di Zara)
- [ ] Testare form con dati fake
- [ ] Ottenere link abbreviato
- [ ] Salvare link in sicurezza

### Invio Email (oggi - 1 ora)
- [ ] Preparare lista 52 email partecipanti
- [ ] Personalizzare email template con link form
- [ ] Inviare email a tutti i 52 partecipanti
- [ ] Verificare email non rimbalzate
- [ ] Creare calendario reminder

### Monitoraggio (continuo)
- [ ] Controllare risposte quotidianamente
- [ ] Aggiornare tracking list
- [ ] Inviare reminder settimanali
- [ ] Contattare individualmente chi non risponde

### Import Finale (16/01/2026)
- [ ] Export CSV da Google Sheets
- [ ] Pulire e validare dati
- [ ] Import in database Supabase
- [ ] Verificare tutti i dati
- [ ] Inviare codici accesso via email

---

## 🆘 Troubleshooting

### "Non ricevo risposte"
- Controlla spam delle email inviate
- Verifica link form funzionante
- Prova a condividere via WhatsApp/social
- Contatta personalmente i partecipanti

### "Risposte duplicate"
- Google Forms permette modifiche
- L'ultima risposta sovrascrive le precedenti
- Scarica CSV con timestamp per tracking

### "Dati incompleti"
- Campi opzionali possono essere vuoti
- Contatta direttamente per completare
- Usa reminder mirati

---

## 📱 Condivisione Alternativa

Oltre all'email, condividi il form anche via:

1. **WhatsApp:** Messaggio diretto o gruppo
2. **Instagram:** Storia o DM
3. **Facebook:** Post o messaggio
4. **SMS:** Per chi non usa email

---

**Link Form:** [INSERIRE DOPO CREAZIONE]

**Google Sheets Risposte:** [INSERIRE DOPO CREAZIONE]

---

*Documento creato: 19 Novembre 2025*
*Scadenza raccolta: 15 Gennaio 2026*
*Responsabile: Matteo Zaramella*
