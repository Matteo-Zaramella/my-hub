# 🤖 Cron Jobs vs Zapier - Guida Decisione

## TL;DR - Scelta Consigliata

**Per Il Castello di Zara: USA VERCEL CRON JOBS** ✅

- Gratis
- Già integrato
- Più controllo
- Nessun limite

---

## Confronto Dettagliato

### 📊 Tabella Comparativa

| Caratteristica | Vercel Cron Jobs | Zapier |
|----------------|------------------|--------|
| **Costo** | Gratis | $20-30/mese per piano necessario |
| **Limite task** | Illimitato | 100/mese (free), 750/mese ($20) |
| **Setup** | 5-10 min codice | 2-3 min no-code |
| **Manutenzione** | Nessuna | Nessuna |
| **Affidabilità** | 99.9% | 99.9% |
| **Controllo** | Totale | Limitato UI |
| **Il Castello di Zara needs** | ✅ Perfetto | ❌ Troppo costoso |

---

## 🎯 Esigenze Il Castello di Zara

### Automazioni Necessarie

1. **Indizi Settimanali** (40 settimane)
   - Ogni sabato 00:00
   - Email a 52 partecipanti
   - = 52 email × 40 sabati = **2.080 email**

2. **Reminder Sfide** (12 sfide)
   - 2 giorni prima di ogni sfida
   - Email a 52 partecipanti
   - = 52 email × 12 sfide = **624 email**

3. **Email Cerimonia**
   - 1 settimana prima (24/01/2026)
   - Email a 52 partecipanti
   - = **52 email**

**Totale email annuali: ~2.750**

### Con Zapier
- Piano Free: 100 task/mese = **NON SUFFICIENTE**
- Piano Starter ($20/mese): 750 task/mese = **NON SUFFICIENTE**
- Piano Professional ($50/mese): 2.000 task/mese = **SUFFICIENTE MA COSTOSO**
- **Costo annuale: $600**

### Con Vercel Cron
- Illimitato
- **Costo annuale: $0**

---

## 💻 Come Funziona Vercel Cron

### Esempio Pratico: Invio Indizio Settimanale

#### 1. Crea File API Route
**File:** `app/api/cron/send-weekly-clue/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

// Questa funzione viene chiamata AUTOMATICAMENTE ogni sabato alle 00:00
export async function GET(request: Request) {
  // 1. Verifica che la chiamata venga da Vercel Cron (sicurezza)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()
  const resend = new Resend(process.env.RESEND_API_KEY)

  // 2. Trova l'indizio da rivelare oggi
  const today = new Date().toISOString().split('T')[0]

  const { data: clue } = await supabase
    .from('game_clues')
    .select('*')
    .eq('reveal_date', today)
    .single()

  if (!clue) {
    return NextResponse.json({ message: 'Nessun indizio per oggi' })
  }

  // 3. Prendi tutti i partecipanti con email
  const { data: participants } = await supabase
    .from('game_participants')
    .select('email, participant_name')
    .not('email', 'is', null)

  // 4. Invia email a tutti (52 partecipanti)
  for (const p of participants) {
    await resend.emails.send({
      from: 'Il Castello di Zara <game@matteozaramella.com>',
      to: p.email,
      subject: '🔍 Nuovo Indizio Rivelato!',
      html: `
        <h1>Ciao ${p.participant_name}!</h1>
        <p>Un nuovo indizio è stato rivelato:</p>
        <blockquote>${clue.clue_text}</blockquote>
        <a href="https://matteozaramella.com/game/area">Vai all'area gioco</a>
      `
    })
  }

  return NextResponse.json({
    success: true,
    sentTo: participants.length
  })
}
```

#### 2. Configura Schedule
**File:** `vercel.json` (nella root del progetto)

```json
{
  "crons": [
    {
      "path": "/api/cron/send-weekly-clue",
      "schedule": "0 0 * * 6"
    }
  ]
}
```

**Spiegazione schedule:**
- `0 0 * * 6` = Ogni sabato alle 00:00
- Formato: `minuto ora giorno mese giorno-settimana`

#### 3. Aggiungi Secret Key
Nel file `.env.local`:
```env
CRON_SECRET=tuo-segreto-random-qui-abc123xyz
```

