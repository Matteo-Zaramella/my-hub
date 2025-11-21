# Sistema Chat di Gruppo - A Tutto Reality: La Rivoluzione

## 📋 Panoramica

Sistema di chat di gruppo in tempo reale per "A Tutto Reality: La Rivoluzione", accessibile tramite codici partecipante univoci stampati su cartoncini fisici.

## 🏗️ Architettura

### Flusso Utente

1. **Pre 26/01/2026**: Password "EVOLUZIONE" → Pagina successo 100 punti + pulsante provvisorio per GameArea
2. **Post 26/01/2026**: Password "EVOLUZIONE" → GameArea completa automaticamente
3. **GameArea**: Richiede login con codice partecipante (6 caratteri)
4. **Chat**: Accessibile dopo login, tutti i partecipanti possono comunicare in tempo reale

### Componenti Principali

```
app/
├── game/
│   ├── ParticipantLogin.tsx      # Login con codice partecipante
│   ├── GameAreaWithChat.tsx      # Area gioco con tab (Chat, Indizi, Classifica)
│   ├── GroupChat.tsx             # Chat di gruppo con realtime
│   ├── PasswordSuccess.tsx       # Pagina successo password (con data activation)
│   └── area/
│       └── page.tsx              # Route /game/area (per accesso provvisorio)
```

## 🔑 Sistema di Autenticazione

### Codici Partecipante

- **Formato**: 6 caratteri alfanumerici (es. ABC123)
- **Distribuzione**: Stampati su cartoncini fisici
- **Sicurezza**: A discrezione del partecipante (può mantenerlo segreto o condividerlo)
- **Utilizzo**: Login + assegnazione punti indizi

### ParticipantLogin.tsx

```typescript
// Validazione codice
const { data: participant } = await supabase
  .from('game_participants')
  .select('*')
  .eq('participant_code', code.toUpperCase())
  .single()

// Salvataggio sessione
localStorage.setItem('game_participant', JSON.stringify(participant))
```

## 💬 Sistema Chat

### Database: game_chat_messages_v2

```sql
CREATE TABLE game_chat_messages_v2 (
  id BIGSERIAL PRIMARY KEY,
  participant_id INTEGER NOT NULL REFERENCES game_participants(id),
  participant_name TEXT NOT NULL,
  participant_code TEXT NOT NULL,
  message TEXT NOT NULL,
  is_system_message BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Motivo v2**: Versione semplificata che usa participant_id invece di user_id (Supabase Auth)

### Funzionalità Chat

- ✅ **Real-time**: Supabase Realtime subscription
- ✅ **Messaggi utente**: Con nome partecipante e timestamp
- ✅ **Messaggi sistema**: Evidenziati visivamente (benvenuto, annunci)
- ✅ **Auto-scroll**: Scroll automatico a nuovi messaggi
- ✅ **Limite caratteri**: 500 caratteri per messaggio
- ✅ **Persistenza**: Ultimi 100 messaggi caricati all'accesso

### GroupChat.tsx - Invio Messaggi

```typescript
const sendMessage = async () => {
  await supabase.from('game_chat_messages_v2').insert({
    participant_id: participant.id,
    participant_name: participant.participant_name,
    participant_code: participant.participant_code,
    message: newMessage.trim(),
    is_system_message: false,
  })
}
```

### Real-time Subscription

```typescript
supabase
  .channel('game-chat-v2')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'game_chat_messages_v2',
  }, (payload) => {
    setMessages(prev => [...prev, payload.new as Message])
  })
  .subscribe()
```

## 📅 Sistema Date Activation

### PasswordSuccess.tsx

```typescript
const GAME_ACTIVATION_DATE = new Date('2026-01-26T00:00:00')
const now = new Date()
const isGameActive = now >= GAME_ACTIVATION_DATE

