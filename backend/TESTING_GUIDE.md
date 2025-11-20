# Testing Guide for Meeting Minutes

This guide will help you test the Meeting Minutes system thoroughly.

## 📋 Pre-flight Checklist

Before testing, ensure you have:

- [ done ] Installed all dependencies (`pip install -r requirements.txt`)
- [ done] Set `HUGGINGFACE_TOKEN` in `.env`
- [ ] Set `OPENAI_API_KEY` in `.env`
- [ ] Accepted pyannote license at https://huggingface.co/pyannote/speaker-diarization-3.1
- [ ] At least one test audio file (WAV, MP3, or M4A)

## 🎤 Preparing Test Audio

### Option 1: Use Your Own Meeting Recording

Best results with:
- Clear audio (minimal background noise)
- 2-4 speakers
- Mix of Cantonese and English (for testing code-switching)
- 5-30 minutes duration (longer = slower processing)

### Option 2: Create Test Audio

Record a quick test meeting:
1. Open voice recorder on your phone/computer
2. Have 2 people speak alternately
3. Mix languages (e.g., "今日我哋討論 the project timeline")
4. Save as WAV or MP3

### Option 3: Use Online Samples

Find sample meeting recordings:
- YouTube meetings (download audio with yt-dlp)
- Podcast episodes with multiple speakers
- Company town halls or presentations

## 🧪 Test Suite

### Test 1: Basic CLI Processing

**Goal**: Verify the pipeline works end-to-end

```bash
python scripts/run_local_pipeline.py test_audio.wav
```

**Expected Output**:
```
Processing audio file: test_audio.wav
================================================================================
Step 1/5: Running speaker diarization...
Found X speaker segments
Step 2/5: Transcribing segments with language detection...
Transcribed X chunks
Step 3/5: Building structured transcript...
Step 4/5: Building RAG index...
Step 5/5: Generating AI summary...

Meeting ID: meeting_xxxxx
Duration: X seconds
Speakers: SPEAKER_00, SPEAKER_01, ...
```

**✅ Pass Criteria**:
- No errors
- Speakers detected
- Transcript generated with text
- Summary includes action items/decisions

**❌ Common Issues**:
- "Token not found" → Check `.env` has `HUGGINGFACE_TOKEN`
- "OpenAI error" → Check `.env` has `OPENAI_API_KEY`
- Out of memory → Use shorter audio or set `DEVICE=cpu`

---

### Test 2: Language Detection

**Goal**: Verify Cantonese/English detection works

```bash
python scripts/run_local_pipeline.py mixed_language.wav -v
```

**Check the Output**:
Look for language tags in transcript:
```
[0.0s - 5.0s] SPEAKER_00 [zh]: 大家好
[5.0s - 10.0s] SPEAKER_01 [en]: Hello everyone
[10.0s - 15.0s] SPEAKER_00 [mixed]: 今日 we will discuss
```

**✅ Pass Criteria**:
- `[zh]` appears for Cantonese segments
- `[en]` appears for English segments
- `[mixed]` appears for code-switched segments

**🔧 Debugging**:
- If all show `unknown`: Check `app/services/asr.py` > `_detect_language()`
- If wrong language: Whisper may need better audio quality

---

### Test 3: Q&A with RAG

**Goal**: Test question answering

```bash
python scripts/run_local_pipeline.py test_audio.wav --test-qa
```

**Expected Output**:
```
🤔 TESTING Q&A
================================================================================

Q: What were the main topics discussed?
A: The main topics discussed were: 1) Project timeline...
   (Based on 3 transcript chunks)

Q: What action items were identified?
A: The action items identified include: ...
```

**✅ Pass Criteria**:
- Answers are relevant to the meeting content
- Context chunks have correct timestamps
- Answers reference specific speakers when appropriate

**Test Custom Questions**:
After processing, load Python REPL:

