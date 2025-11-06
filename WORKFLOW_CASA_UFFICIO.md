# 🏢 Workflow Casa-Ufficio per My Hub

Questa guida spiega come sincronizzare il lavoro tra casa e ufficio.

## 📋 Setup Iniziale

### 1️⃣ Setup su Nuova Macchina (Ufficio)

```bash
# 1. Clona il repository
git clone https://github.com/Matteo-Zaramella/my-hub.git
cd my-hub

# 2. Installa le dipendenze
npm install

# 3. Copia .env.example in .env.local
cp .env.example .env.local

# 4. Modifica .env.local con i valori reali
# (vedi in Supabase Dashboard > Settings > API)
```

## 🔄 Workflow Quotidiano

### 🏠 Da Casa → Ufficio

**Prima di finire la sessione a casa:**
```bash
# 1. Salva tutto il lavoro
git add .
git commit -m "Descrizione delle modifiche"
git push origin main

# 2. Verifica che il push sia andato a buon fine
git status
```

**All'ufficio:**
```bash
# 1. Apri il progetto
cd my-hub

# 2. Scarica le ultime modifiche
git pull origin main

# 3. Installa eventuali nuove dipendenze
npm install

# 4. Avvia il server di sviluppo
npm run dev
```

### 🏢 Da Ufficio → Casa

**Prima di finire la sessione in ufficio:**
```bash
# 1. Salva tutto il lavoro
git add .
git commit -m "Descrizione delle modifiche"
git push origin main
```

**A casa:**
```bash
# 1. Scarica le ultime modifiche
cd "Desktop/My Hub"
git pull origin main
npm install
npm run dev
```

## 🗄️ Gestione Database

### Database Condiviso (Produzione)
- Entrambi gli ambienti (casa e ufficio) usano lo stesso database Supabase
- I dati sono automaticamente sincronizzati
- **Attenzione**: Le modifiche al database sono immediate e visibili ovunque

### Per Testing Isolato (Opzionale)
Se vuoi testare modifiche al database senza toccare la produzione:

```bash
# Crea un branch di sviluppo Supabase
# (verrà configurato successivamente)
```

## 📁 File da NON Committare

Questi file sono già nel `.gitignore`:
- `.env.local` (contiene chiavi segrete)
- `.mcp.json` (configurazione MCP con token)
- `*.sql` (dump del database)
- `backups/` (backup locali)
- `node_modules/` (dipendenze)

## ✅ Checklist Prima di Cambiare Ambiente

- [ ] Commit di tutte le modifiche
- [ ] Push su GitHub
- [ ] Verifica che il push sia riuscito
- [ ] Chiudi localhost:3000

## 🆘 Problemi Comuni

### "Your branch is behind"
```bash
git pull origin main
```

### "Merge conflict"
```bash
# 1. Apri i file in conflitto
# 2. Risolvi manualmente i conflitti
# 3. Aggiungi e committi
git add .
git commit -m "Risolti conflitti"
git push
```

### "npm ERR! missing dependencies"
```bash
npm install
```

## 🚀 Best Practices

1. **Sempre fare pull** prima di iniziare a lavorare
2. **Sempre fare push** prima di chiudere la sessione
3. **Commit frequenti** con messaggi descrittivi
4. **Testare sempre** prima di committare (`npm run dev`)
5. **Non committare file sensibili** (.env, tokens, ecc.)

## 📞 Configurazione MCP (Opzionale)

Se vuoi usare gli stessi server MCP in entrambi gli ambienti:

**Su ogni macchina:**
```bash
# Configurazione già completata per:
- Supabase
- GitHub
- Vercel
- Cloudflare (Observability, Workers, Browser, Radar)
```

I token MCP sono locali (in `.claude.json`) e non vengono condivisi via Git per sicurezza.
