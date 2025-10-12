import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, List
from pydantic import BaseModel

class PredictionResult(BaseModel):
    is_phishing: bool
    confidence: float
    features_used: List[str]
    raw_prediction: List[float]

class MLModel:
    def __init__(self):
        self.model = None
        self.preprocessor = None
        self.feature_columns = []
        self.is_loaded = False
    
    async def load_model(self):
        """Try to load ML model, fallback to rule-based"""
        try:
            self.model = joblib.load('../ml/models/trained_model.joblib')
            self.preprocessor = joblib.load('../ml/models/preprocessor.joblib')
            self.feature_columns = joblib.load('../ml/models/feature_columns.joblib')
            self.is_loaded = True
            print("✅ ML model loaded successfully")
        except Exception as e:
            print(f"⚠️ Using rule-based detection: {e}")
            self.is_loaded = False
    
    async def predict(self, message: str) -> PredictionResult:
        """Predict if message is phishing - SIMPLIFIED"""
        return await self.rule_based_predict(message)
    
    async def rule_based_predict(self, message: str) -> PredictionResult:
        """Rule-based phishing detection - SIMPLIFIED"""
        features = []
        score = 0.0
        
        # Simple detection rules
        if len(message) > 75:
            features.append("long_url")
            score += 0.2
        
        if message.count('.') > 3:
            features.append("multiple_subdomains")
            score += 0.15
        
        if '-' in message:
            features.append("hyphens_in_domain")
            score += 0.1
        
        suspicious_keywords = ['login', 'verify', 'account', 'security']
        for keyword in suspicious_keywords:
            if keyword in message.lower():
                features.append(f"keyword_{keyword}")
                score += 0.2
        
        is_phishing = score > 0.5
        confidence = float(min(score, 0.95))
        
        if len(features) == 0:
            features = ["legitimate"]
            confidence = 0.85
        
        return PredictionResult(
            is_phishing=is_phishing,
            confidence=confidence,
            features_used=features[:5],
            raw_prediction=[1.0 - confidence, confidence] if is_phishing else [confidence, 1.0 - confidence]
        )