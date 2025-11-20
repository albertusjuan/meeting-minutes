@echo off
REM Windows batch script to run the Meeting Minutes API server

echo Starting Meeting Minutes API...
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo Virtual environment not found!
    echo Please run setup.bat first or create a virtual environment.
    pause
    exit /b 1
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Check if .env file exists
if not exist ".env" (
    echo WARNING: .env file not found!
    echo Please copy .env.example to .env and configure your API keys.
    pause
    exit /b 1
)

REM Run the server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause

