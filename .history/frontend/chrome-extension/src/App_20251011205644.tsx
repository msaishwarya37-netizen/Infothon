import React, { useState } from 'react';
import Alert from './components/Alert';
import Feedback from './components/Feedback';
import { analyzeMessage, submitFeedback, getFeedbackStats } from './api';
import { AnalysisResult, FeedbackData } from './types';

const App: React.FC = () => {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [stats, setStats] = useState<any>(null);

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
        error: 'Analysis failed. Make sure the backend is running on port 8000.'
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
      // Refresh stats
      loadStats();
    } catch (error) {
      console.error('Feedback error:', error);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await getFeedbackStats();
      setStats(statsData);
    } catch (error) {
      console.error('Stats load error:', error);
    }
  };

  React.useEffect(() => {
    loadStats();
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>Phishing Detection Demo</h1>
        <p style={{ color: '#666', fontSize: '18px' }}>
          Analyze URLs and messages for potential phishing attempts using machine learning
        </p>
      </header>

      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '25px' }}>
          <label htmlFor="message-input" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Enter URL or message to analyze:
          </label>
          <textarea
            id="message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Paste a URL or suspicious message here. Example: https://example-security-login.verify-account.com"
            style={{
              width: '100%',
              height: '120px',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              resize: 'vertical',
              fontFamily: 'inherit'
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
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
        >
          {loading ? 'Analyzing...' : 'Check for Phishing'}
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

      {stats && (
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '15px' }}>Feedback Statistics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                {stats.total_feedback}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Total Feedback</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                {stats.correct_predictions}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Correct Predictions</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
                {stats.incorrect_predictions}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Incorrect Predictions</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
                {(stats.user_reported_accuracy * 100).toFixed(1)}%
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>User Reported Accuracy</div>
            </div>
          </div>
        </div>
      )}

      <footer style={{ marginTop: '40px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
        <p>Phishing Detection MVP • Machine Learning Powered Security</p>
      </footer>
    </div>
  );
};

export default App;