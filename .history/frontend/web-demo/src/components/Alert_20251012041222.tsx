import React from 'react';
import { AnalysisResult } from '../types';

interface AlertProps {
  result: AnalysisResult;
}

const Alert: React.FC<AlertProps> = ({ result }) => {
  const getAlertColor = () => {
    if (result.error) return '#6c757d';
    if (result.is_phishing) {
      return result.confidence > 0.7 ? '#dc3545' : '#ffc107';
    }
    return '#28a745';
  };

  const getAlertMessage = () => {
    if (result.error) return '❌ Analysis Failed';
    if (result.is_phishing) {
      return result.confidence > 0.7 
        ? '🚨 High Confidence Phishing!'
        : '⚠ Suspicious Content Detected';
    }
    return '✅ Likely Legitimate';
  };

  const getAlertIcon = () => {
    if (result.error) return '❌';
    if (result.is_phishing) {
      return result.confidence > 0.7 ? '🚨' : '⚠';
    }
    return '✅';
  };

  return (
    <div style={{
      padding: '20px',
      border: `2px solid ${getAlertColor()}`,
      borderRadius: '12px',
      backgroundColor: `${getAlertColor()}15`,
      marginBottom: '20px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '15px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>{getAlertIcon()}</span>
          <h3 style={{ 
            margin: 0, 
            color: getAlertColor(),
            fontSize: '18px',
            fontWeight: '600'
          }}>
            {getAlertMessage()}
          </h3>
        </div>
        <span style={{
          color: getAlertColor(),
          fontWeight: 'bold',
          fontSize: '16px',
          backgroundColor: `${getAlertColor()}20`,
          padding: '6px 12px',
          borderRadius: '20px'
        }}>
          {(result.confidence * 100).toFixed(1)}%
        </span>
      </div>
      
      {result.error ? (
        <div style={{ fontSize: '14px', color: '#666' }}>
          <p style={{ margin: '8px 0' }}>{result.error}</p>
          <p style={{ margin: '8px 0', fontSize: '12px' }}>
            Make sure the backend server is running on localhost:8000
          </p>
        </div>
      ) : (
        <div style={{ fontSize: '14px', color: '#666' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '15px',
            marginBottom: '15px'
          }}>
            <div>
              <strong>Status:</strong><br />
              <span style={{ 
                color: getAlertColor(), 
                fontWeight: '600',
                fontSize: '14px'
              }}>
                {result.is_phishing ? 'PHISHING' : 'SAFE'}
              </span>
            </div>
            <div>
              <strong>Confidence:</strong><br />
              <span style={{ fontWeight: '600', fontSize: '14px' }}>
                {(result.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          
          {result.features_used.length > 0 && (
            <div>
              <strong>Detection Indicators:</strong>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '8px',
                marginTop: '8px'
              }}>
                {result.features_used.slice(0, 5).map((feature, index) => (
                  <span key={index} style={{
                    backgroundColor: `${getAlertColor()}20`,
                    color: getAlertColor(),
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {feature.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.detection_method && (
            <div style={{ marginTop: '10px', fontSize: '12px', opacity: 0.7 }}>
              <strong>Method:</strong> {result.detection_method === 'ml_xgboost' ? '🤖 ML (XGBoost)' : '⚡ Rule-Based'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Alert;
