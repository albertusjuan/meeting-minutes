import type { TranscriptSegment } from '../types/meeting';

interface TranscriptViewProps {
  segments: TranscriptSegment[];
  speakers: string[];
}

export default function TranscriptView({ segments, speakers }: TranscriptViewProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSpeakerDisplayName = (speakerLabel: string): string => {
    const index = speakers.indexOf(speakerLabel);
    return index >= 0 ? `Speaker ${index + 1}` : speakerLabel;
  };

  const getSpeakerColor = (speakerLabel: string): string => {
    const colors = [
      'bg-blue-100 text-blue-700 border-blue-200',
      'bg-green-100 text-green-700 border-green-200',
      'bg-purple-100 text-purple-700 border-purple-200',
      'bg-orange-100 text-orange-700 border-orange-200',
      'bg-pink-100 text-pink-700 border-pink-200',
      'bg-indigo-100 text-indigo-700 border-indigo-200',
    ];
    const index = speakers.indexOf(speakerLabel);
    return colors[index % colors.length];
  };

  const getLanguageBadge = (language?: string | null) => {
    if (!language) return null;

    const lang = language.toLowerCase();
    let displayText = '';
    let colorClass = '';

    if (lang === 'zh' || lang === 'yue' || lang.includes('chinese') || lang.includes('cantonese')) {
      displayText = '粵';
      colorClass = 'bg-red-100 text-red-700';
    } else if (lang === 'en' || lang.includes('english')) {
      displayText = 'EN';
      colorClass = 'bg-blue-100 text-blue-700';
    } else if (lang === 'mixed') {
      displayText = 'MIX';
      colorClass = 'bg-purple-100 text-purple-700';
    } else {
      displayText = lang.toUpperCase().slice(0, 3);
      colorClass = 'bg-gray-100 text-gray-700';
    }

    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
        {displayText}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <svg
          className="w-6 h-6 text-primary-600 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
        Transcript
      </h2>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {segments.map((segment, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getSpeakerColor(
                    segment.speaker_label
                  )}`}
                >
                  {getSpeakerDisplayName(segment.speaker_label)}
                </span>
                {getLanguageBadge(segment.language)}
              </div>

              <span className="text-sm text-gray-500 font-mono">
                {formatTime(segment.start_time)} - {formatTime(segment.end_time)}
              </span>
            </div>

            <p className="text-gray-800 leading-relaxed">{segment.text}</p>
          </div>
        ))}
      </div>

      {segments.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <p>No transcript available</p>
        </div>
      )}
    </div>
  );
}

