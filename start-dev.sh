#!/bin/bash
# Local development script - starts both backend and frontend

set -e

echo "=================================="
echo "Meeting Minutes - Local Dev Setup"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down services...${NC}"
    kill $(jobs -p) 2>/dev/null
    exit 0
}

# Trap CTRL+C and cleanup
trap cleanup SIGINT SIGTERM

# Check backend requirements
echo -e "${GREEN}[1/4] Checking backend...${NC}"
cd backend

if [ ! -d "venv" ]; then
    echo -e "${RED}Error: Virtual environment not found in backend/venv${NC}"
    echo "Please create it first:"
    echo "  cd backend"
    echo "  python -m venv venv"
    echo "  source venv/bin/activate  # or 'venv\\Scripts\\activate' on Windows"
    echo "  pip install -r requirements.txt"
    exit 1
fi

cd ..
if [ ! -f ".env" ]; then
    echo -e "${RED}Error: .env file not found in project root${NC}"
    echo "Please configure your API keys in .env"
    exit 1
fi
cd backend

# Check frontend requirements
echo -e "${GREEN}[2/4] Checking frontend...${NC}"
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo -e "${RED}Error: node_modules not found in frontend/${NC}"
    echo "Please install dependencies first:"
    echo "  cd frontend"
    echo "  npm install"
    exit 1
fi

# Frontend uses root .env file via Vite

cd ..

# Start backend
echo -e "${GREEN}[3/4] Starting backend server...${NC}"
cd backend
source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null || . venv/bin/activate
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Start frontend
echo -e "${GREEN}[4/4] Starting frontend dev server...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo -e "${GREEN}=================================="
echo "✓ Services Started Successfully!"
echo "==================================${NC}"
echo ""
echo "Backend API:  http://localhost:8000"
echo "API Docs:     http://localhost:8000/docs"
echo "Frontend:     http://localhost:5173"
echo ""
echo -e "${YELLOW}Press CTRL+C to stop all services${NC}"
echo ""

# Wait for both processes
wait