```python
import asyncio
from app.services.pipeline import get_pipeline

# Load the meeting
pipeline = get_pipeline()
result, index = pipeline.load_meeting_data("meeting_xxxxx")

# Ask custom questions
async def test_qa():
    answer, chunks = await pipeline.answer_question(
        index, 
        "Who mentioned the budget?"
    )
    print(answer)

asyncio.run(test_qa())
```

---

### Test 4: API Server

**Goal**: Test REST API endpoints

**Step 1**: Start server
```bash
# Windows
run_server.bat

# macOS/Linux
./run_server.sh
```

**Step 2**: Check health
```bash
curl http://localhost:8000/health
```
Expected: `{"status": "healthy"}`

**Step 3**: Upload meeting
```bash
curl -X POST "http://localhost:8000/meetings/upload" \
  -F "file=@test_audio.wav"
```

**Step 4**: Check response
```json
{
  "meeting_id": "meeting_xxxxx",
  "message": "Meeting processed successfully",
  "transcript_preview": "...",
  "summary": { ... }
}
```

**Step 5**: Ask question
```bash
curl -X POST "http://localhost:8000/meetings/qa/meeting_xxxxx" \
  -H "Content-Type: application/json" \
  -d '{"question": "What were the key decisions?"}'
```

**Step 6**: Get meeting details
```bash
curl http://localhost:8000/meetings/meeting_xxxxx
```

**Step 7**: List all meetings
```bash
curl http://localhost:8000/meetings/
```

**✅ Pass Criteria**:
- All endpoints return 200 status
- Upload produces valid meeting_id
- Q&A returns relevant answers
- Meeting details include full transcript

---

### Test 5: Persistence

**Goal**: Verify data persists to disk

**Step 1**: Process a meeting
```bash
python scripts/run_local_pipeline.py test.wav --meeting-id test-persist
```

**Step 2**: Check files created
```bash
ls data/storage/test-persist/
```

**Expected Files**:
```
data/storage/test-persist/
├── transcript.json
├── transcript.txt
├── summary.json
└── rag_index/
    ├── faiss.index
    └── chunks.json
```

**Step 3**: Verify content
```bash
# Check transcript
cat data/storage/test-persist/transcript.txt

# Check summary
cat data/storage/test-persist/summary.json
```

**✅ Pass Criteria**:
- All files exist
- JSON files are valid
- transcript.txt is human-readable

---

### Test 6: Multiple Speakers

**Goal**: Test with 3+ speakers

Use audio with multiple distinct speakers.

**Expected**:
```
Speakers: SPEAKER_00, SPEAKER_01, SPEAKER_02, SPEAKER_03
```

Check transcript shows correct speaker switching:
```
[0.0s - 5.0s] SPEAKER_00: ...
[5.0s - 10.0s] SPEAKER_01: ...
[10.0s - 15.0s] SPEAKER_02: ...
[15.0s - 20.0s] SPEAKER_00: ...  # Speaker returns
```

**✅ Pass Criteria**:
- All speakers detected
- Speaker labels consistent throughout
- Turn-taking makes sense

---

### Test 7: Edge Cases

#### Empty/Silent Audio
```bash
python scripts/run_local_pipeline.py silent.wav
```
**Expected**: Graceful handling, possibly empty transcript

#### Very Short Audio (< 10 seconds)
```bash
python scripts/run_local_pipeline.py short.wav
```
**Expected**: Still processes, may have few chunks

#### Very Long Audio (> 1 hour)
```bash
python scripts/run_local_pipeline.py long.wav
```
**Expected**: Takes longer but completes (or use `--no-summary` for faster testing)

#### Non-audio File
```bash
python scripts/run_local_pipeline.py document.pdf
```
**Expected**: Clear error message

---

### Test 8: Error Handling

#### Missing API Key
```bash
# Temporarily rename .env
mv .env .env.backup
python scripts/run_local_pipeline.py test.wav
```
**Expected**: Clear error about missing keys

#### Invalid Meeting ID
```bash
curl http://localhost:8000/meetings/invalid_id
```
**Expected**: 404 error with message

#### Corrupted Audio
```bash
python scripts/run_local_pipeline.py corrupted.wav
```
**Expected**: Error message (not crash)

