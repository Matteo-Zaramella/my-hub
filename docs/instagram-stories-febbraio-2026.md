# Instagram Stories - Sfida Febbraio 2026

## Piano delle Storie

Le storie Instagram fungeranno da indizi per guidare i partecipanti alla sfida di Febbraio 2026 (5 mini-giochi progressivi).

### Calendario Pubblicazione

Basato sullo **Scenario B** delle date indizi:

- **31 Gennaio 2026** - Storia 1: Immagine TBD
- **7 Febbraio 2026** - Storia 2: Cronometro/Sveglia
- **14 Febbraio 2026** - Storia 3: Saetta McQueen #95
- **21-22 Febbraio 2026** - Sfida attiva (completamento mini-giochi)

### Dettagli Storie

#### Storia 1 (31 Gennaio) - TBD
- **Contenuto**: Da definire
- **Indizio**: ?
- **Obiettivo**: Prima indicazione verso la sfida

#### Storia 2 (7 Febbraio) - Cronometro/Sveglia
- **Contenuto**: Immagine di un cronometro o sveglia
- **Indizio**: Indica la pagina con il countdown (homepage con timer)
- **Obiettivo**: Guidare gli utenti alla landing page principale

#### Storia 3 (14 Febbraio) - Saetta McQueen #95
- **Contenuto**: Immagine di Saetta McQueen con numero 95
- **Indizio**: Indica il cerchio 95 nella griglia (posizione 94 nell'array, riga 10 colonna 5)
- **Obiettivo**: Rivelare il cerchio rosso da cliccare per accedere ai mini-giochi
- **Nota**: Il cerchio 95 NON ha animazione pulse per non essere troppo ovvio

### Meccanica della Sfida

1. Gli utenti seguono gli indizi delle storie Instagram
2. Arrivano alla homepage (storia 2)
3. Identificano il cerchio #95 (storia 3)
4. Cliccano sul cerchio rosso in posizione 95
5. Vengono reindirizzati a `/minigames`
6. Completano i 5 mini-giochi in sequenza:
   - Game 1: Memory (12 carte, 90s)
   - Game 2: Puzzle Slider (4x4, 180s)
   - Game 3: Sequence (6 livelli)
   - Game 4: Clicker (50 click, 60s)
   - Game 5: Quiz (10 domande, 10s each, serve 8/10)
7. Chi completa tutti i giochi vince la sfida

### Programmazione Storie

Le storie possono essere programmate usando **Meta Business Suite**:
- https://business.facebook.com/creatorstudio
- Permette di schedulare storie Instagram in anticipo
- Impostare data e ora di pubblicazione per ciascuna storia

### Note Tecniche

- Cerchio 95 implementato in `app/LandingPage.tsx` alla posizione 94 (index)
- Route mini-giochi: `app/minigames/page.tsx`
- Progresso salvato in `game_participants.minigame_progress` (array INTEGER[])
- Database column da creare con migration SQL su Supabase

### TODO

- [ ] Decidere contenuto Storia 1 (31 Gennaio)
- [ ] Creare/trovare immagine cronometro per Storia 2
- [ ] Creare/trovare immagine Saetta McQueen #95 per Storia 3
- [ ] Programmare pubblicazione storie su Meta Business Suite
- [ ] Personalizzare domande quiz (Game 5) insieme
- [ ] Testare flow completo prima del lancio
