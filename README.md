# Meeting Minutes - AI-Powered Transcription & Analysis

Complete backend system for meeting transcription with **speaker diarization**, **multi-language support** (Cantonese + English code-switching), and **AI-powered summaries**.

---

## 📋 Table of Contents

- [Quick Start](#-quick-start-5-minutes)
- [What You Get](#-what-you-get)
- [Installation](#-installation)
- [Usage](#-usage)
  - [CLI Tool](#option-1-cli-tool-recommended)
  - [API Server](#option-2-api-server)
- [How It Works](#-how-it-works)
- [Configuration](#-configuration)
- [API Reference](#-api-reference)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Troubleshooting](#-troubleshooting)
- [Advanced Topics](#-advanced-topics)

---

## 🚀 Quick Start (5 Minutes)

### 1. Setup

```bash
cd backend
setup.bat
```

### 2. Configure API Keys

Create `backend/.env` file:

```env
# Get from: https://huggingface.co/settings/tokens
HUGGINGFACE_TOKEN=hf_your_token_here

# LLM Provider - DeepSeek
LLM_API_KEY=sk-your_deepseek_key_here
LLM_PROVIDER=deepseek
LLM_MODEL=deepseek-chat

# Device settings
DEVICE=cpu
TORCH_DEVICE=cpu

# Other settings (defaults are fine)
UPLOAD_DIR=./data/uploads
STORAGE_DIR=./data/storage
HOST=0.0.0.0
PORT=8000
```

**Important**: Visit https://huggingface.co/pyannote/speaker-diarization-3.1 and accept the license!

**Note**: The Whisper model doesn't require license acceptance, only pyannote does.

### 3. Test It!

```bash
# Activate environment
venv\Scripts\activate

# Process a meeting
python scripts\run_local_pipeline.py your_meeting.wav
```

---

## ✨ What You Get

### Core Features

- ✅ **Speaker Diarization** - Identifies who speaks when using `pyannote/speaker-diarization-3.1`
- ✅ **Multi-language Transcription** - Transcribes Cantonese and English using `simonl0909/whisper-large-v2-cantonese`
- ✅ **Code-Switching Support** - Detects language per segment (Cantonese/English/Mixed)
- ✅ **RAG Q&A System** - Ask questions about meetings using semantic search
- ✅ **AI Summaries** - Automatic action items, key decisions, and topic extraction
- ✅ **REST API** - FastAPI with full CRUD operations
- ✅ **CLI Tool** - Test locally without running a server

### Example Output

```
Meeting ID: meeting_abc123
Duration: 1847.3 seconds
Speakers: SPEAKER_00, SPEAKER_01
Chunks: 47

📝 TRANSCRIPT:
[0.0s - 15.2s] SPEAKER_00 [zh]: 大家好，今日我哋要討論項目進度
[15.2s - 28.5s] SPEAKER_01 [en]: Yes, let me share the latest updates
[28.5s - 45.0s] SPEAKER_00 [mixed]: 好的，我同意 we should proceed

📊 SUMMARY:
The meeting discussed project progress and timeline adjustments...

✅ ACTION ITEMS:
  • Complete design review by Friday
  • Prepare presentation for client

🎯 KEY DECISIONS:
  • Approved new timeline
  • Increased budget allocation
```

---

## 📦 Installation

### Prerequisites

- Windows 10/11
- Python 3.11+
- 16GB+ RAM (32GB recommended)
- GPU optional (NVIDIA with CUDA for faster processing)

### Step-by-Step

**1. Navigate to project:**
```bash
cd backend
```

**2. Set up virtual environment:**

Using the setup script (recommended):
```bash
setup.bat
```

Or manually:
```bash
# Create virtual environment
python -m venv venv

# Activate it
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

**3. Create `.env` file:**

Create a new file `backend\.env` with notepad or your editor:
```bash
notepad .env
```

**4. Get API Keys:**

- **Hugging Face**: https://huggingface.co/settings/tokens
  - Create a token
  - **IMPORTANT**: Accept license at https://huggingface.co/pyannote/speaker-diarization-3.1
  - Note: Whisper model doesn't require license acceptance
  
- **DeepSeek**: https://platform.deepseek.com/api_keys
  - Cost-effective LLM provider
  - Good multilingual support (Cantonese + English)
  - Set `LLM_PROVIDER=deepseek` and `LLM_API_KEY=sk-xxx`

---

## 🎯 Usage

### Option 1: CLI Tool (Recommended)

**Basic usage:**
```bash
python scripts/run_local_pipeline.py meeting.wav
```

**With custom meeting ID:**
```bash
python scripts/run_local_pipeline.py meeting.wav --meeting-id team-standup-2024
```

**Test Q&A after processing:**
```bash
python scripts/run_local_pipeline.py meeting.wav --test-qa
```

**Verbose logging:**
```bash
python scripts/run_local_pipeline.py meeting.wav -v
```

**Available options:**
```bash
python scripts/run_local_pipeline.py --help
```

### Option 2: API Server

**Start the server:**
```bash
# Using launch script:
run_server.bat

# Or manually:
python -m uvicorn app.main:app --reload
```

**Interactive API docs:**
Open http://localhost:8000/docs (Swagger UI with file upload)

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
[4] LLM Summarization (DeepSeek)
    → Generates summary
    → Extracts action items & key decisions
    ↓
Complete Meeting Result
```

### Language Detection (Code-Switching)

The system detects language **per segment**, not just once:

- **Chinese ratio > 70%** → Tagged as `[zh]` (Cantonese)
- **Chinese ratio < 30%** → Tagged as `[en]` (English)
- **Chinese ratio 30-70%** → Tagged as `[mixed]` (Code-switching)

This allows accurate tracking when speakers switch languages mid-conversation.

### Tech Stack

| Component | Technology |
|-----------|-----------|
| Framework | FastAPI + Uvicorn |
| Language | Python 3.11+ |
| Diarization | pyannote/speaker-diarization-3.1 |
| ASR | simonl0909/whisper-large-v2-cantonese |
| Embeddings | sentence-transformers/all-MiniLM-L6-v2 |
| Vector Store | FAISS |
| LLM | DeepSeek (OpenAI-compatible API) |
| Validation | Pydantic v2 |

---

## ⚙️ Configuration

### Environment Variables

Edit `backend/.env`:

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

### Using GPU (Faster Processing)

If you have an NVIDIA GPU with CUDA:

```env
DEVICE=cuda
TORCH_DEVICE=cuda:0
```

**Performance boost**: 3-5x faster processing!

### Changing Models

You can use different models by updating the configuration:

```env
# Use a different Whisper model
ASR_MODEL=openai/whisper-large-v3

# Use different embedding model
EMBEDDING_MODEL=sentence-transformers/paraphrase-multilingual-mpnet-base-v2
```

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

**Response:**
```json
{
  "meeting_id": "meeting_abc123",
  "transcript": { ... },
  "summary": { ... },
  "processed_at": "2024-11-20T10:30:00Z"
}
```

#### GET `/meetings/`

List all processed meetings.

**Response:**
```json
{
  "total": 5,
  "meetings": ["meeting_abc123", "meeting_def456", ...]
}
```

#### GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "healthy"
}
```

---

## 🧪 Testing

### Test 1: Basic Processing

```bash
python scripts/run_local_pipeline.py test_audio.wav
```

**Expected**: 
- ✅ No errors
- ✅ Speakers detected
- ✅ Transcript generated
- ✅ Summary with action items

### Test 2: Language Detection

Use audio with mixed Cantonese/English and check output for language tags:
- `[zh]` for Cantonese segments
- `[en]` for English segments
- `[mixed]` for code-switched segments

### Test 3: Q&A

```bash
python scripts/run_local_pipeline.py test_audio.wav --test-qa
```

**Expected**: Relevant answers to test questions

### Test 4: API Server

```bash
# Terminal 1: Start server
run_server.bat

# Terminal 2: Test endpoints
curl http://localhost:8000/health
curl -X POST http://localhost:8000/meetings/upload -F "file=@test.wav"
```

### Performance Benchmarks

**Expected processing times** (10-minute audio):

| Component | CPU | GPU (CUDA) |
|-----------|-----|------------|
| Diarization | ~3 min | ~1 min |
| Transcription | ~5 min | ~2 min |
| RAG Indexing | ~10 sec | ~10 sec |
| LLM Summary | ~20 sec | ~20 sec |
| **Total** | **~9 min** | **~4 min** |

**Memory**: 4-8 GB RAM (CPU mode), 6-10 GB VRAM (GPU mode)

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI application entry
│   ├── config.py                  # Centralized settings
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py             # Pydantic data models
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── diarization.py         # Speaker diarization
│   │   ├── asr.py                 # Multi-language ASR
│   │   ├── llm.py                 # LLM client (DeepSeek/OpenAI)
│   │   ├── rag.py                 # RAG indexing & search
│   │   └── pipeline.py            # Main orchestration
│   │
│   ├── routes/
│   │   ├── __init__.py
│   │   └── meeting.py             # API endpoints
│   │
│   └── storage/
│       └── __init__.py            # In-memory storage
│
├── scripts/
│   └── run_local_pipeline.py      # CLI tool
│
├── pyproject.toml                 # Poetry dependencies
├── requirements.txt               # Pip dependencies
├── .env.example / env.example.txt # Environment template
├── .gitignore
│
├── setup.bat                      # Setup script
└── run_server.bat                 # Server launch script
```

### Key Files Explained

- **`app/main.py`** - FastAPI entry point, route registration
- **`app/config.py`** - All settings loaded from environment variables
- **`app/models/schemas.py`** - Data models (SpeakerSegment, TranscriptChunk, etc.)
- **`app/services/pipeline.py`** - Main orchestration logic
- **`app/services/asr.py`** - ASR with language detection (important for code-switching)
- **`scripts/run_local_pipeline.py`** - CLI tool for local testing

### Data Storage

Processed meetings are saved to `data/storage/{meeting_id}/`:

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

## 🐛 Troubleshooting

### Issue: "Token not found" or Authentication Error

**Cause**: Missing or invalid Hugging Face token

**Solution**:
1. Check `HUGGINGFACE_TOKEN` in `.env`
2. Visit https://huggingface.co/pyannote/speaker-diarization-3.1 and accept the license
3. Generate a new token at https://huggingface.co/settings/tokens

### Issue: "CUDA out of memory"

**Cause**: GPU doesn't have enough VRAM

**Solution**:
```env
# In .env, switch to CPU:
DEVICE=cpu
TORCH_DEVICE=cpu
```

### Issue: Slow Processing

**Solutions**:
- Use GPU if available (`DEVICE=cuda`)
- Process shorter audio clips
- Use faster hardware
- Close other applications

### Issue: Poor Transcription Quality

**Solutions**:
- Use higher quality audio (16kHz+, WAV format)
- Reduce background noise
- Ensure speakers are clearly audible
- Check microphone placement

### Issue: Wrong Language Detection

**Cause**: Language detection heuristics need adjustment

**Solution**: Edit `backend/app/services/asr.py` → `_detect_language()` method:
```python
# Adjust these thresholds:
if chinese_ratio > 0.7:  # Try 0.6 or 0.8
    return "zh"
elif chinese_ratio < 0.3:  # Try 0.2 or 0.4
    return "en"
```

### Issue: DeepSeek API Error

**Causes & Solutions**:
- Missing API key → Check `LLM_API_KEY` in `.env`
- No credits → Add credits to DeepSeek account
- Rate limit → Wait and retry
- Invalid model → Check `LLM_MODEL` setting (should be `deepseek-chat`)

### Issue: Module Not Found

**Cause**: Virtual environment not activated or dependencies not installed

**Solution**:
```bash
# Activate virtual environment
venv\Scripts\activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: Audio File Not Supported

**Solution**: Convert to WAV format:
```bash
# Using ffmpeg:
ffmpeg -i input.mp3 -ar 16000 -ac 1 output.wav
```

Supported formats: WAV, MP3, M4A, FLAC

---

## 🎓 Advanced Topics

### Adding a New LLM Provider

The system currently uses DeepSeek (OpenAI-compatible API). To add another provider:

1. Create a new class implementing the `LLMClient` protocol in `app/services/llm.py`
2. Update `get_llm_client()` to include your provider

Example for Anthropic:
```python
class AnthropicLLMClient:
    async def summarize_meeting(self, transcript: MeetingTranscript) -> SummaryResponse:
        # Your implementation
        pass
    
    async def answer_question(self, transcript_context: str, question: str) -> str:
        # Your implementation
        pass

def get_llm_client() -> LLMClient:
    if settings.llm_provider == "deepseek":
        return DeepSeekLLMClient()
    elif settings.llm_provider == "anthropic":
        return AnthropicLLMClient()
```

### Using Different Vector Stores

Replace FAISS in `app/services/rag.py`:

```python
# Instead of FAISS:
import chromadb

# Build ChromaDB index:
client = chromadb.Client()
collection = client.create_collection("meeting_transcripts")
collection.add(...)
```

### Customizing the Summary Prompt

Edit `app/services/llm.py` → `_build_summary_prompt()`:

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

### Processing in Python Code

```python
import asyncio
from app.services.pipeline import get_pipeline

async def process_my_meeting():
    pipeline = get_pipeline()
    result, rag_index = await pipeline.process_meeting_audio("meeting.wav")
    
    print(f"Meeting ID: {result.meeting_id}")
    print(f"Summary: {result.summary.summary}")
    
    # Ask a question
    answer, chunks = await pipeline.answer_question(
        rag_index, 
        "What were the action items?"
    )
    print(f"Answer: {answer}")

asyncio.run(process_my_meeting())
```

### Batch Processing

```python
import asyncio
from pathlib import Path
from app.services.pipeline import get_pipeline

async def batch_process(audio_files):
    pipeline = get_pipeline()
    
    for audio_file in audio_files:
        print(f"Processing {audio_file}...")
        result, index = await pipeline.process_meeting_audio(audio_file)
        pipeline.save_meeting_data(result.meeting_id, result, index)
        print(f"✅ Done: {result.meeting_id}")

audio_files = list(Path("./meetings").glob("*.wav"))
asyncio.run(batch_process(audio_files))
```

---

## 🚀 Next Steps (Future Stages)

### Stage 1 (Current) ✅
- ✅ Backend API
- ✅ Multi-language transcription with code-switching
- ✅ RAG Q&A
- ✅ CLI tool
- ✅ Local processing

### Stage 2 (Planned) 🔄
- Frontend (React/Next.js)
- Web UI for uploads
- Visual transcript viewer
- Interactive Q&A interface
- Dashboard

### Stage 3 (Planned) 📅
- Cloud deployment (AWS/GCP/Azure)
- Authentication & user management
- PostgreSQL database
- S3/blob storage
- Multi-tenant architecture

### Stage 4 (Planned) 🎯
- Real-time streaming transcription
- Speaker identification (names)
- Sentiment analysis
- Meeting analytics
- Email summaries
- Calendar integration

---

## 📊 Performance Tips

### For Faster Processing

1. **Use GPU**: Set `DEVICE=cuda` in `.env` (requires NVIDIA GPU)
2. **Pre-process audio**: Convert to 16kHz mono WAV
3. **Batch process**: Process multiple meetings in sequence
4. **Close applications**: Free up RAM/VRAM

### For Better Accuracy

1. **High-quality audio**: 16kHz+ sample rate, WAV format
2. **Clear speakers**: Good microphone placement
3. **Reduce noise**: Quiet environment, noise reduction tools
4. **Shorter segments**: Break very long meetings into parts

---

## 📝 Data Models

### TranscriptChunk
```python
{
  "chunk_id": "chunk_0001",
  "speaker_label": "SPEAKER_00",
  "start_time": 0.0,
  "end_time": 5.2,
  "text": "大家好，今日我哋開會",
  "language": "zh",
  "confidence": 0.95
}
```

### MeetingTranscript
```python
{
  "meeting_id": "meeting_abc123",
  "chunks": [...],
  "speakers": ["SPEAKER_00", "SPEAKER_01"],
  "duration": 1847.3,
  "created_at": "2024-11-20T10:30:00Z"
}
```

### SummaryResponse
```python
{
  "summary": "Meeting overview...",
  "action_items": ["Item 1", "Item 2"],
  "key_decisions": ["Decision 1"],
  "topics": ["Topic 1", "Topic 2"]
}
```

---

## 🔒 Security Notes

- ✅ `.env` is in `.gitignore` - never commit secrets
- ✅ API keys are loaded from environment only
- ✅ No hardcoded credentials
- ⚠️ Stage 1 has no authentication (local use only)
- ⚠️ Don't expose API to internet without auth (Stage 3 feature)

---

## 📞 Support & Resources

### Documentation
- This README (you're reading it!)
- API docs: http://localhost:8000/docs (when server is running)
- Inline code documentation (docstrings)

### Getting Help
- Check the Troubleshooting section above
- Review error logs (verbose mode: `-v`)
- Test with the CLI tool first before API
- Verify `.env` configuration

### Model Resources
- Hugging Face: https://huggingface.co
- PyAnnote docs: https://github.com/pyannote/pyannote-audio
- Whisper docs: https://github.com/openai/whisper
- DeepSeek docs: https://platform.deepseek.com/docs

---

## 📄 License

[Your License Here]

---

## 🎉 You're All Set!

Everything is ready for Stage 1 testing. To get started:

1. **Setup**: Run `setup.bat`
2. **Configure**: Edit `.env` with your API keys
3. **Test**: `python scripts/run_local_pipeline.py meeting.wav`

**Happy meeting processing! 🚀**

