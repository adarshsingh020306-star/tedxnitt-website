@echo off
title TEDxNITT Website
cd /d "%~dp0"
echo.
echo  Starting the TEDxNITT website...
echo  Your browser will open automatically in a few seconds.
echo  KEEP THIS WINDOW OPEN while using the site. Press Ctrl+C to stop.
echo.
start "" cmd /c "timeout /t 8 >nul & start http://localhost:3000"
call npm run dev
pause