---

## 📊 Performance Testing

### Benchmark Processing Speed

```bash
time python scripts/run_local_pipeline.py test_10min.wav --no-save
```

**Expected Times** (10-minute audio):

| Component | CPU | GPU |
|-----------|-----|-----|
| Diarization | ~3 min | ~1 min |
| Transcription | ~5 min | ~2 min |
| RAG Indexing | ~10 sec | ~10 sec |
| LLM Summary | ~20 sec | ~20 sec |
| **Total** | **~9 min** | **~4 min** |

### Memory Usage

Monitor memory:
```bash
# Linux/macOS
top -p $(pgrep -f "run_local_pipeline")

# Windows (PowerShell)
Get-Process python | Select-Object WorkingSet64
```

**Expected**: 4-8 GB RAM (CPU mode)

---

## 🔍 Debugging Tips

### Enable Verbose Logging

```bash
python scripts/run_local_pipeline.py test.wav -v
```

### Check Logs in Detail

All services log to console. Look for:
- `INFO` - Normal progress
- `WARNING` - Non-critical issues
- `ERROR` - Something failed

### Inspect Raw Data

```python
import json

# Load transcript
with open("data/storage/meeting_xxx/transcript.json") as f:
    data = json.load(f)
    print(json.dumps(data, indent=2))
```

### Test Individual Components

```python
# Test diarization only
from app.services.diarization import run_diarization
segments = run_diarization("test.wav")
print(segments)

# Test ASR only
from app.services.asr import transcribe_segment
text, lang = transcribe_segment("test.wav", 0, 10)
print(f"{text} [{lang}]")
```

---

## ✅ Acceptance Criteria

Before considering Stage 1 complete, verify:

- [x] ✅ CLI processes audio without errors
- [x] ✅ API server starts and accepts requests
- [x] ✅ Speaker diarization detects multiple speakers
- [x] ✅ Transcription produces readable text
- [x] ✅ Language detection identifies Cantonese/English
- [x] ✅ Code-switching is handled (mixed language segments)
- [x] ✅ Summary includes action items and key decisions
- [x] ✅ Q&A returns relevant answers
- [x] ✅ Data persists to disk correctly
- [x] ✅ Errors are handled gracefully

---

## 🐛 Common Issues & Solutions

### Issue: "RuntimeError: CUDA out of memory"
**Solution**: 
```env
# In .env
DEVICE=cpu
TORCH_DEVICE=cpu
```

### Issue: Slow processing
**Solutions**:
1. Use GPU if available
2. Process shorter audio clips
3. Skip summary with `--no-save` during testing

### Issue: Poor transcription quality
**Solutions**:
1. Use higher quality audio (16kHz+, WAV format)
2. Reduce background noise
3. Ensure speakers are clearly audible

### Issue: Wrong language detection
**Solutions**:
1. Check audio actually contains multiple languages
2. Adjust `_detect_language()` thresholds in `asr.py`
3. Try with clearer audio

### Issue: Summary not relevant
**Solutions**:
1. Check transcript quality first
2. Adjust LLM prompt in `llm.py`
3. Try different LLM model (e.g., `gpt-4` instead of `gpt-4-turbo`)

---

## 📈 What to Test Next

After basic functionality works:

1. **Accuracy Testing**
   - Compare transcripts to ground truth
   - Measure speaker diarization error rate
   - Evaluate summary quality

2. **Stress Testing**
   - Very long meetings (2+ hours)
   - Many speakers (10+)
   - Poor audio quality

3. **Integration Testing**
   - Upload via Python requests library
   - Build simple frontend
   - Test concurrent requests

4. **Real-World Testing**
   - Use actual meeting recordings
   - Test with diverse accents
   - Verify privacy/security

---

## 🎓 Next Steps

Once testing is complete:

1. Document any issues found
2. Fine-tune configuration for your use case
3. Plan Stage 2 (frontend + deployment)
4. Consider additional features (speaker names, sentiment analysis, etc.)

Happy testing! 🚀

