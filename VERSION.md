# Changelog - My Hub

Tutte le modifiche significative a questo progetto saranno documentate in questo file.

Il formato si basa su [Keep a Changelog](https://keepachangelog.com/it/1.0.0/),
e questo progetto aderisce al [Semantic Versioning](https://semver.org/lang/it/).

## [1.0.0] - 2025-01-06

### Aggiunto
- Sistema di autenticazione con Supabase
- Dashboard principale con navigazione
- Modulo Wishlist con gestione items
  - Creazione, modifica, eliminazione items
  - Filtri per priorità e visibilità
  - Supporto per link e immagini
- Modulo Pasti (Alimentazione)
  - Registrazione pasti per tipo (colazione, pranzo, cena, snack)
  - Modifica data, tipo e descrizione
  - Filtro per periodo temporale
  - Export PDF con riepilogo personalizzato
- Modulo Fitness (Allenamenti)
  - Sistema schede allenamento preset (A, B, C)
  - Registrazione esercizi con serie, ripetizioni, peso
  - Modifica data e note sessioni
  - Filtro per periodo temporale
  - Export PDF con riepilogo allenamenti
- Sistema di filtraggio dati per periodo (ultimi 30/60/365 giorni)
- Export PDF per moduli Pasti e Fitness
- Deploy su Vercel con dominio personalizzato
- Configurazione DNS su Cloudflare

### Tecnico
- Next.js 16.0.1 con Turbopack
- Supabase per autenticazione e database
- jsPDF per generazione PDF client-side
- Tailwind CSS per styling
- TypeScript per type safety

### Database
- Tabelle: users, wishlist_items, wishlist_tags, pasti, workout_sessions, workout_exercises
- Relazioni foreign key configurate
- Supporto UUID per user_id (auth.users)

---

## Come Versioning

### Incrementare la versione:

1. **MAJOR (x.0.0)** - Breaking changes
   ```bash
   npm version major
   git push && git push --tags
   ```

2. **MINOR (1.x.0)** - Nuove funzionalità
   ```bash
   npm version minor
   git push && git push --tags
   ```

3. **PATCH (1.0.x)** - Bug fixes
   ```bash
   npm version patch
   git push && git push --tags
   ```

### Ripristinare una versione:
```bash
# Lista tutte le versioni
git tag -l

# Ripristina a una versione specifica
git checkout v1.0.0

# Oppure crea un branch da quella versione
git checkout -b hotfix/v1.0.0 v1.0.0
```

### Visualizzare differenze tra versioni:
```bash
git diff v1.0.0 v1.1.0
```
