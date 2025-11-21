import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

/**
 * Landing Page - Simple and straightforward
 * Focuses on the core value proposition
 */
export default function Home() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        
        {/* Hero Section */}
        <section className="text-center py-20">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Stop taking notes.<br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Start running better meetings.
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            AI meeting notes that understand <strong>Cantonese and English</strong> with speaker labels, 
            action items, and instant answers from past discussions.
          </p>
          <div className="flex items-center justify-center">
            <button
              onClick={() => navigate('/upload')}
              className="px-12 py-5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-xl font-bold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </section>

        {/* Pain Points */}
        <section className="py-16">
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className="glass-card rounded-3xl p-8 border-l-4 border-red-500/50">
              <h3 className="text-xl font-bold text-white mb-3">❌ Manual notes ruin focus</h3>
              <p className="text-gray-400 leading-relaxed">
                You can't fully participate when you're busy typing. Notes end up incomplete, and nobody's 100% sure what was actually said.
              </p>
            </div>
            <div className="glass-card rounded-3xl p-8 border-l-4 border-red-500/50">
              <h3 className="text-xl font-bold text-white mb-3">❌ Decisions disappear</h3>
              <p className="text-gray-400 leading-relaxed">
                A week later: "What did we decide?" Action items scattered across Slack, WhatsApp, and random docs. No single source of truth.
              </p>
            </div>
            <div className="glass-card rounded-3xl p-8 border-l-4 border-red-500/50">
              <h3 className="text-xl font-bold text-white mb-3">❌ Multi-language chaos</h3>
              <p className="text-gray-400 leading-relaxed">
                Switching between Cantonese and English? Generic tools mis-transcribe names, mix languages, and lose critical context.
              </p>
            </div>
            <div className="glass-card rounded-3xl p-8 border-l-4 border-red-500/50">
              <h3 className="text-xl font-bold text-white mb-3">❌ Finding context is painful</h3>
              <p className="text-gray-400 leading-relaxed">
                Scrubbing through hours of recordings to find 30 seconds. "Who said X?" takes forever to answer.
              </p>
            </div>
          </div>
        </section>

        {/* Solution */}
        <section className="py-16">
          <div className="glass-card rounded-3xl p-12 text-center bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
            <h2 className="text-4xl font-bold text-white mb-6">
              Meeting Minutes solves all of this
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Upload your recording. Get speaker-labeled transcripts, AI summaries, and the ability to 
              ask questions like <em>"What did we decide about the budget?"</em> instantly.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <h2 className="text-4xl font-bold text-white text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-3xl shadow-xl">
                1
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Upload or Record</h3>
              <p className="text-gray-400 leading-relaxed">
                Drop in audio from Zoom, Google Meet, Teams, or record live. Supports WAV, MP3, M4A, FLAC.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-3xl shadow-xl">
                2
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI Processes Everything</h3>
              <p className="text-gray-400 leading-relaxed">
                Speaker diarization, Cantonese + English transcription, and RAG-powered analysis in minutes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-3xl shadow-xl">
                3
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Search & Share</h3>
              <p className="text-gray-400 leading-relaxed">
                Review summaries, search transcripts, ask questions, and export everything for your team.
              </p>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Why Teams Choose Us</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card rounded-3xl p-6 flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Speaker Diarization</h3>
                <p className="text-gray-400 text-sm">Know exactly who said what, with timestamps.</p>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6 flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Multi-Language Support</h3>
                <p className="text-gray-400 text-sm">Handles Cantonese + English code-switching seamlessly.</p>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6 flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Smart Summaries</h3>
                <p className="text-gray-400 text-sm">Auto-generated action items, decisions, and key topics.</p>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6 flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Ask Anything</h3>
                <p className="text-gray-400 text-sm">Chat with your past meetings using RAG-powered Q&A.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Built for Modern Teams</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">🎯 Founders & Leaders</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• High-level pulse on all meetings</li>
                <li>• No need to read full transcripts</li>
                <li>• Track decisions across the company</li>
              </ul>
            </div>
            <div className="glass-card rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">📋 Project Managers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• Never lose track of action items</li>
                <li>• Clear ownership and deadlines</li>
                <li>• Searchable meeting history</li>
              </ul>
            </div>
            <div className="glass-card rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">💼 Client Teams</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• Turn calls into clear briefs</li>
                <li>• Document client requirements</li>
                <li>• Share meeting outcomes easily</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Common Questions</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            <details className="glass-card rounded-2xl p-6 group">
              <summary className="font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                <span>Does it work with Cantonese + English in the same meeting?</span>
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-gray-400 mt-4">
                Yes! Meeting Minutes is specifically designed to handle code-switching between Cantonese and English. 
                Our AI models detect language changes and transcribe accurately in both languages.
              </p>
            </details>

            <details className="glass-card rounded-2xl p-6 group">
              <summary className="font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                <span>What audio formats are supported?</span>
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-gray-400 mt-4">
                We support WAV, MP3, M4A, and FLAC files up to 500MB. Works with recordings from Zoom, 
                Google Meet, Microsoft Teams, or any audio recording device.
              </p>
            </details>

            <details className="glass-card rounded-2xl p-6 group">
              <summary className="font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                <span>How is this different from generic transcription tools?</span>
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-gray-400 mt-4">
                Meeting Minutes goes beyond transcription: speaker diarization (who said what), 
                true multi-language support, AI-extracted action items and decisions, plus RAG-powered Q&A 
                so you can ask questions about past meetings.
              </p>
            </details>

            <details className="glass-card rounded-2xl p-6 group">
              <summary className="font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                <span>Is my data private?</span>
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-gray-400 mt-4">
                Your meeting data is encrypted and stored securely. We never train AI models on your data, 
                and you maintain full control over your recordings and transcripts.
              </p>
            </details>
          </div>
        </section>


      </div>
    </Layout>
  );
}
