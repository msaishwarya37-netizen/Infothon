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
        error: 'Analysis failed'
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
    }
  };

  return (
    <div className="app" style={{ width: '400px', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#333', marginBottom: '20px', fontSize: '18px' }}>Phishing Detector</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Paste URL or suspicious message here..."
          style={{
            width: '100%',
            height: '80px',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            resize: 'vertical'
          }}
        />
      </div>
      
      <button
        onClick={handleAnalyze}
        disabled={loading || !message.trim()}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: loading ? '#6c757d' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '14px'
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