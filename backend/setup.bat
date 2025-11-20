@echo off
REM Windows setup script for Meeting Minutes

echo ================================================
echo Meeting Minutes - Setup Script
echo ================================================
echo.

REM Check Python version
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.11 or higher
    pause
    exit /b 1
)

echo.
echo Creating virtual environment...
python -m venv venv

echo.
echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Upgrading pip...
python -m pip install --upgrade pip

echo.
echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Creating .env file from template...
if not exist ".env" (
    copy .env.example .env
    echo Created .env file - please edit it with your API keys
) else (
    echo .env file already exists, skipping...
)

echo.
echo Creating data directories...
mkdir data\uploads 2>nul
mkdir data\storage 2>nul

echo.
echo ================================================
echo Setup complete!
echo ================================================
echo.
echo Next steps:
echo 1. Edit .env file with your API keys:
echo    - HUGGINGFACE_TOKEN
echo    - OPENAI_API_KEY
echo.
echo 2. Run the server:
echo    run_server.bat
echo.
echo 3. Or test with CLI:
echo    venv\Scripts\activate.bat
echo    python scripts\run_local_pipeline.py your_audio.wav
echo.
pause

