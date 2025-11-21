import { useState } from 'react';
import Layout from '../components/Layout';

/**
 * 🔴 PLACEHOLDER DATA - Mock Meetings
 * 
 * TODO: Replace with real API call to getMeetings()
 * Backend Endpoint: GET /meetings/ or GET /meetings/list
 */
const mockMeetings = [
  {
    id: '1',
    title: 'Team Standup - Engineering',
    date: 'Nov 20, 2025',
    duration: '32 min',
    summary: 'The engineering team discussed current sprint progress, with focus on the new authentication system. Key decisions included moving forward with OAuth2 implementation and scheduling a security review for next week. Action items: John to finalize API documentation, Sarah to complete unit tests, and Mike to prepare deployment scripts.',
    transcript: '[00:00] John: Good morning everyone, let\'s get started.\n[00:12] Sarah: I completed the authentication module yesterday.\n[00:45] Mike: Great work! We should review the security aspects.\n[01:20] John: Agreed. Let\'s schedule a security review for next week.\n[02:00] Sarah: I\'ll prepare the documentation by Friday.\n[02:30] Mike: Perfect. I\'ll handle the deployment scripts.',
    speakers: ['John (Host)', 'Sarah (Developer)', 'Mike (DevOps)'],
  },
  {
    id: '2',
    title: 'Product Planning Q1 2026',
    date: 'Nov 19, 2025',
    duration: '1 hr 15 min',
    summary: 'Product team outlined Q1 roadmap priorities including mobile app launch, enhanced analytics dashboard, and customer feedback integration. Budget allocation discussed with $200K for development and $50K for marketing. Timeline: Mobile app beta by Jan 15, full launch by Feb 28.',
    transcript: '[00:00] Lisa: Welcome to our Q1 planning session.\n[00:30] Tom: I\'d like to propose prioritizing the mobile app.\n[01:45] Lisa: That makes sense given our user feedback.\n[03:00] Tom: We\'ll need about $200K for development.\n[04:30] Emma: I can allocate $50K from marketing budget.\n[05:00] Lisa: Perfect. Let\'s aim for a beta by January 15th.',
    speakers: ['Lisa (Product Manager)', 'Tom (Tech Lead)', 'Emma (Marketing)'],
  },
  {
    id: '3',
    title: 'Client Presentation - Acme Corp',
    date: 'Nov 18, 2025',
    duration: '45 min',
    summary: 'Presented new features to Acme Corp including real-time collaboration tools and advanced reporting. Client expressed strong interest in enterprise plan upgrade. Follow-up: Send detailed pricing proposal by end of week, schedule technical demo for their IT team next month.',
    transcript: '[00:00] Alex: Thank you for joining us today.\n[00:20] Client: We\'re excited to see the new features.\n[01:30] Alex: Let me show you our real-time collaboration tools.\n[03:00] Client: This looks impressive! What\'s the pricing?\n[04:00] Alex: I\'ll send a detailed proposal by Friday.\n[04:30] Client: Perfect. Let\'s also schedule a technical demo.',
    speakers: ['Alex (Sales)', 'Client (Acme Corp)', 'Jessica (Support)'],
  },
];

