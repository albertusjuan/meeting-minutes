@echo off
REM Windows setup script for Meeting Minutes Frontend

echo ================================================
echo Meeting Minutes Frontend - Setup Script
echo ================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.
echo npm version:
npm --version
echo.

echo Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Creating .env file from template...
if not exist ".env" (
    copy .env.example .env
    echo Created .env file - please review the API URL
) else (
    echo .env file already exists, skipping...
)

echo.
echo ================================================
echo Setup complete!
echo ================================================
echo.
echo Next steps:
echo 1. Make sure the backend is running on http://localhost:8000
echo 2. Review .env file and update VITE_API_BASE_URL if needed
echo 3. Run: npm run dev
echo 4. Open: http://localhost:3000
echo.
pause

