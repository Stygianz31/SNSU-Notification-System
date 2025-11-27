@echo off
title SNSU Smart School Notification System - Quick Start

color 0A
echo.
echo ========================================================
echo   SNSU SMART SCHOOL NOTIFICATION SYSTEM
echo   Quick Start Script for Noemel
echo ========================================================
echo.
echo   Your official SNSU logos are integrated!
echo   System is ready to launch...
echo.
echo ========================================================
echo.

:menu
echo.
echo   What would you like to do?
echo.
echo   [1] Start Everything (Backend + Frontend)
echo   [2] Start Backend Only
echo   [3] Start Frontend Only
echo   [4] Test Connection
echo   [5] Open Documentation
echo   [6] Optimize Logos
echo   [7] View Project Status
echo   [Q] Quit
echo.
set /p choice="   Enter your choice: "

if /i "%choice%"=="1" goto startall
if /i "%choice%"=="2" goto backend
if /i "%choice%"=="3" goto frontend
if /i "%choice%"=="4" goto test
if /i "%choice%"=="5" goto docs
if /i "%choice%"=="6" goto optimize
if /i "%choice%"=="7" goto status
if /i "%choice%"=="Q" goto quit
goto menu

:startall
echo.
echo ========================================================
echo   Starting Backend and Frontend...
echo ========================================================
echo.
echo   This will open 2 terminal windows:
echo   - Terminal 1: Backend (Port 5000)
echo   - Terminal 2: Frontend (Port 8100)
echo.
echo   Wait for both to start, then visit:
echo   http://localhost:8100/
echo.
pause

start "SNSU Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start "SNSU Frontend App" cmd /k "cd frontend && npm start"

echo.
echo   Both servers starting...
echo   Backend: http://localhost:5000
echo   Frontend: http://localhost:8100
echo.
echo   Login with: admin / admin123
echo.
timeout /t 5
start http://localhost:8100
goto menu

:backend
echo.
echo   Starting Backend Server...
echo.
start "SNSU Backend Server" cmd /k "cd backend && npm run dev"
echo   Backend started on port 5000
timeout /t 3
goto menu

:frontend
echo.
echo   Starting Frontend App...
echo.
start "SNSU Frontend App" cmd /k "cd frontend && npm start"
echo   Frontend started on port 8100
timeout /t 3
start http://localhost:8100
goto menu

:test
echo.
echo ========================================================
echo   Testing System Connection...
echo ========================================================
echo.
call TEST-CONNECTION.bat
goto menu

:docs
echo.
echo   Opening Documentation...
echo.
start START-HERE.md
timeout /t 2
goto menu

:optimize
echo.
echo   Opening Logo Optimization Guide...
echo.
call OPTIMIZE-LOGOS.bat
goto menu

:status
echo.
echo   Opening Project Status...
echo.
start FINAL-STATUS-REPORT.md
timeout /t 2
goto menu

:quit
echo.
echo   Thank you for using SNSU Smart School Notification System!
echo   Made for Noemel with official SNSU branding.
echo.
timeout /t 2
exit

:error
echo.
echo   Error occurred. Please check the documentation.
pause
goto menu
