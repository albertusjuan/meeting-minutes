# Meeting Minutes - Frontend

Modern React frontend for the Meeting Minutes AI transcription system.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Create a `.env` file:

```bash
# Copy from example
copy .env.example .env
```

Default configuration (backend running on localhost:8000):
```env
VITE_API_BASE_URL=http://localhost:8000
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:3000**

---

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Backend API** running on `http://localhost:8000` (or configure different URL in `.env`)

---

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── api/                 # API client layer
│   │   ├── client.ts        # Axios instance with interceptors
│   │   └── meetings.ts      # Meeting API functions
│   ├── components/          # Reusable React components
│   │   ├── FileUpload.tsx   # Drag-and-drop file upload
│   │   ├── Layout.tsx       # App shell with navbar
│   │   ├── MeetingList.tsx  # List of processed meetings
│   │   ├── QAChat.tsx       # Q&A chat interface
│   │   ├── SummaryPanel.tsx # Meeting summary display
│   │   └── TranscriptView.tsx # Speaker-labeled transcript
│   ├── pages/               # Route pages
│   │   ├── Home.tsx         # Upload page
│   │   └── MeetingDetail.tsx # Meeting detail view
│   ├── types/               # TypeScript interfaces
│   │   └── meeting.ts       # Meeting data types
│   ├── App.tsx              # Root component with routing
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles (Tailwind)
├── index.html
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json
```

---

## 🎨 Features

### Home Page
- **Drag-and-drop file upload** for audio files (WAV, MP3, M4A, FLAC)
- **Real-time upload progress** with loading indicators
- **Meeting list** showing recently processed meetings
- **Feature cards** explaining capabilities

### Meeting Detail Page
- **Tabbed interface** (Summary, Transcript, Q&A)
- **Summary Panel**:
  - AI-generated meeting summary
  - Action items (numbered list)
  - Key decisions (numbered list)
  - Topics discussed (tags)
- **Transcript View**:
  - Speaker-labeled segments with color coding
  - Timestamps in mm:ss format
  - Language badges (EN/粵/MIX)
  - Scrollable view with hover effects
- **Q&A Chat**:
  - Chat-style interface
  - Question history
  - Expandable context chunks showing source transcript
  - Loading states for responses

---

## 🎨 Tech Stack

- **React 18** with TypeScript
- **Vite** for blazing fast dev server and builds
- **React Router** for navigation
- **Axios** for HTTP requests
- **Tailwind CSS** for styling
- **ESLint** for code quality

---

## 📡 API Integration

The frontend expects the following backend endpoints:

### POST `/meetings/upload`
Upload audio file for processing.

**Request**: `multipart/form-data` with `file` field

**Response**:
```json
{
  "meeting_id": "string",
  "message": "string",
  "summary": {
    "summary": "string",
    "action_items": ["string"],
    "key_decisions": ["string"],
    "topics": ["string"]
  }
}
```

### GET `/meetings/{meeting_id}`
Get meeting details.

**Response**:
```json
{
  "meeting_id": "string",
  "transcript": {
    "meeting_id": "string",
    "chunks": [
      {
        "speaker_label": "SPEAKER_00",
        "start_time": 0.0,
        "end_time": 5.2,
        "text": "...",
        "language": "en"
      }
    ],
    "speakers": ["SPEAKER_00", "SPEAKER_01"],
    "duration": 1847.3
  },
  "summary": { ... }
}
```

### POST `/meetings/qa/{meeting_id}`
Ask question about a meeting.

**Request**:
```json
{
  "question": "What were the main topics?",
  "top_k": 5
}
```

**Response**:
```json
{
  "question": "...",
  "answer": "...",
  "context_chunks": [ ... ]
}
```

---

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Environment Variables

Create `.env` file:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:8000
```

For production, update this to your deployed backend URL.

---

## 🎯 Usage

### 1. Upload a Meeting

1. Click or drag-and-drop an audio file
2. Click "Upload & Process Meeting"
3. Wait for processing (may take several minutes)
4. Automatically redirected to meeting detail page

### 2. View Meeting Summary

- Summary tab shows AI-generated overview
- Action items listed with numbers
- Key decisions highlighted
- Topics displayed as tags

### 3. Browse Transcript

- Switch to Transcript tab
- Each segment shows:
  - Speaker label (color-coded)
  - Timestamp range
  - Language badge
  - Transcribed text
- Scroll through full conversation

### 4. Ask Questions

- Switch to Q&A tab
- Type question in input field
- Click "Ask" to submit
- View answer in chat format
- Expand context to see source transcript chunks

---

## 🎨 Customization

### Changing Colors

Edit `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: {
        // Customize your brand colors here
        500: '#0ea5e9',
        600: '#0284c7',
        // ...
      },
    },
  },
}
```

### API Configuration

All API calls go through `src/api/client.ts`. Modify interceptors there for:
- Authentication headers
- Custom error handling
- Request/response logging

### Adding New Features

1. Create component in `src/components/`
2. Add types to `src/types/meeting.ts`
3. Add API function to `src/api/meetings.ts`
4. Integrate into pages

---

## 🐛 Troubleshooting

### "Failed to fetch" errors

- Check backend is running on `http://localhost:8000`
- Verify `VITE_API_BASE_URL` in `.env`
- Check CORS settings on backend

### Upload fails

- Ensure file is supported format (WAV, MP3, M4A, FLAC)
- Check file size (backend may have limits)
- Verify backend is processing correctly

### Meeting not loading

- Check browser console for errors
- Verify meeting_id is correct
- Check backend logs for processing status

---

## 📦 Building for Production

```bash
# Create optimized build
npm run build

# Preview production build locally
npm run preview
```

The built files will be in the `dist/` folder, ready for deployment.

### Deployment Options

- **Vercel**: Connect GitHub repo, auto-deploys
- **Netlify**: Drag-and-drop `dist` folder
- **Static hosting**: Upload `dist` folder contents
- **Docker**: Create Dockerfile with nginx serving `dist`

### Environment for Production

Set `VITE_API_BASE_URL` to your production backend URL before building:

```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

---

## 🔜 Future Enhancements

- Meeting list persistence (localStorage or backend)
- Export transcript as PDF/Word
- Audio playback with timestamp sync
- Real-time processing status updates
- User authentication
- Meeting sharing and collaboration
- Transcript search
- Meeting analytics dashboard

---

## 📄 License

[Your License Here]

---

## 🙋 Support

For issues or questions about the frontend:
- Check the browser console for errors
- Verify backend API is accessible
- Review the API integration section above

For backend issues, see `../backend/README.md`

