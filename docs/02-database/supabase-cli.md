# 🔧 CONFIGURAZIONE SUPABASE CLI

## STEP 1: Ottieni Access Token

1. Vai su: https://supabase.com/dashboard/account/tokens
2. Clicca su **"Generate new token"**
3. Nome: `my-hub-cli`
4. Copia il token generato (lo vedrai solo una volta!)

## STEP 2: Configura variabile d'ambiente

**Windows (PowerShell):**
```powershell
$env:SUPABASE_ACCESS_TOKEN="il_tuo_token_qui"
```

**Windows (CMD):**
```cmd
set SUPABASE_ACCESS_TOKEN=il_tuo_token_qui
```

## STEP 3: Link al progetto DEV

```bash
cd D:\Claude\my-hub
npx supabase link --project-ref mheowbijzaparmddumsr
```

## STEP 4: Esporta schema da produzione

```bash
npx supabase db dump --project-ref wuvuapmjclahbmngntku --schema public > schema_prod.sql
```

## STEP 5: Importa schema in DEV

```bash
npx supabase db push --project-ref mheowbijzaparmddumsr --file schema_prod.sql
```

---

**ALTERNATIVA SEMPLICE (senza CLI):**

1. Apri SQL Editor PRODUZIONE: https://supabase.com/dashboard/project/wuvuapmjclahbmngntku/sql
2. Usa il comando: `pg_dump` dal pannello SQL
3. Copia risultato
4. Apri SQL Editor DEV: https://supabase.com/dashboard/project/mheowbijzaparmddumsr/sql
5. Incolla ed esegui
