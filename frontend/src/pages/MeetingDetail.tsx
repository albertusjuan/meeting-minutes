import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SummaryPanel from '../components/SummaryPanel';
import TranscriptView from '../components/TranscriptView';
import QAChat from '../components/QAChat';
import { getMeetingDetails, askQuestion } from '../api/meetings';
import type { MeetingResult } from '../types/meeting';

export default function MeetingDetail() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  
  const [meeting, setMeeting] = useState<MeetingResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'transcript' | 'qa'>('summary');

  useEffect(() => {
    if (!meetingId) {
      navigate('/');
      return;
    }

    loadMeetingDetails();
  }, [meetingId]);

  const loadMeetingDetails = async () => {
    if (!meetingId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getMeetingDetails(meetingId);
      setMeeting(data);
    } catch (err: any) {
      console.error('Failed to load meeting:', err);
      
      let errorMessage = 'Failed to load meeting details.';
      if (err.response?.status === 404) {
        errorMessage = 'Meeting not found.';
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskQuestion = async (question: string) => {
    if (!meetingId) throw new Error('Meeting ID not found');
    return await askQuestion(meetingId, question);
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <svg
              className="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-gray-600">Loading meeting details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !meeting) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <svg
              className="w-16 h-16 text-red-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-red-900 mb-2">
              {error || 'Meeting Not Found'}
            </h2>
            <p className="text-red-700 mb-6">
              Unable to load meeting details. The meeting may not exist or there was an error.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>

          <div className="glass-card rounded-3xl p-8">
            <h1 className="text-3xl font-bold text-white mb-6">
              Meeting Details
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass rounded-2xl p-4">
                <span className="text-gray-400 font-medium">Meeting ID:</span>
                <p className="font-mono text-white mt-2 text-sm">{meeting.meeting_id}</p>
              </div>
              
              <div className="glass rounded-2xl p-4">
                <span className="text-gray-400 font-medium">Duration:</span>
                <p className="text-white mt-2 font-semibold">{formatDuration(meeting.transcript.duration)}</p>
              </div>
              
              <div className="glass rounded-2xl p-4">
                <span className="text-gray-400 font-medium">Speakers:</span>
                <p className="text-white mt-2 font-semibold">
                  {meeting.transcript.speakers.length} speaker{meeting.transcript.speakers.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="glass rounded-3xl p-2">
            <nav className="flex space-x-2" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('summary')}
                className={`flex-1 py-4 px-4 rounded-2xl font-semibold transition-all duration-200 ${
                  activeTab === 'summary'
                    ? 'bg-gradient-to-r from-white via-gray-200 to-gray-400 text-black shadow-lg'
                    : 'text-gray-400 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Summary</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('transcript')}
                className={`flex-1 py-4 px-4 rounded-2xl font-semibold transition-all duration-200 ${
                  activeTab === 'transcript'
                    ? 'bg-gradient-to-r from-white via-gray-200 to-gray-400 text-black shadow-lg'
                    : 'text-gray-400 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <span>Transcript</span>
                  <span className={`px-2.5 py-0.5 rounded-xl text-xs font-bold ${
                    activeTab === 'transcript' ? 'bg-black/20 text-black' : 'bg-gray-700 text-gray-400'
                  }`}>
                    {meeting.transcript.chunks.length}
                  </span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('qa')}
                className={`flex-1 py-4 px-4 rounded-2xl font-semibold transition-all duration-200 ${
                  activeTab === 'qa'
                    ? 'bg-gradient-to-r from-white via-gray-200 to-gray-400 text-black shadow-lg'
                    : 'text-gray-400 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Q&A</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="pb-12">
          {activeTab === 'summary' && <SummaryPanel summary={meeting.summary} />}
          
          {activeTab === 'transcript' && (
            <TranscriptView
              segments={meeting.transcript.chunks}
              speakers={meeting.transcript.speakers}
            />
          )}
          
          {activeTab === 'qa' && (
            <QAChat meetingId={meeting.meeting_id} onAskQuestion={handleAskQuestion} />
          )}
        </div>
      </div>
    </Layout>
  );
}

