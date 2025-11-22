# Backend Integration Guide

This document maps all frontend placeholders to their corresponding backend endpoints and data structures.

## 🔴 PLACEHOLDER STATUS
**Current State**: All API calls are mocked. No real backend integration exists.

---

## API Endpoints Mapping

### 1. File Upload (`src/api/meetings.ts`)

#### `uploadFile(file: File)`
**Purpose**: Upload audio file to server  
**Current**: Returns mock response after 2s delay  
**Backend Endpoint**: `POST /upload/` or `POST /meetings/upload`  
**Request**: 
```typescript
FormData {
  file: File (audio file)
}
```
**Expected Response**:
```typescript
{
  file_id: string;          // Unique file identifier
  filename: string;         // Original filename
  file_size: number;        // Size in bytes
  message: string;          // Success message
  upload_path: string;      // Server storage path
}
```
**File Location**: `frontend/src/api/meetings.ts:12-28`

---

#### `listFiles()`
**Purpose**: Get list of all uploaded files  
**Current**: Returns empty array  
**Backend Endpoint**: `GET /upload/files` or `GET /meetings/files`  
**Expected Response**:
```typescript
{
  total: number;
  files: Array<{
    filename: string;
    size: number;
    uploaded_at: string;    // ISO 8601 format
  }>
}
```
**File Location**: `frontend/src/api/meetings.ts:33-39`

---

### 2. Audio Recording Processing

#### `processAudio(audioBlob: Blob)`
**Purpose**: Send recorded audio to RAG pipeline for transcription  
**Current**: Shows alert after 2s delay (placeholder)  
**Backend Endpoint**: `POST /meetings/process` or `POST /transcribe`  
**Request**:
```typescript
FormData {
  file: Blob (audio recording)
  // Optional parameters:
  language?: string;         // "auto", "en", "zh", etc.
  speaker_diarization?: boolean;
}
```
**Expected Response**:
```typescript
{
  meeting_id: string;
  status: "processing" | "completed" | "failed";
  message: string;
}
```
**File Location**: `frontend/src/components/AudioRecorder.tsx:134-149`

---

### 3. Meetings List (Dashboard)

#### `getMeetings()`
**Purpose**: Fetch all processed meetings for dashboard  
**Current**: Returns hardcoded mock data  
**Backend Endpoint**: `GET /meetings/` or `GET /meetings/list`  
**Expected Response**:
```typescript
{
  total: number;
  meetings: Array<{
    id: string;
    title: string;
    date: string;            // Human-readable date
    duration: string;        // e.g., "32 min", "1 hr 15 min"
    summary: string;
    transcript: string;
    speakers: string[];      // e.g., ["John (Host)", "Sarah (Developer)"]
    status: "completed" | "processing" | "failed";
    created_at?: string;     // ISO 8601
    audio_file?: string;     // Path to original audio
  }>
}
```
**File Location**: `frontend/src/pages/Dashboard.tsx:7` (mockMeetings)  
**TODO**: Create `getMeetings()` function in `src/api/meetings.ts`

---

### 4. Meeting Detail

#### `getMeetingDetail(meetingId: string)`
**Purpose**: Get full details of a specific meeting  
**Current**: No implementation (placeholder page only)  
**Backend Endpoint**: `GET /meetings/{meeting_id}`  
**Expected Response**:
```typescript
{
  meeting_id: string;
  title: string;
  date: string;
  duration: string;
  summary: string;
  transcript: string;        // Full transcript with timestamps
  speakers: string[];
  status: "completed" | "processing" | "failed";
  created_at: string;
  audio_file: string;
  
  // Detailed RAG analysis:
  action_items?: string[];
  key_decisions?: string[];
  topics?: string[];
  sentiment?: string;
  
  // Transcript chunks (for detailed view):
  transcript_chunks?: Array<{
    speaker: string;
    start_time: number;      // seconds
    end_time: number;        // seconds
    text: string;
    confidence?: number;
  }>
}
```
**File Location**: `frontend/src/pages/MeetingDetail.tsx` (entire file is placeholder)  
**TODO**: Implement full meeting detail view with backend data

---

## Data Flow Mapping

### Upload Flow
```
User selects file
  ↓
FileUpload.tsx (handleSubmit)
  ↓
Home.tsx (handleUpload)
  ↓
[PLACEHOLDER] uploadFile() in api/meetings.ts
  ↓
[TODO: BACKEND] POST /upload/
  ↓
Backend saves file & returns file_id
  ↓
Frontend shows success message
  ↓
[OPTIONAL] Trigger processing: POST /meetings/process with file_id
```

### Recording Flow
```
User records audio
  ↓
AudioRecorder.tsx (mediaRecorder.onstop)
  ↓
Creates audio Blob
  ↓
User clicks "Process Audio"
  ↓
[PLACEHOLDER] processAudio() shows alert
  ↓
[TODO: BACKEND] POST /transcribe with audio Blob
  ↓
Backend processes: ASR → Diarization → RAG → Summary
  ↓
Returns meeting_id
  ↓
Frontend redirects to /meeting/{meeting_id} or /dashboard
```

