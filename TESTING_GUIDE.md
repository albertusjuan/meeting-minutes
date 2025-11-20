# Meeting Minutes - Testing Guide

Comprehensive testing guide for the Meeting Minutes application.

---

## 📋 Table of Contents

- [Quick Test](#-quick-test)
- [Test Suite](#-test-suite)
- [Performance Benchmarks](#-performance-benchmarks)
- [Debugging](#-debugging)
- [Acceptance Criteria](#-acceptance-criteria)

---

## 🚀 Quick Test

### Prerequisites

Before testing, ensure:
- ✅ Backend virtual environment set up (`backend/venv/`)
- ✅ Frontend dependencies installed (`frontend/node_modules/`)
- ✅ `.env` files configured in both `backend/` and `frontend/`
- ✅ API keys valid and licenses accepted

### Quick Verification

```bash
# Test backend health
curl http://localhost:8000/health

# Should return: {"status":"healthy"}
```

---

## 🧪 Test Suite

### Test 1: Basic CLI Processing

**Purpose**: Verify core pipeline functionality without the API

**Steps**:
```bash
cd backend
venv\Scripts\activate  # or: source venv/bin/activate

# Process a test audio file
python scripts/run_local_pipeline.py path/to/test_audio.wav
```

**Expected Results**:
- ✅ No errors or crashes
- ✅ Speaker segments detected (e.g., "Found 47 speaker segments")
- ✅ Transcript generated with text
- ✅ Language tags present (`[zh]`, `[en]`, or `[mixed]`)
- ✅ Summary generated with action items and key decisions
- ✅ Files saved to `backend/data/storage/{meeting_id}/`

**Validation**:
```bash
# Check output files exist
ls backend/data/storage/meeting_*/
# Should see: transcript.json, transcript.txt, summary.json, rag_index/
```

---

### Test 2: Language Detection

**Purpose**: Verify code-switching and language detection

**Steps**:
1. Use audio with mixed Cantonese and English
2. Process with CLI: `python scripts/run_local_pipeline.py mixed_audio.wav`
3. Check output transcript

**Expected Results**:
- ✅ `[zh]` tags for Cantonese segments
- ✅ `[en]` tags for English segments
- ✅ `[mixed]` tags for code-switched segments
- ✅ Language detection matches actual content

**Sample Output**:
```
[0.0s - 5.2s] SPEAKER_00 [zh]: 大家好，今日我哋開會
[5.2s - 10.5s] SPEAKER_01 [en]: Yes, let's discuss the project
[10.5s - 15.0s] SPEAKER_00 [mixed]: 我同意 but we need more time
```

---

### Test 3: Q&A System

**Purpose**: Test RAG-based question answering

**Steps**:
```bash
# Process with Q&A test enabled
python scripts/run_local_pipeline.py test_audio.wav --test-qa
```

**Expected Results**:
- ✅ Questions answered with relevant information
- ✅ Answers reference actual transcript content
- ✅ Context chunks returned
- ✅ No hallucinations or made-up information

**Manual Q&A Test**:
```bash
# After processing a meeting, test via API
curl -X POST "http://localhost:8000/meetings/qa/MEETING_ID" \
  -H "Content-Type: application/json" \
  -d '{"question": "What were the main topics discussed?"}'
```

---

### Test 4: API Server

**Purpose**: Test REST API endpoints

**Steps**:

**1. Start the server**:
```bash
cd backend
venv\Scripts\activate
python -m uvicorn app.main:app --reload
```

**2. Test health endpoint**:
```bash
curl http://localhost:8000/health
# Expected: {"status":"healthy"}
```

**3. Upload a meeting**:
```bash
curl -X POST "http://localhost:8000/meetings/upload" \
  -F "file=@test_audio.wav"
```

**Expected Response**:
```json
{
  "meeting_id": "meeting_abc123",
  "message": "Meeting processed successfully",
  "transcript_preview": "[0.0s - 5.0s] SPEAKER_00 [zh]: ...",
  "summary": {
    "summary": "...",
    "action_items": ["..."],
    "key_decisions": ["..."],
    "topics": ["..."]
  }
}
```

**4. Get meeting details**:
```bash
curl http://localhost:8000/meetings/meeting_abc123
```

**5. List all meetings**:
```bash
curl http://localhost:8000/meetings/
```

**6. Ask a question**:
```bash
curl -X POST "http://localhost:8000/meetings/qa/meeting_abc123" \
  -H "Content-Type: application/json" \
  -d '{"question": "What were the action items?"}'
```

**Expected Results**:
- ✅ All endpoints return 200 OK
- ✅ Data structure matches schema
- ✅ No 500 errors
- ✅ CORS headers present (for frontend)

---

### Test 5: Frontend UI

**Purpose**: Test React frontend

**Steps**:

**1. Start both servers**:
```bash
# Terminal 1 - Backend
cd backend
venv\Scripts\activate
python -m uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**2. Open browser**:
Navigate to http://localhost:5173

**3. Test file upload**:
- Drag and drop an audio file
- Click "Upload & Process Meeting"
- Wait for processing
- Verify redirect to meeting detail page

**4. Test meeting detail page**:
- Check Summary tab displays correctly
- Check Transcript tab shows speaker-labeled segments
- Check language badges (粵/EN/MIX)
- Check timestamps are formatted (mm:ss)

**5. Test Q&A**:
- Switch to Q&A tab
- Type a question
- Click "Ask"
- Verify answer appears
- Expand context chunks
- Verify context shows transcript source

**Expected Results**:
- ✅ No console errors in browser DevTools
- ✅ UI is responsive and loads quickly
- ✅ All tabs display data correctly
- ✅ Upload progress indicator works
- ✅ Error messages are user-friendly
- ✅ Chat auto-scrolls to latest message

---

### Test 6: Error Handling

**Purpose**: Verify graceful error handling

**Test Cases**:

**1. Invalid audio file**:
```bash
curl -X POST "http://localhost:8000/meetings/upload" \
  -F "file=@invalid_file.txt"
```
Expected: 400 Bad Request with clear error message

**2. Non-existent meeting ID**:
```bash
curl http://localhost:8000/meetings/nonexistent_id
```
Expected: 404 Not Found

**3. Missing API keys**:
- Remove `HUGGINGFACE_TOKEN` from `.env`
- Try to process a file
Expected: Clear error message about missing token

**4. Invalid question**:
```bash
curl -X POST "http://localhost:8000/meetings/qa/meeting_id" \
  -H "Content-Type: application/json" \
  -d '{"question": ""}'
```
Expected: 400 Bad Request with validation error

**Expected Results**:
- ✅ All errors return appropriate HTTP status codes
- ✅ Error messages are clear and actionable
- ✅ No crashes or stack traces exposed to user
- ✅ Logs contain detailed debug information

---

### Test 7: Multi-Speaker Meetings

**Purpose**: Test with complex multi-speaker scenarios

**Steps**:
1. Use audio with 3+ speakers
2. Process with CLI or API
3. Review transcript

**Expected Results**:
- ✅ All speakers identified (SPEAKER_00, SPEAKER_01, SPEAKER_02, ...)
- ✅ Speaker labels consistent throughout
- ✅ No speaker confusion or mixing
- ✅ Color coding works for 6+ speakers in frontend

---

### Test 8: Long Audio Files

**Purpose**: Test with extended meeting recordings

**Steps**:
1. Use 30-60 minute audio file
2. Process and monitor

**Expected Results**:
- ✅ Processing completes without memory errors
- ✅ All segments transcribed
- ✅ Summary covers entire meeting
- ✅ RAG index includes all content
- ✅ Q&A works across entire transcript

**Performance Notes**:
- CPU: Expect ~1x realtime (30min audio → 30min processing)
- GPU: Expect ~0.3x realtime (30min audio → 10min processing)

---

## 📊 Performance Benchmarks

### Expected Processing Times

**Test Audio: 10-minute meeting**

| Component | CPU Mode | GPU Mode (CUDA) |
|-----------|----------|-----------------|
| Diarization | ~3 min | ~1 min |
| Transcription | ~5 min | ~2 min |
| RAG Indexing | ~10 sec | ~10 sec |
| LLM Summary | ~20 sec | ~20 sec |
| **Total** | **~9 min** | **~4 min** |

**Memory Usage**:
- CPU: 4-8 GB RAM
- GPU: 6-10 GB VRAM + 4 GB RAM

### Bottlenecks

1. **Transcription**: Slowest step (Whisper model)
2. **Diarization**: Second slowest (pyannote model)
3. **LLM Summary**: Depends on API latency (10-30s typically)
4. **RAG Indexing**: Fast (<10s for typical meetings)

### Optimization Tips

**For Faster Processing**:
- Use GPU: Set `DEVICE=cuda` in `.env`
- Use shorter audio clips
- Pre-process audio: Convert to 16kHz mono WAV

**For Better Accuracy**:
- High-quality audio: 16kHz+ sample rate, WAV format
- Clear speakers: Good microphone placement
- Reduce noise: Quiet environment
- Shorter segments: Break very long meetings

---

## 🐛 Debugging

### Enabling Verbose Logging

**CLI Tool**:
```bash
python scripts/run_local_pipeline.py meeting.wav -v
```

**API Server**:
Edit `backend/app/main.py` and set logging level to DEBUG:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Common Issues and Solutions

#### Issue: Models Won't Download

**Symptoms**: "Token not found" or HTTP 403 errors

**Solution**:
1. Check `HUGGINGFACE_TOKEN` in `.env`
2. Visit https://huggingface.co/pyannote/speaker-diarization-3.1
3. Accept the model license
4. Generate a new token if needed

#### Issue: Out of Memory

**Symptoms**: "CUDA out of memory" or system freezes

**Solution**:
```env
# In backend/.env, switch to CPU:
DEVICE=cpu
TORCH_DEVICE=cpu
```

Or process shorter audio files.

#### Issue: Poor Transcription

**Symptoms**: Incorrect or garbled text

**Debugging**:
1. Check audio quality:
   ```bash
   # Use ffmpeg to check audio properties
   ffmpeg -i meeting.wav
   ```
2. Convert to optimal format:
   ```bash
   ffmpeg -i input.mp3 -ar 16000 -ac 1 output.wav
   ```
3. Check for background noise or poor microphone

#### Issue: Wrong Language Detection

**Symptoms**: `[en]` tags on Cantonese or vice versa

**Solution**: Adjust detection thresholds in `backend/app/services/asr.py`:
```python
def _detect_language(self, text: str) -> str:
    # Adjust these thresholds:
    if chinese_ratio > 0.7:  # Try 0.6 or 0.8
        return "zh"
    elif chinese_ratio < 0.3:  # Try 0.2 or 0.4
        return "en"
```

#### Issue: API Timeout

**Symptoms**: Request times out during upload

**Solution**: Processing takes time. Increase timeout in `frontend/src/api/client.ts`:
```typescript
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 600000,  // 10 minutes (increase if needed)
});
```

#### Issue: Frontend Can't Connect

**Symptoms**: "Failed to fetch" errors

**Debugging**:
1. Check backend is running:
   ```bash
   curl http://localhost:8000/health
   ```
2. Check `VITE_API_BASE_URL` in `frontend/.env`
3. Check browser console for CORS errors
4. Verify backend allows CORS (should be enabled by default)

### Viewing Logs

**Backend Logs**:
- Displayed in terminal where uvicorn is running
- Check for ERROR or WARNING messages

**Frontend Logs**:
- Open browser DevTools (F12)
- Check Console tab
- Check Network tab for failed requests

**Meeting Data**:
```bash
# View saved meeting data
cat backend/data/storage/meeting_abc123/transcript.txt
cat backend/data/storage/meeting_abc123/summary.json
```

---

## ✅ Acceptance Criteria

### Backend (API)

- [ ] Server starts without errors
- [ ] Health endpoint returns 200 OK
- [ ] Upload endpoint accepts WAV/MP3/M4A/FLAC files
- [ ] Processing completes for test audio
- [ ] Transcript includes speaker labels
- [ ] Transcript includes language tags (zh/en/mixed)
- [ ] Transcript includes timestamps
- [ ] Summary generated with action items
- [ ] Summary generated with key decisions
- [ ] Q&A returns relevant answers
- [ ] Q&A includes context chunks
- [ ] All API endpoints return valid JSON
- [ ] Errors return appropriate HTTP status codes
- [ ] Meeting data persists to disk

### Frontend (UI)

- [ ] App loads without console errors
- [ ] File upload drag-and-drop works
- [ ] Upload shows progress indicator
- [ ] Redirect to meeting detail after upload
- [ ] Summary tab displays correctly
- [ ] Action items shown as numbered list
- [ ] Key decisions shown as numbered list
- [ ] Topics shown as tags
- [ ] Transcript tab displays all segments
- [ ] Speaker labels color-coded
- [ ] Timestamps formatted as mm:ss
- [ ] Language badges displayed (粵/EN/MIX)
- [ ] Q&A input accepts questions
- [ ] Q&A displays answers in chat format
- [ ] Context chunks are expandable
- [ ] Loading states shown during async operations
- [ ] Error messages are user-friendly
- [ ] UI is responsive on mobile

### Integration

- [ ] Frontend successfully calls backend API
- [ ] Upload from UI creates meeting in backend
- [ ] Meeting detail page loads data from backend
- [ ] Q&A from UI gets answers from backend
- [ ] CORS configured correctly
- [ ] No authentication errors between services

### Performance

- [ ] 10-min audio processes in <15 min (CPU mode)
- [ ] 10-min audio processes in <5 min (GPU mode)
- [ ] Memory usage stays under 8GB (CPU mode)
- [ ] No memory leaks during processing
- [ ] API responds within 100ms (non-processing endpoints)
- [ ] Frontend loads in <2 seconds
- [ ] Upload UI remains responsive during processing

### Quality

- [ ] Code has no linter errors
- [ ] All imports resolve correctly
- [ ] No deprecated dependencies
- [ ] .env files not committed to git
- [ ] API keys not hardcoded
- [ ] Error messages are actionable
- [ ] Logs provide useful debug information

---

## 📝 Test Checklist

Use this checklist for comprehensive testing:

```
Backend Tests:
☐ CLI processing (Test 1)
☐ Language detection (Test 2)
☐ Q&A system (Test 3)
☐ API endpoints (Test 4)
☐ Error handling (Test 6)
☐ Multi-speaker (Test 7)
☐ Long audio (Test 8)

Frontend Tests:
☐ UI loads (Test 5)
☐ File upload (Test 5)
☐ Meeting detail (Test 5)
☐ Q&A interface (Test 5)
☐ Error handling (Test 6)

Integration Tests:
☐ Frontend → Backend upload
☐ Frontend → Backend Q&A
☐ Frontend → Backend meeting fetch
☐ CORS working

Performance Tests:
☐ 10-min audio benchmark
☐ 30-min audio benchmark
☐ Memory usage check
☐ API response times

Acceptance:
☐ All backend criteria met
☐ All frontend criteria met
☐ All integration criteria met
☐ All performance criteria met
☐ All quality criteria met
```

---

## 🎯 Next Steps After Testing

Once all tests pass:

1. **Document Issues**: Note any failures or unexpected behavior
2. **Performance Tuning**: Optimize slow components
3. **User Testing**: Get feedback from real users
4. **Deploy**: Consider cloud deployment (Stage 3)
5. **Monitor**: Set up logging and monitoring in production

---

## 📞 Getting Help

If tests fail:
1. Check the [Troubleshooting](#-troubleshooting) section in README.md
2. Review logs for detailed error messages
3. Try the debugging tips in this guide
4. Verify all prerequisites are met

---

**Happy Testing! 🧪**

