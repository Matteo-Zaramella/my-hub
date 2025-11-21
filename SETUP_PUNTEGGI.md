# Setup Colonna Punteggi

## 🎯 Aggiungere Punteggio ai Partecipanti

### Esegui questo SQL su Supabase

**Apri:** https://supabase.com/dashboard/project/wuvuapmjclahbmngntku/sql

**Copia e incolla:**

```sql
-- Add current_points column to game_participants
ALTER TABLE game_participants
ADD COLUMN IF NOT EXISTS current_points INTEGER DEFAULT 0 NOT NULL;

-- Create index for performance when sorting by points
CREATE INDEX IF NOT EXISTS idx_game_participants_points ON game_participants(current_points DESC);

-- Add comment
COMMENT ON COLUMN game_participants.current_points IS 'Punteggio corrente del partecipante in A Tutto Reality: La Rivoluzione';
```

**Clicca "Run"**

## ✅ Fatto!

Dopo aver eseguito lo script, ricarica la pagina della gestione partecipanti e vedrai:

- ✅ Nuova colonna **Punteggio** con icona 🏆
- ✅ Sorting cliccabile su **tutte le colonne**:
  - Nome ↕️
  - Categoria ↕️
  - Partner ↕️
  - Codice ↕️
  - Punteggio ↕️
- ✅ Punteggio di default: 0 per tutti
- ✅ Badge colorato giallo-arancione per il punteggio

## 🎨 Funzionalità Sorting

Clicca su qualsiasi header della tabella per ordinare:

- **Primo click**: Ordina A-Z (o 0-9)
- **Secondo click**: Ordina Z-A (o 9-0)
- **Icone**:
  - ↕️ = Non ordinato
  - ↑ = Crescente (A→Z, 0→9)
  - ↓ = Decrescente (Z→A, 9→0)

**Default**: Ordinato per Punteggio decrescente (più punti prima)

---

**Tempo richiesto**: 1 minuto
