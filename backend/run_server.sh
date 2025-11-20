#!/bin/bash
# Unix/Linux/macOS script to run the Meeting Minutes API server

echo "Starting Meeting Minutes API..."
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Virtual environment not found!"
    echo "Please create a virtual environment first:"
    echo "  python -m venv venv"
    echo "  source venv/bin/activate"
    echo "  pip install -r requirements.txt"
    exit 1
fi

# Activate virtual environment
source venv/bin/activate

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "WARNING: .env file not found!"
    echo "Please copy .env.example to .env and configure your API keys:"
    echo "  cp .env.example .env"
    exit 1
fi

# Run the server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

