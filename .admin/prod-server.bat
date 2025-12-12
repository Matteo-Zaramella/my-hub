@echo off
echo ========================================
echo   AVVIO SERVER MY-HUB (AMBIENTE PROD)
echo ========================================
echo.
echo ⚠️  ATTENZIONE: STAI USANDO IL DATABASE DI PRODUZIONE!
echo.

cd /d D:\Claude\my-hub

REM Verifica che esista .env.local.prod
if not exist .env.local.prod (
    echo Errore: .env.local.prod non trovato!
    pause
    exit
)

REM Copia env prod su env local
copy /Y .env.local.prod .env.local >nul

echo Database: https://wuvuapmjclahbmngntku.supabase.co
echo Ambiente: PRODUZIONE
echo Porta: 3500
echo ⚠️  Le modifiche saranno visibili pubblicamente!
echo.
echo Avvio server Next.js su localhost:3500...
echo.

REM Avvia il server in background sulla porta 3500
start "My-Hub Server PROD" cmd /c "set PORT=3500 && npm run dev"

REM Attendi 5 secondi
echo Attendo 5 secondi per l'avvio del server...
timeout /t 5 /nobreak >nul

REM Apri il browser
echo Apertura browser...
start http://localhost:3500

echo.
echo ========================================
echo Server PROD avviato!
echo ⚠️  ATTENZIONE: Modifiche visibili in produzione!
echo Database: PRODUZIONE
echo Browser aperto su http://localhost:3500
echo.
echo Per fermare il server, chiudi la finestra
echo "My-Hub Server PROD" oppure premi CTRL+C
echo ========================================
echo.
pause
