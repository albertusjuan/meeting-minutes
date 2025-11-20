import { useState, useRef, useEffect, FormEvent } from 'react';
import type { QAMessage, TranscriptSegment } from '../types/meeting';

interface QAChatProps {
  meetingId: string;
  onAskQuestion: (question: string) => Promise<{ answer: string; context_chunks: TranscriptSegment[] }>;
}

export default function QAChat({ meetingId, onAskQuestion }: QAChatProps) {
  const [messages, setMessages] = useState<QAMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showContext, setShowContext] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!currentQuestion.trim() || isLoading) return;

    const userMessage: QAMessage = {
      role: 'user',
      content: currentQuestion,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentQuestion('');
    setIsLoading(true);

    try {
      const response = await onAskQuestion(currentQuestion);

      const assistantMessage: QAMessage = {
        role: 'assistant',
        content: response.answer,
        context_chunks: response.context_chunks,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: QAMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your question. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error('QA Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-card rounded-3xl p-8">
      <h2 className="text-xl font-semibold text-white mb-8 flex items-center">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-white via-gray-300 to-gray-500 flex items-center justify-center mr-3 shadow-lg">
          <svg
            className="w-5 h-5 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        Ask Questions
      </h2>

      {/* Chat Messages */}
      <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto pr-2">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-sm">Ask any question about this meeting</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-3xl p-5 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-white via-gray-200 to-gray-300 text-black shadow-lg'
                    : 'glass text-gray-300 shadow-md'
                }`}
              >
                <p className="whitespace-pre-wrap text-base leading-relaxed">{message.content}</p>

                {message.context_chunks && message.context_chunks.length > 0 && (
                  <div className="mt-4">
                    <button
                      onClick={() => setShowContext(showContext === index ? null : index)}
                      className="text-sm hover:scale-105 transition-transform flex items-center glass-button px-3 py-1.5 rounded-xl"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {showContext === index ? 'Hide' : 'Show'} context ({message.context_chunks.length} chunks)
                    </button>

                    {showContext === index && (
                      <div className="mt-3 space-y-2">
                        {message.context_chunks.map((chunk, chunkIndex) => (
                          <div
                            key={chunkIndex}
                            className="text-sm glass rounded-2xl p-3"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-gray-700 font-semibold">
                                {chunk.speaker_label}
                              </span>
                              <span className="text-xs text-gray-600 font-mono">
                                {formatTime(chunk.start_time)} - {formatTime(chunk.end_time)}
                              </span>
                            </div>
                            <p className="text-gray-800">{chunk.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <p className="text-xs mt-3 opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="glass rounded-3xl p-5 shadow-md">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex space-x-3">
        <input
          type="text"
          value={currentQuestion}
          onChange={(e) => setCurrentQuestion(e.target.value)}
          placeholder="Ask a question about the meeting..."
          disabled={isLoading}
          className="flex-1 px-5 py-3.5 glass-input rounded-2xl focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder-gray-500 text-base"
        />
        <button
          type="submit"
          disabled={isLoading || !currentQuestion.trim()}
          className="px-6 py-3.5 bg-gradient-to-r from-white via-gray-200 to-gray-400 text-black rounded-2xl hover:from-gray-200 hover:to-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
}

