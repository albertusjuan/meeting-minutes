@echo off
echo =========================================
echo   File Upload System - Starting...
echo =========================================
echo.

echo [1/2] Starting Backend Server...
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
    call venv\Scripts\activate.bat
    echo Installing dependencies...
    pip install -r requirements.txt
)
start "Backend (Port 8000)" cmd /k "venv\Scripts\activate && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo [2/2] Starting Frontend Server...
cd ..\frontend
if not exist node_modules (
    echo Installing dependencies...
    npm install
)
start "Frontend (Port 5173)" cmd /k "npm run dev"

cd ..

echo.
echo =========================================
echo   Servers Started!
echo =========================================
echo.
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo.
echo   Two command windows will open.
echo   Close them to stop the servers.
echo.
echo =========================================
echo.

pause

