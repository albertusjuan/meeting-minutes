# Testing Guide for Meeting Minutes

Complete testing procedures for the Meeting Minutes backend system (Windows).

---

## 📋 Pre-Flight Checklist

Before testing, ensure you have:

### Environment Setup
- [ ] Windows 10/11
- [ ] Python 3.11+ installed
- [ ] Virtual environment created (`backend\venv\` folder exists)
- [ ] All dependencies installed (`pip install -r requirements.txt`)

### API Keys & Authentication
- [ ] `.env` file created in `backend\` folder
- [ ] `HUGGINGFACE_TOKEN` set in `.env`
- [ ] `LLM_API_KEY` (DeepSeek) set in `.env`
- [ ] Accepted pyannote license at https://huggingface.co/pyannote/speaker-diarization-3.1
- [ ] ✅ Whisper model does NOT require license acceptance

### Configuration Verified
- [ ] `LLM_PROVIDER=deepseek` in `.env`
- [ ] `ASR_MODEL=JackyHoCL/whisper-large-v3-turbo-cantonese-yue-english` in `.env`
- [ ] Device setting (`DEVICE=cpu` or `cuda`) configured

### Test Data
- [ ] Test audio file ready (WAV, MP3, M4A, or FLAC)
- [ ] Recommended: 1-5 minutes for first test
- [ ] Ideally contains Cantonese + English mix

---

## 🧪 Test Suite

### Test 1: Configuration Loading

**Goal**: Verify environment variables load correctly

```powershell
cd backend
venv\Scripts\activate
python -c "from app.config import settings; print(f'✅ HF Token: {settings.huggingface_token[:10]}...'); print(f'✅ LLM Provider: {settings.llm_provider}'); print(f'✅ ASR Model: {settings.asr_model}')"
```

**Expected Output**:
```
✅ HF Token: hf_xxxxx...
✅ LLM Provider: deepseek
✅ ASR Model: JackyHoCL/whisper-large-v3-turbo-cantonese-yue-english
```

**❌ Common Issues**:
- `KeyError` → `.env` file missing or incomplete
- Empty values → Check `.env` syntax (no quotes needed)

---

### Test 2: Service Imports

**Goal**: Verify all services can be imported without errors

```powershell
python -c "from app.services import diarization, asr, llm, rag, pipeline; print('✅ All services imported successfully')"
```

**Expected Output**:
```
✅ All services imported successfully
```

**❌ Common Issues**:
- `ModuleNotFoundError` → Virtual environment not activated
- Import errors → Missing dependencies, run `pip install -r requirements.txt`

---

### Test 3: Model Authentication

**Goal**: Test Hugging Face authentication works

```powershell
python -c "from huggingface_hub import login; from app.config import settings; login(token=settings.huggingface_token); print('✅ HuggingFace authentication successful')"
```

**Expected Output**:
```
✅ HuggingFace authentication successful
```

**❌ Common Issues**:
- `401 Unauthorized` → Invalid `HUGGINGFACE_TOKEN`
- `403 Forbidden` → Haven't accepted pyannote license

---

### Test 4: Basic CLI Processing

**Goal**: Process audio through the complete pipeline

```powershell
python scripts\run_local_pipeline.py your_test_audio.wav
```

**Expected Output**:
```
Processing audio file: your_test_audio.wav
================================================================================
Step 1/5: Running speaker diarization...
Found X speaker segments

Step 2/5: Transcribing segments with language detection...
Transcribed X chunks

Step 3/5: Building structured transcript...
Step 4/5: Building RAG index...
RAG index built with X vectors

Step 5/5: Generating AI summary...

Meeting ID: meeting_xxxxx
Duration: X seconds
Speakers: SPEAKER_00, SPEAKER_01
Chunks: X

📝 TRANSCRIPT PREVIEW:
[0.0s - 5.0s] SPEAKER_00 [zh]: 大家好
[5.0s - 10.0s] SPEAKER_01 [en]: Hello everyone
```

**✅ Pass Criteria**:
- No errors during execution
- Speakers detected and labeled
- Transcript contains actual transcribed text
- Language tags present (`[zh]`, `[en]`, or `[mixed]`)
- Summary includes action items and key decisions

**❌ Common Issues**:
- Out of memory → Use shorter audio or set `DEVICE=cpu`
- Model download slow → First run downloads models (can take 10+ minutes)
- DeepSeek API error → Check `LLM_API_KEY` is valid

---

### Test 5: Language Detection

**Goal**: Verify Cantonese/English code-switching detection

**Use audio with mixed languages and check output:**

```
Expected Language Tags:
[zh]    - Predominantly Cantonese/Chinese
[en]    - Predominantly English  
[mixed] - Code-switching (both languages in same segment)
```

**✅ Pass Criteria**:
- `[zh]` appears for Cantonese segments
- `[en]` appears for English segments
- `[mixed]` appears for code-switched segments
- Language detection seems reasonable (not all `unknown`)

**🔧 Debugging**:
If language detection is inaccurate:
1. Check audio quality (clear speech?)
2. Review `backend\app\services\asr.py` → `_detect_language()` thresholds
3. Model might need better audio to distinguish languages

---

### Test 6: Q&A with RAG

**Goal**: Test question answering functionality

```powershell
python scripts\run_local_pipeline.py test_audio.wav --test-qa
```

**Expected Output**:
```
🤔 TESTING Q&A
================================================================================

Q: What were the main topics discussed?
A: The main topics discussed were: ...
   (Based on 3 transcript chunks)

Q: What action items were identified?
A: The action items identified include: ...
```

**✅ Pass Criteria**:
- Answers are relevant to meeting content
- Context chunks have correct timestamps
- Answers reference specific speakers when appropriate
- No DeepSeek API errors

---

### Test 7: API Server

**Goal**: Test REST API endpoints

**Step 1**: Start server
```powershell
cd backend
venv\Scripts\activate
run_server.bat
```

**Step 2**: In another PowerShell window, test health endpoint
```powershell
curl http://localhost:8000/health
```
Expected: `{"status":"healthy"}`

**Step 3**: Upload a meeting
```powershell
curl -X POST "http://localhost:8000/meetings/upload" -F "file=@test_audio.wav"
```

**Step 4**: Verify response contains:
- `meeting_id`
- `transcript_preview`
- `summary` with action items and decisions

**Step 5**: Test Q&A (replace MEETING_ID)
```powershell
curl -X POST "http://localhost:8000/meetings/qa/MEETING_ID" -H "Content-Type: application/json" -d '{\"question\": \"What were the key decisions?\"}'
```

**Step 6**: Get meeting details
```powershell
curl http://localhost:8000/meetings/MEETING_ID
```

**Step 7**: List all meetings
```powershell
curl http://localhost:8000/meetings/
```

**✅ Pass Criteria**:
- All endpoints return 200 status
- Upload produces valid `meeting_id`
- Q&A returns relevant answers
- Meeting details include full transcript

---

### Test 8: Data Persistence

**Goal**: Verify data saves to disk correctly

**Step 1**: Process a meeting with custom ID
```powershell
python scripts\run_local_pipeline.py test.wav --meeting-id test-persist
```

**Step 2**: Check files created
```powershell
dir data\storage\test-persist
```

**Expected Files**:
```
test-persist\
├── transcript.json       # Structured transcript
├── transcript.txt        # Human-readable text
├── summary.json          # AI summary
└── rag_index\           # Vector index
    ├── faiss.index
    └── chunks.json
```

**Step 3**: Verify content
```powershell
type data\storage\test-persist\transcript.txt
type data\storage\test-persist\summary.json
```

**✅ Pass Criteria**:
- All expected files exist
- JSON files are valid (can be opened)
- `transcript.txt` is readable
- Contains expected content

---

### Test 9: Multiple Speakers

**Goal**: Test with 3+ speakers

**Use audio with multiple distinct speakers**

**Expected Output**:
```
Speakers: SPEAKER_00, SPEAKER_01, SPEAKER_02, SPEAKER_03
```

**Check transcript shows correct speaker switching:**
```
[0.0s - 5.0s] SPEAKER_00: ...
[5.0s - 10.0s] SPEAKER_01: ...
[10.0s - 15.0s] SPEAKER_02: ...
[15.0s - 20.0s] SPEAKER_00: ...  # Speaker returns
```

**✅ Pass Criteria**:
- All speakers detected
- Speaker labels consistent throughout
- Turn-taking makes logical sense

---

### Test 10: Edge Cases

#### Empty/Silent Audio
```powershell
python scripts\run_local_pipeline.py silent.wav
```
**Expected**: Graceful handling, possibly empty/minimal transcript

#### Very Short Audio (< 10 seconds)
```powershell
python scripts\run_local_pipeline.py short.wav
```
**Expected**: Still processes, may have few chunks

#### Very Long Audio (> 1 hour)
```powershell
python scripts\run_local_pipeline.py long.wav
```
**Expected**: Takes longer but completes successfully

#### Non-audio File
```powershell
python scripts\run_local_pipeline.py document.pdf
```
**Expected**: Clear error message about unsupported format

---

## 📊 Performance Benchmarks

### Expected Processing Times

**10-minute audio:**

| Component | CPU | GPU (CUDA) |
|-----------|-----|------------|
| Diarization | ~3 min | ~1 min |
| Transcription | ~5 min | ~2 min |
| RAG Indexing | ~10 sec | ~10 sec |
| LLM Summary | ~20 sec | ~20 sec |
| **Total** | **~9 min** | **~4 min** |

**Memory Usage:**
- CPU mode: 4-8 GB RAM
- GPU mode: 6-10 GB VRAM + 4 GB RAM

**Note**: First run downloads models (adds 5-15 minutes)

---

## 🔍 Debugging Tips

### Enable Verbose Logging

```powershell
python scripts\run_local_pipeline.py test.wav -v
```

All services log to console:
- `INFO` - Normal progress
- `WARNING` - Non-critical issues
- `ERROR` - Something failed

### Check Model Downloads

Models download to:
```
C:\Users\YourName\.cache\huggingface\hub\
```

If download fails, delete cache and retry.

### Test Individual Components

**Test diarization only:**
```python
from app.services.diarization import run_diarization
segments = run_diarization("test.wav")
for seg in segments:
    print(f"{seg.speaker_label}: {seg.start_time:.1f}s - {seg.end_time:.1f}s")
```

**Test ASR only:**
```python
from app.services.asr import transcribe_segment
text, lang = transcribe_segment("test.wav", 0, 10)
print(f"{text} [{lang}]")
```

**Test DeepSeek only:**
```python
import asyncio
from app.services.llm import get_llm_client

async def test():
    client = get_llm_client()
    # Test with simple context
    answer = await client.answer_question(
        "Meeting discussed project timeline and budget.",
        "What was discussed?"
    )
    print(answer)

asyncio.run(test())
```

---

## 🐛 Common Issues & Solutions

### Issue: "HUGGINGFACE_TOKEN not found"
**Solution**: 
1. Check `.env` file exists in `backend\` folder
2. Verify `HUGGINGFACE_TOKEN=hf_xxxxx` (no quotes)
3. Restart terminal/IDE after creating `.env`

### Issue: "CUDA out of memory"
**Solution**:
```env
# In .env:
DEVICE=cpu
TORCH_DEVICE=cpu
```

### Issue: Slow Processing
**Solutions**:
1. Use GPU if available (`DEVICE=cuda`)
2. Process shorter audio clips for testing
3. Use faster machine
4. First run is always slow (downloading models)

### Issue: Poor Transcription Quality
**Solutions**:
1. Use higher quality audio (16kHz+, WAV format)
2. Reduce background noise
3. Ensure speakers speak clearly
4. Try different audio preprocessing

### Issue: Wrong Language Detection
**Solutions**:
1. Check audio actually contains multiple languages
2. Review detection thresholds in `asr.py` → `_detect_language()`
3. Test with clearer audio samples

### Issue: DeepSeek API Error
**Check**:
- API key is valid: https://platform.deepseek.com/api_keys
- Have credits in account
- Rate limits not exceeded
- Model name is correct: `deepseek-chat`

### Issue: Model Download Fails
**Solutions**:
1. Check internet connection
2. Verify `HUGGINGFACE_TOKEN` is valid
3. Ensure you accepted pyannote license
4. Try clearing cache: `rmdir /s /q %USERPROFILE%\.cache\huggingface\hub`

### Issue: "License not accepted" for pyannote
**Solution**:
Visit https://huggingface.co/pyannote/speaker-diarization-3.1 and click Accept

### Issue: Pipeline Crashes Mid-Process
**Check**:
1. Available RAM (need 8GB+ free)
2. Disk space (models are large)
3. Audio file is not corrupted
4. No other heavy processes running

---

## ✅ Acceptance Criteria

Before considering testing complete, verify:

- [ ] ✅ CLI processes audio without errors
- [ ] ✅ API server starts and accepts requests
- [ ] ✅ Speaker diarization detects multiple speakers
- [ ] ✅ Transcription produces readable text
- [ ] ✅ Language detection identifies Cantonese/English
- [ ] ✅ Code-switching is handled (mixed language segments)
- [ ] ✅ DeepSeek generates relevant summaries
- [ ] ✅ Summary includes action items and key decisions
- [ ] ✅ Q&A returns relevant answers
- [ ] ✅ Data persists to disk correctly
- [ ] ✅ Errors are handled gracefully

---

## 📈 Test Results Template

Document your test results:

```
Test Date: ___________
System: Windows __ (CPU/GPU: _____)

Environment:
- Python version: _______
- Virtual env activated: Yes/No
- All dependencies installed: Yes/No

Configuration:
- HUGGINGFACE_TOKEN: Set ✓
- LLM_API_KEY (DeepSeek): Set ✓
- ASR_MODEL: JackyHoCL/whisper-large-v3-turbo-cantonese-yue-english ✓
- LLM_PROVIDER: deepseek ✓

Test Results:
[ ] Test 1: Config Loading - PASS/FAIL
[ ] Test 2: Service Imports - PASS/FAIL
[ ] Test 3: Model Auth - PASS/FAIL
[ ] Test 4: Basic CLI - PASS/FAIL
[ ] Test 5: Language Detection - PASS/FAIL
[ ] Test 6: Q&A RAG - PASS/FAIL
[ ] Test 7: API Server - PASS/FAIL
[ ] Test 8: Persistence - PASS/FAIL
[ ] Test 9: Multiple Speakers - PASS/FAIL
[ ] Test 10: Edge Cases - PASS/FAIL

Issues Found:
1. ___________
2. ___________

Performance:
- 5-min audio processing time: _____ minutes
- Memory usage: _____ GB

Notes:
___________
```

---

## 🎓 Next Steps After Testing

Once all tests pass:

1. **Document Issues**: Note any problems encountered
2. **Fine-tune**: Adjust configuration for your use case
3. **Optimize**: Profile performance bottlenecks
4. **Real Data**: Test with actual meeting recordings
5. **Plan Deployment**: Consider cloud hosting options (Stage 3)

---

## 📞 Support

If you encounter issues not covered here:

1. Check the main [README.md](../README.md)
2. Review error logs carefully
3. Test individual components in isolation
4. Verify all prerequisites are met
5. Check API service status (DeepSeek, HuggingFace)

**Remember**: First run is always slow due to model downloads!

---

**Happy testing! 🚀**


