@echo off
echo ========================================
echo   AVVIO SERVER PROD IN BACKGROUND
echo ========================================
echo.
echo ⚠️  ATTENZIONE: DATABASE DI PRODUZIONE!
echo.
echo Configurazione:
echo - Porta: 3500
echo - Database: PROD (wuvuapmjclahbmngntku)
echo - Modalità: Background (nessuna finestra)
echo.

cd /d D:\Claude\my-hub

REM Copia env prod
copy /Y .env.local.prod .env.local >nul

REM Avvia in background usando PowerShell (nessuna finestra)
powershell -WindowStyle Hidden -Command "Start-Process -WindowStyle Hidden cmd -ArgumentList '/c cd /d D:\Claude\my-hub && set PORT=3500 && npm run dev'"

timeout /t 3 /nobreak >nul

echo.
echo ✅ Server PROD avviato in background!
echo    Porta: 3500
echo    URL: http://localhost:3500
echo    ⚠️  Database: PRODUZIONE
echo.
echo Per fermare: STOP_SERVER.bat
echo.
pause