### Dashboard Flow
```
User navigates to /dashboard
  ↓
Dashboard.tsx loads
  ↓
[PLACEHOLDER] Uses mockMeetings array
  ↓
[TODO: BACKEND] Call getMeetings()
  ↓
Backend returns all meetings with status
  ↓
Frontend displays in MeetingCard components
  ↓
User clicks "View Details"
  ↓
Navigate to /meeting/{meeting_id}
  ↓
[TODO: BACKEND] Call getMeetingDetail(meeting_id)
```

---

## Files to Update for Backend Integration

### Priority 1: Core API Functions
1. **`frontend/src/api/meetings.ts`**
   - Line 12-28: Replace `uploadFile()` mock with real API call
   - Line 33-39: Replace `listFiles()` mock with real API call
   - Add new: `getMeetings()` function
   - Add new: `getMeetingDetail(meetingId)` function
   - Add new: `processAudioRecording(audioBlob)` function

### Priority 2: Component Integration
2. **`frontend/src/components/AudioRecorder.tsx`**
   - Line 134-149: Replace `processAudio()` placeholder with real API call

3. **`frontend/src/pages/Dashboard.tsx`**
   - Line 7-41: Replace `mockMeetings` with API call to `getMeetings()`
   - Add useEffect to fetch meetings on mount
   - Add loading state while fetching

4. **`frontend/src/pages/MeetingDetail.tsx`**
   - Complete rewrite: Fetch real meeting data
   - Display full transcript with timestamps
   - Show speaker-by-speaker breakdown
   - Display RAG analysis (action items, decisions, topics)

5. **`frontend/src/pages/Home.tsx`**
   - Line 27-57: Update to handle real upload responses
   - Add error handling for backend failures

---

## Expected Backend Data Structures

### Meeting Object (Full)
```typescript
interface Meeting {
  // Basic Info
  id: string;
  title: string;
  date: string;
  duration: string;
  status: "completed" | "processing" | "failed";
  created_at: string;        // ISO 8601
  audio_file_path: string;
  
  // Processing Results
  transcript: string;        // Full text
  summary: string;
  
  // RAG Analysis
  action_items: string[];
  key_decisions: string[];
  topics: string[];
  
  // Speaker Info
  speakers: Array<{
    id: string;
    label: string;          // e.g., "SPEAKER_00"
    name?: string;          // Optional human name
    speaking_time: number;  // seconds
  }>;
  
  // Detailed Transcript
  transcript_segments: Array<{
    segment_id: string;
    speaker_id: string;
    speaker_label: string;
    start_time: number;
    end_time: number;
    text: string;
    language?: string;
    confidence?: number;
  }>;
}
```

---

## Environment Variables

Create `.env` file in frontend directory:
```bash
# Backend API Base URL
VITE_API_BASE_URL=http://localhost:8000

# Optional: API Key if backend requires authentication
VITE_API_KEY=your_api_key_here
```

Update `frontend/src/api/client.ts` to use this URL.

---

## Integration Checklist

### Phase 1: File Upload
- [ ] Update `uploadFile()` to call real backend
- [ ] Test file upload endpoint
- [ ] Handle success/error responses
- [ ] Display uploaded file info

### Phase 2: Audio Recording
- [ ] Implement `processAudioRecording()` function
- [ ] Connect to backend transcription endpoint
- [ ] Handle processing status updates
- [ ] Add real-time status polling if needed

### Phase 3: Meetings List
- [ ] Create `getMeetings()` API function
- [ ] Update Dashboard to fetch from backend
- [ ] Add loading states
- [ ] Handle empty state
- [ ] Implement status filters with real data

### Phase 4: Meeting Details
- [ ] Create `getMeetingDetail()` API function
- [ ] Build full meeting detail view
- [ ] Display transcript with timestamps
- [ ] Show RAG analysis results
- [ ] Add download/export functionality

### Phase 5: Error Handling
- [ ] Add global error handling
- [ ] Implement retry logic
- [ ] Add toast notifications
- [ ] Handle offline state

---

## Testing Strategy

1. **Mock Data Testing** (Current)
   - All features work with placeholder data
   - UI flows are complete

2. **Backend Integration Testing**
   - Test each endpoint individually
   - Verify data structure matches expectations
   - Handle edge cases (empty data, errors)

3. **End-to-End Testing**
   - Upload → Process → View flow
   - Record → Process → View flow
   - Dashboard navigation

---

## Quick Reference: What Calls What

| Frontend Component | Placeholder Function | Backend Endpoint | Data Needed |
|-------------------|---------------------|------------------|-------------|
| FileUpload.tsx | `uploadFile()` | `POST /upload/` | file_id, filename, size |
| AudioRecorder.tsx | `processAudio()` | `POST /transcribe` | meeting_id, status |
| Dashboard.tsx | `mockMeetings` | `GET /meetings/` | Array of Meeting objects |
| MeetingDetail.tsx | N/A | `GET /meetings/{id}` | Full Meeting object |
| Home.tsx | `listFiles()` | `GET /upload/files` | Array of FileInfo |

---

## Notes for Backend Developer

- All timestamps should be ISO 8601 format for dates
- File sizes in bytes
- Audio durations can be human-readable strings ("32 min") or seconds (number)
- Speaker labels should be consistent (SPEAKER_00, SPEAKER_01, etc.)
- Status values must be: "completed", "processing", or "failed"
- All endpoints should return JSON
- CORS must be enabled for frontend origin
- Consider pagination for large meeting lists