**Done!** Vercel eseguirà automaticamente questa funzione ogni sabato. ✅

---

## 🎮 Esempio Completo: Reminder Sfida

**File:** `app/api/cron/send-challenge-reminder/route.ts`

```typescript
export async function GET(request: Request) {
  // Verifica autorizzazione
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()
  const resend = new Resend(process.env.RESEND_API_KEY)

  // Trova sfide nei prossimi 2 giorni
  const twoDaysFromNow = new Date()
  twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2)

  const { data: challenges } = await supabase
    .from('game_challenges')
    .select('*')
    .eq('challenge_date', twoDaysFromNow.toISOString().split('T')[0])

  if (!challenges?.length) {
    return NextResponse.json({ message: 'Nessuna sfida imminente' })
  }

  // Invia reminder a tutti
  const { data: participants } = await supabase
    .from('game_participants')
    .select('email, participant_name')
    .not('email', 'is', null)

  for (const challenge of challenges) {
    for (const p of participants) {
      await resend.emails.send({
        from: 'Il Castello di Zara <game@matteozaramella.com>',
        to: p.email,
        subject: `🎯 Sfida ${challenge.challenge_month} tra 2 giorni!`,
        html: `
          <h1>Ciao ${p.participant_name}!</h1>
          <p>La sfida di <strong>${challenge.challenge_month}</strong> si terrà tra 2 giorni!</p>
          <p>Data: <strong>${challenge.challenge_date}</strong></p>
          <p>Location: <strong>${challenge.challenge_location || 'TBD'}</strong></p>
          <a href="https://matteozaramella.com/game/area">Vedi dettagli</a>
        `
      })
    }
  }

  return NextResponse.json({ success: true })
}
```

**Schedule:** `0 9 * * *` = Ogni giorno alle 09:00 (controlla se c'è sfida tra 2 giorni)

---

## 🆚 Quando Usare Zapier?

Zapier è ottimo quando:
- ❌ Non vuoi scrivere codice
- ✅ Hai budget ($50/mese)
- ✅ Serve integrare con servizi esterni (es. Google Sheets, Slack)
- ✅ Task semplici e sporadici (<100/mese)

**Per Il Castello di Zara:** Non conviene. Troppo costoso per le nostre esigenze.

---

## 📋 Implementazione Raccomandata

### Fase 1: Setup Base (ORA)
1. ✅ **FATTO**: Sistema email funzionante
2. [ ] Crea file `vercel.json`
3. [ ] Aggiungi `CRON_SECRET` a `.env.local`

### Fase 2: Cron Indizi (Dicembre 2025)
1. [ ] Crea `/api/cron/send-weekly-clue/route.ts`
2. [ ] Configura schedule in `vercel.json`
3. [ ] Test manuale prima del deploy
4. [ ] Deploy su Vercel
5. [ ] Monitor primo sabato (01/02/2026)

### Fase 3: Cron Reminder (Dicembre 2025)
1. [ ] Crea `/api/cron/send-challenge-reminder/route.ts`
2. [ ] Configura schedule giornaliero
3. [ ] Test manuale
4. [ ] Deploy

---

## 🧪 Come Testare Cron Localmente

Non puoi testare il timing, ma puoi testare la logica:

```bash
# Chiama manualmente l'endpoint
curl http://localhost:3000/api/cron/send-weekly-clue \
  -H "Authorization: Bearer tuo-cron-secret"
```

Oppure apri nel browser:
```
http://localhost:3000/api/cron/send-weekly-clue
```

---

## 💰 Calcolo Risparmio

| Servizio | Costo Annuale |
|----------|---------------|
| Vercel Cron | **€0** |
| Zapier Professional | **€550** |
| **Risparmio** | **€550** |

---

## ✅ Conclusione

**Per Il Castello di Zara:**
- ✅ Usa Vercel Cron Jobs
- ✅ Gratis, affidabile, scalabile
- ✅ Controllo totale
- ❌ Non serve Zapier

**Implementazione:**
1. Creiamo prima i template email (reminder, indizi)
2. Poi aggiungiamo i Cron Jobs a dicembre
3. Testiamo manualmente
4. Deploy e monitoring

---

**Vuoi che ti mostri come implementare i Cron Jobs ora?** Oppure li facciamo più avanti (dicembre)?
