from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
from datetime import datetime
import re

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
    error: Optional[str] = None

class FeedbackRequest(BaseModel):
    message: str
    prediction: bool
    user_feedback: str
    correct_prediction: bool

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    timestamp: str

# Simple phishing detection (no ML dependencies needed)
def detect_phishing(url: str):
    features = []
    score = 0.0
    
    # URL length
    if len(url) > 75:
        features.append("long_url")
        score += 0.2
    
    # Number of dots
    if url.count('.') > 3:
        features.append("multiple_subdomains")
        score += 0.15
    
    # Hyphens in domain
    if '-' in url.split('//')[-1].split('/')[0]:
        features.append("hyphens_in_domain")
        score += 0.1
    
    # @ symbol
    if '@' in url:
        features.append("contains_at_symbol")
        score += 0.3
    
    # HTTP without HTTPS
    if url.startswith('http://') and not url.startswith('https://'):
        features.append("http_not_https")
        score += 0.1
    
    # Suspicious keywords
    suspicious_keywords = ['login', 'verify', 'account', 'security', 'banking', 'update']
    for keyword in suspicious_keywords:
        if keyword in url.lower():
            features.append(f"suspicious_keyword_{keyword}")
            score += 0.1
    
    # IP address in URL
    if re.search(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', url):
        features.append("ip_address_in_url")
        score += 0.25
    
    is_phishing = score > 0.5
    confidence = min(score, 0.95)
    
    # If no suspicious features, assume safe
    if len(features) == 0:
        return False, 0.85, ["legitimate_url"]
    
    return is_phishing, confidence, features[:5]  # Return first 5 features

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
    return HealthResponse(
        status="healthy",
        model_loaded=True,  # Always true for rule-based
        timestamp=datetime.now().isoformat()
    )

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_message(request: AnalysisRequest):
    try:
        is_phishing, confidence, features = detect_phishing(request.message)
        
        return AnalysisResponse(
            is_phishing=is_phishing,
            confidence=confidence,
            features_used=features,
            message=request.message,
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        return AnalysisResponse(
            is_phishing=False,
            confidence=0.0,
            features_used=[],
            message=request.message,
            timestamp=datetime.now().isoformat(),
            error=f"Analysis error: {str(e)}"
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
        total = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM feedback WHERE correct_prediction = 1")
        correct = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM feedback WHERE correct_prediction = 0")
        incorrect = cursor.fetchone()[0]
        
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
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)