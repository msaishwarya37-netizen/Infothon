export interface AnalysisResult {
  is_phishing: boolean;
  confidence: number;
  features_used: string[];
  message: string;
  timestamp: string;
  error?: string;
}

export interface FeedbackData {
  message: string;
  prediction: boolean;
  user_feedback: string;
  correct_prediction: boolean;
}