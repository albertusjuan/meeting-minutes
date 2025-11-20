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

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    echo "Installing dependencies..."
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

# Start backend in background
echo "Starting FastAPI server on http://localhost:8000"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload > ../logs/backend.log 2>&1 &
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
echo "  To stop servers:"
echo "    kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "========================================="

