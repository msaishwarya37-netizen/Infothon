import pandas as pd
import numpy as np
import joblib
from preprocessing import DataPreprocessor

class PhishingPredictor:
    def __init__(self, model_path, preprocessor_path, feature_columns_path):
        self.model = joblib.load(model_path)
        self.preprocessor = joblib.load(preprocessor_path)
        self.feature_columns = joblib.load(feature_columns_path)
    
    def predict_single(self, url_features):
        """Predict single URL"""
        # Create feature vector
        features = self._create_feature_vector(url_features)
        
        # Scale features
        scaled_features = self.preprocessor['scaler'].transform([features])
        
        # Make prediction
        prediction = self.model.predict(scaled_features)[0]
        probability = self.model.predict_proba(scaled_features)[0]
        
        return {
            'prediction': 'phishing' if prediction == 1 else 'legitimate',
            'confidence': float(probability[1] if prediction == 1 else probability[0]),
            'probabilities': {
                'legitimate': float(probability[0]),
                'phishing': float(probability[1])
            }
        }
    
    def _create_feature_vector(self, url_features):
        """Create feature vector from URL features"""
        features = {}
        
        # Fill with provided features or defaults
        for col in self.feature_columns:
            features[col] = url_features.get(col, 0)
        
        # Ensure correct order
        return [features[col] for col in self.feature_columns]

def main():
    # Example usage
    predictor = PhishingPredictor(
        'models/trained_model.joblib',
        'models/preprocessor.joblib',
        'models/feature_columns.joblib'
    )
    
    # Example URL features (you would extract these from actual URLs)
    example_features = {
        'url_length': 45,
        'num_digits': 3,
        'num_special_chars': 5,
        'has_https': 1,
        'has_http': 0
        # ... add all 89 features as needed
    }
    
    result = predictor.predict_single(example_features)
    print(f"Prediction: {result['prediction']}")
    print(f"Confidence: {result['confidence']:.4f}")

if __name__ == "__main__":
    main()