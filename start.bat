@echo off
echo Starting Creative Language Translator...
echo.

echo Starting Backend Server...
start "Backend" cmd /k "cd /workspace && source venv/bin/activate && cd backend && python3 main.py"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend" cmd /k "npm start"

echo.
echo Both servers are starting!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
pause