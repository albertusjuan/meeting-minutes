import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

/**
 * 🔴 PLACEHOLDER: Meeting Detail Page
 * 
 * TODO: Complete implementation when backend is ready
 * Backend Endpoint: GET /meetings/{meeting_id}
 * 
 * Should display:
 * 1. Meeting metadata (title, date, duration, speakers)
 * 2. Summary with action items, decisions, topics
 * 3. Full transcript with timestamps
 * 4. Speaker-by-speaker breakdown
 * 5. Download/export options
 * 6. RAG Q&A interface (optional)
 * 
 * Implementation steps:
 * 1. Import { getMeetingDetail } from '../api/meetings'
 * 2. Add state for meeting data and loading
 * 3. useEffect to fetch meeting on mount
 * 4. Display full meeting information
 * 5. Add error handling for not found / failed meetings
 * 
 * See: BACKEND_INTEGRATION.md for data structure
 */
export default function MeetingDetail() {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  
  // TODO: Add state and fetch logic:
  // const [meeting, setMeeting] = useState(null);
  // const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   getMeetingDetail(meetingId).then(setMeeting).finally(() => setLoading(false));
  // }, [meetingId]);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Dashboard</span>
        </button>

        {/* Placeholder Content */}
        <div className="glass-card rounded-3xl p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-500/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Meeting Detail View</h1>
          <p className="text-gray-400 mb-2">
            This is a placeholder for meeting ID: <span className="text-cyan-400 font-mono">{meetingId}</span>
          </p>
          <p className="text-gray-500 text-sm">
            When backend is connected, this page will show detailed meeting information, full transcript, and analysis.
          </p>
        </div>
      </div>
    </Layout>
  );
}