if (isGameActive) {
  // Mostra GameArea completa
  return <GameAreaWithChat />
} else {
  // Mostra pagina successo + pulsante provvisorio
  return (
    <>
      <h1>🎉 100 Punti Ottenuti!</h1>
      <button onClick={() => router.push('/game/area')}>
        🚀 Accedi all'Area Game (Provvisorio)
      </button>
    </>
  )
}
```

## 🎮 GameArea - Sezioni

### Tab Navigation

1. **💬 Chat**: Comunicazione gruppo in tempo reale
2. **🔍 Indizi**: Rivelati ogni sabato alle 00:00 (placeholder)
3. **🏆 Classifica**: Visibile dopo 6 mesi - 26/07/2026 (placeholder)

### Header

- Nome utente: `{participant.participant_name}`
- Pulsante logout: Rimuove localStorage e reindirizza a login
- Codice partecipante: Visualizzato nel footer

### Footer

- Codice partecipante
- Partner (se coppia)
- Date evento: 24/01/2026 - 24/01/2027

## 🗂️ Struttura Database

### game_participants

Tabella esistente con codici partecipante:

```sql
- id (PRIMARY KEY)
- user_id (NULLABLE - non più usato)
- participant_name
- participant_code (UNIQUE)
- phone_number
- instagram_handle
- category
- notes
- partner_name
- is_couple
```

### game_chat_messages_v2

Nuova tabella per messaggi chat:

```sql
- id (PRIMARY KEY)
- participant_id (FK → game_participants)
- participant_name
- participant_code
- message
- is_system_message
- created_at
```

### Indici

```sql
CREATE INDEX idx_chat_v2_created_at ON game_chat_messages_v2(created_at DESC);
CREATE INDEX idx_chat_v2_participant_id ON game_chat_messages_v2(participant_id);
```

### Row Level Security (RLS)

```sql
-- Tutti possono leggere
CREATE POLICY "Anyone can view chat messages v2"
  ON game_chat_messages_v2 FOR SELECT
  USING (true);

-- Tutti possono inviare (validazione client-side)
CREATE POLICY "Anyone can send messages v2"
  ON game_chat_messages_v2 FOR INSERT
  WITH CHECK (true);
```

### Realtime Publication

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE game_chat_messages_v2;
```

## 🚀 Deploy e Setup

### 1. Eseguire SQL su Supabase

```bash
# Connettersi a Supabase SQL Editor
# Eseguire: database/chat_messages_v2.sql
```

### 2. Verificare RLS Policies

```sql
-- Verificare policies attive
SELECT * FROM pg_policies WHERE tablename = 'game_chat_messages_v2';
```

### 3. Verificare Realtime

```sql
-- Verificare pubblicazione
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
```

### 4. Avviare Server

```bash
cd /d/my-hub
npm run dev
# Server: http://localhost:3000
```

### 5. Testing

1. Accedi con password: http://localhost:3000/game?password=EVOLUZIONE
2. Clicca pulsante "Accedi all'Area Game (Provvisorio)"
3. Inserisci codice partecipante valido (da game_participants)
4. Verifica chat funzionante
5. Apri seconda finestra per testare real-time

## 🔐 Sicurezza

### Considerazioni

- **Codici partecipante**: NON sono segreti crittografici, ma identificatori univoci
- **RLS**: Policies permettono INSERT/SELECT pubblici (chat aperta)
- **Validazione client-side**: Il participant_id viene dal localStorage (facilmente modificabile)

### Nota Importante

Questo sistema è progettato per un gioco amichevole tra conoscenti, NON per applicazioni che richiedono sicurezza critica. Se un partecipante vuole impersonare altri, tecnicamente può farlo modificando localStorage.

### Possibili Miglioramenti Futuri

Se necessaria maggiore sicurezza:

1. **JWT Tokens**: Generare token firmati per ogni login
2. **Server-side validation**: API Routes Next.js per validare messaggi
3. **Rate limiting**: Limitare numero messaggi per participant_id
4. **Moderazione**: Filtri bad words, lunghezza, spam detection

## 📊 Statistiche e Monitoraggio

### Query Utili

