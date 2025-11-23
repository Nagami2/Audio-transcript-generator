export enum TranscriptionStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  PROCESSING_MEDIA = 'PROCESSING_MEDIA',
  PROCESSING_CHUNKS = 'PROCESSING_CHUNKS',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface TranscriptSegment {
  timestamp: string;
  speaker: string;
  text: string;
}

export interface VideoMeta {
  name: string;
  size: number;
  type: string;
  url?: string; // For local preview
  thumbnail?: string; // For YouTube thumbnails
}

export interface ProcessingError {
  message: string;
  details?: string;
}