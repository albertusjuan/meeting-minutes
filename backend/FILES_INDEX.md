# Meeting Minutes - Complete Files Index

## 📂 Project Structure

```
backend/
├── 📄 Documentation
│   ├── README.md              # Complete documentation
│   ├── QUICKSTART.md          # 5-minute getting started guide
│   ├── TESTING_GUIDE.md       # Comprehensive testing guide
│   └── FILES_INDEX.md         # This file
│
├── ⚙️ Configuration
│   ├── .env.example           # Environment variables template
│   ├── pyproject.toml         # Poetry dependencies
│   ├── requirements.txt       # Pip dependencies
│   └── .gitignore            # Git ignore rules
│
├── 🚀 Launch Scripts
│   ├── setup.sh              # Unix/Linux/macOS setup
│   ├── setup.bat             # Windows setup
│   ├── run_server.sh         # Unix/Linux/macOS server
│   └── run_server.bat        # Windows server
│
├── 🏗️ Application Code
│   └── app/
│       ├── __init__.py
│       ├── main.py           # FastAPI entry point
│       ├── config.py         # Settings & environment
│       │
│       ├── 📊 Data Models
│       │   └── models/
│       │       ├── __init__.py
│       │       └── schemas.py    # Pydantic models
│       │
│       ├── 🔧 Services (Core Logic)
│       │   └── services/
│       │       ├── __init__.py
│       │       ├── diarization.py   # Speaker diarization
│       │       ├── asr.py           # Multi-language ASR
│       │       ├── llm.py           # LLM client
│       │       ├── rag.py           # RAG indexing/search
│       │       └── pipeline.py     # Main orchestration
│       │
│       ├── 🌐 API Routes
│       │   └── routes/
│       │       ├── __init__.py
│       │       └── meeting.py      # API endpoints
│       │
│       └── 💾 Storage
│           └── storage/
│               └── __init__.py     # In-memory storage
│
└── 📜 Scripts
    └── scripts/
        └── run_local_pipeline.py   # CLI tool
```

---

## 📋 File-by-File Reference

### Documentation Files

#### `README.md`
**Purpose**: Complete project documentation  
**Contains**:
- Feature overview
- Architecture explanation
- Installation instructions
- API usage examples
- Configuration guide
- Troubleshooting tips

**Read this**: For comprehensive understanding of the system

---

#### `QUICKSTART.md`
**Purpose**: Get started in 5 minutes  
**Contains**:
- Quick setup steps
- First upload example
- API usage examples
- Common issues

**Read this**: If you want to start testing immediately

---

#### `TESTING_GUIDE.md`
**Purpose**: Comprehensive testing guide  
**Contains**:
- Test suite (8 tests)
- Performance benchmarks
- Debugging tips
- Acceptance criteria

**Read this**: Before running tests or reporting issues

---

#### `FILES_INDEX.md`
**Purpose**: This file - complete file reference  
**Contains**:
- Project structure
- File descriptions
- Quick reference

**Read this**: To understand what each file does

---

### Configuration Files

#### `.env.example`
**Purpose**: Environment variables template  
**Action Required**: Copy to `.env` and fill in:
```env
HUGGINGFACE_TOKEN=your_token
OPENAI_API_KEY=your_key
```

**Used by**: `app/config.py`

---

#### `pyproject.toml`
**Purpose**: Poetry dependency management  
**Contains**:
- Python version requirement (3.11+)
- All dependencies with versions
- Black/Ruff configuration

**Used by**: `poetry install`

---

#### `requirements.txt`
**Purpose**: Pip dependency management  
**Contains**: Same dependencies as pyproject.toml  
**Used by**: `pip install -r requirements.txt`

---

#### `.gitignore`
**Purpose**: Git ignore rules  
**Excludes**:
- Python cache files
- Virtual environments
- `.env` (secrets)
- Data/audio files
- Model cache

---

### Launch Scripts

#### `setup.sh` / `setup.bat`
**Purpose**: Automated setup  
**Does**:
1. Creates virtual environment
2. Installs dependencies
3. Creates `.env` from template
4. Creates data directories

**Run**: Once, before first use

---

#### `run_server.sh` / `run_server.bat`
**Purpose**: Start API server  
**Does**:
1. Activates venv
2. Checks `.env` exists
3. Runs `uvicorn app.main:app --reload`

**Run**: When you want to use the API

---

### Application Code

#### `app/__init__.py`
**Purpose**: Package initialization  
**Contains**: Version info

---

#### `app/main.py` ⭐
**Purpose**: FastAPI application entry point  
**Contains**:
- App initialization
- CORS middleware
- Route inclusion
- Lifespan events
- Health check endpoint

**Key Functions**:
- `lifespan()` - Startup/shutdown
- `root()` - API info endpoint
- `health_check()` - Health check

**Used by**: `uvicorn` to start server

---

#### `app/config.py` ⭐
**Purpose**: Centralized configuration  
**Contains**:
- `Settings` class (Pydantic BaseSettings)
- All environment variables
- Model IDs
- Paths
- Device config

