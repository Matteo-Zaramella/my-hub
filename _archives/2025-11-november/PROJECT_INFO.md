# A Tutto Reality: La Rivoluzione - Project Information

## Overview
A Tutto Reality: La Rivoluzione è un gioco interattivo della durata di un anno (24/01/2026 - 24/01/2027) con sfide mensili, indizi progressivi e una cerimonia di apertura speciale.

## Key Dates

### Cerimonia di Apertura
- **Data:** 24 Gennaio 2026
- **Indizi:** 10 indizi da trovare durante la festa
- **Bonus:** +100 punti se tutti trovati durante la serata
- **Password finale:** EVOLUZIONE (da indovinare per iniziare il gioco)

### Area Gioco Pubblica
- **Attivazione:** 26 Gennaio 2026, ore 00:00

### Sfide Mensili (2026-2027)
1. **Febbraio 2026:** 21-22/02 (100 punti)
2. **Marzo 2026:** 21-22/03 (100 punti)
3. **Aprile 2026:** 25-26/04 (100 punti)
4. **Maggio 2026:** 23-24/05 (100 punti)
5. **Giugno 2026:** 27-28/06 (100 punti)
6. **Luglio 2026:** 25-26/07 (100 punti)
7. **Agosto 2026:** 22-23/08 (100 punti)
8. **Settembre 2026:** 26-27/09 (100 punti)
9. **Ottobre 2026:** 24-25/10 (100 punti)
10. **Novembre 2026:** 21-22/11 (100 punti)
11. **Dicembre 2026:** 26-27/12 (100 punti)
12. **Gennaio 2027:** 23-24/01 (100 punti)
13. **SFIDA FINALE:** 24/01/2027 (500 punti)

**Totale punti possibili dalle sfide:** 1.700 punti

## Sistema Indizi

### Cerimonia di Apertura
- 10 parole da trovare che formano l'anagramma "EVOLUZIONE"
- Prima parola: ENTOMOLOGIA
- Gli indizi vengono inseriti fisicamente durante la festa

### Sfide Mensili
- Gli indizi vengono rivelati automaticamente ogni **sabato alle 00:00**
- Numero indizi variabile (3-4 indizi per sfida)
- Totale: **40 indizi** distribuiti durante l'anno
- Gli indizi aiutano a scoprire la location/sfida del weekend

## Partecipanti

### Statistiche
- **Totale:** 52 partecipanti
- **In coppia con partner noto:** 24 persone (12 coppie)
- **In coppia senza partner noto:** 13 persone

### Categorie
- Arcella: 9
- Mare: 5
- Severi: 8
- Mortise: 4
- Famiglia: 8
- Colleghi: 1
- Amici: 1
- Senza categoria: 16

### Partecipanti in coppia senza partner specificato
(Possono essere aggiunti tramite dashboard)
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

## Risorse del Progetto

### Google Drive
**Cartella principale:** https://drive.google.com/drive/folders/1MvL5PGHxjR66SqkPqIalhlfM-YkidU69

#### Struttura suggerita della cartella:
```
/A Tutto Reality: La Rivoluzione 2026-2027
├── /Assets
│   ├── /Immagini
│   │   ├── /Cerimonia_Apertura
│   │   ├── /Sfide_Mensili
│   │   └── /Sfida_Finale
│   ├── /Video
│   └── /Audio
├── /Backup
│   ├── /Database_Exports
│   └── /Configurazioni
├── /Documentazione
│   ├── Regolamento_Completo.pdf
│   ├── Lista_Partecipanti.xlsx
│   └── Calendario_Eventi.pdf
└── /Materiali_Sfide
    ├── /Febbraio_2026
    ├── /Marzo_2026
    └── ...
```

### Deployment
- **Platform:** Vercel
- **Database:** Supabase
- **Domain:** matteozaramella.com

## Stack Tecnologico

### Frontend
- Next.js 16.0.1 (App Router)
- React 19
- TypeScript
- Tailwind CSS

### Backend
- Supabase (PostgreSQL)
- Supabase Auth
- Row Level Security (RLS)

### Tools
- Vercel CLI
- Supabase CLI

## Database Schema

### Tabelle Principali
- `game_prize_config` - Configurazione generale del gioco
- `game_challenges` - 13 sfide mensili + finale
- `game_clues` - 40 indizi con date di rivelazione
- `game_participants` - 52 partecipanti
- `game_user_scores` - Punteggi utenti

## Note di Sviluppo

### Testing
Prima del lancio del 24/01/2026, testare:
1. Sistema di countdown (landing page e cerimonia)
2. Inserimento password "EVOLUZIONE"
3. Rivelazione automatica indizi ogni sabato
4. Filtri e ricerca partecipanti
5. Sistema di punteggi
6. Responsive design su mobile

### Funzionalità Future da Implementare
- [ ] Sistema di notifiche push per nuovi indizi
- [ ] Export PDF della classifica
- [ ] Sistema di caricamento foto/video per le sfide
- [ ] Integrazione Instagram per le storie
- [ ] Chat/commenti per ogni sfida
- [ ] Galleria foto dei partecipanti durante le sfide

## Contatti
- **Sviluppatore:** Claude Code
- **Cliente:** Matteo Zaramella
- **Email:** (da aggiungere)

## Licenza
Progetto privato - Tutti i diritti riservati

---
*Ultimo aggiornamento: 10 Novembre 2025*
