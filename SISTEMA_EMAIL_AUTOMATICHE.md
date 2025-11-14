# 📧 Sistema Email Automatiche - The Game

**Priorità:** 🔴 ALTA
**Beneficio:** Eliminazione cartoncini fisici + Onboarding automatico
**Tempo stimato:** 3-4 ore implementazione

---

## 🎯 Obiettivo

Implementare un sistema di email automatiche per inviare il codice partecipante e le istruzioni del gioco immediatamente dopo l'iscrizione, eliminando la necessità di cartoncini fisici.

---

## ✨ Vantaggi

### Eliminazione Cartoncini Fisici
- ✅ Nessun costo di stampa
- ✅ Nessun rischio di perdita/danneggiamento
- ✅ Distribuzione immediata (no logistica)
- ✅ Eco-friendly

### Automazione Comunicazioni
- ✅ Invio istantaneo alla registrazione
- ✅ Email sempre disponibile (re-invio facile)
- ✅ Tracking aperture/click
- ✅ Scalabile per nuovi partecipanti

### Comunicazioni Future
- ✅ Notifiche nuovi indizi (ogni sabato)
- ✅ Reminder sfide mensili
- ✅ Annunci importanti
- ✅ Classifica aggiornata (dopo 6 mesi)

---

## 📧 Servizi Email Consigliati

### Opzione A: Resend (🏆 Consigliato)
**Pro:**
- 100 email/giorno GRATIS
- API semplicissima
- React Email templates
- Delivery rate altissimo
- Dashboard analytics
- Ottimo per Next.js

**Contro:**
- Piano gratuito limitato (100/giorno)

**Costo:**
- Free: 100 email/giorno, 3.000/mese
- Pro: $20/mese per 50.000 email

**Setup:** 10 minuti

**Link:** https://resend.com

---

### Opzione B: SendGrid
**Pro:**
- 100 email/giorno GRATIS permanente
- Affidabile
- Analytics complete
- Template builder

**Contro:**
- Setup più complesso
- UI meno moderna

**Costo:**
- Free: 100 email/giorno
- Essentials: $19.95/mese per 50.000 email

---

### Opzione C: Mailgun
**Pro:**
- 1.000 email/mese GRATIS primi 3 mesi
- Potente API
- Validazione email

**Contro:**
- Dopo 3 mesi: $35/mese

---

## 🚀 Implementazione con Resend

### 1. Setup Resend (10 min)

```bash
# Installa package
npm install resend

# Crea account su https://resend.com
# Ottieni API key
# Aggiungi a .env.local
```

`.env.local`:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
```

---

### 2. Configurazione Email Template

**File:** `lib/email-templates/welcome-email.tsx`

```tsx
import * as React from 'react'

interface WelcomeEmailProps {
  participantName: string
  participantCode: string
  category: string
  ceremonyDate: string
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  participantName,
  participantCode,
  category,
  ceremonyDate
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '600px' }}>
    <h1 style={{ color: '#2563eb' }}>🎮 Benvenuto in The Game!</h1>

    <p>Ciao <strong>{participantName}</strong>,</p>

    <p>Sei stato registrato con successo a <strong>The Game</strong>!</p>

    <div style={{
      backgroundColor: '#f3f4f6',
      padding: '20px',
      borderRadius: '8px',
      margin: '20px 0'
    }}>
      <h2 style={{ margin: '0 0 10px 0' }}>Il tuo codice partecipante:</h2>
      <p style={{
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#2563eb',
        letterSpacing: '4px',
        margin: '10px 0'
      }}>
        {participantCode}
      </p>
      <p style={{ fontSize: '14px', color: '#6b7280' }}>
        Categoria: <strong>{category}</strong>
      </p>
    </div>

    <h3>📅 Prossimi Passi:</h3>
    <ol>
      <li>Salva questo codice - ti servirà per accedere</li>
      <li>Partecipa alla cerimonia di apertura: <strong>{ceremonyDate}</strong></li>
      <li>Accedi all'area gioco con il tuo codice</li>
    </ol>

    <div style={{
      backgroundColor: '#dbeafe',
      padding: '15px',
      borderRadius: '8px',
      margin: '20px 0'
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>🎯 Come Funziona:</h3>
      <ul style={{ margin: '0', paddingLeft: '20px' }}>
        <li>12 sfide mensili da Febbraio 2026 a Gennaio 2027</li>
        <li>Indizi rivelati ogni sabato</li>
        <li>Chat di gruppo dal 26/01/2026</li>
        <li>Premio finale: <strong>1.000€</strong></li>
      </ul>
    </div>

    <p>
      <a
        href="https://matteozaramella.com/game/area"
        style={{
          display: 'inline-block',
          backgroundColor: '#2563eb',
          color: 'white',
          padding: '12px 24px',
          textDecoration: 'none',
          borderRadius: '6px',
          fontWeight: 'bold'
        }}
      >
        Accedi all'Area Gioco
      </a>
    </p>

    <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

    <p style={{ fontSize: '12px', color: '#6b7280' }}>
      Per qualsiasi domanda, rispondi a questa email.<br />
      Ci vediamo alla cerimonia! 🎉
    </p>
  </div>
)

export default WelcomeEmail
```

---

### 3. API Route per Invio Email

**File:** `app/api/send-welcome-email/route.ts`

```typescript
import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { WelcomeEmail } from '@/lib/email-templates/welcome-email'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email, participantName, participantCode, category } = await request.json()

    const { data, error } = await resend.emails.send({
      from: 'The Game <noreply@matteozaramella.com>',
      to: [email],
      subject: `🎮 Il tuo codice per The Game: ${participantCode}`,
      react: WelcomeEmail({
        participantName,
        participantCode,
        category,
        ceremonyDate: '24 Gennaio 2026'
      })
    })

    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
