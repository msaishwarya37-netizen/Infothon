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
        error: 'Failed to connect to backend. Make sure it\'s running on localhost:8000'
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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>🛡️ PhishShield Detector</h1>
        <p style={{ color: '#666', fontSize: '18px' }}>
          AI-powered phishing detection that protects you in real-time
        </p>
      </header>

      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Enter URL to analyze:
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="https://example.com"
            style={{
              width: '100%',
              height: '120px',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              resize: 'vertical'
            }}
          />
        </div>
        
        <button
          onClick={handleAnalyze}
          disabled={loading || !message.trim()}
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: loading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          {loading ? '🔍 Analyzing...' : '🛡️ Check for Phishing'}
        </button>
        
        {result && (
          <div style={{ marginTop: '30px' }}>
            <Alert result={result} />
          </div>
        )}
        
        {showFeedback && result && (
          <Feedback
            result={result}
            onSubmit={handleFeedback}
            onCancel={() => setShowFeedback(false)}
          />
        )}
      </div>

      <footer style={{ marginTop: '40px', textAlign: 'center', color: '#666' }}>
        <p>PhishShield - Real-time Phishing Detection</p>
      </footer>
    </div>
  );
};

export default App;