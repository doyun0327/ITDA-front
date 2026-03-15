@echo off
setlocal

echo [1/2] Building frontend on Windows...
cd /d C:\ITDA_frontend\itda-frontend

call npm run build
IF %ERRORLEVEL% NEQ 0 (
  echo npm run build failed.
  exit /b 1
)

echo.
echo [2/2] Copy build to WSL...

wsl rm -rf ~/itda-frontend
wsl mkdir -p ~/itda-frontend
wsl cp -r /mnt/c/ITDA_frontend/itda-frontend/build/* ~/itda-frontend/

echo Starting server...
wsl bash -c "cd ~/itda-frontend && npx serve -s . -l 4000"

endlocal