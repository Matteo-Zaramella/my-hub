@echo off
echo ========================================
echo   AVVIO SERVER MY-HUB (AMBIENTE DEV)
echo ========================================
echo.
echo Configurazione database DEV...
echo.

cd /d D:\Claude\my-hub

REM Copia env dev su env local
copy /Y .env.local.dev .env.local >nul

echo Database: https://mheowbijzaparmddumsr.supabase.co
echo Ambiente: SVILUPPO (separato da produzione)
echo Porta: 3000
echo.
echo Avvio server Next.js su localhost:3000...
echo.

REM Avvia il server in background sulla porta 3000
start "My-Hub Server DEV" cmd /c "set PORT=3000 && npm run dev"

REM Attendi 5 secondi per dare tempo al server di avviarsi
echo Attendo 5 secondi per l'avvio del server...
timeout /t 5 /nobreak >nul

REM Apri il browser
echo Apertura browser...
start http://localhost:3000

echo.
echo ========================================
echo Server DEV avviato!
echo Database: DEV (separato da produzione)
echo Browser aperto su http://localhost:3000
echo.
echo Per fermare il server, chiudi la finestra
echo "My-Hub Server DEV" oppure premi CTRL+C
echo ========================================
echo.
pause
