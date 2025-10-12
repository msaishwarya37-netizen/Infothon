import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, List
from pydantic import BaseModel
import os

class PredictionResult(BaseModel):
    is_phishing: bool
    confidence: float
    features_used: List[str]
    raw_prediction: List[float]

class MLModel:
    def __init__(self):
        self.model = None
        self.preprocessor = None
        self.feature_columns = None
        self.is_loaded = False
    
    async def load_model(self):
        """Load the trained model and preprocessor"""
        try:
            model_path = '../ml/models/trained_model.joblib'
            preprocessor_path = '../ml/models/preprocessor.joblib'
            feature_columns_path = '../ml/models/feature_columns.joblib'
            
            if not all(os.path.exists(path) for path in [model_path, preprocessor_path, feature_columns_path]):
                print("Model files not found. Please train the model first.")
                return
            
            self.model = joblib.load(model_path)
            preprocessor_data = joblib.load(preprocessor_path)
            self.preprocessor = preprocessor_data
            self.feature_columns = joblib.load(feature_columns_path)
            self.is_loaded = True
            print("ML model loaded successfully")
            print(f"Model type: {type(self.model).__name__}")
            print(f"Number of features: {len(self.feature_columns)}")
        except Exception as e:
            print(f"Error loading model: {e}")
            self.is_loaded = False
    
    def extract_features(self, message: str) -> pd.DataFrame:
        """Extract features from message/URL"""
        features = {}
        
        # Basic URL features (simplified - in production, extract all 89 features)
        features['url_length'] = len(message)
        features['num_digits'] = sum(c.isdigit() for c in message)
        features['num_special_chars'] = sum(not c.isalnum() for c in message)
        features['has_https'] = 1 if 'https' in message.lower() else 0
        features['has_http'] = 1 if 'http' in message.lower() else 0
        features['num_subdomains'] = message.lower().count('.') - 1  # Subtract 1 for TLD
        features['num_dashes'] = message.count('-')
        features['num_underscores'] = message.count('_')
        features['num_question_marks'] = message.count('?')
        features['num_equals'] = message.count('=')
        features['num_ampersands'] = message.count('&')
        features['num_percent'] = message.count('%')
        
        # Domain features
        if '://' in message:
            domain = message.split('://', 1)[1].split('/')[0]
            features['domain_length'] = len(domain)
        else:
            features['domain_length'] = len(message.split('/')[0])
        
        # Fill remaining features with defaults
        for col in self.feature_columns:
            if col not in features:
                features[col] = 0
        
        # Create DataFrame with correct column order
        feature_df = pd.DataFrame([features])[self.feature_columns]
        return feature_df
    
    async def predict(self, message: str) -> PredictionResult:
        """Predict if message is phishing"""
        if not self.is_loaded:
            raise Exception("Model not loaded")
        
        # Extract features
        features_df = self.extract_features(message)
        
        # Scale features
        scaled_features = self.preprocessor['scaler'].transform(features_df)
        
        # Make prediction
        prediction_proba = self.model.predict_proba(scaled_features)[0]
        prediction = self.model.predict(scaled_features)[0]
        
        confidence = prediction_proba[1] if prediction == 1 else prediction_proba[0]
        
        return PredictionResult(
            is_phishing=bool(prediction),
            confidence=float(confidence),
            features_used=self.feature_columns[:10],  # Return first 10 features for demo
            raw_prediction=prediction_proba.tolist()
        )