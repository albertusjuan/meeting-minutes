# Meeting Minutes - Backend

AI-powered meeting transcription, diarization, and analysis with support for Cantonese and English code-switching.

## Features

- **Speaker Diarization**: Identify who is speaking when using `pyannote/speaker-diarization-3.1`
- **Multi-language Transcription**: Transcribe Cantonese and English with automatic language detection using `simonl0909/whisper-large-v2-cantonese`
- **Code-switching Support**: Handles seamless switching between Cantonese and English within the same audio
- **AI Summarization**: Generate meeting summaries, action items, and key decisions using LLMs
- **RAG-based Q&A**: Ask questions about the meeting and get contextual answers
- **RESTful API**: FastAPI-based endpoints for easy integration
- **Local Processing**: Run everything locally on your machine (Stage 1)

## Architecture

```
backend/
├── app/
│   ├── config.py              # Settings and environment configuration
│   ├── main.py                # FastAPI application entry point
│   ├── models/
│   │   └── schemas.py         # Pydantic data models
│   ├── services/
│   │   ├── diarization.py     # Speaker diarization service
│   │   ├── asr.py             # Speech recognition with language detection
│   │   ├── llm.py             # LLM client abstraction
│   │   ├── rag.py             # RAG indexing and querying
│   │   └── pipeline.py        # Main orchestration pipeline
│   ├── routes/
│   │   └── meeting.py         # API endpoints
│   └── storage/
│       └── __init__.py        # In-memory storage (Stage 1)
├── scripts/
│   └── run_local_pipeline.py  # CLI tool for local testing
└── pyproject.toml             # Dependencies and project metadata
```

## Prerequisites

- **Python 3.11+**
- **Hugging Face Account**: You'll need a Hugging Face token to access the models
- **OpenAI API Key** (or other LLM provider): For summarization and Q&A

### System Requirements

- **CPU**: Multi-core processor (8+ cores recommended)
- **RAM**: 16GB minimum, 32GB recommended
- **GPU** (optional): NVIDIA GPU with CUDA for faster processing
- **Disk Space**: ~10GB for models and data

## Installation

### 1. Clone the Repository

```bash
cd backend
```

### 2. Set Up Python Environment

Using Poetry (recommended):

```bash
# Install Poetry if you haven't
pip install poetry

# Install dependencies
poetry install
```

Or using pip:

```bash
# Create virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt  # You'll need to generate this from pyproject.toml
```

### 3. Configure Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Required: Get from https://huggingface.co/settings/tokens
HUGGINGFACE_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Required: Get from https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# LLM Configuration
LLM_PROVIDER=openai
LLM_MODEL=gpt-4-turbo-preview

# Device Configuration
DEVICE=cpu  # or cuda if you have a GPU
TORCH_DEVICE=cpu  # or cuda:0

# Storage
UPLOAD_DIR=./data/uploads
STORAGE_DIR=./data/storage

# Server
HOST=0.0.0.0
PORT=8000
```

### 4. Accept Model License Agreements

The diarization model requires accepting license terms:

1. Visit https://huggingface.co/pyannote/speaker-diarization-3.1
2. Sign in with your Hugging Face account
3. Accept the terms of use

## Usage

### Option 1: CLI Tool (Recommended for Testing)

Process an audio file locally without starting the API server:

```bash
# Basic usage
python scripts/run_local_pipeline.py path/to/meeting.wav

# With custom meeting ID
python scripts/run_local_pipeline.py meeting.wav --meeting-id team-standup-2024

# Test Q&A after processing
python scripts/run_local_pipeline.py meeting.wav --test-qa

# Verbose logging
python scripts/run_local_pipeline.py meeting.wav -v
```

The CLI tool will:
1. Run speaker diarization
2. Transcribe each segment with language detection
3. Generate an AI summary with action items and key decisions
4. Save results to `./data/storage/{meeting_id}/`

### Option 2: API Server

Start the FastAPI server:

```bash
# Using Poetry
poetry run python -m uvicorn app.main:app --reload

# Or if using venv
python -m uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

#### API Documentation

Interactive API docs: http://localhost:8000/docs

#### Upload a Meeting

```bash
curl -X POST "http://localhost:8000/meetings/upload" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@meeting.wav"
```

Response:
```json
{
  "meeting_id": "meeting_abc123def456",
  "message": "Meeting processed successfully",
  "transcript_preview": "[0.0s - 5.2s] SPEAKER_00 [zh]: 大家好，今日我哋開會...",
  "summary": {
    "summary": "The meeting discussed project timelines and budget allocation...",
    "action_items": [
      "John to review the budget by Friday",
      "Team to prepare progress report"
    ],
    "key_decisions": [
      "Approved new timeline for Q2",
      "Increased marketing budget by 15%"
    ],
    "topics": [
      "Project timeline",
      "Budget allocation",
      "Team assignments"
    ]
  }
}
```

#### Ask Questions

```bash
curl -X POST "http://localhost:8000/meetings/qa/meeting_abc123def456" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What were the main action items?",
    "top_k": 5
  }'
```

Response:
```json
{
  "question": "What were the main action items?",
  "answer": "The main action items were: 1) John to review the budget by Friday, 2) Team to prepare progress report...",
  "context_chunks": [
    {
      "chunk_id": "chunk_0012",
      "speaker_label": "SPEAKER_00",
      "start_time": 45.2,
      "end_time": 52.8,
      "text": "John, can you review the budget by Friday?",
      "language": "en"
    }
  ]
}
```

#### Get Meeting Details

