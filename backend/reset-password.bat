@echo off
echo.
echo ========================================
echo   Password Reset Tool
echo ========================================
echo.

if "%~1"=="" (
    echo Usage: reset-password.bat [username] [new_password]
    echo.
    echo Examples:
    echo   reset-password.bat student student123
    echo   reset-password.bat teacher teacher123
    echo.
    echo If password is not provided, default is: password123
    echo.
    
    echo Current users in database:
    echo.
    npx ts-node src/scripts/listUsers.ts
    goto :end
)

cd /d "%~dp0"
npx ts-node src/scripts/resetPassword.ts %1 %2

:end
echo.
pause
