import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import FileUpload from '../components/FileUpload';
import { uploadFile, listFiles } from '../api/meetings';
import type { FileInfo } from '../types/meeting';

export default function Home() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load files on mount
  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const result = await listFiles();
      setFiles(result.files);
    } catch (err) {
      console.error('Failed to load files:', err);
    }
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('Uploading file:', file.name);
      const result = await uploadFile(file);
      
      console.log('Upload successful:', result);

      setSuccess(`File "${result.filename}" uploaded successfully! (${(result.file_size / 1024 / 1024).toFixed(2)} MB)`);
      setIsUploading(false);
      
      // Reload files list
      await loadFiles();
    } catch (err: any) {
      console.error('Upload error:', err);
      
      let errorMessage = 'Failed to upload file. Please try again.';
      
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-4">
            File Upload System
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Upload your audio files (WAV, MP3, M4A, or FLAC) securely to our server.
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <FileUpload onUpload={handleUpload} isUploading={isUploading} />
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-8 glass-card rounded-3xl p-6">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mr-4 shadow-lg flex-shrink-0">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1 text-lg">Upload Successful</h3>
                <p className="text-gray-300">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 glass-card rounded-3xl p-6">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center mr-4 shadow-lg flex-shrink-0">
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1 text-lg">Upload Failed</h3>
                <p className="text-gray-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Uploaded Files List */}
        {files.length > 0 && (
          <div className="mt-12 glass-card rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Uploaded Files ({files.length})</h2>
            <div className="space-y-4">
              {files.map((file, index) => (
                <div key={index} className="glass rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white via-gray-200 to-gray-400 flex items-center justify-center shadow-lg">
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
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{file.filename}</p>
                      <p className="text-sm text-gray-400">
                        {formatFileSize(file.size)} • {formatDate(file.uploaded_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

