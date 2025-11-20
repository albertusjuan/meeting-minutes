/**
 * TypeScript types matching the backend API responses
 */

export interface UploadResponse {
  file_id: string;
  filename: string;
  file_size: number;
  message: string;
  upload_path: string;
}

export interface FileInfo {
  filename: string;
  size: number;
  uploaded_at: string;
}

