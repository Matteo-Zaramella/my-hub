# Setup Email Promemoria RSVP

Questa guida spiega come configurare l'invio automatico delle email promemoria per il 24/01/2026 alle 12:00.

---

## 1. Account Resend (GIA' CONFIGURATO)

- Account: matteozaramella.com
- Dominio verificato: matteozaramella.com
- API Key: vedi `C:\Users\matte\Desktop\Credenziali\TUTTE_LE_CREDENZIALI.md`

---

## 2. Configura i secrets in Supabase

```bash
# Da terminale, nella cartella del progetto
cd C:\Users\matte\Desktop\Progetti\my-hub

# Imposta la API key di Resend
supabase secrets set RESEND_API_KEY=re_8t3ZKPbL_Mg3cgW5X42g2cA9ZmN7wNDCn
```

Oppure da Supabase Dashboard:
1. Vai su **Settings** > **Edge Functions**
2. Aggiungi il secret `RESEND_API_KEY`

---

## 5. Deploy della funzione

```bash
cd C:\Users\matte\Desktop\Progetti\my-hub

# Deploy
supabase functions deploy send-rsvp-reminder
```

---

## 6. Test della funzione

```bash
# Test locale
supabase functions serve send-rsvp-reminder

# In un altro terminale
curl -X POST http://localhost:54321/functions/v1/send-rsvp-reminder
```

Oppure da remoto dopo il deploy:
```bash
curl -X POST https://wuvuapmjclahbmngntku.supabase.co/functions/v1/send-rsvp-reminder \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

---

## 7. Schedulare per il 24/01/2026 alle 12:00

### Opzione A: Cron job con pg_cron (Supabase Pro)

```sql
-- In Supabase SQL Editor
SELECT cron.schedule(
  'send-rsvp-reminder',
  '0 12 24 1 *',  -- 24 gennaio alle 12:00
  $$
  SELECT net.http_post(
    url := 'https://wuvuapmjclahbmngntku.supabase.co/functions/v1/send-rsvp-reminder',
    headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  );
  $$
);
```

### Opzione B: Reminder manuale

Il 24/01/2026 alle 12:00, esegui manualmente:
```bash
curl -X POST https://wuvuapmjclahbmngntku.supabase.co/functions/v1/send-rsvp-reminder \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"
```

### Opzione C: Usa un servizio esterno

- **cron-job.org** (gratuito)
- **EasyCron**
- **GitHub Actions** con schedule

---

## Cosa fa la funzione

1. Trova tutti i partecipanti con email
2. Filtra chi:
   - Non ha risposto al RSVP
   - Ha risposto "forse"
3. Invia email personalizzata a ciascuno
4. Restituisce un report con i risultati

---

## Email inviate

**A chi non ha risposto:**
> Ciao [Nome],
> non hai ancora confermato la tua presenza per la festa di stasera!
> Entra sul sito per confermare e unisciti al gruppo WhatsApp...

**A chi ha detto "forse":**
> Ciao [Nome],
> hai indicato che forse parteciperai alla festa di stasera.
> Ti ricordiamo di confermare la tua presenza...

---

## Troubleshooting

- **Errore 401**: Verifica che RESEND_API_KEY sia configurata
- **Email non arrivano**: Controlla la cartella spam
- **Dominio non verificato**: Usa `onboarding@resend.dev` per test

---

**Ultimo aggiornamento:** 6 Gennaio 2026
