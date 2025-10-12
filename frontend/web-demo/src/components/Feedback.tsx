import React, { useState } from 'react';
import { AnalysisResult, FeedbackData } from '../types';

interface FeedbackProps {
  result: AnalysisResult;
  onSubmit: (feedback: FeedbackData) => void;
  onCancel: () => void;
}

const Feedback: React.FC<FeedbackProps> = ({ result, onSubmit, onCancel }) => {
  const [userFeedback, setUserFeedback] = useState('');
  const [correctPrediction, setCorrectPrediction] = useState<boolean | null>(null);

  const handleSubmit = () => {
    if (correctPrediction === null) {
      alert('Please indicate if the prediction was correct.');
      return;
    }

    if (!userFeedback.trim()) {
      alert('Please provide additional feedback.');
      return;
    }

    onSubmit({
      message: result.message,
      prediction: result.is_phishing,
      user_feedback: userFeedback,
      correct_prediction: correctPrediction
    });
  };

  return (
    <div style={{
      padding: '20px',
      border: '1px solid #e9ecef',
      borderRadius: '12px',
      backgroundColor: '#f8f9fa',
      marginTop: '20px'
    }}>
      <h4 style={{ 
        margin: '0 0 15px 0', 
        fontSize: '16px',
        color: '#495057',
        fontWeight: '600'
      }}>
        Help Improve Our Detection
      </h4>
      
      <div style={{ marginBottom: '15px' }}>
        <p style={{ 
          margin: '0 0 10px 0', 
          fontSize: '14px',
          color: '#6c757d'
        }}>
          Was this prediction accurate?
        </p>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
            <input
              type="radio"
              name="correctPrediction"
              checked={correctPrediction === true}
              onChange={() => setCorrectPrediction(true)}
              style={{ marginRight: '8px' }}
            />
            ✅ Yes, correct
          </label>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
            <input
              type="radio"
              name="correctPrediction"
              checked={correctPrediction === false}
              onChange={() => setCorrectPrediction(false)}
              style={{ marginRight: '8px' }}
            />
            ❌ No, wrong
          </label>
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '5px', 
          fontSize: '14px',
          fontWeight: '500',
          color: '#495057'
        }}>
          Additional details:
        </label>
        <textarea
          value={userFeedback}
          onChange={(e) => setUserFeedback(e.target.value)}
          placeholder="What made this website suspicious/legitimate?"
          style={{
            width: '100%',
            height: '80px',
            padding: '10px',
            border: '1px solid #dee2e6',
            borderRadius: '6px',
            fontSize: '14px',
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleSubmit}
          disabled={!userFeedback.trim() || correctPrediction === null}
          style={{
            flex: 1,
            padding: '10px 20px',
            backgroundColor: (!userFeedback.trim() || correctPrediction === null) ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: (!userFeedback.trim() || correctPrediction === null) ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Submit Feedback
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Feedback;
