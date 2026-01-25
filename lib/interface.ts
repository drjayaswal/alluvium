export interface MLAnalysis {
  filename: string;
  match_score: number;
  status: string;
  error?: string;
}

export interface FileData {
  filename: string;
  words: string[];
  ml_analysis?: MLAnalysis;
}