import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import FileUpload from '../components/FileUpload';
import AudioRecorder from '../components/AudioRecorder';
import { uploadFile, listFiles } from '../api/meetings';
import type { FileInfo } from '../types/meeting';

export default function Upload() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [numSpeakers, setNumSpeakers] = useState<number>(2); // Default to 2 speakers
  const [customSpeakerCount, setCustomSpeakerCount] = useState<string>('');

  const handleFileSelected = (file: File | null) => {
    setSelectedFile(file);
    setError(null);
  };


  /**
   * 🔴 PLACEHOLDER: Process Audio (Unified for both Recording and Upload)
   * 
   * TODO: Replace with real backend call
   * Backend Endpoints: 
   * - POST /transcribe (for recorded audio blob)
   * - POST /upload + POST /meetings/process (for selected file)
   * 
   * Backend should:
   * 1. Accept either audio Blob or File
   * 2. Run ASR (Whisper)
   * 3. Run speaker diarization (pyannote)
   * 4. Process through RAG pipeline
   * 5. Generate summary with LLM
   * 6. Return meeting_id
   */
  const handleProcessAudio = async () => {
    if (!recordedAudio && !selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      if (recordedAudio) {
        console.log('[🔴 PLACEHOLDER] Processing recorded audio:', {
          size: recordedAudio.size,
          type: recordedAudio.type,
          numSpeakers: numSpeakers
        });
        console.warn('[BACKEND NEEDED] Replace with: await processAudioRecording(recordedAudio, { num_speakers: ' + numSpeakers + ' })');
      } else if (selectedFile) {
        console.log('[🔴 PLACEHOLDER] Processing selected file:', selectedFile.name, 'with', numSpeakers, 'speakers');
        console.warn('[BACKEND NEEDED] Replace with: uploadFile() then processUploadedFile() with num_speakers parameter');
      }

      // Generate mock meeting ID
      const mockMeetingId = `mock_meeting_${Date.now()}`;
      const source = recordedAudio ? 'recording' : 'upload';

      console.log('[🔴 PLACEHOLDER] Redirecting to processing page');
      
      // Redirect to processing status page
      navigate(`/processing?meetingId=${mockMeetingId}&source=${source}`);
      
      setIsProcessing(false);
      setSelectedFile(null);
      setRecordedAudio(null);

      // TODO: When backend is ready:
      // if (recordedAudio) {
      //   const result = await processAudioRecording(recordedAudio);
      //   navigate(`/processing?meetingId=${result.meeting_id}&source=recording`);
      // } else if (selectedFile) {
      //   const uploadResult = await uploadFile(selectedFile);
      //   const processResult = await processUploadedFile(uploadResult.file_id);
      //   navigate(`/processing?meetingId=${processResult.meeting_id}&source=upload`);
      // }
    } catch (err: any) {
      console.error('[PROCESS] Processing error:', err);
      setError('Failed to process audio. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* Clean Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-3">
            Upload Your Meeting
          </h1>
          <p className="text-gray-400">
            Record live or upload an existing audio file
          </p>
        </div>

        {/* Record Section */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Record Audio</h2>
          </div>
          <AudioRecorder 
            onRecordingComplete={(audioBlob, audioUrl) => {
              console.log('Recording complete:', { size: audioBlob.size, url: audioUrl });
            }}
            onRecordingReady={(audioBlob) => {
              setRecordedAudio(audioBlob);
            }}
          />
        </div>

        {/* Divider */}
        <div className="flex items-center my-12">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
          <span className="px-6 text-sm text-gray-500 font-semibold uppercase tracking-wider">Or</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
        </div>

        {/* Upload Section */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Upload File</h2>
          </div>
          <FileUpload onFileSelected={handleFileSelected} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-red-400 text-sm">Error</h3>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Speaker Configuration */}
        {(recordedAudio || selectedFile) && (
          <div className="mb-8 glass-card rounded-3xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Number of Speakers</h3>
                <p className="text-sm text-gray-400">Configure speaker diarization for pyannote</p>
              </div>
            </div>

            {/* Quick Select Buttons */}
            <div className="grid grid-cols-6 gap-3 mb-4">
              {[2, 3, 4, 5, 6].map((count) => (
                <button
                  key={count}
                  onClick={() => {
                    setNumSpeakers(count);
                    setCustomSpeakerCount('');
                  }}
                  className={`py-3 rounded-xl font-semibold transition-all duration-300 ${
                    numSpeakers === count
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white border border-gray-700/50'
                  }`}
                >
                  {count}
                </button>
              ))}
              
              {/* Custom Input */}
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="20"
                  placeholder="More"
                  value={customSpeakerCount}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCustomSpeakerCount(value);
                    if (value && !isNaN(parseInt(value))) {
                      setNumSpeakers(parseInt(value));
                    }
                  }}
                  className={`w-full px-2 py-3 rounded-xl font-semibold transition-all duration-300 text-center focus:outline-none ${
                    customSpeakerCount && !isNaN(parseInt(customSpeakerCount))
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105 border-0'
                      : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:bg-gray-700/50 hover:text-white focus:border-blue-500'
                  }`}
                />
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-3 text-center">
              💡 Specify the exact number of speakers for accurate diarization
            </p>
          </div>
        )}

        {/* Process Button */}
        {(recordedAudio || selectedFile) && (
          <div className="mb-12">
            <button
              onClick={handleProcessAudio}
              disabled={isProcessing || !numSpeakers}
              className="w-full px-8 py-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl hover:shadow-blue-500/30 hover:scale-[1.02]"
            >
              {isProcessing ? (
                <>
                  <svg
                    className="animate-spin h-6 w-6 text-white"
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
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Process Audio</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

