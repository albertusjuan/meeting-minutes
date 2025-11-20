/**
 * TypeScript types matching the backend API responses
 */

export interface TranscriptSegment {
  chunk_id?: string;
  speaker_label: string;
  start_time: number;
  end_time: number;
  text: string;
  language?: string | null;
  confidence?: number;
}

export interface MeetingTranscript {
  meeting_id: string;
  chunks: TranscriptSegment[];
  speakers: string[];
  duration: number;
  created_at: string;
}

export interface SummaryResponse {
  summary: string;
  action_items: string[];
  key_decisions: string[];
  topics: string[];
}

export interface MeetingResult {
  meeting_id: string;
  transcript: MeetingTranscript;
  summary: SummaryResponse;
  processed_at: string;
}

export interface UploadResponse {
  meeting_id: string;
  message: string;
  transcript_preview?: string;
  summary?: SummaryResponse;
}

export interface QARequest {
  question: string;
  top_k?: number;
}

export interface QAResponse {
  question: string;
  answer: string;
  context_chunks: TranscriptSegment[];
  confidence?: string | null;
}

export interface QAMessage {
  role: 'user' | 'assistant';
  content: string;
  context_chunks?: TranscriptSegment[];
  timestamp: Date;
}

