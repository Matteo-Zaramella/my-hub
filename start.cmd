@echo off
echo ========================================
echo   MY HUB - Development Server
echo ========================================
echo.

cd /d D:\my-hub

echo [1/3] Checking for updates from GitHub...
git pull origin main

if errorlevel 1 (
    echo.
    echo WARNING: Git pull failed!
    echo Please resolve conflicts manually.
    echo.
    pause
    exit /b 1
)

echo.
echo [2/3] Checking status...
git status --short

echo.
echo [3/3] Starting development server...
echo.
echo Server will be available at:
echo   - Local:   http://localhost:3000
echo   - Network: http://192.168.1.110:3000
echo.
echo Press CTRL+C to stop the server
echo ========================================
echo.

npm run dev