```

---

### 4. Integrazione con Form Registrazione

**Aggiornare:** `app/register/page.tsx` o Form di aggiunta partecipante

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)

  const supabase = createClient()

  // 1. Genera codice partecipante
  const participantCode = generateCode() // funzione da creare

  // 2. Inserisci nel database
  const { data: participant, error } = await supabase
    .from('game_participants')
    .insert({
      participant_name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone_number: formData.phone,
      instagram_handle: formData.instagram,
      participant_code: participantCode,
      category: formData.category || 'Amici'
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating participant:', error)
    setLoading(false)
    return
  }

  // 3. Invia email automatica con codice
  const emailResponse = await fetch('/api/send-welcome-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: formData.email,
      participantName: `${formData.firstName} ${formData.lastName}`,
      participantCode: participantCode,
      category: formData.category || 'Amici'
    })
  })

  if (emailResponse.ok) {
    setSuccess(true)
    // Mostra messaggio: "Controlla la tua email!"
  }

  setLoading(false)
}
```

---

### 5. Funzione Generazione Codice

**File:** `lib/utils/generate-code.ts`

```typescript
export function generateParticipantCode(name: string): string {
  // Genera codice tipo: AB12XY
  const initials = name
    .split(' ')
    .map(word => word[0]?.toUpperCase() || '')
    .join('')
    .slice(0, 2)

  const numbers = Math.floor(Math.random() * 100).toString().padStart(2, '0')

  const letters = String.fromCharCode(
    65 + Math.floor(Math.random() * 26), // A-Z
    65 + Math.floor(Math.random() * 26)  // A-Z
  )

  return `${initials}${numbers}${letters}`
}

// Esempio: "Mario Rossi" → "MR47XK"
```

---

## 📧 Template Email Aggiuntivi

### 2. Email Reminder Sfida

```typescript
export const ChallengeReminderEmail = ({
  participantName,
  challengeMonth,
  challengeDate,
  daysRemaining
}) => (
  <div>
    <h1>🎯 Sfida {challengeMonth} in arrivo!</h1>
    <p>Ciao {participantName},</p>
    <p>
      La prossima sfida si terrà il <strong>{challengeDate}</strong>.
    </p>
    <p>
      Mancano solo <strong>{daysRemaining} giorni</strong>!
    </p>
    {/* ... */}
  </div>
)
```

### 3. Email Nuovo Indizio

```typescript
export const NewClueEmail = ({
  participantName,
  clueNumber,
  clueText,
  totalClues
}) => (
  <div>
    <h1>🔍 Nuovo Indizio Rivelato!</h1>
    <p>Ciao {participantName},</p>
    <p>
      L'indizio <strong>{clueNumber}/{totalClues}</strong> è stato rivelato:
    </p>
    <blockquote>{clueText}</blockquote>
    {/* ... */}
  </div>
)
```

### 4. Email Classifica (dopo 6 mesi)

```typescript
export const LeaderboardEmail = ({
  participantName,
  currentPosition,
  currentPoints,
  topPlayer
}) => (
  <div>
    <h1>📊 Classifica Aggiornata!</h1>
    <p>Ciao {participantName},</p>
    <p>
      Sei al <strong>{currentPosition}° posto</strong> con <strong>{currentPoints} punti</strong>.
    </p>
    {/* ... */}
  </div>
)
```

---

## 🤖 Automazioni da Implementare

### A. Email Registrazione (Immediata)
- ✅ Invio codice partecipante
- ✅ Istruzioni accesso
- ✅ Info cerimonia apertura

### B. Email Reminder Cerimonia (1 settimana prima)
- ⏰ Schedulata: 17/01/2026
- Info location
- Orario e dettagli

### C. Email Nuovi Indizi (Ogni Sabato 00:01)
- ⏰ Schedulata: Ogni sabato
- Indizio rivelato
- Link area gioco

