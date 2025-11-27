@echo off
echo.
echo ========================================
echo   Killing Backend Server (Port 5000)
echo ========================================
echo.

echo Finding process on port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    set PID=%%a
    goto :found
)

echo No process found on port 5000
echo Backend is not running.
goto :end

:found
echo Found process: PID %PID%
echo Killing process...
taskkill /PID %PID% /F
echo.
echo ✅ Backend server stopped!
echo You can now restart it with: npm run dev

:end
echo.
pause
