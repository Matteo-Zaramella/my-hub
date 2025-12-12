@echo off
echo ========================================
echo   AVVIO SERVER DEV IN BACKGROUND
echo ========================================
echo.
echo Configurazione:
echo - Porta: 3000
echo - Database: DEV (mheowbijzaparmddumsr)
echo - Modalità: Background (nessuna finestra)
echo.

cd /d D:\Claude\my-hub

REM Copia env dev
copy /Y .env.local.dev .env.local >nul

REM Avvia in background usando PowerShell (nessuna finestra)
powershell -WindowStyle Hidden -Command "Start-Process -WindowStyle Hidden cmd -ArgumentList '/c cd /d D:\Claude\my-hub && set PORT=3000 && npm run dev'"

timeout /t 3 /nobreak >nul

echo.
echo ✅ Server DEV avviato in background!
echo    Porta: 3000
echo    URL: http://localhost:3000
echo.
echo Per fermare: STOP_SERVER.bat
echo.
pause
