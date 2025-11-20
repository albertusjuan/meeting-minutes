# Quick Start Guide

Get up and running with Meeting Minutes in 5 minutes!

## 🚀 Setup (One-time)

### Windows

```bash
# Run the setup script
setup.bat
```

### macOS/Linux

```bash
# Make script executable and run
chmod +x setup.sh
./setup.sh
```

### Manual Setup

```bash
# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env
```

## 🔑 Configure API Keys

Edit `.env` file with your credentials:

```env
# Get from: https://huggingface.co/settings/tokens
HUGGINGFACE_TOKEN=hf_your_token_here

# Get from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your_key_here
```

**Important**: Visit https://huggingface.co/pyannote/speaker-diarization-3.1 and accept the terms!

## ✅ Quick Test

Test with the CLI tool (no server needed):

```bash
# Activate environment if not already active
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

# Process an audio file
python scripts/run_local_pipeline.py path/to/your/meeting.wav

# With test Q&A
python scripts/run_local_pipeline.py meeting.wav --test-qa
```

## 🌐 Run the API Server

### Windows
```bash
run_server.bat
```

### macOS/Linux
```bash
./run_server.sh
```

### Manual
```bash
source venv/bin/activate  # or venv\Scripts\activate on Windows
python -m uvicorn app.main:app --reload
```

Visit http://localhost:8000/docs for interactive API documentation!

## 📤 Upload Your First Meeting

### Using curl

```bash
curl -X POST "http://localhost:8000/meetings/upload" \
  -F "file=@meeting.wav"
```

### Using Python

```python
import requests

with open("meeting.wav", "rb") as f:
    response = requests.post(
        "http://localhost:8000/meetings/upload",
        files={"file": f}
    )

result = response.json()
print(f"Meeting ID: {result['meeting_id']}")
print(f"Summary: {result['summary']['summary']}")
```

### Using the Web UI

Open http://localhost:8000/docs and use the interactive Swagger UI.

## 💬 Ask Questions

```bash
# Replace MEETING_ID with your actual meeting ID
curl -X POST "http://localhost:8000/meetings/qa/MEETING_ID" \
  -H "Content-Type: application/json" \
  -d '{"question": "What were the main topics discussed?"}'
```

## 📝 Example Output

```
Meeting ID: meeting_abc123def456
Duration: 1847.3 seconds
Speakers: SPEAKER_00, SPEAKER_01, SPEAKER_02
Chunks: 156

📊 MEETING SUMMARY
================================================================================

This meeting covered the Q2 project roadmap and budget allocation. The team 
discussed timeline adjustments and resource planning for upcoming deliverables.

✅ ACTION ITEMS:
  • John to review the budget by Friday
  • Sarah to prepare progress report
  • Team to finalize Q2 timeline

🎯 KEY DECISIONS:
  • Approved new timeline for Q2
  • Increased marketing budget by 15%
  • Postponed feature X to Q3

💬 TOPICS DISCUSSED:
  • Project timeline
  • Budget allocation  
  • Team assignments
  • Marketing strategy
```

## 🎯 Supported Audio Formats

- WAV (recommended)
- MP3
- M4A
- FLAC
- Any format supported by `librosa`

## ⚡ Performance Tips

### For Faster Processing

1. **Use GPU**: Set `DEVICE=cuda` in `.env` (requires NVIDIA GPU + CUDA)
2. **Shorter clips**: Break long meetings into segments
3. **Pre-process audio**: Convert to WAV, 16kHz mono

### If Running Out of Memory

1. Set `DEVICE=cpu` in `.env`
2. Process shorter audio files
3. Close other applications

## 🐛 Troubleshooting

### "Token not found" error
- Make sure `HUGGINGFACE_TOKEN` is set in `.env`
- Check you've accepted the model license at https://huggingface.co/pyannote/speaker-diarization-3.1

### "OpenAI API error"
- Verify `OPENAI_API_KEY` in `.env`
- Check you have API credits

### "Module not found" error
- Activate virtual environment: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Unix)
- Reinstall dependencies: `pip install -r requirements.txt`

### Audio processing fails
- Check audio format is supported
- Try converting to WAV: `ffmpeg -i input.mp3 -ar 16000 -ac 1 output.wav`

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore the API at http://localhost:8000/docs
- Check out [example use cases](#) (coming soon)
- Join our community [link] (coming soon)

## 🆘 Need Help?

- Check [README.md](README.md) for detailed docs
- File an issue on GitHub
- Email: [your-email]

---

**Enjoy using Meeting Minutes! 🎉**