```bash
curl "http://localhost:8000/meetings/meeting_abc123def456"
```

#### List All Meetings

```bash
curl "http://localhost:8000/meetings/"
```

## How It Works

### 1. Speaker Diarization

Uses `pyannote/speaker-diarization-3.1` to identify speaker segments:

```
Input: meeting.wav (30 minutes)
Output: 
  - [0.0s - 15.2s] SPEAKER_00
  - [15.2s - 28.5s] SPEAKER_01
  - [28.5s - 45.0s] SPEAKER_00
  ...
```

### 2. Multi-language Transcription

For each speaker segment, transcribes using `simonl0909/whisper-large-v2-cantonese`:

- **Automatic language detection**: Identifies Cantonese (zh) vs English (en)
- **Code-switching support**: Handles mid-sentence language switches
- **Per-segment processing**: Each segment is transcribed independently

Example output:
```
[0.0s - 15.2s] SPEAKER_00 [zh]: "大家好，今日我哋要討論 project timeline"
[15.2s - 28.5s] SPEAKER_01 [en]: "Yes, we need to finalize the schedule"
[28.5s - 45.0s] SPEAKER_00 [mixed]: "I agree, 但係我哋 need more time"
```

### 3. RAG Index Building

- Chunks are embedded using `sentence-transformers/all-MiniLM-L6-v2`
- Vectors stored in FAISS for efficient similarity search
- Supports multilingual embeddings

### 4. LLM Analysis

- Summarization: Generates overview, action items, key decisions
- Q&A: Uses RAG to find relevant context, then LLM generates answer
- Supports OpenAI (extensible to other providers)

## Configuration

### Model Selection

All models can be configured in `app/config.py` or via environment variables:

```python
# Diarization
DIARIZATION_MODEL=pyannote/speaker-diarization-3.1

# ASR (transcription)
ASR_MODEL=simonl0909/whisper-large-v2-cantonese

# Embeddings for RAG
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2

# LLM
LLM_PROVIDER=openai
LLM_MODEL=gpt-4-turbo-preview
```

### Device Selection

```env
# CPU only
DEVICE=cpu
TORCH_DEVICE=cpu

# GPU (CUDA)
DEVICE=cuda
TORCH_DEVICE=cuda:0
```

### RAG Settings

```env
# Maximum tokens per chunk
RAG_CHUNK_MAX_TOKENS=500

# Number of chunks to retrieve for Q&A
RAG_TOP_K=5
```

## Project Structure Details

### Data Models (`app/models/schemas.py`)

- **SpeakerSegment**: Speaker label with timestamps
- **TranscriptChunk**: Transcribed text with metadata (speaker, time, language)
- **MeetingTranscript**: Complete transcript with all chunks
- **SummaryResponse**: AI-generated summary with action items
- **QARequest/QAResponse**: Question answering structures

### Services

- **diarization.py**: Speaker diarization with pyannote
- **asr.py**: Multi-language ASR with Whisper
- **llm.py**: LLM client abstraction (OpenAI implementation)
- **rag.py**: Vector indexing and semantic search
- **pipeline.py**: Main orchestration of all services

### Storage

Stage 1 uses:
- **In-memory**: Fast access during runtime
- **Disk**: Persistent storage in `./data/storage/{meeting_id}/`

Each meeting directory contains:
```
data/storage/meeting_abc123/
├── transcript.json       # Full structured transcript
├── transcript.txt        # Human-readable text
├── summary.json          # AI summary
└── rag_index/           # FAISS index and embeddings
    ├── faiss.index
    └── chunks.json
```

## Troubleshooting

### Models Won't Download

- **Issue**: Hugging Face authentication fails
- **Solution**: Verify your `HUGGINGFACE_TOKEN` is correct and you've accepted the model licenses

### Out of Memory

- **Issue**: System runs out of RAM/VRAM
- **Solution**: 
  - Use CPU instead of GPU
  - Process shorter audio files
  - Reduce batch sizes in model configs

### Transcription Language Detection Issues

- **Issue**: Language incorrectly detected
- **Solution**: The Whisper model uses heuristics. You can adjust the detection logic in `asr.py` > `_detect_language()`

### API Request Timeout

- **Issue**: Processing takes too long
- **Solution**: 
  - Use async endpoints
  - Process files offline with CLI tool
  - Increase timeout settings

## Next Steps (Future Stages)

Stage 1 is local-only. Future enhancements:

- **Stage 2**: Web frontend (React/Next.js)
- **Stage 3**: Cloud deployment (AWS/GCP/Azure)
- **Stage 4**: Multi-tenant architecture with proper database
- **Stage 5**: Real-time processing and streaming
- **Stage 6**: Advanced analytics and insights

## Development

### Running Tests

```bash
poetry run pytest
```

### Code Formatting

```bash
# Format with Black
poetry run black app/

# Lint with Ruff
poetry run ruff check app/
```

### Adding a New LLM Provider

1. Create a new class in `app/services/llm.py` implementing the `LLMClient` protocol
2. Update `get_llm_client()` to support the new provider
3. Add configuration in `app/config.py`

Example:
```python
class AnthropicLLMClient:
    async def summarize_meeting(self, transcript: MeetingTranscript) -> SummaryResponse:
        # Implementation
        pass
    
    async def answer_question(self, transcript_context: str, question: str) -> str:
        # Implementation
        pass
```

## License

[Your License Here]

## Contributing

[Contributing Guidelines]

## Support

For issues and questions:
- GitHub Issues: [your-repo-url]
- Documentation: [docs-url]
- Email: [your-email]

