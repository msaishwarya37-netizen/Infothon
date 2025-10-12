from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
from datetime import datetime
import numpy as np
import re
import os

app = FastAPI(title="Phishing Detection API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    message: str

class AnalysisResponse(BaseModel):
    is_phishing: bool
    confidence: float
    features_used: List[str]
    message: str
    timestamp: str
    detection_method: str

class FeedbackRequest(BaseModel):
    message: str
    prediction: bool
    user_feedback: str
    correct_prediction: bool

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    ml_accuracy: str
    detection_methods: List[str]

# Try to load ML model - FIXED VERSION
ML_LOADED = False
ml_model = None
feature_columns = []
preprocessor = None

try:
    import joblib
    import pandas as pd
    import numpy as np
    
    # Use relative paths that work from backend folder
    model_path = '../ml/models/trained_model.joblib'
    features_path = '../ml/models/feature_columns.joblib'
    preprocessor_path = '../ml/models/preprocessor.joblib'
    
    # Check if files exist before loading
    if os.path.exists(model_path) and os.path.exists(features_path) and os.path.exists(preprocessor_path):
        ml_model = joblib.load(model_path)
        feature_columns = joblib.load(features_path)
        preprocessor = joblib.load(preprocessor_path)
        
        # Validate loaded objects
        if (ml_model is not None and 
            feature_columns is not None and 
            preprocessor is not None and 
            hasattr(ml_model, 'predict') and 
            hasattr(ml_model, 'predict_proba')):
            
            ML_LOADED = True
            print("✅ ML Model loaded successfully!")
            print(f"Model type: {type(ml_model).__name__}")
            print(f"Features: {len(feature_columns)}")
        else:
            print("⚠️ Loaded model is missing required attributes")
    else:
        print("⚠️ Model files not found")
        
except Exception as e:
    print(f"⚠️ ML Model not loaded: {e}")
    print("Using rule-based detection only")

def ml_predict(url: str):
    """Make prediction using ML model - FIXED VERSION"""
    if not ML_LOADED or ml_model is None or preprocessor is None:
        return None, None, []
    
    try:
        # Extract features
        features = {}
        features['url_length'] = len(url)
        features['num_dots'] = url.count('.')
        features['num_hyphens'] = url.count('-')
        features['num_digits'] = sum(c.isdigit() for c in url)
        features['has_https'] = 1 if 'https' in url.lower() else 0
        features['has_http'] = 1 if 'http' in url.lower() else 0
        
        # Fill with defaults for other features
        for col in feature_columns:
            if col not in features:
                features[col] = 0
        
        # Create feature vector
        feature_vector = [features[col] for col in feature_columns]
        features_array = np.array(feature_vector).reshape(1, -1)
        
        # Scale and predict - WITH PROPER NULL CHECKS
        if 'scaler' not in preprocessor:
            print("⚠️ Scaler not found in preprocessor")
            return None, None, []
            
        features_scaled = preprocessor['scaler'].transform(features_array)
        
        # Check if model has required methods
        if not hasattr(ml_model, 'predict') or not hasattr(ml_model, 'predict_proba'):
            print("⚠️ Model missing predict methods")
            return None, None, []
            
        prediction = ml_model.predict(features_scaled)
        probability = ml_model.predict_proba(features_scaled)
        
        # Safely access arrays
        if (prediction is not None and len(prediction) > 0 and 
            probability is not None and len(probability) > 0):
            
            pred_value = prediction[0]
            prob_array = probability[0]
            
            # Ensure we have valid probability array
            if prob_array is not None and len(prob_array) > 1:
                confidence = float(prob_array[1] if pred_value == 1 else prob_array[0])
            else:
                confidence = 0.5  # Default confidence
                
            return bool(pred_value), confidence, list(features.keys())[:5]
        else:
            print("⚠️ Prediction returned empty results")
            return None, None, []
        
    except Exception as e:
        print(f"ML prediction failed: {e}")
        return None, None, []

def rule_based_predict(url: str):
    """Rule-based phishing detection"""
    features = []
    score = 0.0
    
    # Basic detection rules
    if len(url) > 75:
        features.append("long_url")
        score += 0.2
    
    if url.count('.') > 3:
        features.append("multiple_subdomains")
        score += 0.15
    
    if '-' in url:
        features.append("hyphens_in_domain")
        score += 0.1
    
    if '@' in url:
        features.append("contains_at_symbol")
        score += 0.3
    
    if url.startswith('http://'):
        features.append("http_not_https")
        score += 0.1
    
    suspicious_keywords = ['login', 'verify', 'account', 'security', 'banking']
    for keyword in suspicious_keywords:
        if keyword in url.lower():
            features.append(f"suspicious_keyword_{keyword}")
            score += 0.1
    
    if re.search(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', url):
        features.append("ip_address_in_url")
        score += 0.25
    
    is_phishing = score > 0.5
    confidence = float(min(score, 0.95))
    
    if len(features) == 0:
        return False, 0.85, ["legitimate_url"]
    
    return is_phishing, confidence, features[:5]

# Initialize database
def init_db():
    conn = sqlite3.connect('feedback.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            message TEXT NOT NULL,
            prediction BOOLEAN NOT NULL,
            user_feedback TEXT NOT NULL,
            correct_prediction BOOLEAN NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

@app.on_event("startup")
def startup_event():
    init_db()

@app.get("/", response_model=HealthResponse)
async def health_check():
    methods = ["rule_based"]
    accuracy = "Unknown"
    
    if ML_LOADED:
        methods.append("ml_xgboost")
        try:
            import json
            metrics_path = '../ml/experiments/model_comparison.json'
            if os.path.exists(metrics_path):
                with open(metrics_path, 'r') as f:
                    results = json.load(f)
                    accuracy = f"{results.get('xgboost', {}).get('accuracy', 0.9663):.4f}"
            else:
                accuracy = "96.63% (default)"
        except Exception as e:
            print(f"Metrics load error: {e}")
            accuracy = "96.63% (fallback)"
    
    return HealthResponse(
        status="healthy",
        model_loaded=ML_LOADED,
        ml_accuracy=accuracy,
        detection_methods=methods
    )

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_message(request: AnalysisRequest):
    try:
        # Try ML prediction first
        if ML_LOADED:
            ml_phishing, ml_confidence, ml_features = ml_predict(request.message)
            if ml_phishing is not None and ml_confidence is not None:
                return AnalysisResponse(
                    is_phishing=ml_phishing,
                    confidence=ml_confidence,
                    features_used=ml_features,
                    message=request.message,
                    timestamp=datetime.now().isoformat(),
                    detection_method="ml_xgboost"
                )
        
        # Fallback to rule-based
        rb_phishing, rb_confidence, rb_features = rule_based_predict(request.message)
        return AnalysisResponse(
            is_phishing=rb_phishing,
            confidence=rb_confidence,
            features_used=rb_features,
            message=request.message,
            timestamp=datetime.now().isoformat(),
            detection_method="rule_based"
        )
            
    except Exception as e:
        print(f"Analysis error: {e}")
        # Safe fallback
        return AnalysisResponse(
            is_phishing=False,
            confidence=0.0,
            features_used=["error_fallback"],
            message=request.message,
            timestamp=datetime.now().isoformat(),
            detection_method="error"
        )

@app.post("/feedback")
async def submit_feedback(feedback: FeedbackRequest):
    try:
        conn = sqlite3.connect('feedback.db')
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO feedback (message, prediction, user_feedback, correct_prediction)
            VALUES (?, ?, ?, ?)
        ''', (feedback.message, feedback.prediction, feedback.user_feedback, feedback.correct_prediction))
        conn.commit()
        conn.close()
        return {"status": "feedback_saved", "timestamp": datetime.now().isoformat()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Feedback save error: {str(e)}")

@app.get("/feedback/stats")
async def get_feedback_stats():
    try:
        conn = sqlite3.connect('feedback.db')
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) FROM feedback")
        total_result = cursor.fetchone()
        total = total_result[0] if total_result else 0
        
        cursor.execute("SELECT COUNT(*) FROM feedback WHERE correct_prediction = 1")
        correct_result = cursor.fetchone()
        correct = correct_result[0] if correct_result else 0
        
        cursor.execute("SELECT COUNT(*) FROM feedback WHERE correct_prediction = 0")
        incorrect_result = cursor.fetchone()
        incorrect = incorrect_result[0] if incorrect_result else 0
        
        accuracy = correct / total if total > 0 else 0
        
        conn.close()
        
        return {
            "total_feedback": total,
            "correct_predictions": correct,
            "incorrect_predictions": incorrect,
            "user_reported_accuracy": accuracy
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stats error: {str(e)}")

if __name__ == "__main__":
    print("🚀 Starting Backend Server...")
    print(f"🤖 ML Model Status: {'LOADED' if ML_LOADED else 'RULE-BASED'}")
    
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)