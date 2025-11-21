/**
 * ⚠️ API PLACEHOLDER FUNCTIONS ⚠️
 * 
 * ALL FUNCTIONS IN THIS FILE ARE MOCKED/SIMULATED
 * 
 * Backend Integration Required:
 * 1. Update API_BASE_URL in client.ts
 * 2. Replace each function with real axios/fetch calls
 * 3. Match response types to backend API
 * 
 * See BACKEND_INTEGRATION.md for detailed mapping
 */

import type { UploadResponse } from '../types/meeting';
// import apiClient from './client'; // Uncomment when ready for real API

/**
 * 🔴 PLACEHOLDER: Upload an audio file
 * 
 * TODO: Replace with real backend call
 * Backend Endpoint: POST /upload/ or POST /meetings/upload
 * Request: FormData with 'file' field
 * Response: { file_id, filename, file_size, message, upload_path }
 * 
 * Example implementation:
 * const formData = new FormData();
 * formData.append('file', file);
 * const response = await apiClient.post('/upload/', formData);
 * return response.data;
 */
export async function uploadFile(file: File): Promise<UploadResponse> {
  console.log('[🔴 PLACEHOLDER] Simulating file upload:', file.name, 'Size:', file.size);
  console.warn('[BACKEND NEEDED] This function needs real API endpoint: POST /upload/');
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock successful response - REPLACE WITH REAL API CALL
  const mockResponse: UploadResponse = {
    file_id: `mock_file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    filename: file.name,
    file_size: file.size,
    message: '⚠️ MOCK UPLOAD - File not actually uploaded to server',
    upload_path: `/uploads/${file.name}`
  };

  console.log('[🔴 PLACEHOLDER] Simulated upload complete:', mockResponse);
  return mockResponse;
}

/**
 * 🔴 PLACEHOLDER: List all uploaded files
 * 
 * TODO: Replace with real backend call
 * Backend Endpoint: GET /upload/files or GET /meetings/files
 * Response: { total: number, files: Array<{filename, size, uploaded_at}> }
 * 
 * Example implementation:
 * const response = await apiClient.get('/upload/files');
 * return response.data;
 */
export async function listFiles(): Promise<{ total: number; files: Array<{filename: string; size: number; uploaded_at: string}> }> {
  console.log('[🔴 PLACEHOLDER] Simulating file list fetch');
  console.warn('[BACKEND NEEDED] This function needs real API endpoint: GET /upload/files');
  
  // Return empty array - no backend to store files yet
  return {
    total: 0,
    files: []
  };
}

/**
 * 🔴 PLACEHOLDER: Process audio recording for transcription
 * 
 * TODO: Create this function when backend is ready
 * Backend Endpoint: POST /meetings/process or POST /transcribe
 * Request: FormData with audio Blob and optional num_speakers parameter
 * Response: { meeting_id, status, message }
 * 
 * Example implementation:
 * const formData = new FormData();
 * formData.append('file', audioBlob);
 * if (options?.num_speakers) formData.append('num_speakers', options.num_speakers.toString());
 * const response = await apiClient.post('/transcribe', formData);
 * return response.data;
 */
export async function processAudioRecording(
  audioBlob: Blob, 
  options?: { num_speakers?: number | null }
): Promise<{ meeting_id: string; status: string; message: string }> {
  console.log('[🔴 PLACEHOLDER] Simulating audio processing with options:', options);
  console.warn('[BACKEND NEEDED] This function needs real API endpoint: POST /transcribe');
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    meeting_id: `mock_meeting_${Date.now()}`,
    status: 'processing',
    message: '⚠️ MOCK - Audio not actually sent to transcription service'
  };
}

/**
 * 🔴 PLACEHOLDER: Process uploaded file for transcription
 * 
 * TODO: Create this function when backend is ready
 * Backend Endpoint: POST /meetings/process
 * Request: { file_id: string, num_speakers?: number }
 * Response: { meeting_id, status, message }
 * 
 * Example implementation:
 * const response = await apiClient.post('/meetings/process', {
 *   file_id: fileId,
 *   num_speakers: options?.num_speakers
 * });
 * return response.data;
 */
export async function processUploadedFile(
  fileId: string,
  options?: { num_speakers?: number | null }
): Promise<{ meeting_id: string; status: string; message: string }> {
  console.log('[🔴 PLACEHOLDER] Simulating file processing for:', fileId, 'with options:', options);
  console.warn('[BACKEND NEEDED] This function needs real API endpoint: POST /meetings/process');
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    meeting_id: `mock_meeting_${Date.now()}`,
    status: 'processing',
    message: '⚠️ MOCK - File not actually sent to transcription service'
  };
}

/**
 * 🔴 PLACEHOLDER: Get all meetings
 * 
 * TODO: Create this function when backend is ready
 * Backend Endpoint: GET /meetings/ or GET /meetings/list
 * Response: { total, meetings: Array<Meeting> }
 * 
 * This should be called from Dashboard.tsx
 */
export async function getMeetings(): Promise<any> {
  console.log('[🔴 PLACEHOLDER] Simulating meetings fetch');
  console.warn('[BACKEND NEEDED] This function needs real API endpoint: GET /meetings/');
  
  // Currently using mockMeetings in Dashboard.tsx
  // Replace with real API call when ready
  throw new Error('getMeetings() not implemented - using mock data in Dashboard.tsx');
}

/**
 * 🔴 PLACEHOLDER: Get meeting detail
 * 
 * TODO: Create this function when backend is ready
 * Backend Endpoint: GET /meetings/{meeting_id}
 * Response: Full Meeting object with transcript, analysis, etc.
 * 
 * This should be called from MeetingDetail.tsx
 */
export async function getMeetingDetail(meetingId: string): Promise<any> {
  console.log('[🔴 PLACEHOLDER] Simulating meeting detail fetch for:', meetingId);
  console.warn('[BACKEND NEEDED] This function needs real API endpoint: GET /meetings/' + meetingId);
  
  throw new Error('getMeetingDetail() not implemented - no backend endpoint');
}

/**
 * 🔴 PLACEHOLDER: Update meeting (edit title, summary, transcript, etc.)
 * 
 * TODO: Create this function when backend is ready
 * Backend Endpoint: PATCH /meetings/{meeting_id}
 * Request: { title?: string, summary?: string, transcript?: string }
 * Response: Updated meeting object
 * 
 * This should be called from:
 * - Dashboard.tsx handleEditMeeting() - for title
 * - Dashboard.tsx saveContentChanges() - for summary & transcript
 * 
 * Example implementation:
 * const response = await apiClient.patch(`/meetings/${meetingId}`, updates);
 * return response.data;
 */
export async function updateMeeting(meetingId: string, updates: { title?: string; summary?: string; transcript?: string }): Promise<any> {
  console.log('[🔴 PLACEHOLDER] Simulating meeting update:', meetingId, updates);
  console.warn('[BACKEND NEEDED] This function needs real API endpoint: PATCH /meetings/' + meetingId);
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    meeting_id: meetingId,
    ...updates,
    message: '⚠️ MOCK - Meeting not actually updated in backend'
  };
}

/**
 * 🔴 PLACEHOLDER: Delete meeting
 * 
 * TODO: Create this function when backend is ready
 * Backend Endpoint: DELETE /meetings/{meeting_id}
 * Response: { success: true, message: string }
 * 
 * This should be called from Dashboard.tsx handleDeleteMeeting()
 */
export async function deleteMeeting(meetingId: string): Promise<{ success: boolean; message: string }> {
  console.log('[🔴 PLACEHOLDER] Simulating meeting deletion:', meetingId);
  console.warn('[BACKEND NEEDED] This function needs real API endpoint: DELETE /meetings/' + meetingId);
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    message: '⚠️ MOCK - Meeting not actually deleted from backend'
  };
}

