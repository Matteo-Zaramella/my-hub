# 🧪 Istruzioni Test Sistema Email

**Server avviato su:** http://localhost:3000
**Status:** ✅ PRONTO PER IL TEST

---

## 🎯 Test 1: Aggiungi Partecipante con Email (CONSIGLIATO)

### Passi da seguire:

1. **Apri il browser** su: http://localhost:3000

2. **Login alla dashboard**
   - Se non sei già loggato, fai login con il tuo account

3. **Vai alla gestione partecipanti**
   - Dashboard → "🎮 Gestione Il Castello di Zara"
   - Oppure direttamente: http://localhost:3000/dashboard/game-management
   - Clicca sul tab "**👥 Partecipanti**"

4. **Aggiungi nuovo partecipante**
   - Clicca pulsante verde "**➕ Aggiungi Partecipante**"
   - Compila il form:
     ```
     Nome: Test Email System
     Email: matteo.zaramella2002@gmail.com
     Categoria: Amici
     ```
   - Clicca "**Aggiungi**"

5. **Verifica conferma**
   - Dovresti vedere un alert:
     ```
     ✅ Partecipante aggiunto!
     Codice: [CODICE-GENERATO]
     📧 Email di conferma inviata a matteo.zaramella2002@gmail.com
     ```

6. **Controlla email**
   - Apri Gmail: https://mail.google.com
   - Cerca email da "My Hub <onboarding@resend.dev>"
   - Verifica che contenga:
     - ✅ Titolo "Iscrizione Confermata"
     - ✅ Nome corretto
     - ✅ Codice partecipante
     - ✅ Design professionale nero/verde

---

## 🔄 Test 2: Reinvia Email a Partecipante Esistente

### Passi da seguire:

1. **Trova un partecipante con email**
   - Nella tabella partecipanti, cerca uno con email compilata
   - Usa la barra di ricerca se necessario

2. **Clicca pulsante reinvio**
   - Sulla riga del partecipante, clicca il pulsante **📧** (verde)
   - Conferma nel dialog popup che appare

3. **Verifica conferma**
   - Dovresti vedere:
     ```
     ✅ Email inviata con successo a [email]!
     ```

4. **Controlla email**
   - Verifica ricezione email con codice partecipante

---

## 📧 Test 3: Email su Diversi Client (Opzionale)

### Testa il rendering su:
- [ ] Gmail (web)
- [ ] Gmail (app mobile)
- [ ] Outlook (web)
- [ ] Apple Mail (se disponibile)

### Verifica:
- [ ] Template si visualizza correttamente
- [ ] Colori corretti (nero/verde)
- [ ] Codice leggibile
- [ ] Link funzionanti (se presenti)

---

## ❌ Se Qualcosa Va Storto

### Errore "Email non inviata"
1. Controlla console browser (F12)
2. Verifica `.env.local` contiene `RESEND_API_KEY`
3. Riavvia server dev:
   ```bash
   # Ferma server (Ctrl+C)
   npm run dev
   ```

### Email non arriva
1. Controlla cartella SPAM
2. Verifica email scritta correttamente
3. Vai su Resend Dashboard: https://resend.com/emails
4. Controlla logs invii

### Errore "Unauthorized"
- API Key non valida
- Verifica in `.env.local`:
  ```
  RESEND_API_KEY=re_5f4xcnLc_99FyTx21GPxox6cY8eE4LVnm
  ```

---

## 📊 Cosa Verificare

### ✅ Checklist Test Completo
- [ ] Server dev avviato (http://localhost:3000)
- [ ] Login alla dashboard funzionante
- [ ] Form aggiungi partecipante visibile
- [ ] Nuovo partecipante creato con successo
- [ ] Alert conferma invio email mostrato
- [ ] Email ricevuta su Gmail
- [ ] Template email corretto e leggibile
- [ ] Codice partecipante visibile nell'email
- [ ] Pulsante 📧 visibile sui partecipanti con email
- [ ] Reinvio email funzionante

---

## 🎉 Risultato Atteso

Se tutto funziona, dovresti:

1. ✅ Vedere il nuovo partecipante nella tabella
2. ✅ Ricevere email su Gmail
3. ✅ Vedere email professionale con codice
4. ✅ Poter reinviare email con pulsante 📧

---

## 📸 Screenshot da Fare (Opzionale)

Se vuoi documentare:
1. Alert conferma invio
2. Partecipante aggiunto in tabella
3. Email ricevuta su Gmail
4. Template email completo

---

## 🚀 Dopo il Test

Se tutto funziona:
- ✅ Sistema email è PRODUCTION READY
- ✅ Puoi iniziare ad aggiungere partecipanti reali
- ✅ Email verranno inviate automaticamente

Se ci sono problemi:
- Annota errore specifico
- Controlla console browser
- Verifica logs Resend Dashboard

---

**Pronto?** Inizia con **Test 1** e seguimi passo-passo! 🚀
