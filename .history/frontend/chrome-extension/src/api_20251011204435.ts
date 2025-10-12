import { AnalysisResult, FeedbackData } from './types';

const API_BASE_URL = 'http://localhost:8000';

export const analyzeMessage = async (message: string): Promise<AnalysisResult> => {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
};

export const submitFeedback = async (feedback: FeedbackData): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(feedback),
  });

  if (!response.ok) {
    throw new Error(`Feedback submission failed: ${response.status}`);
  }
};

export const getFeedbackStats = async () => {
  const response = await fetch(`${API_BASE_URL}/feedback/stats`);
  
  if (!response.ok) {
    throw new Error(`Stats fetch failed: ${response.status}`);
  }

  return response.json();
};