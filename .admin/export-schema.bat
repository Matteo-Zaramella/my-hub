@echo off
echo ========================================
echo   ESPORTAZIONE SCHEMA DATABASE
echo ========================================
echo.
echo Esportazione schema da database di produzione...
echo Database: wuvuapmjclahbmngntku.supabase.co
echo.

cd /d D:\Claude\my-hub

REM Esporta lo schema del database
npx supabase db dump --db-url "postgresql://postgres:YOUR_DB_PASSWORD@db.wuvuapmjclahbmngntku.supabase.co:5432/postgres" --schema public > schema_export.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Schema esportato con successo!
    echo File: schema_export.sql
    echo ========================================
) else (
    echo.
    echo ========================================
    echo ERRORE durante l'esportazione
    echo Verifica la password del database
    echo ========================================
)

echo.
pause
