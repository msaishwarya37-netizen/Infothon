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
    if (correctPrediction === null || !userFeedback.trim()) {
      alert('Please provide feedback and indicate if the prediction was correct.');
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
      padding: '15px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f8f9fa'
    }}>
      <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
        Was this prediction accurate?
      </h4>
      
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>
          <input
            type="radio"
            name="correctPrediction"
            checked={correctPrediction === true}
            onChange={() => setCorrectPrediction(true)}
            style={{ marginRight: '5px' }}
          />
          Yes, prediction was correct
        </label>
        <label style={{ display: 'block', fontSize: '12px' }}>
          <input
            type="radio"
            name="correctPrediction"
            checked={correctPrediction === false}
            onChange={() => setCorrectPrediction(false)}
            style={{ marginRight: '5px' }}
          />
          No, prediction was incorrect
        </label>
      </div>

      <textarea
        value={userFeedback}
        onChange={(e) => setUserFeedback(e.target.value)}
        placeholder="Please provide additional feedback..."
        style={{
          width: '100%',
          height: '60px',
          padding: '8px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '12px',
          resize: 'vertical',
          marginBottom: '10px'
        }}
      />

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleSubmit}
          style={{
            flex: 1,
            padding: '8px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Submit Feedback
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: '8px 12px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Feedback;