**Key Settings**:
- `huggingface_token` - HF authentication
- `openai_api_key` - LLM API key
- `diarization_model` - Speaker diarization model ID
- `asr_model` - Whisper model ID
- `device` - CPU/CUDA

**Used by**: All services

---

### Data Models

#### `app/models/schemas.py` ⭐
**Purpose**: All Pydantic data models  
**Contains**:

**Models**:
- `SpeakerSegment` - Speaker + timestamps
- `TranscriptChunk` - Transcribed text + metadata (including language)
- `MeetingTranscript` - Complete transcript
- `SummaryResponse` - AI summary
- `MeetingResult` - Complete result
- `QARequest/QAResponse` - Q&A structures
- `UploadResponse` - Upload API response

**Key Features**:
- Type validation
- JSON serialization
- Helper methods (e.g., `to_context_string()`)

**Used by**: All modules for data exchange

---

### Services (Core Logic)

#### `app/services/diarization.py` ⭐
**Purpose**: Speaker diarization service  
**Model**: `pyannote/speaker-diarization-3.1`

**Key Class**: `DiarizationService`
**Key Function**: `run_diarization(audio_path) -> list[SpeakerSegment]`

**Does**:
1. Loads pyannote pipeline
2. Authenticates with HF token
3. Runs diarization
4. Returns speaker segments with timestamps

**Used by**: `pipeline.py`

---

#### `app/services/asr.py` ⭐⭐
**Purpose**: Multi-language ASR with code-switching  
**Model**: `simonl0909/whisper-large-v2-cantonese`

**Key Class**: `ASRService`
**Key Functions**:
- `transcribe_segment(audio, start, end) -> (text, language)`
- `_detect_language(text) -> language_code`

**Does**:
1. Extracts audio segment
2. Transcribes with Whisper
3. Detects language (zh/en/mixed)
4. Returns text + language tag

**Language Detection Logic**:
- Counts Chinese characters vs ASCII
- Ratio > 0.7 → "zh" (Cantonese)
- Ratio < 0.3 → "en" (English)
- Else → "mixed" (code-switching)

**Used by**: `pipeline.py`

---

#### `app/services/llm.py` ⭐
**Purpose**: LLM client abstraction  
**Provider**: OpenAI (extensible)

**Key Protocol**: `LLMClient`
**Key Class**: `OpenAILLMClient`

**Key Functions**:
- `summarize_meeting(transcript) -> SummaryResponse`
- `answer_question(context, question) -> str`

**Does**:
1. Builds prompts from transcript
2. Calls OpenAI API
3. Parses responses
4. Returns structured data

**Extensibility**: Implement `LLMClient` protocol for new providers

**Used by**: `pipeline.py`

---

#### `app/services/rag.py` ⭐
**Purpose**: RAG indexing and semantic search  
**Model**: `sentence-transformers/all-MiniLM-L6-v2`
**Vector Store**: FAISS

**Key Classes**:
- `RagIndex` - Vector index wrapper
- `RAGService` - Index building/querying

**Key Functions**:
- `build_index(chunks) -> RagIndex`
- `query_index(index, question, top_k) -> list[TranscriptChunk]`

**Does**:
1. Embeds transcript chunks
2. Builds FAISS index
3. Performs semantic search
4. Returns relevant chunks

**Used by**: `pipeline.py`

---

#### `app/services/pipeline.py` ⭐⭐⭐
**Purpose**: Main orchestration - ties everything together  
**Key Class**: `MeetingPipeline`

**Main Function**: `process_meeting_audio(audio_path) -> (MeetingResult, RagIndex)`

**Pipeline Flow**:
1. Run diarization → speaker segments
2. Transcribe each segment → chunks with language
3. Build structured transcript
4. Build RAG index
5. Generate LLM summary
6. Return complete result

**Other Functions**:
- `answer_question()` - RAG-based Q&A
- `save_meeting_data()` - Persist to disk
- `load_meeting_data()` - Load from disk

**Used by**: API routes & CLI script

---

### API Routes

#### `app/routes/meeting.py` ⭐
**Purpose**: REST API endpoints  