export default function Dashboard() {
  const [meetings, setMeetings] = useState(mockMeetings);
  const [selectedMeeting, setSelectedMeeting] = useState(mockMeetings[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [editedSummary, setEditedSummary] = useState('');
  const [editedTranscript, setEditedTranscript] = useState('');

  const filteredMeetings = meetings.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /**
   * 🔴 PLACEHOLDER: Edit Meeting Title
   * 
   * TODO: Connect to backend API
   * Backend Endpoint: PATCH /meetings/{meeting_id}
   * Request: { title: string }
   * Response: Updated meeting object
   * 
   * When backend is ready, replace local state update with:
   * const result = await updateMeeting(meetingId, { title: editedTitle });
   * setMeetings(prev => prev.map(m => m.id === meetingId ? result : m));
   */
  const handleEditMeeting = async (meetingId: string) => {
    if (editingMeetingId === meetingId) {
      // Save changes
      console.log('[🔴 PLACEHOLDER] Saving meeting title:', editedTitle);
      console.warn('[BACKEND NEEDED] Call: await updateMeeting(' + meetingId + ', { title: "' + editedTitle + '" })');
      
      // Update local state - REPLACE WITH BACKEND CALL
      setMeetings(prev => prev.map(m => 
        m.id === meetingId ? { ...m, title: editedTitle } : m
      ));
      if (selectedMeeting?.id === meetingId) {
        setSelectedMeeting({ ...selectedMeeting, title: editedTitle });
      }
      
      setEditingMeetingId(null);
    } else {
      // Start editing
      const meeting = meetings.find(m => m.id === meetingId);
      if (meeting) {
        setEditedTitle(meeting.title);
        setEditingMeetingId(meetingId);
      }
    }
  };

  /**
   * 🔴 PLACEHOLDER: Delete Meeting
   * 
   * TODO: Connect to backend API
   * Backend Endpoint: DELETE /meetings/{meeting_id}
   * Response: { success: true, message: string }
   * 
   * When backend is ready, replace local state update with:
   * await deleteMeeting(meetingId);
   * setMeetings(prev => prev.filter(m => m.id !== meetingId));
   */
  const handleDeleteMeeting = async (meetingId: string) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this meeting?\n\nThis action cannot be undone.'
    );
    
    if (!confirmDelete) return;

    console.log('[🔴 PLACEHOLDER] Deleting meeting:', meetingId);
    console.warn('[BACKEND NEEDED] Call: await deleteMeeting(' + meetingId + ')');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Update local state - REPLACE WITH BACKEND CALL
    setMeetings(prev => prev.filter(m => m.id !== meetingId));
    
    // If deleted meeting was selected, select first available
    if (selectedMeeting?.id === meetingId) {
      const remaining = meetings.filter(m => m.id !== meetingId);
      setSelectedMeeting(remaining.length > 0 ? remaining[0] : null);
    }

    console.log('[🔴 PLACEHOLDER] Meeting deleted locally (not from backend)');
  };

  const cancelEdit = () => {
    setEditingMeetingId(null);
    setEditedTitle('');
  };

  /**
   * 🔴 PLACEHOLDER: Edit Meeting Content (Summary & Transcript)
   * 
   * TODO: Connect to backend API
   * Backend Endpoint: PATCH /meetings/{meeting_id}
   * Request: { summary?: string, transcript?: string }
   * Response: Updated meeting object
   * 
   * When backend is ready, replace local state update with:
   * const result = await updateMeeting(selectedMeeting.id, {
   *   summary: editedSummary,
   *   transcript: editedTranscript
   * });
   * setMeetings(prev => prev.map(m => m.id === result.meeting_id ? result : m));
   */
  const startEditingContent = () => {
    if (selectedMeeting) {
      setEditedSummary(selectedMeeting.summary);
      setEditedTranscript(selectedMeeting.transcript);
      setIsEditingContent(true);
    }
  };

  const saveContentChanges = async () => {
    if (!selectedMeeting) return;

    console.log('[🔴 PLACEHOLDER] Saving meeting content:', {
      meetingId: selectedMeeting.id,
      summary: editedSummary,
      transcript: editedTranscript
    });
    console.warn('[BACKEND NEEDED] Call: await updateMeeting("' + selectedMeeting.id + '", { summary: "...", transcript: "..." })');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Update local state - REPLACE WITH BACKEND CALL
    const updatedMeeting = {
      ...selectedMeeting,
      summary: editedSummary,
      transcript: editedTranscript
    };

    setMeetings(prev => prev.map(m => 
      m.id === selectedMeeting.id ? updatedMeeting : m
    ));
    setSelectedMeeting(updatedMeeting);
    setIsEditingContent(false);

    console.log('[🔴 PLACEHOLDER] Content updated locally (not in backend)');
    
    // TODO: When backend is ready:
    // try {
    //   const result = await updateMeeting(selectedMeeting.id, {
    //     summary: editedSummary,
    //     transcript: editedTranscript
    //   });
    //   setMeetings(prev => prev.map(m => m.id === result.meeting_id ? result : m));
    //   setSelectedMeeting(result);
    //   setIsEditingContent(false);
    // } catch (error) {
    //   console.error('Failed to update meeting:', error);
    //   alert('Failed to save changes. Please try again.');
    // }
  };

  const cancelContentEdit = () => {
    setIsEditingContent(false);
    setEditedSummary('');
    setEditedTranscript('');
  };

  return (
    <Layout>
      <div className="max-w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent mb-4">
            Dashboard
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            View all your transcribed meetings, summaries, and transcripts.
          </p>
          <div className="mt-4 inline-block px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-xl">
            <p className="text-sm text-yellow-300 font-medium">
              ⚠️ PLACEHOLDER MODE - Showing mock data. Connect backend to see real meetings.
            </p>
          </div>
        </div>

        {/* Single Container with Split Layout */}
        <div className="glass-card rounded-3xl p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Side: Meeting List */}
            <div className="lg:col-span-1 border-r border-gray-700/50 pr-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Meetings ({filteredMeetings.length})</h2>
              </div>

              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search meetings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-10 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <svg
                    className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Meeting Cards List */}
              <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {filteredMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className={`w-full rounded-2xl transition-all duration-300 ${
                      selectedMeeting?.id === meeting.id
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                        : 'bg-gray-800/30 border border-gray-700/50'
                    }`}
                  >
                    <div
                      onClick={() => setSelectedMeeting(meeting)}
                      className="p-4 cursor-pointer"
                    >
                      {editingMeetingId === meeting.id ? (
                        <input
                          type="text"
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full bg-white/10 border border-white/30 rounded px-2 py-1 text-white font-semibold mb-1 focus:outline-none focus:border-white/50"
                          autoFocus
                        />
                      ) : (
                        <h3 className="font-semibold mb-1 text-white">
                          {meeting.title}
                        </h3>
                      )}
                      <div className="flex items-center space-x-3 text-xs">
                        <span className={selectedMeeting?.id === meeting.id ? 'text-white/90' : 'text-gray-400'}>
                          {meeting.date}
                        </span>
                        <span className={selectedMeeting?.id === meeting.id ? 'text-white/80' : 'text-gray-500'}>
                          •
                        </span>
                        <span className={selectedMeeting?.id === meeting.id ? 'text-white/90' : 'text-gray-400'}>
                          {meeting.duration}
                        </span>
                      </div>
                    </div>
                    
                    {/* Edit and Delete Buttons */}
                    <div className="flex items-center justify-end space-x-2 px-4 pb-3">
                      {editingMeetingId === meeting.id ? (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEditMeeting(meeting.id); }}
                            className="p-1.5 bg-green-500/80 hover:bg-green-600 text-white rounded-lg transition-all"
                            title="Save"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); cancelEdit(); }}
                            className="p-1.5 bg-gray-500/80 hover:bg-gray-600 text-white rounded-lg transition-all"
                            title="Cancel"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEditMeeting(meeting.id); }}
                            className={`p-1.5 rounded-lg transition-all ${
                              selectedMeeting?.id === meeting.id
                                ? 'bg-white/20 hover:bg-white/30 text-white'
                                : 'bg-gray-700/50 hover:bg-gray-700 text-gray-300'
                            }`}
                            title="Edit meeting title"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteMeeting(meeting.id); }}
                            className={`p-1.5 rounded-lg transition-all ${
                              selectedMeeting?.id === meeting.id
                                ? 'bg-red-500/30 hover:bg-red-500/50 text-white'
                                : 'bg-gray-700/50 hover:bg-red-500/30 text-gray-300 hover:text-red-300'
                            }`}
                            title="Delete meeting"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {filteredMeetings.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <p>No meetings found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side: Meeting Details */}
            <div className="lg:col-span-2">
              {selectedMeeting ? (
                <div className="space-y-6">
                  {/* Header with Edit Button */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-white mb-3">{selectedMeeting.title}</h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{selectedMeeting.date}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{selectedMeeting.duration}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>{selectedMeeting.speakers.length} speakers</span>
                        </span>
                      </div>
                    </div>
                    
                    {/* Edit Content Toggle */}
                    {!isEditingContent ? (
                      <button
                        onClick={startEditingContent}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit</span>
                      </button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={saveContentChanges}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Save</span>
                        </button>
                        <button
                          onClick={cancelContentEdit}
                          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Speakers */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Speakers</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedMeeting.speakers.map((speaker, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl text-sm text-blue-200"
                        >
                          {speaker}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Summary</h3>
                    {isEditingContent ? (
                      <textarea
                        value={editedSummary}
                        onChange={(e) => setEditedSummary(e.target.value)}
                        rows={5}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                        placeholder="Enter meeting summary..."
                      />
                    ) : (
                      <p className="text-gray-300 leading-relaxed">{selectedMeeting.summary}</p>
                    )}
                  </div>

                  {/* Transcript */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Transcript</h3>
                    {isEditingContent ? (
                      <textarea
                        value={editedTranscript}
                        onChange={(e) => setEditedTranscript(e.target.value)}
                        rows={12}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors font-mono text-sm resize-none"
                        placeholder="Enter transcript..."
                      />
                    ) : (
                      <div className="bg-gray-800/30 rounded-2xl p-4 max-h-96 overflow-y-auto border border-gray-700/50">
                        <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                          {selectedMeeting.transcript}
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3 pt-4 border-t border-gray-700/50">
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[500px]">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-700/30 flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">Select a Meeting</h3>
                    <p className="text-gray-500">Choose a meeting from the list to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
