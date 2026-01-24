# Sistema Punti e Squadre

> Ultimo aggiornamento: 24/01/2026 - 16:30
> Stato: **ATTIVO** - 19 partecipanti (18 in squadre + 1 admin)

## Admin/Organizzatore

**ZARA** (id=71) è impostato come admin superpartes:
- `is_admin = TRUE`
- `team_id = NULL` (fuori dalle squadre)
- Può vedere tutte le chat di tutte le squadre
- Accesso completo a tutte le funzionalità

## Le 4 Squadre

| Squadra | Codice | Colore | Hex |
|---------|--------|--------|-----|
| FSB (Russia) | FSB | Rosso | #DC2626 |
| Mossad (Israele) | MOSSAD | Blu | #2563EB |
| MSS (Cina) | MSS | Verde | #16A34A |
| AISE (Italia) | AISE | Oro | #CA8A04 |

## Composizione Attuale (24/01/2026)

> ⚠️ BENNY e JACKBOA rimossi (non parteciperanno)
> Squadre ribilanciate con `RIBILANCIA_SQUADRE.sql`

| Squadra | Membri | Note |
|---------|--------|------|
| **FSB** (4) | NATASHA, Samantha, MARCO, LEO | -1 spostato a MOSSAD |
| **MOSSAD** (5) | VITTO, RACHI, ADI + 2 nuovi | +2 da ribilanciamento |
| **MSS** (4) | CAROLA, ALESSANDRONAI, MARTINA, GIOVANNI | -1 spostato a MOSSAD |
| **AISE** (5) | PIETRO, ROBERTO, CESKO, FRANCO, SARA | Invariato |

**Totale**: 18 partecipanti in squadra + ZARA admin = 19

## Assegnazione Squadre

- **Automatica**: alla registrazione, il sistema assegna il partecipante alla squadra con meno membri
- **Non modificabile**: una volta assegnato, il partecipante non può cambiare squadra
- **Bilanciamento**: il sistema mantiene le squadre bilanciate
- **Trigger attivo**: `trigger_assign_team` su `game_participants`

## Sistema Punti

### Tipi di Punti

| Tipo | Punti | Descrizione |
|------|-------|-------------|
| `ceremony_bonus` | 50 | Bonus per partecipazione alla cerimonia di apertura |
| `clue_found` | Variabile | Punti per aver trovato un indizio |
| `challenge_completed` | Variabile | Punti per completamento sfida mensile |
| `special_action` | Variabile | Azioni segrete durante l'anno |

### Come si Guadagnano

1. **Cerimonia di Apertura (24/01/2026)**
   - 50 punti a tutti i partecipanti iscritti SE la cerimonia viene completata
   - Se la cerimonia fallisce (timeout), nessun punto
   - **Assegnazione automatica**: quando viene inserita "EVOLUZIONE", l'API viene chiamata automaticamente

2. **Indizi Mensili**
   - Punti per chi decifra per primo gli indizi
   - Punti bonus per velocità

3. **Sfide Mensili**
   - Punti variabili in base alla difficoltà
   - Punti bonus per primi classificati

4. **Azioni Segrete**
   - Punti nascosti durante l'anno
   - Svelati progressivamente

### Punti Individuali vs Squadra

- **Punti Individuali**: ogni partecipante accumula punti personali
- **Punti Squadra**: somma dei punti di tutti i membri
- **Classifica Individuale**: visibile da Halloween (31/10/2026)
- **Classifica Squadre**: sempre visibile dopo la cerimonia

## Database

### Tabelle

```sql
-- Punti assegnati
game_points (
  id, participant_id, team_id, points, reason, description, created_at
)

-- Squadre
game_teams (
  id, team_code, team_name, team_color, total_points
)

-- Partecipanti
game_participants (
  id, nickname, team_id, individual_points, ...
)
```

### Viste

- `game_team_leaderboard`: classifica squadre
- `game_individual_leaderboard`: classifica individuale

## File SQL

1. `FASE1_game_teams_and_state.sql` - Creazione squadre
2. `FASE2_points_system.sql` - Sistema punti
3. `FASE3_auto_team_assignment.sql` - Assegnazione automatica
4. `SET_ZARA_ADMIN.sql` - Imposta ZARA come admin
5. `RIBILANCIA_SQUADRE.sql` - Ribilanciamento dopo rimozione partecipanti

## API Endpoints

### GET /api/game/points
Ottieni classifica squadre o individuale.
```
GET /api/game/points?type=teams     # Classifica squadre (default)
GET /api/game/points?type=individual # Classifica individuale
```

### POST /api/game/points
Assegna punti (richiede admin key).
```json
POST /api/game/points?key=cerimonia2026
{
  "participant_id": 76,  // opzionale
  "team_id": 1,          // opzionale (auto se participant_id)
  "points": 10,          // obbligatorio
  "reason": "clue_found", // obbligatorio
  "description": "..."   // opzionale
}
```

### POST /api/game/points/ceremony-bonus
Assegna 50 punti a TUTTI i partecipanti (una volta sola).
```
POST /api/game/points/ceremony-bonus?key=cerimonia2026
```

### GET /api/game/points/ceremony-bonus
Verifica se i punti cerimonia sono stati assegnati.
```json
{
  "ceremonyBonusAssigned": true,
  "participantsWithBonus": 21,
  "totalBonusPoints": 1050
}
```

---

⬆️ [Torna al README](./README.md)
