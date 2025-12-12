@echo off
echo ========================================
echo   STOP ALL MY-HUB SERVERS
echo ========================================
echo.
echo Fermando tutti i server Next.js...
echo.

REM Ferma tutti i processi Node.js (Next.js usa Node)
powershell -Command "Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force"

REM Aspetta un momento
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo Tutti i server Node.js sono stati fermati!
echo Ora puoi riavviare DEV o PROD separatamente.
echo ========================================
echo.
pause
