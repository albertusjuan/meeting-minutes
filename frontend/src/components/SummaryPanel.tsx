import type { SummaryResponse } from '../types/meeting';

interface SummaryPanelProps {
  summary: SummaryResponse;
}

export default function SummaryPanel({ summary }: SummaryPanelProps) {
  return (
    <div className="space-y-6">
      {/* Main Summary */}
      <div className="glass-card rounded-3xl p-8">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-white via-gray-200 to-gray-400 flex items-center justify-center mr-3 shadow-lg">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          Summary
        </h2>
        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">{summary.summary}</p>
      </div>

      {/* Action Items */}
      {summary.action_items && summary.action_items.length > 0 && (
        <div className="glass-card rounded-3xl p-8">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 flex items-center justify-center mr-3 shadow-lg">
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            Action Items
          </h3>
          <ul className="space-y-3">
            {summary.action_items.map((item, index) => (
              <li key={index} className="flex items-start group">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-gray-300 to-gray-600 text-white text-sm font-semibold mr-4 mt-0.5 flex-shrink-0 shadow-md">
                  {index + 1}
                </span>
                <span className="text-gray-300 text-base">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Key Decisions */}
      {summary.key_decisions && summary.key_decisions.length > 0 && (
        <div className="glass-card rounded-3xl p-8">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-400 via-gray-500 to-gray-700 flex items-center justify-center mr-3 shadow-lg">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            Key Decisions
          </h3>
          <ul className="space-y-3">
            {summary.key_decisions.map((decision, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-gray-400 to-gray-700 text-white text-sm font-semibold mr-4 mt-0.5 flex-shrink-0 shadow-md">
                  {index + 1}
                </span>
                <span className="text-gray-300 text-base">{decision}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Topics */}
      {summary.topics && summary.topics.length > 0 && (
        <div className="glass-card rounded-3xl p-8">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-500 via-gray-600 to-gray-800 flex items-center justify-center mr-3 shadow-lg">
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
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            Topics Discussed
          </h3>
          <div className="flex flex-wrap gap-3">
            {summary.topics.map((topic, index) => (
              <span
                key={index}
                className="px-5 py-2 glass rounded-2xl text-sm font-semibold text-gray-300 hover:scale-105 transition-transform"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

