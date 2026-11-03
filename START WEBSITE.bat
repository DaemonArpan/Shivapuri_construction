@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js is required. Install Node.js, then run this file again.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing website dependencies for the first run...
  call npm install
  if errorlevel 1 goto failed
)

echo Starting the Shivapuri Group website. Keep this window open while browsing.
call npm run dev -- --host 127.0.0.1 --open
if errorlevel 1 goto failed
goto end

:failed
echo Website startup failed. Check the messages above.
pause

:end
endlocal
