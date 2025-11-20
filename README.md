# File Upload System

A simple web-based file upload system for audio files.

## Quick Start

Just double-click **`start.bat`** to launch the application!

The script will:
1. Set up the backend (Python/FastAPI)
2. Set up the frontend (React/Vite)
3. Open two command windows for backend and frontend servers

## Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Supported File Types

- WAV
- MP3
- M4A
- FLAC

Maximum file size: 500MB

## Stopping the Servers

Simply close the two command windows that were opened by the start script.

## Manual Setup (Optional)

If you prefer to run servers manually:

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Requirements

- Python 3.8 or higher
- Node.js 16 or higher
- npm

## Project Structure

```
.
├── start.bat           # Launch script
├── backend/            # FastAPI backend
│   ├── app/
│   │   ├── main.py     # API entry point
│   │   ├── config.py   # Configuration
│   │   ├── routes/     # API routes
│   │   └── models/     # Data models
│   └── data/
│       └── uploads/    # Uploaded files stored here
└── frontend/           # React frontend
    └── src/
        ├── components/ # UI components
        ├── pages/      # Page components
        └── api/        # API client
```