```sql
-- Conteggio messaggi per partecipante
SELECT
  participant_name,
  COUNT(*) as message_count
FROM game_chat_messages_v2
WHERE is_system_message = false
GROUP BY participant_name
ORDER BY message_count DESC;

-- Ultimi 50 messaggi
SELECT
  id,
  participant_name,
  message,
  created_at
FROM game_chat_messages_v2
ORDER BY created_at DESC
LIMIT 50;

-- Messaggi sistema
SELECT * FROM game_chat_messages_v2
WHERE is_system_message = true
ORDER BY created_at DESC;
```

## 🐛 Troubleshooting

### Chat non si aggiorna in tempo reale

1. Verificare Realtime abilitato su Supabase Dashboard
2. Controllare console browser per errori subscription
3. Verificare RLS policies attive
4. Controllare tabella in pubblicazione realtime

### Errore "Module not found: GroupChat"

```bash
# Pulire cache Next.js
rm -rf .next
npm run dev
```

### Porta 3000 occupata

```bash
# Windows
cmd //c "taskkill /F /IM node.exe"

# Verificare porta libera
netstat -ano | findstr :3000

# Riavviare
npm run dev
```

### Messaggio non viene inviato

1. Verificare RLS policy INSERT
2. Controllare foreign key participant_id valido
3. Verificare lunghezza messaggio < 500 caratteri
4. Controllare console per errori Supabase

## 📱 Responsive Design

Il sistema è completamente responsive:

- **Mobile**: Chat full-height con header fisso
- **Tablet**: Ottimizzazione tab navigation
- **Desktop**: Layout espanso con sidebar potential

### Breakpoints Tailwind

```typescript
// Mobile-first approach
className="h-[calc(100vh-280px)] md:h-[600px]"  // Chat height
className="px-4 sm:px-6 lg:px-8"                // Padding responsive
className="text-xl md:text-3xl"                 // Font responsive
```

## 🎨 Design System

### Colori

- **Background**: Gradient purple-900 → black → pink-900
- **Chat bubbles**:
  - Propri messaggi: Purple-600/80
  - Altri messaggi: White/10
  - Sistema: Blue-500/20
- **Accenti**: Purple-500, Pink-600

### Componenti UI

- **Backdrop blur**: Per effetto vetro smerigliato
- **Border glow**: Border con opacità per profondità
- **Animations**: Pulse per online indicator
- **Smooth scroll**: Auto-scroll animato per nuovi messaggi

## 📝 Note di Sviluppo

### Perché game_chat_messages_v2?

La prima versione utilizzava `auth.users` di Supabase per l'autenticazione. Dopo feedback utente, è emerso che il sistema doveva usare codici partecipante invece di email/password. La v2 riflette questa architettura semplificata.

### localStorage Persistence

```typescript
// Salvataggio sessione
localStorage.setItem('game_participant', JSON.stringify(participant))

// Recupero all'avvio
const stored = localStorage.getItem('game_participant')
if (stored) {
  setParticipant(JSON.parse(stored))
}
```

### Date Temporanee

⚠️ **IMPORTANTE**: Prima del deploy in produzione, ripristinare data corretta:

```typescript
// Sviluppo (per testing)
const GAME_ACTIVATION_DATE = new Date('2025-11-11T00:00:00')

// Produzione
const GAME_ACTIVATION_DATE = new Date('2026-01-26T00:00:00')
```

## 🚀 Prossimi Sviluppi

### Sezione Indizi (placeholder)

- Sistema rivelazione indizi ogni sabato 00:00
- Interfaccia visualizzazione indizi sbloccati
- Assegnazione punti per risoluzione

### Sezione Classifica (placeholder)

- Visibile dopo 6 mesi (26/07/2026)
- Ranking partecipanti
- Statistiche dettagliate

### Funzionalità Chat Aggiuntive

- Emoji picker
- Supporto immagini
- Menzioni @participant
- Reazioni ai messaggi
- Ricerca messaggi
- Notifiche desktop

---

**Creato**: 11/11/2025
**Versione**: 2.0.0
**Autore**: Matteo Zaramella
