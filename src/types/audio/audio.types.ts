export interface AudioAnalysisContext {
  userId: string;
  audioBuffer: Buffer;
  filename: string;
}

export interface AudioAnalysisResult {
  title: string;
  keywords: string[];
  transcript: string;
  summary: string;
}

export interface CreateAudioSummaryData {
  ownerId: string;
  title: string;
  keywords: string[];
  transcript: string;
  summary: string;
}

export interface AudioSummaryResponse {
  id: string;
  ownerId: string;
  title: string;
  keywords: string[];
  transcript: string;
  summary: string;
  createdAt: Date;
  updatedAt: Date;
}
