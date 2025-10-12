import React from 'react';
import { AnalysisResult } from '../types';

interface AlertProps {
  result: AnalysisResult;
}

const Alert: React.FC<AlertProps> = ({ result }) => {
  const getAlertColor = () => {
    if (result.is_phishing) {
      return result.confidence > 0.7 ? '#dc3545' : '#ffc107';
    }
    return '#28a745';
  };

  const getAlertMessage = () => {
    if (result.is_phishing) {
      return result.confidence > 0.7 
        ? '🚨 High confidence phishing detected!'
        : '⚠️ Suspicious content detected';
    }
    return '✅ Likely legitimate';
  };

  return (
    <div style={{
      padding: '20px',
      border: `2px solid ${getAlertColor()}`,
      borderRadius: '8px',
      backgroundColor: `${getAlertColor()}15`,
      marginBottom: '20px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '15px'
      }}>
        <h3 style={{ 
          margin: 0, 
          color: getAlertColor(),
          fontSize: '18px',
          fontWeight: '600'
        }}>
          {getAlertMessage()}
        </h3>
        <span style={{
          color: getAlertColor(),
          fontWeight: 'bold',
          fontSize: '16px'
        }}>
          {(result.confidence * 100).toFixed(1)}%
        </span>
      </div>
      
      <div style={{ fontSize: '14px', color: '#666' }}>
        <p style={{ margin: '8px 0' }}>
          <strong>Analysis:</strong> {result.is_phishing ? 'Phishing' : 'Legitimate'}
        </p>
        <p style={{ margin: '8px 0' }}>
          <strong>Confidence:</strong> {(result.confidence * 100).toFixed(1)}%
        </p>
        {result.features_used.length > 0 && (
          <div>
            <strong>Features analyzed:</strong>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              {result.features_used.slice(0, 5).map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
        <p style={{ margin: '8px 0', fontSize: '12px', color: '#999' }}>
          Analyzed at: {new Date(result.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default Alert;