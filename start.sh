#!/bin/bash

# File Upload System Startup Script
# This script starts both the backend (FastAPI) and frontend (Vite + React)

set -e  # Exit on any error

echo "========================================="
echo "  File Upload System - Starting..."
echo "========================================="
echo ""

# Check prerequisites
echo "[1/2] Starting Backend Server..."
cd backend

# Detect OS and set activation script path
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    ACTIVATE_SCRIPT="venv/Scripts/activate"
    PYTHON_CMD="python"
else
    ACTIVATE_SCRIPT="venv/bin/activate"
    PYTHON_CMD="python3"
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    $PYTHON_CMD -m venv venv
    source $ACTIVATE_SCRIPT
    echo "Installing dependencies..."
    pip install -r requirements.txt
else
    source $ACTIVATE_SCRIPT
fi

# Start backend in background
echo "Starting FastAPI server on http://localhost:8000"
$PYTHON_CMD -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to be ready
echo "Waiting for backend to start..."
for i in {1..30}; do
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        echo "✓ Backend is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "✗ Backend failed to start. Check logs/backend.log"
        exit 1
    fi
    sleep 1
done

cd ..

echo ""
echo "[2/2] Starting Frontend Server..."
cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start frontend in background
echo "Starting Vite dev server on http://localhost:5173"
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

cd ..

# Create logs directory if it doesn't exist
mkdir -p logs

echo ""
echo "========================================="
echo "  Servers Started!"
echo "========================================="
echo ""
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
echo ""
echo "  Logs:"
echo "    Backend:  logs/backend.log"
echo "    Frontend: logs/frontend.log"
echo ""
echo "  Press Ctrl+C to stop both servers"
echo ""
echo "========================================="

# Trap SIGINT (Ctrl+C) to cleanup
trap 'echo ""; echo "Stopping servers..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit' INT TERM

# Keep script running and wait for background processes
echo ""
echo "Servers are running. Monitoring processes..."
wait

