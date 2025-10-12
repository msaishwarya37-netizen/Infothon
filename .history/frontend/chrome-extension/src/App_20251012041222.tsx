import React, { useState } from 'react';
import Alert from './components/Alert';
import Feedback from './components/Feedback';
import { analyzeMessage, submitFeedback } from './api';
import { AnalysisResult, FeedbackData } from './types';

const App: React.FC = () => {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnalyze = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    try {
      const analysisResult = await analyzeMessage(message);
      setResult(analysisResult);
      setShowFeedback(true);
    } catch (error) {
      console.error('Analysis error:', error);
      setResult({
        is_phishing: false,
        confidence: 0,
        features_used: [],
        message: message,
        timestamp: new Date().toISOString(),
        error: 'Failed to analyze. Make sure backend is running on localhost:8000'
      });
    }
    setLoading(false);
  };

  const handleFeedback = async (feedbackData: FeedbackData) => {
    try {
      await submitFeedback(feedbackData);
      setShowFeedback(false);
      setMessage('');
      setResult(null);
    } catch (error) {
      console.error('Feedback error:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <div style={{ 
      width: '400px', 
      minHeight: '300px',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <h2 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>🛡️ PhishShield</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Paste URL to check for phishing..."
          style={{
            width: '100%',
            height: '80px',
            padding: '10px',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '8px',
            fontSize: '14px',
            resize: 'vertical',
            backgroundColor: 'rgba(255,255,255,0.1)',
            color: 'white'
          }}
        />
      </div>
      
      <button
        onClick={handleAnalyze}
        disabled={loading || !message.trim()}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: loading ? '#6c757d' : 'rgba(255,255,255,0.9)',
          color: loading ? 'white' : '#667eea',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: '600'
        }}
      >
        {loading ? 'Analyzing...' : 'Check for Phishing'}
      </button>
      
      {result && (
        <div style={{ marginTop: '20px' }}>
          <Alert result={result} />
        </div>
      )}
      
      {showFeedback && result && (
        <div style={{ marginTop: '20px' }}>
          <Feedback
            result={result}
            onSubmit={handleFeedback}
            onCancel={() => setShowFeedback(false)}
          />
        </div>
      )}
    </div>
  );
};

export default App;