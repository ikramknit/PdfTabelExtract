
export type ExtractedData = Record<string, string | number>[];

export type Status = 'pending' | 'processing' | 'done' | 'error';

export interface FileWithStatus {
  id: string;
  file: File;
  status: Status;
  error?: string;
}

export interface HistoryEntry {
    id: string;
    timestamp: string;
    fileCount: number;
    data: ExtractedData;
    preview: string;
}
