/**
 * API functions for meeting operations
 */

import apiClient from './client';
import type { UploadResponse, QARequest, QAResponse, MeetingResult } from '../types/meeting';

/**
 * Upload a meeting audio file for processing
 */
export async function uploadMeeting(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<UploadResponse>('/meetings/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

/**
 * Ask a question about a specific meeting
 */
export async function askQuestion(
  meetingId: string,
  question: string,
  topK: number = 5
): Promise<QAResponse> {
  const payload: QARequest = {
    question,
    top_k: topK,
  };

  const response = await apiClient.post<QAResponse>(
    `/meetings/qa/${meetingId}`,
    payload
  );

  return response.data;
}

/**
 * Get meeting details by ID
 */
export async function getMeetingDetails(meetingId: string): Promise<MeetingResult> {
  const response = await apiClient.get<MeetingResult>(`/meetings/${meetingId}`);
  return response.data;
}

/**
 * List all meetings
 */
export async function listMeetings(): Promise<{ total: number; meetings: string[] }> {
  const response = await apiClient.get<{ total: number; meetings: string[] }>('/meetings/');
  return response.data;
}

