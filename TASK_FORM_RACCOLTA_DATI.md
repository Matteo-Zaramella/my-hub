# 📋 Task: Form Raccolta Dati Partecipanti

**Priorità:** 🟡 ALTA
**Scadenza:** 15/01/2026
**Tempo stimato:** 2-3 ore sviluppo + raccolta dati

---

## 🎯 Obiettivo

Creare un modulo pubblico per raccogliere e confermare i dati di contatto dei partecipanti a "Il Castello di Zara", utilizzabile sia per i 52 partecipanti esistenti che per futuri nuovi iscritti.

---

## 📝 Campi del Form

### Campi Obbligatori (*)
1. **Nome** * - text
2. **Cognome** * - text
3. **Email** * - email (validazione formato)
4. **Conferma partecipazione** * - checkbox

### Campi Opzionali
5. **Numero di telefono** - tel
6. **Instagram handle** - text (@username)
7. **Note/Preferenze** - textarea (opzionale)

---

## 🛠️ Opzioni di Implementazione

### Opzione A: Google Forms (⚡ Veloce - 30 min)
**Pro:**
- Setup immediato
- Raccolta dati automatica in Google Sheets
- Facile da condividere (link)
- Mobile friendly
- Gratuito

**Contro:**
- Design limitato
- Non integrato nel database
- Richiede import manuale

**Steps:**
1. Crea Google Form con campi sopra
2. Condividi link a partecipanti
3. Export risposte in CSV
4. Import manuale nel database Supabase

---

### Opzione B: Typeform (✨ Migliore UX - 1 ora)
**Pro:**
- Design moderno e accattivante
- UX eccellente
- Logic jumps
- Integrazioni disponibili

**Contro:**
- Piano gratuito limitato (10 domande, 10 risposte/mese)
- Richiede account
- Import manuale dati

**Steps:**
1. Crea account Typeform
2. Crea form con campi sopra
3. Personalizza design
4. Condividi link
5. Export e import dati

---

### Opzione C: Form Personalizzato su My-Hub (🎯 Migliore - 2-3 ore)
**Pro:**
- Integrazione diretta con database Supabase
- Design personalizzato
- Salvataggio automatico
- Validazione real-time
- Scalabile per futuri partecipanti

**Contro:**
- Richiede sviluppo
- Tempo maggiore

**Steps:**
1. Creare route pubblica `/register` o `/partecipanti/conferma`
2. Form component con validazione
3. API route per salvataggio diretto su Supabase
4. Email di conferma automatica
5. Pagina success con codice partecipante generato

---

## 🚀 Implementazione Consigliata

### FASE 1: Quick Start (Google Forms)
**Per raccogliere dati immediatamente:**
1. Crea Google Form (30 min)
2. Condividi link ai 52 partecipanti
3. Raccogli risposte entro 15/01/2026
4. Import manuale dati

### FASE 2: Soluzione Permanente (Form su My-Hub)
**Sviluppo in parallelo o dopo:**
1. Crea componente form pubblico
2. Integra con database
3. Usa per futuri nuovi partecipanti
4. Sostituisci Google Form con link al form integrato

---

## 💻 Implementazione Tecnica (Opzione C)

### File da Creare

#### 1. Route pubblica: `app/register/page.tsx`
```typescript
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    instagram: '',
    confirmed: false
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()

    // Controlla se partecipante già esiste
    const { data: existing } = await supabase
      .from('game_participants')
      .select('id')
      .eq('email', formData.email)
      .single()

    if (existing) {
      // Aggiorna dati esistenti
      await supabase
        .from('game_participants')
        .update({
          phone_number: formData.phone,
          instagram_handle: formData.instagram,
          email: formData.email
        })
        .eq('id', existing.id)
    } else {
      // Crea nuovo partecipante
      // (logica da implementare)
    }

    setSuccess(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6">Conferma Partecipazione - Il Castello di Zara</h1>

        {success ? (
          <div className="text-green-600">
            ✅ Dati confermati con successo!
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Form fields */}
          </form>
        )}
      </div>
    </div>
  )
}
```

