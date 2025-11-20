import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import FileUpload from '../components/FileUpload';
import MeetingList from '../components/MeetingList';
import { uploadMeeting } from '../api/meetings';

interface Meeting {
  id: string;
  timestamp: Date;
}

export default function Home() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      console.log('Uploading file:', file.name);
      const result = await uploadMeeting(file);
      
      console.log('Upload successful:', result);

      // Add to meetings list
      const newMeeting: Meeting = {
        id: result.meeting_id,
        timestamp: new Date(),
      };
      setMeetings((prev) => [newMeeting, ...prev]);

      // Navigate to meeting detail page
      navigate(`/meeting/${result.meeting_id}`);
    } catch (err: any) {
      console.error('Upload error:', err);
      
      let errorMessage = 'Failed to process meeting. Please try again.';
      
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setIsUploading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-4">
            AI-Powered Meeting Transcription
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Upload your meeting audio and get instant transcription with speaker diarization,
            multi-language support (Cantonese + English), AI summaries, and intelligent Q&A.
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <FileUpload onUpload={handleUpload} isUploading={isUploading} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 glass-card rounded-3xl p-6">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center mr-4 shadow-lg flex-shrink-0">
                <svg
                  className="w-5 h-5 text-white"
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
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1 text-lg">Upload Failed</h3>
                <p className="text-gray-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Processing Status */}
        {isUploading && (
          <div className="mb-8 glass-card rounded-3xl p-8">
            <div className="flex items-center justify-center space-x-6">
              <svg
                className="animate-spin h-12 w-12 text-white"
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
              <div>
                <p className="font-semibold text-white text-lg">Processing your meeting...</p>
                <p className="text-gray-300 mt-1">
                  This may take several minutes. Please don't close this page.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Meetings List */}
        {meetings.length > 0 && (
          <div className="mb-8">
            <MeetingList meetings={meetings} />
          </div>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="glass-card rounded-3xl p-8 hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-white mb-3 text-xl">Speaker Diarization</h3>
            <p className="text-gray-300 leading-relaxed">
              Automatically identifies and labels different speakers in your meeting.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
              </svg>
            </div>
            <h3 className="font-bold text-white mb-3 text-xl">Multi-Language</h3>
            <p className="text-gray-300 leading-relaxed">
              Supports Cantonese and English with automatic code-switching detection.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-white mb-3 text-xl">AI Analysis</h3>
            <p className="text-gray-300 leading-relaxed">
              Get summaries, action items, key decisions, and ask questions about your meeting.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

