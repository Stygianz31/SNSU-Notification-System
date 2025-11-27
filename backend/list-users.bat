@echo off
echo.
echo ========================================
echo   Listing All Users in Database
echo ========================================
echo.

cd /d "%~dp0"
npx ts-node src/scripts/listUsers.ts

echo.
pause
