@echo off
echo ========================================
echo DATABASE CLEANUP SCRIPT
echo ========================================
echo.
echo This will delete all test data and keep only admin user
echo.
pause
echo.
echo Running cleanup...
echo.
cd backend
npx ts-node src/scripts/cleanTestData.ts
echo.
echo ========================================
echo Done! Press any key to exit...
pause > nul
