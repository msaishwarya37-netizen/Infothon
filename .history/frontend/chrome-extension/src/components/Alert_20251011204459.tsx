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
      padding: '15px',
      border: `2px solid ${getAlertColor()}`,
      borderRadius: '8px',
      backgroundColor: `${getAlertColor()}15`,
      marginBottom: '15px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px'
      }}>
        <h3 style={{ 
          margin: 0, 
          color: getAlertColor(),
          fontSize: '16px',
          fontWeight: '600'
        }}>
          {getAlertMessage()}
        </h3>
        <span style={{
          color: getAlertColor(),
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          {(result.confidence * 100).toFixed(1)}%
        </span>
      </div>
      
      <div style={{ fontSize: '12px', color: '#666' }}>
        <p style={{ margin: '5px 0' }}>
          <strong>Analysis:</strong> {result.is_phishing ? 'Phishing' : 'Legitimate'}
        </p>
        <p style={{ margin: '5px 0' }}>
          <strong>Confidence:</strong> {(result.confidence * 100).toFixed(1)}%
        </p>
        {result.features_used.length > 0 && (
          <div>
            <strong>Features analyzed:</strong>
            <ul style={{ margin: '5px 0', paddingLeft: '15px' }}>
              {result.features_used.slice(0, 3).map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;