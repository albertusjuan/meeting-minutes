import { useNavigate } from 'react-router-dom';

interface Meeting {
  id: string;
  timestamp: Date;
}

interface MeetingListProps {
  meetings: Meeting[];
}

export default function MeetingList({ meetings }: MeetingListProps) {
  const navigate = useNavigate();

  if (meetings.length === 0) {
    return null;
  }

  return (
    <div className="glass-card rounded-3xl p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Meetings</h2>
      
      <div className="space-y-3">
        {meetings.map((meeting) => (
          <button
            key={meeting.id}
            onClick={() => navigate(`/meeting/${meeting.id}`)}
            className="w-full text-left px-5 py-4 rounded-2xl glass-button hover:scale-[1.02] transition-all duration-200 flex items-center justify-between group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-white via-gray-200 to-gray-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                <svg
                  className="w-6 h-6 text-black"
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
              <div>
                <p className="font-semibold text-white">Meeting {meeting.id.slice(0, 12)}...</p>
                <p className="text-sm text-gray-400">
                  {meeting.timestamp.toLocaleString()}
                </p>
              </div>
            </div>

            <svg
              className="w-5 h-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