**Endpoints**:

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/meetings/upload` | Upload & process audio |
| POST | `/meetings/qa/{id}` | Ask question |
| GET | `/meetings/{id}` | Get meeting details |
| GET | `/meetings/` | List all meetings |

**Key Handlers**:
- `upload_meeting()` - Processes uploaded audio
- `ask_question()` - RAG-based Q&A
- `get_meeting()` - Retrieves meeting data
- `list_meetings()` - Lists all meetings

**Used by**: FastAPI app in `main.py`

---

### Storage

#### `app/storage/__init__.py`
**Purpose**: In-memory storage (Stage 1)  
**Key Class**: `MeetingStorage`

**Methods**:
- `store_meeting()` - Save to memory
- `get_meeting()` - Retrieve from memory
- `get_index()` - Get RAG index
- `list_meetings()` - List all IDs

**Note**: Data lost on server restart (but persists to disk)

**Future**: Replace with database (PostgreSQL)

---

### Scripts

#### `scripts/run_local_pipeline.py` ⭐⭐
**Purpose**: CLI tool for local testing  

**Usage**:
```bash
python scripts/run_local_pipeline.py audio.wav
python scripts/run_local_pipeline.py audio.wav --test-qa
python scripts/run_local_pipeline.py audio.wav --meeting-id custom-id
```

**Does**:
1. Processes audio through pipeline
2. Displays results (transcript, summary)
3. Optionally tests Q&A
4. Saves to disk

**Use this**: For testing without running API server

---

## 🎯 Quick Reference: Key Files to Know

### For Users (Getting Started)

1. **QUICKSTART.md** - Start here!
2. **README.md** - Full docs
3. **setup.sh / setup.bat** - Run this first
4. **.env.example** - Configure this (copy to `.env`)

### For Testing

1. **TESTING_GUIDE.md** - Test procedures
2. **scripts/run_local_pipeline.py** - CLI tool
3. **run_server.sh / run_server.bat** - API server

### For Developers (Modifying Code)

1. **app/config.py** - Change settings
2. **app/services/pipeline.py** - Main orchestration
3. **app/services/asr.py** - Transcription & language detection
4. **app/services/llm.py** - Add new LLM providers
5. **app/models/schemas.py** - Data structures

### For Debugging

1. **app/config.py** - Check settings
2. **app/services/*.py** - Check logs in each service
3. **.env** - Verify API keys

---

## 📊 Dependencies Flow

```
main.py
  ├── routes/meeting.py
  │   ├── services/pipeline.py
  │   │   ├── services/diarization.py
  │   │   ├── services/asr.py
  │   │   ├── services/rag.py
  │   │   └── services/llm.py
  │   └── storage/__init__.py
  └── config.py
```

---

## 🔗 Data Flow

```
Audio File
    ↓
[diarization.py] → SpeakerSegment[]
    ↓
[asr.py] → TranscriptChunk[] (with language tags)
    ↓
[pipeline.py] → MeetingTranscript
    ↓
[rag.py] → RagIndex
    ↓
[llm.py] → SummaryResponse
    ↓
MeetingResult → API Response / CLI Output
```

---

## 💡 Usage Patterns

### Pattern 1: Quick Test (CLI)
```bash
python scripts/run_local_pipeline.py meeting.wav
```
**Uses**: `run_local_pipeline.py` → `pipeline.py` → all services

---

### Pattern 2: API Upload
```bash
curl -X POST http://localhost:8000/meetings/upload -F "file=@meeting.wav"
```
**Uses**: `meeting.py` → `pipeline.py` → all services → `storage`

---

### Pattern 3: Q&A
```bash
curl -X POST http://localhost:8000/meetings/qa/meeting_id -d '{"question":"..."}'
```
**Uses**: `meeting.py` → `pipeline.py` → `rag.py` + `llm.py`

---

## 🎓 Learning Path

### Beginner (Just Want to Use It)
1. Read **QUICKSTART.md**
2. Run **setup.sh**
3. Try **run_local_pipeline.py**

### Intermediate (Want to Customize)
1. Read **README.md**
2. Explore **app/config.py**
3. Modify **app/services/llm.py** (add providers)

### Advanced (Want to Extend)
1. Read **app/services/pipeline.py**
2. Read **app/services/asr.py** (language detection)
3. Read **TESTING_GUIDE.md**
4. Add features to **app/routes/meeting.py**

---

## 🔍 Finding Specific Functionality

| I want to... | Look in... |
|--------------|------------|
| Change models | `app/config.py` |
| Adjust language detection | `app/services/asr.py` → `_detect_language()` |
| Change summary format | `app/services/llm.py` → `_build_summary_prompt()` |
| Add API endpoint | `app/routes/meeting.py` |
| Change RAG logic | `app/services/rag.py` |
| Modify pipeline steps | `app/services/pipeline.py` |
| Add new data field | `app/models/schemas.py` |

---

## ✅ Files Checklist (All Implemented)

- [x] app/__init__.py
- [x] app/main.py
- [x] app/config.py
- [x] app/models/__init__.py
- [x] app/models/schemas.py
- [x] app/services/__init__.py
- [x] app/services/diarization.py
- [x] app/services/asr.py
- [x] app/services/llm.py
- [x] app/services/rag.py
- [x] app/services/pipeline.py
- [x] app/routes/__init__.py
- [x] app/routes/meeting.py
- [x] app/storage/__init__.py
- [x] scripts/run_local_pipeline.py
- [x] pyproject.toml
- [x] requirements.txt
- [x] .env.example
- [x] .gitignore
- [x] setup.sh / setup.bat
- [x] run_server.sh / run_server.bat
- [x] README.md
- [x] QUICKSTART.md
- [x] TESTING_GUIDE.md
- [x] FILES_INDEX.md

**Total: 28 files, all complete! ✅**

---

## 🎉 You're All Set!

Everything is ready for Stage 1. Start with [QUICKSTART.md](QUICKSTART.md) to begin!

