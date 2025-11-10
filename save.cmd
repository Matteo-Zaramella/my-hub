@echo off
echo ========================================
echo   MY HUB - Save and Push Changes
echo ========================================
echo.

cd /d D:\my-hub

echo [1/4] Checking current changes...
git status

echo.
echo [2/4] Adding all changes...
git add .

echo.
set /p commit_msg="Enter commit message: "

if "%commit_msg%"=="" (
    set commit_msg=Update: latest changes
)

echo.
echo [3/4] Creating commit...
git commit -m "%commit_msg%"

if errorlevel 1 (
    echo.
    echo No changes to commit or commit failed.
    pause
    exit /b 1
)

echo.
echo [4/4] Pushing to GitHub...
git push origin main

if errorlevel 1 (
    echo.
    echo ERROR: Push failed!
    echo Try: git pull origin main --rebase
    echo Then: git push origin main
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS! Changes saved to GitHub
echo ========================================
echo.
pause
