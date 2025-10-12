import { AnalysisResult, FeedbackData, FeedbackStats, HealthStatus } from './types';

const API_BASE_URL = 'http://localhost:8000';

export const analyzeMessage = async (message: string): Promise<AnalysisResult> => {
  try {
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

    return await response.json();
  } catch (error) {
    console.error('Analysis API error:', error);
    throw new Error('Failed to connect to detection service. Please make sure the backend is running.');
  }
};

export const submitFeedback = async (feedback: FeedbackData): Promise<void> => {
  try {
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
  } catch (error) {
    console.error('Feedback API error:', error);
    throw new Error('Failed to submit feedback. Please try again.');
  }
};

export const getFeedbackStats = async (): Promise<FeedbackStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/feedback/stats`);
    
    if (!response.ok) {
      throw new Error(`Stats fetch failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Stats API error:', error);
    throw new Error('Failed to load statistics.');
  }
};

export const getHealthStatus = async (): Promise<HealthStatus> => {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Health check error:', error);
    throw new Error('Failed to check backend health.');
  }
};
