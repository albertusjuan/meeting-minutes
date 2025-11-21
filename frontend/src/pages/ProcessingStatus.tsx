import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';

/**
 * 🔴 PLACEHOLDER: Processing Status Page
 * 
 * This page shows the status of audio processing through the RAG pipeline.
 * 
 * TODO: When backend is ready:
 * 1. Poll backend for processing status: GET /meetings/{meeting_id}/status
 * 2. Update progress based on backend response
 * 3. When complete, redirect to /meeting/{meeting_id} or /dashboard
 * 4. Show error state if processing fails
 * 
 * Backend should provide:
 * - processing_status: "uploading" | "transcribing" | "diarizing" | "analyzing" | "completed" | "failed"
 * - progress_percent: number (0-100)
 * - current_step: string (description of current step)
 * - meeting_id: string
 * - error_message?: string
 */
export default function ProcessingStatus() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [processingStatus, setProcessingStatus] = useState<'processing' | 'completed' | 'failed'>('processing');

  const meetingId = searchParams.get('meetingId') || 'mock_meeting_' + Date.now();
  const source = searchParams.get('source') || 'unknown'; // 'recording' or 'upload'

  const processingSteps = [
    { 
      name: 'Uploading Audio', 
      description: 'Sending audio file to server...',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      )
    },
    { 
      name: 'Transcribing', 
      description: 'Converting speech to text with Whisper...',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      )
    },
    { 
      name: 'Speaker Diarization', 
      description: 'Identifying different speakers with pyannote...',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      name: 'RAG Analysis', 
      description: 'Processing transcript through RAG pipeline...',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      )
    },
    { 
      name: 'Generating Summary', 
      description: 'Creating summary with LLM...',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
  ];

  useEffect(() => {
    // PLACEHOLDER: Simulate processing steps
    console.log('[🔴 PLACEHOLDER] Starting mock processing for meeting:', meetingId);
    console.warn('[BACKEND NEEDED] Poll: GET /meetings/' + meetingId + '/status');

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= processingSteps.length - 1) {
          clearInterval(interval);
          // Simulate completion
          setTimeout(() => {
            setProcessingStatus('completed');
            // Redirect after 2 seconds
            setTimeout(() => {
              navigate('/dashboard');
            }, 2000);
          }, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 2000); // Each step takes 2 seconds (PLACEHOLDER)

    return () => clearInterval(interval);
  }, [meetingId, navigate]);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {processingStatus === 'processing' && (
          <div className="glass-card rounded-3xl p-12">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl animate-pulse">
                <svg
                  className="w-12 h-12 text-white animate-spin"
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
              </div>
              <h1 className="text-4xl font-bold text-white mb-3">
                Processing Your {source === 'recording' ? 'Recording' : 'Audio File'}
              </h1>
              <p className="text-gray-400 text-lg">
                Please wait while we transcribe and analyze your audio...
              </p>
              <div className="mt-4 inline-block px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-xl">
                <p className="text-sm text-yellow-300 font-medium">
                  ⚠️ PLACEHOLDER - Simulating processing steps
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-400">Progress</span>
                <span className="text-sm font-semibold text-white">
                  {Math.round((currentStep / processingSteps.length) * 100)}%
                </span>
              </div>
              <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000 ease-out"
                  style={{ width: `${(currentStep / processingSteps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Processing Steps */}
            <div className="space-y-4">
              {processingSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-4 p-5 rounded-2xl transition-all duration-500 ${
                    index === currentStep
                      ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/40 scale-[1.02] shadow-lg'
                      : index < currentStep
                      ? 'bg-green-500/10 border border-green-500/30'
                      : 'bg-gray-800/20 border border-gray-700/30'
                  }`}
                >
                  {/* Icon Container */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                    index === currentStep
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg'
                      : index < currentStep
                      ? 'bg-gradient-to-br from-green-500 to-green-600'
                      : 'bg-gray-700/50'
                  }`}>
                    <div className={index === currentStep ? 'text-white' : index < currentStep ? 'text-white' : 'text-gray-500'}>
                      {step.icon}
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className={`font-semibold text-lg ${
                        index === currentStep ? 'text-white' : index < currentStep ? 'text-green-400' : 'text-gray-500'
                      }`}>
                        {step.name}
                      </h3>
                      {index < currentStep && (
                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                      {index === currentStep && (
                        <svg className="w-5 h-5 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                    </div>
                    <p className={`text-sm mt-1 ${
                      index === currentStep ? 'text-gray-300' : index < currentStep ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Info */}
            <div className="mt-8 p-4 bg-gray-800/30 rounded-2xl border border-gray-700/50">
              <p className="text-sm text-gray-400 text-center">
                This may take a few minutes depending on the audio length.
                <br />
                You can safely close this page - we'll save your meeting to the dashboard.
              </p>
            </div>
          </div>
        )}

        {processingStatus === 'completed' && (
          <div className="glass-card rounded-3xl p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-2xl">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Processing Complete!
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Your meeting has been transcribed and analyzed successfully.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Redirecting to dashboard...
            </p>
            <div className="inline-block px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-xl">
              <p className="text-sm text-blue-300 font-medium">
                ⚠️ PLACEHOLDER - Meeting ID: {meetingId}
              </p>
            </div>
          </div>
        )}

        {processingStatus === 'failed' && (
          <div className="glass-card rounded-3xl p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-2xl">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Processing Failed
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Something went wrong while processing your audio.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-semibold transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

