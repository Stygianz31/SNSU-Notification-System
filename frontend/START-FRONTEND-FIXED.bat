@echo off
echo ==========================================
echo  STARTING FRONTEND - FIXED VERSION
echo ==========================================
echo.
echo Stopping any running processes on port 8100...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8100" ^| find "LISTENING"') do taskkill /F /PID %%a 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Starting Vite development server...
echo.
cd /d "%~dp0frontend"
npm start

pause