### D. Email Reminder Sfida (2 giorni prima)
- ⏰ 2 giorni prima di ogni sfida
- Dettagli sfida
- Location/istruzioni

### E. Email Classifica (Una tantum)
- ⏰ Schedulata: 26/07/2026
- Posizione attuale
- Top 10
- Statistiche

---

## ⚙️ Cron Jobs / Scheduled Tasks

Per automazioni periodiche, usa **Vercel Cron Jobs**:

**File:** `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/send-weekly-clue",
      "schedule": "0 0 * * 6"
    },
    {
      "path": "/api/cron/send-challenge-reminders",
      "schedule": "0 9 * * *"
    }
  ]
}
```

**File:** `app/api/cron/send-weekly-clue/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

export async function GET(request: Request) {
  // Verifica autorizzazione Vercel Cron
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient()
  const resend = new Resend(process.env.RESEND_API_KEY)

  // 1. Trova indizio da rivelare oggi
  const today = new Date().toISOString().split('T')[0]

  const { data: clue } = await supabase
    .from('game_clues')
    .select('*')
    .eq('reveal_date', today)
    .single()

  if (!clue) {
    return NextResponse.json({ message: 'No clue for today' })
  }

  // 2. Ottieni tutti i partecipanti con email
  const { data: participants } = await supabase
    .from('game_participants')
    .select('email, participant_name')
    .not('email', 'is', null)

  // 3. Invia email a tutti
  const emailPromises = participants.map(p =>
    resend.emails.send({
      from: 'The Game <noreply@matteozaramella.com>',
      to: p.email,
      subject: `🔍 Nuovo Indizio Rivelato - The Game`,
      react: NewClueEmail({
        participantName: p.participant_name,
        clueNumber: clue.clue_order,
        clueText: clue.clue_text,
        totalClues: 40
      })
    })
  )

  await Promise.all(emailPromises)

  return NextResponse.json({
    success: true,
    sentTo: participants.length
  })
}
```

---

## 📊 Dashboard Email Analytics

Traccia aperture e click via Resend Dashboard:
- Email inviate
- Tasso apertura
- Click sui link
- Bounce rate
- Spam reports

---

## 💰 Costi Stimati

### Per 52 Partecipanti

**Email registrazione:** 52 (una tantum)
**Email weekly indizi:** 52 × 40 settimane = 2.080
**Email reminder sfide:** 52 × 12 = 624
**Email varie:** ~500

**Totale annuale:** ~3.250 email

**Costo con Resend Free:** €0 (sotto 3.000/mese)
**Costo con Resend Pro:** €20/mese solo se superi limiti

---

## 🔐 Security & Best Practices

### 1. Validazione Email
```typescript
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
```

### 2. Rate Limiting
- Max 1 email per utente al giorno
- Max 100 email/ora totali

### 3. Unsubscribe
- Aggiungi link "Disiscriviti" in footer
- Salva preferenze in database

### 4. SPF/DKIM/DMARC
- Configura DNS per Resend domain
- Migliora deliverability

---

## ✅ Checklist Implementazione

### Setup Iniziale
- [ ] Crea account Resend
- [ ] Ottieni API key
- [ ] Configura DNS (se dominio custom)
- [ ] Installa package `resend`
- [ ] Aggiungi variabili ambiente

### Template Email
- [ ] Crea template welcome email
- [ ] Crea template reminder sfida
- [ ] Crea template nuovo indizio
- [ ] Crea template classifica
- [ ] Test rendering template

### API Routes
- [ ] Crea `/api/send-welcome-email`
- [ ] Crea `/api/cron/send-weekly-clue`
- [ ] Crea `/api/cron/send-challenge-reminders`
- [ ] Testa API con Postman

### Integrazione
- [ ] Aggiorna form registrazione
- [ ] Aggiorna form aggiunta partecipante (dashboard)
- [ ] Trigger email al submit
- [ ] Mostra conferma invio

### Testing
- [ ] Test con email personale
- [ ] Verifica template su Gmail
- [ ] Verifica template su Outlook
- [ ] Check spam folder
- [ ] Test link funzionanti

### Production
- [ ] Deploy su Vercel
- [ ] Configura Cron Jobs
- [ ] Monitor email analytics
- [ ] Setup alerting errori

---

## 🎯 Risultato Finale

### Flusso Partecipante

1. Compila form registrazione
2. **Riceve email immediata** con codice
3. Salva codice nella email (sempre accessibile)
4. Accede all'area gioco
5. **Riceve email ogni sabato** con nuovi indizi
6. **Riceve reminder** 2 giorni prima delle sfide
7. Nessun cartoncino fisico necessario! 🎉

---

**💡 Prossimo step:** Implementare prima email registrazione, poi aggiungere automazioni gradualmente.

---

*File creato: 12 Novembre 2025*
*Tempo implementazione stimato: 3-4 ore*
