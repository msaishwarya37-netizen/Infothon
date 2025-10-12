export interface AnalysisResult {
  is_phishing: boolean;
  confidence: number;
  features_used: string[];
  message: string;
  timestamp: string;
  detection_method?: string;
  error?: string;
}

export interface FeedbackData {
  message: string;
  prediction: boolean;
  user_feedback: string;
  correct_prediction: boolean;
}

export interface FeedbackStats {
  total_feedback: number;
  correct_predictions: number;
  incorrect_predictions: number;
  user_reported_accuracy: number;
}

export interface HealthStatus {
  status: string;
  model_loaded: boolean;
  ml_accuracy: string;
  detection_methods: string[];
}