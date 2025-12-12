# ⚡ Quick Start - My Hub

## 🎯 Per Iniziare Subito

### Metodo 1: Script Automatici (Raccomandato)

```cmd
cd D:\my-hub

REM Avvia server (scarica aggiornamenti automaticamente)
start.cmd

REM In un altro terminale, quando finisci:
save.cmd
```

### Metodo 2: Comandi Manuali

```cmd
cd D:\my-hub
git pull origin main
npm run dev
```

---

## 📚 Documentazione Completa

- **WORKFLOW.md** - Guida completa multi-dispositivo
- **README.md** - Panoramica progetto
- **PROJECT_STATUS.md** - Stato moduli
- **VERSION.md** - Changelog versioni

---

## 🔥 Comandi Più Usati

```cmd
# Scarica aggiornamenti
git pull origin main

# Salva modifiche
git add .
git commit -m "Tua descrizione"
git push origin main

# Vedi stato
git status

# Vedi modifiche
git diff
```

---

## 🌐 Collegamenti

- **Locale:** http://localhost:3000
- **GitHub:** https://github.com/Matteo-Zaramella/my-hub
- **Produzione:** https://matteozaramella.com
- **Database:** https://supabase.com/dashboard/project/wuvuapmjclahbmngntku

---

## 🆘 Aiuto Rapido

**Git pull fallisce?**
```cmd
git stash
git pull origin main
git stash pop
```

**Vuoi annullare tutto?**
```cmd
git reset --hard HEAD
git pull origin main
```

**Server porta occupata?**
```cmd
netstat -ano | findstr :3000
taskkill /PID [numero] /F
```
