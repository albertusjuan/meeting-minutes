# Meeting Minutes - AI-Powered Transcription & Analysis

Complete full-stack application for meeting transcription with **speaker diarization**, **multi-language support** (Cantonese + English code-switching), **AI-powered summaries**, and a modern **React frontend**.

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [How It Works](#-how-it-works)
- [Configuration](#-configuration)
- [API Reference](#-api-reference)
- [Troubleshooting](#-troubleshooting)

---

## 🚀 Quick Start

### Prerequisites
- **Windows 10/11**, macOS, or Linux
- **Python 3.11+**
- **Node.js 18+** and npm
- **16GB+ RAM** (32GB recommended)
- **Hugging Face Account** + token
- **LLM API Key** (DeepSeek recommended)

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Environment Configuration

Create a `.env` file in the project root (not in backend or frontend):

```bash
# Windows:
notepad .env

# macOS/Linux:
nano .env
```

Edit `.env`:
```env
# Get from: https://huggingface.co/settings/tokens
HUGGINGFACE_TOKEN=hf_your_token_here

# DeepSeek API (cost-effective LLM)
LLM_API_KEY=sk-your_deepseek_key_here
LLM_PROVIDER=deepseek
LLM_MODEL=deepseek-chat

# Device settings
DEVICE=cpu
TORCH_DEVICE=cpu
```

**Important**: Visit https://huggingface.co/pyannote/speaker-diarization-3.1 and accept the license!

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

The frontend will automatically use the `.env` file from the project root.

### 4. Start the Application

Use the startup script at the root:

```bash
# Windows
.\start-dev.bat

# macOS/Linux/Git Bash
./start-dev.sh
```

Or start manually:

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate  # or: source venv/bin/activate
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Access the Application

- **Frontend UI**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## ✨ Features

### Core Capabilities

- ✅ **Speaker Diarization** - Identifies who speaks when using `pyannote/speaker-diarization-3.1`
- ✅ **Multi-language Transcription** - Transcribes Cantonese and English using `simonl0909/whisper-large-v2-cantonese`
- ✅ **Code-Switching Support** - Detects language per segment (Cantonese/English/Mixed)
- ✅ **RAG Q&A System** - Ask questions about meetings using semantic search (FAISS + sentence-transformers)
- ✅ **AI Summaries** - Automatic action items, key decisions, and topic extraction
- ✅ **REST API** - FastAPI with full CRUD operations
- ✅ **Modern Web UI** - React + TypeScript + Tailwind CSS
- ✅ **CLI Tool** - Test locally without running a server

### Frontend Features

- **Drag-and-drop file upload** with progress indicators
- **Meeting list** showing recently processed meetings
- **Tabbed interface** (Summary / Transcript / Q&A)
- **Speaker-labeled transcript** with color coding
- **Timestamps** in mm:ss format
- **Language badges** (粵 for Cantonese, EN for English, MIX for mixed)
- **Interactive Q&A chat** with expandable context chunks
- **Responsive design** for all screen sizes

---

## 📦 Installation

See [Quick Start](#-quick-start) for installation steps.

### API Keys Required

**1. Hugging Face Token**
- Get from: https://huggingface.co/settings/tokens
- **IMPORTANT**: Accept license at https://huggingface.co/pyannote/speaker-diarization-3.1
- Note: Whisper model doesn't require license acceptance

**2. DeepSeek API Key** (Recommended)
- Get from: https://platform.deepseek.com/api_keys
- Cost-effective LLM provider
- Good multilingual support (Cantonese + English)

**Alternative LLM Providers:**
- OpenAI (set `LLM_PROVIDER=openai`, `LLM_API_KEY=sk-xxx`)
- Any OpenAI-compatible API

---

## 🎯 Usage

### Web Interface (Recommended)

1. Open http://localhost:5173
2. Drag and drop an audio file (WAV, MP3, M4A, FLAC)
3. Click "Upload & Process Meeting"
4. Wait for processing (may take several minutes)
5. View summary, transcript, and ask questions!

### CLI Tool

```bash
cd backend
venv\Scripts\activate  # or: source venv/bin/activate

# Basic usage
python scripts/run_local_pipeline.py meeting.wav

# With custom meeting ID
python scripts/run_local_pipeline.py meeting.wav --meeting-id team-standup-2024

# Test Q&A after processing
python scripts/run_local_pipeline.py meeting.wav --test-qa

# Verbose logging
python scripts/run_local_pipeline.py meeting.wav -v
```

### API Usage

**Upload a meeting:**
```bash
curl -X POST "http://localhost:8000/meetings/upload" \
  -F "file=@meeting.wav"
```

**Ask a question:**
```bash
curl -X POST "http://localhost:8000/meetings/qa/MEETING_ID" \
  -H "Content-Type: application/json" \
  -d '{"question": "What were the main action items?"}'
```

**Get meeting details:**
```bash
curl http://localhost:8000/meetings/MEETING_ID
```

**List all meetings:**
```bash
curl http://localhost:8000/meetings/
```

---

## 📁 Project Structure

```
meeting-minutes-1/
├── backend/                     # Python backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py             # FastAPI application entry
│   │   ├── config.py           # Centralized settings
│   │   ├── models/
│   │   │   └── schemas.py      # Pydantic data models
│   │   ├── services/
│   │   │   ├── diarization.py  # Speaker diarization
│   │   │   ├── asr.py          # Multi-language ASR
│   │   │   ├── llm.py          # LLM client
│   │   │   ├── rag.py          # RAG indexing & search
│   │   │   └── pipeline.py     # Main orchestration
│   │   ├── routes/
│   │   │   └── meeting.py      # API endpoints
│   │   └── storage/
│   │       └── __init__.py     # In-memory storage
│   ├── scripts/
│   │   └── run_local_pipeline.py  # CLI tool
│   ├── pyproject.toml
│   ├── requirements.txt
│   └── env.example.txt
│
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── api/                # API client layer
│   │   │   ├── client.ts       # Axios instance
│   │   │   └── meetings.ts     # Meeting API functions
│   │   ├── components/         # React components
│   │   │   ├── FileUpload.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── MeetingList.tsx
│   │   │   ├── QAChat.tsx
│   │   │   ├── SummaryPanel.tsx
│   │   │   └── TranscriptView.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   └── MeetingDetail.tsx
│   │   ├── types/
│   │   │   └── meeting.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── env.example.txt
│
├── start-dev.sh                # Start both services (Unix/macOS/Git Bash)
├── start-dev.bat               # Start both services (Windows)
├── README.md                   # This file
└── TESTING_GUIDE.md           # Testing guide
```

---

## 🔍 How It Works

### Pipeline Overview

```
Audio File
    ↓
[1] Speaker Diarization (pyannote)
    → Identifies speaker segments with timestamps
    ↓
[2] Multi-language ASR (Whisper)
    → Transcribes each segment
    → Detects language per segment (zh/en/mixed)
    ↓
[3] RAG Index Building (FAISS)
    → Creates vector embeddings
    → Enables semantic search
    ↓
[4] LLM Summarization (DeepSeek/OpenAI)
    → Generates summary
    → Extracts action items & key decisions
    ↓
Complete Meeting Result
    ↓
Frontend Display
```

### Language Detection (Code-Switching)

The system detects language **per segment**, not just once:

- **Chinese ratio > 70%** → Tagged as `[zh]` (Cantonese)
- **Chinese ratio < 30%** → Tagged as `[en]` (English)
- **Chinese ratio 30-70%** → Tagged as `[mixed]` (Code-switching)

This allows accurate tracking when speakers switch languages mid-conversation.

### Tech Stack

**Backend:**
- Framework: FastAPI + Uvicorn
- Language: Python 3.11+
- Diarization: pyannote/speaker-diarization-3.1
- ASR: simonl0909/whisper-large-v2-cantonese
- Embeddings: sentence-transformers/all-MiniLM-L6-v2
- Vector Store: FAISS
- LLM: DeepSeek (OpenAI-compatible API)
- Validation: Pydantic v2

**Frontend:**
- Framework: React 18 + TypeScript
- Build Tool: Vite
- Styling: Tailwind CSS
- HTTP Client: Axios
- Routing: React Router

---

## ⚙️ Configuration

### Environment Variables

Edit `.env` in the project root:

```env
# Required
HUGGINGFACE_TOKEN=hf_xxxxx
LLM_API_KEY=sk-xxxxx

# Models (change if needed)
DIARIZATION_MODEL=pyannote/speaker-diarization-3.1
ASR_MODEL=simonl0909/whisper-large-v2-cantonese
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2

# LLM
LLM_PROVIDER=deepseek
LLM_MODEL=deepseek-chat

# Device (use "cuda" if you have GPU)
DEVICE=cpu
TORCH_DEVICE=cpu

# Storage
UPLOAD_DIR=./data/uploads
STORAGE_DIR=./data/storage

# Server
HOST=0.0.0.0
PORT=8000

# RAG
RAG_CHUNK_MAX_TOKENS=500
RAG_TOP_K=5
```

The frontend configuration is included in the same `.env` file above (VITE_API_BASE_URL).

### Using GPU (Faster Processing)

If you have an NVIDIA GPU with CUDA:

```env
DEVICE=cuda
TORCH_DEVICE=cuda:0
```

**Performance boost**: 3-5x faster processing!

---

## 📡 API Reference

### Endpoints

#### POST `/meetings/upload`

Upload and process a meeting audio file.

**Request:**
- Multipart form data with `file` field
- Supported formats: WAV, MP3, M4A, FLAC

**Response:**
```json
{
  "meeting_id": "meeting_abc123",
  "message": "Meeting processed successfully",
  "transcript_preview": "[0.0s - 5.0s] SPEAKER_00 [zh]: ...",
  "summary": {
    "summary": "Meeting overview...",
    "action_items": ["Item 1", "Item 2"],
    "key_decisions": ["Decision 1"],
    "topics": ["Topic 1", "Topic 2"]
  }
}
```

#### POST `/meetings/qa/{meeting_id}`

Ask a question about a meeting.

**Request:**
```json
{
  "question": "What were the main action items?",
  "top_k": 5
}
```

**Response:**
```json
{
  "question": "What were the main action items?",
  "answer": "The main action items were...",
  "context_chunks": [
    {
      "chunk_id": "chunk_0012",
      "speaker_label": "SPEAKER_00",
      "start_time": 45.2,
      "end_time": 52.8,
      "text": "John, can you review the budget?",
      "language": "en"
    }
  ]
}
```

#### GET `/meetings/{meeting_id}`

Get meeting details.

#### GET `/meetings/`

List all processed meetings.

#### GET `/health`

Health check endpoint.

---

## 🐛 Troubleshooting

### Backend Issues

**"Token not found" or Authentication Error**
- Check `HUGGINGFACE_TOKEN` in `.env` (project root)
- Visit https://huggingface.co/pyannote/speaker-diarization-3.1 and accept the license
- Generate a new token at https://huggingface.co/settings/tokens

**"CUDA out of memory"**
```env
# In .env (project root), switch to CPU:
DEVICE=cpu
TORCH_DEVICE=cpu
```

**Slow Processing**
- Use GPU if available (`DEVICE=cuda`)
- Process shorter audio clips
- Use faster hardware

**Poor Transcription Quality**
- Use higher quality audio (16kHz+, WAV format)
- Reduce background noise
- Ensure speakers are clearly audible

**DeepSeek API Error**
- Check `LLM_API_KEY` in `.env` (project root)
- Add credits to DeepSeek account
- Check `LLM_MODEL` setting (should be `deepseek-chat`)

**Module Not Found**
```bash
# Activate virtual environment
venv\Scripts\activate  # Windows
source venv/bin/activate  # Unix/macOS

# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend Issues

**"Failed to fetch" errors**
- Check backend is running on http://localhost:8000
- Verify `VITE_API_BASE_URL` in `.env` (project root)
- Check CORS settings on backend

**Upload fails**
- Ensure file is supported format (WAV, MP3, M4A, FLAC)
- Check file size (backend may have limits)
- Verify backend is processing correctly

**Meeting not loading**
- Check browser console for errors
- Verify meeting_id is correct
- Check backend logs for processing status

**Frontend won't start**
```bash
cd frontend
rm -rf node_modules  # or: rmdir /s /q node_modules on Windows
npm install
```

---

## 📊 Performance

### Processing Time (CPU)
- 10-minute meeting → ~10 minutes processing
- 30-minute meeting → ~30 minutes processing

### With GPU (CUDA)
- 10-minute meeting → ~3-5 minutes processing
- 30-minute meeting → ~10-15 minutes processing

### Memory Requirements
- CPU mode: 4-8 GB RAM
- GPU mode: 6-10 GB VRAM + 4 GB RAM

---

## 🎓 Advanced Topics

### Adding a New LLM Provider

Create a new class implementing the `LLMClient` protocol in `backend/app/services/llm.py`:

```python
class AnthropicLLMClient:
    async def summarize_meeting(self, transcript: MeetingTranscript) -> SummaryResponse:
        # Your implementation
        pass
    
    async def answer_question(self, transcript_context: str, question: str) -> str:
        # Your implementation
        pass
```

### Customizing the Summary Prompt

Edit `backend/app/services/llm.py` → `_build_summary_prompt()`:

```python
def _build_summary_prompt(self, transcript, speaker_info, duration):
    return f"""
    Custom instructions here...
    
    Transcript:
    {transcript}
    
    Output format:
    - Your custom format
    """
```

### Adjusting Language Detection

Edit `backend/app/services/asr.py` → `_detect_language()` method:

```python
# Adjust these thresholds:
if chinese_ratio > 0.7:  # Try 0.6 or 0.8
    return "zh"
elif chinese_ratio < 0.3:  # Try 0.2 or 0.4
    return "en"
```

---

## 🔒 Security Notes

- ✅ `.env` is in `.gitignore` - never commit secrets
- ✅ API keys are loaded from environment only
- ✅ No hardcoded credentials
- ⚠️ Current version has no authentication (local use only)
- ⚠️ Don't expose API to internet without auth

---

## 📝 Data Storage

Processed meetings are saved to `backend/data/storage/{meeting_id}/` (configurable in `.env`):

```
data/storage/meeting_abc123/
├── transcript.json       # Structured transcript data
├── transcript.txt        # Human-readable text
├── summary.json          # AI-generated summary
└── rag_index/           # Vector index
    ├── faiss.index
    └── chunks.json
```

---

## 🚀 Future Enhancements

### Planned Features
- Real-time streaming transcription
- Speaker identification (names)
- Sentiment analysis
- Meeting analytics dashboard
- Email summaries
- Calendar integration
- Export transcript as PDF/Word
- Audio playback with timestamp sync
- User authentication
- Cloud deployment

---

## 📞 Support

For issues and questions:
- Check the [Troubleshooting](#-troubleshooting) section
- Review the [TESTING_GUIDE.md](TESTING_GUIDE.md)
- Check browser/terminal console for errors

---

## 📄 License

[Your License Here]

---

## 🎉 You're All Set!

Everything is ready to use. To get started:

1. **Setup**: Follow the [Quick Start](#-quick-start) guide
2. **Configure**: Edit `.env` files with your API keys
3. **Start**: Run `start-dev.bat` (Windows) or `start-dev.sh` (Unix/macOS/Git Bash)
4. **Test**: Upload a meeting at http://localhost:5173

**Happy meeting processing! 🚀**
