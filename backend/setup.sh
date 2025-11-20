#!/bin/bash
# Unix/Linux/macOS setup script for Meeting Minutes

echo "================================================"
echo "Meeting Minutes - Setup Script"
echo "================================================"
echo ""

# Check Python version
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.11 or higher"
    exit 1
fi

python3 --version

echo ""
echo "Creating virtual environment..."
python3 -m venv venv

echo ""
echo "Activating virtual environment..."
source venv/bin/activate

echo ""
echo "Upgrading pip..."
pip install --upgrade pip

echo ""
echo "Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "Creating .env file from template..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "Created .env file - please edit it with your API keys"
else
    echo ".env file already exists, skipping..."
fi

echo ""
echo "Creating data directories..."
mkdir -p data/uploads
mkdir -p data/storage

echo ""
echo "Making scripts executable..."
chmod +x run_server.sh
chmod +x setup.sh
chmod +x scripts/run_local_pipeline.py

echo ""
echo "================================================"
echo "Setup complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your API keys:"
echo "   - HUGGINGFACE_TOKEN"
echo "   - OPENAI_API_KEY"
echo ""
echo "2. Run the server:"
echo "   ./run_server.sh"
echo ""
echo "3. Or test with CLI:"
echo "   source venv/bin/activate"
echo "   python scripts/run_local_pipeline.py your_audio.wav"
echo ""