#### 2. Validazione e sanitizzazione
- Email: formato valido
- Telefono: formato internazionale
- Instagram: rimuovi @ iniziale automaticamente

#### 3. Success page
- Mostra codice partecipante
- Link alla game area
- Istruzioni prossimi passi

---

## 📧 Comunicazione ai Partecipanti

### Email Template

```
Oggetto: Conferma i tuoi dati per Il Castello di Zara 🎮

Ciao [Nome],

Sei stato invitato a partecipare a "Il Castello di Zara", un gioco interattivo della durata di un anno con sfide mensili e premi!

🎯 PROSSIMI PASSI:

1. Conferma i tuoi dati compilando questo form:
   [LINK AL FORM]

2. Riceverai il tuo codice partecipante univoco

3. La cerimonia di apertura si terrà il 24/01/2026

📋 DETTAGLI:
- Durata: 24/01/2026 - 24/01/2027
- 12 sfide mensili + 1 sfida finale
- Premio finale: 1.000€
- 52 partecipanti totali

Per qualsiasi domanda, rispondi a questa email.

A presto!
[Tuo Nome]
```

---

## ✅ Checklist Implementazione

### Setup Iniziale
- [ ] Decidere tra Opzione A, B o C
- [ ] Se Opzione A/B: creare form esterno
- [ ] Se Opzione C: creare componente in my-hub

### Raccolta Dati
- [ ] Inviare email a tutti i 52 partecipanti
- [ ] Monitorare risposte quotidianamente
- [ ] Reminder dopo 1 settimana
- [ ] Scadenza: 15/01/2026

### Post-Raccolta
- [ ] Validare tutti i dati ricevuti
- [ ] Aggiornare database Supabase
- [ ] Verificare email duplicate
- [ ] Confermare categorie
- [ ] Inviare codici partecipante

---

## 📊 Dati Mancanti Attuali

13 partecipanti senza contatti completi:
1. Anna Maggi
2. Carola Pagnin
3. Davide Boscolo
4. Enrico Geron
5. Enrico Maragno
6. Francesca Colombin
7. Francesca Gasparin
8. Francesco Marsilio
9. Gabriele Zambon
10. Giulia
11. Ippolito Lavorati
12. Marta Geron
13. Roberto Pietrantonj

**Priorità alta:** Ottenere almeno email di questi 13 partecipanti!

---

## 🔒 Privacy e GDPR

**Importante:** Il form deve includere:
- [ ] Informativa privacy
- [ ] Consenso trattamento dati
- [ ] Checkbox consenso marketing (opzionale)
- [ ] Link a privacy policy
- [ ] Possibilità di richiedere cancellazione dati

---

## 📈 Metriche di Successo

**Target:**
- 100% partecipanti confermano dati (52/52)
- Almeno 90% fornisce email
- Almeno 70% fornisce telefono
- Almeno 50% fornisce Instagram

**Tracking:**
- Risposte per giorno
- Tasso di completamento
- Campi più/meno compilati

---

## 🆘 Supporto Tecnico

### Se usi Google Forms:
- Tutorial: https://support.google.com/docs/answer/6281888
- Export CSV: Forms → Risposte → Excel icon

### Se sviluppi form personalizzato:
- Supabase docs: https://supabase.com/docs
- Next.js forms: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
- Validazione: use zod library

---

## 📅 Timeline

| Data | Attività |
|------|----------|
| Oggi | Creare form (qualsiasi opzione) |
| Domani | Testare form con dati fake |
| 13/11 | Inviare email a tutti i partecipanti |
| 20/11 | Primo reminder |
| 27/11 | Secondo reminder |
| 15/01/2026 | Scadenza raccolta dati |
| 16/01/2026 | Import finale database |

---

**💡 Consiglio:** Inizia con Google Forms per velocità, poi sviluppa form personalizzato per futuri partecipanti!

---

*File creato: 12 Novembre 2025*
*Ultima modifica: 12 Novembre 2025*
