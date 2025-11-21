import { useState, useRef, useEffect } from 'react';

interface AudioRecorderProps {
  onRecordingComplete?: (audioBlob: Blob, audioUrl: string) => void;
  onRecordingReady?: (audioBlob: Blob | null) => void;
}

export default function AudioRecorder({ onRecordingComplete, onRecordingReady }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [waveformHeights] = useState(() => 
    Array.from({ length: 50 }, () => 20 + Math.random() * 60)
  );

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mpeg' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setAudioBlob(audioBlob);
        
        if (onRecordingComplete) {
          onRecordingComplete(audioBlob, url);
        }
        if (onRecordingReady) {
          onRecordingReady(audioBlob);
        }

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please ensure you have granted microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
      setIsPaused(!isPaused);
    }
  };

  const playRecording = () => {
    if (audioUrl && audioPlayerRef.current) {
      if (isPlaying) {
        audioPlayerRef.current.pause();
        setIsPlaying(false);
      } else {
        audioPlayerRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioPlayerRef.current) {
      setCurrentTime(audioPlayerRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioPlayerRef.current) {
      setDuration(audioPlayerRef.current.duration);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.currentTime = newTime;
    }
  };

  const downloadRecording = () => {
    if (audioUrl && audioBlob) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `recording_${timestamp}.mp3`;
      
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  /**
   * 🔴 PLACEHOLDER: Process Audio for RAG
   * 
   * TODO: Replace with real backend call to processAudioRecording()
   * Should call: POST /transcribe or POST /meetings/process
   * 
   * Backend should:
   * 1. Accept audio Blob/File
   * 2. Run ASR (Whisper)
   * 3. Run speaker diarization (pyannote)
   * 4. Process through RAG pipeline
   * 5. Generate summary with LLM
   * 6. Return meeting_id
   * 
   * After successful processing, redirect to:
   * - /meeting/{meeting_id} (detail view)
   * - /dashboard (meetings list)
   */
  const processAudio = async () => {
    if (!audioBlob) return;
    
    setIsProcessing(true);
    console.log('[🔴 PLACEHOLDER] Simulating audio processing for RAG:', {
      size: audioBlob.size,
      type: audioBlob.type
    });
    console.warn('[BACKEND NEEDED] Replace with: await processAudioRecording(audioBlob)');

    // Simulate processing delay - REPLACE WITH REAL API CALL
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('[🔴 PLACEHOLDER] Simulated processing complete');
    alert('⚠️ PLACEHOLDER MODE\n\nAudio NOT sent to backend.\n\nWhen integrated, this will:\n1. Upload audio to backend\n2. Transcribe with Whisper\n3. Identify speakers with pyannote\n4. Process through RAG pipeline\n5. Generate meeting summary\n6. Return meeting_id\n\nSee: frontend/BACKEND_INTEGRATION.md');
    
    setIsProcessing(false);
    
    // TODO: When backend is ready:
    // const result = await processAudioRecording(audioBlob);
    // if (result.meeting_id) {
    //   navigate(`/meeting/${result.meeting_id}`);
    // }
  };

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setRecordingTime(0);
    setIsPlaying(false);
    
    if (onRecordingReady) {
      onRecordingReady(null);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full glass-card rounded-3xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Voice Recorder</h2>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isRecording && !isPaused ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
          <span className="text-gray-300 font-mono text-lg">{formatTime(recordingTime)}</span>
        </div>
      </div>

      {/* Recording Controls */}
      {!audioUrl && (
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110"
              >
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              </button>
            ) : (
              <>
                <button
                  onClick={pauseRecording}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110"
                >
                  {isPaused ? (
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={stopRecording}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110"
                >
                  <div className="w-8 h-8 bg-white rounded-lg"></div>
                </button>
              </>
            )}
          </div>
          
          <p className="text-center text-gray-400 text-sm">
            {!isRecording ? 'Click the microphone to start recording' : isPaused ? 'Recording paused' : 'Recording in progress...'}
          </p>
        </div>
      )}

      {/* Playback Controls */}
      {audioUrl && (
        <div className="space-y-4">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white">Recording Complete</p>
                  <p className="text-sm text-gray-400">Duration: {formatTime(recordingTime)}</p>
                </div>
              </div>
            </div>

            {/* Audio Player */}
            <audio
              ref={audioPlayerRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              className="hidden"
            />

            {/* Progress Slider */}
            <div className="mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-400 font-mono min-w-[40px] text-center">
                  {formatTime(Math.floor(currentTime))}
                </span>
                
                <div className="flex-1 relative group">
                  {/* Track background */}
                  <div className="absolute inset-0 h-2 bg-gray-700/80 rounded-full"></div>
                  
                  {/* Progress fill */}
                  <div 
                    className="absolute inset-0 h-2 bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-100 ease-linear"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  ></div>
                  
                  {/* Slider input */}
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    step="0.01"
                    value={currentTime}
                    onChange={handleSliderChange}
                    className="absolute inset-0 w-full h-2 appearance-none cursor-pointer bg-transparent slider-clean"
                  />
                </div>

                <span className="text-xs text-gray-400 font-mono min-w-[40px] text-center">
                  {formatTime(Math.floor(duration))}
                </span>
              </div>

              {/* Waveform Visual (decorative) */}
              <div className="mt-3 flex items-end justify-center gap-[2px] h-16 px-2">
                {waveformHeights.map((height, i) => {
                  const progress = currentTime / duration;
                  const barProgress = i / waveformHeights.length;
                  const isActive = barProgress <= progress;
                  
                  return (
                    <div
                      key={i}
                      className={`w-1 rounded-sm transition-all duration-300 ease-out ${
                        isActive
                          ? 'bg-gradient-to-t from-green-500 to-green-400' 
                          : 'bg-gray-700/50'
                      }`}
                      style={{
                        height: `${height}%`,
                        transform: isActive ? 'scaleY(1)' : 'scaleY(0.7)',
                        opacity: isActive ? 1 : 0.5
                      }}
                    ></div>
                  );
                })}
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center space-x-3 flex-wrap">
              <button
                onClick={playRecording}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2"
              >
                {isPlaying ? (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    <span>Play</span>
                  </>
                )}
              </button>

              <button
                onClick={downloadRecording}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download MP3</span>
              </button>

              <button
                onClick={deleteRecording}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

