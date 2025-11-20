/**
 * API functions for file upload operations
 */

import apiClient from './client';
import type { UploadResponse } from '../types/meeting';

/**
 * Upload an audio file
 */
export async function uploadFile(file: File): Promise<UploadResponse> {
  console.log('[API] Starting upload:', file.name, 'Size:', file.size);
  console.log('[API] API Base URL:', apiClient.defaults.baseURL);
  
  const formData = new FormData();
  formData.append('file', file);
  
  console.log('[API] FormData created, field name: "file"');
  console.log('[API] Sending POST to /upload/');

  try {
    const response = await apiClient.post<UploadResponse>('/upload/', formData);

    console.log('[API] ✅ Upload successful! Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[API] ❌ Upload failed!');
    console.error('[API] Error details:', error);
    if (error.response) {
      console.error('[API] Response status:', error.response.status);
      console.error('[API] Response data:', error.response.data);
    }
    throw error;
  }
}

/**
 * List all uploaded files
 */
export async function listFiles(): Promise<{ total: number; files: Array<{filename: string; size: number; uploaded_at: string}> }> {
  const response = await apiClient.get('/upload/files');
  return response.data;
}

