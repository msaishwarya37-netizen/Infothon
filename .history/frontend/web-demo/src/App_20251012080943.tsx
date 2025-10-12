import React, { useState, useEffect } from 'react';
import Alert from './components/Alert';
import Feedback from './components/Feedback';
import { analyzeMessage, submitFeedback, getFeedbackStats, getHealthStatus } from './api';
import { AnalysisResult, FeedbackData, FeedbackStats, HealthStatus } from './types';

const App: React.FC = () => {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);

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
      // Refresh stats
      loadStats();
    } catch (error) {
      console.error('Feedback error:', error);
      alert('Failed to submit feedback. Please try again.');
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

  const loadHealth = async () => {
    try {
      const healthData = await getHealthStatus();
      setHealth(healthData);
    } catch (error) {
      console.error('Health check error:', error);
    }
  };

  useEffect(() => {
    loadStats();
    loadHealth();
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>🛡 PhishShield Detector</h1>
        <p style={{ color: '#666', fontSize: '18px' }}>
          AI-Powered Phishing Detection in Real-Time
        </p>
        
        {health && (
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: '#e7f3ff', 
            borderRadius: '8px',
            display: 'inline-block'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
              <span>Backend: <strong>{health.status}</strong></span>
              <span>•</span>
              <span>ML: <strong>{health.model_loaded ? '✅ Loaded' : '⚡ Rule-Based'}</strong></span>
              {health.ml_accuracy && <span>•</span>}
              {health.ml_accuracy && <span>Accuracy: <strong>{health.ml_accuracy}</strong></span>}
            </div>
          </div>
        )}
      </header>

      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '25px' }}>
          <label htmlFor="message-input" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Enter URL to analyze:
          </label>
          <textarea
            id="message-input"
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
            fontWeight: '500'
          }}
        >
          {loading ? '🔍 Analyzing...' : '🛡 Check for Phishing'}
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

      {stats && stats.total_feedback > 0 && (
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '15px' }}>Community Feedback</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                {stats.total_feedback}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Total Reports</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                {stats.correct_predictions}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Correct</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
                {stats.incorrect_predictions}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Incorrect</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
                {(stats.user_reported_accuracy * 100).toFixed(1)}%
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Accuracy</div>
            </div>
          </div>
        </div>
      )}

      <footer style={{ marginTop: '40px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
        <p>PhishShield - Real-time Phishing Detection • ML-Powered Security</p>
      </footer>
    </div>
  );
};

export default App;
