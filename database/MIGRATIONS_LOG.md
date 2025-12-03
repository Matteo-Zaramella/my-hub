# 📊 Log SQL Migrations - My Hub Project

**Data creazione:** 3 Dicembre 2025
**Responsabile:** Claude Code Assistant

---

## ✅ Migrations Eseguite su Supabase

### 1. Toggle Landing Page Buttons
**File:** `add_landing_toggles_to_settings.sql`
**Data esecuzione:** 3 Dicembre 2025
**Descrizione:** Aggiunge controlli toggle per i pulsanti della landing page

```sql
INSERT INTO game_settings (setting_key, setting_value, description)
VALUES
  ('registration_button_enabled', true, 'Controls if registration button (numero 2, position 1) is visible on landing page'),
  ('wishlist_button_enabled', true, 'Controls if wishlist button (numero 1, position 0) is visible on landing page'),
  ('password_input_enabled', false, 'Controls if password input for game access (position 99) is enabled')
ON CONFLICT (setting_key)
DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description;
```

**Risultato:** 3 righe inserite in `game_settings`

---

### 2. Minigame Button Toggle (Cerchio 95)
**File:** `add_minigame_button_toggle.sql` (inline)
**Data esecuzione:** 3 Dicembre 2025
**Descrizione:** Aggiunge controllo per cerchio 95 (Saetta McQueen - mini-giochi febbraio)

```sql
INSERT INTO game_settings (setting_key, setting_value, description)
VALUES ('minigame_button_enabled', false, 'Controls if minigame button (cerchio 95, Saetta McQueen, index 94) is visible and clickable')
ON CONFLICT (setting_key)
DO UPDATE SET setting_value = EXCLUDED.setting_value, description = EXCLUDED.description;
```

**Risultato:** 1 riga inserita in `game_settings`

---

## ❌ Migrations NON Eseguite (Non Necessarie)

### 1. add_landing_buttons_toggles.sql
**Motivo:** Tentava di aggiungere colonne a `game_phases`, ma abbiamo deciso di usare `game_settings` invece
**Status:** OBSOLETO - Non usare

### 2. insert_game_phase_if_not_exists.sql
**Motivo:** Tentava di inserire una riga in `game_phases` per i toggle, ma abbiamo cambiato approccio
**Status:** OBSOLETO - Non usare

---

## 📋 Stato Attuale Database

### Tabella: `game_settings`

| setting_key | setting_value | description |
|------------|---------------|-------------|
| `ceremony_active` | false | Cerimonia apertura attiva |
| `registration_button_enabled` | true | Pulsante registrazione (index 1, numero 2) |
| `wishlist_button_enabled` | true | Pulsante wishlist (index 0, numero 1) |
| `password_input_enabled` | false | Barra password game area (index 99) |
| `minigame_button_enabled` | false | Cerchio mini-giochi (index 94, numero 95) |

---

## 🎯 Mapping Index → Numeri Cerchi

**IMPORTANTE:** Per evitare confusione tra index 0-based (codice) e numeri human-readable:

| Index (0-based) | Numero Cerchio | Descrizione | Toggle Field |
|----------------|----------------|-------------|--------------|
| 0 | 1 | Wishlist pubblica | `wishlist_button_enabled` |
| 1 | 2 | Form registrazione | `registration_button_enabled` |
| 9 | 10 | Accesso admin | - (sempre visibile) |
| 94 | 95 | Saetta McQueen mini-giochi | `minigame_button_enabled` |
| 99 | 100 | Barra password game area | `password_input_enabled` |

**Posizione griglia:** 10x10 = 100 cerchi totali (index 0-99)

---

## 🔧 Come Usare i Toggle

### Dashboard Admin
1. Vai su `/dashboard/game-management`
2. Tab "Settings" (Controlli Landing Page)
3. Usa gli switch per attivare/disattivare i pulsanti

### Effetti sulla Landing Page
- **Toggle ON:** Pulsante visibile/cliccabile
- **Toggle OFF:** Pulsante nascosto/disabilitato
- **Polling:** Landing page controlla settings ogni 2 secondi
- **Delay massimo:** 2 secondi tra cambio toggle e aggiornamento visivo

---

## 📝 Note Tecniche

### Scelta `game_settings` invece di `game_phases`
- `game_phases`: Tabella descrittiva per timeline del gioco (febbraio-gennaio 2027)
- `game_settings`: Tabella operativa per controlli runtime
- **Vantaggi:** Separazione concetti, più flessibilità, nessun inquinamento tabella fasi

### Polling ogni 2 secondi
**File:** `app/LandingPage.tsx` (linea 67-69)
```typescript
const settingsInterval = setInterval(() => {
  checkCeremonyStatus()
}, 2000)
```

**Perché 2 secondi?**
- Bilanciamento tra reattività e carico database
- Sufficientemente veloce per admin che testa
- Non impatta performance con 50+ utenti

---

## ⚠️ Troubleshooting

### Toggle non funziona
1. Verifica che la riga esista in `game_settings`:
```sql
SELECT * FROM game_settings WHERE setting_key = 'wishlist_button_enabled';
```

2. Controlla console browser per errori Supabase
3. Verifica RLS policies su `game_settings`

### Pulsante non appare/scompare
- Attendi 2 secondi (polling interval)
- Ricarica pagina manualmente
- Verifica che il toggle sia effettivamente cambiato nel database

---

## 🚀 Future Migrations

Migrations pianificate ma non ancora necessarie:

1. **Categorie Vestiti Wishlist** (Febbraio 2026)
2. **Sistema Notifiche Push** (Gennaio 2026)
3. **Backup Automatici** (Gennaio 2026)
4. **Analytics Partecipanti** (Gennaio 2026)

---

*Documento generato: 3 Dicembre 2025*
*Ultima modifica: 3 Dicembre 2025*
