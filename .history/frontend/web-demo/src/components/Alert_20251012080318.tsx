import React from 'react';

// Define types locally since './types' is missing
interface AnalysisResult {
  is_phishing: boolean;
  confidence: number;
  features_used?: string[];
  message?: string;
  timestamp?: string;
  error?: string;
}

interface AlertProps {
  result: AnalysisResult;
}

// Confidence color utility functions
const getConfidenceColor = (confidence: number) => {
  return confidence < 0.5 ? '#dc2626' : '#16a34a';
};

const getConfidenceClass = (confidence: number) => {
  return confidence < 0.5 ? 'confidence-low' : 'confidence-high';
};

const Alert: React.FC<AlertProps> = ({ result }) => {
  const isPhishing = result.is_phishing;
  const status = isPhishing ? 'PHISHING' : 'SAFE';
  const statusColor = isPhishing ? '#dc2626' : '#16a34a';
  const statusBackground = isPhishing ? '#fef2f2' : '#f0fdf4';
  const statusEmoji = isPhishing ? '🚨' : '✅';

  return (
    <div style={{
      padding: '20px',
      borderRadius: '8px',
      border: `2px solid ${statusColor}`,
      backgroundColor: statusBackground,
      marginTop: '20px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <span style={{ fontSize: '24px', marginRight: '10px' }}>{statusEmoji}</span>
        <h3 style={{ 
          margin: 0, 
          color: statusColor,
          fontSize: '20px',
          fontWeight: 'bold'
        }}>
          {isPhishing ? 'Likely Phishing' : 'Likely Legitimate'}
        </h3>
      </div>

      {/* Status */}
      <div style={{ marginBottom: '15px' }}>
        <strong>Status:</strong>
        <span style={{ 
          color: statusColor, 
          fontWeight: 'bold',
          marginLeft: '8px',
          fontSize: '16px'
        }}>
          {status}
        </span>
      </div>

      {/* Confidence with Color Coding */}
      <div style={{ marginBottom: '15px' }}>
        <strong>Confidence:</strong>
        <span 
          style={{ 
            color: getConfidenceColor(result.confidence),
            fontWeight: 'bold',
            marginLeft: '8px',
            fontSize: '16px'
          }}
          className={getConfidenceClass(result.confidence)}
        >
          {(result.confidence * 100).toFixed(1)}%
        </span>
      </div>

      {/* Detection Indicators */}
      {result.features_used && result.features_used.length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          <strong>Detection Indicators:</strong>
          <div style={{ 
            marginTop: '8px',
            padding: '10px',
            backgroundColor: 'white',
            borderRadius: '4px',
            border: '1px solid #e5e7eb'
          }}>
            {result.features_used.map((feature: string, index: number) => (
              <div key={index} style={{ 
                fontSize: '14px',
                color: '#374151',
                marginBottom: '4px'
              }}>
                • {feature}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {result.error && (
        <div style={{ 
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '4px',
          color: '#dc2626'
        }}>
          <strong>Error:</strong> {result.error}
        </div>
      )}

      {/* Timestamp */}
      {result.timestamp && (
        <div style={{ 
          marginTop: '15px',
          fontSize: '12px',
          color: '#6b7280'
        }}>
          Analyzed at: {new Date(result.timestamp).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default Alert;