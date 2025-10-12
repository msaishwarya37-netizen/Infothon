from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import sqlite3
from datetime import datetime

# Your existing imports...
from .ml_model import MLModel, PredictionResult
from .database import save_feedback, init_db
from .models import AnalysisRequest, AnalysisResponse, FeedbackRequest

app = FastAPI(title="Phishing Detection API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML model and database
ml_model = MLModel()

@app.on_event("startup")
async def startup_event():
    init_db()
    await ml_model.load_model()

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    timestamp: str

@app.get("/", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        model_loaded=ml_model.is_loaded,
        timestamp=datetime.now().isoformat()
    )

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_message(request: AnalysisRequest):
    """Analyze a message/URL for phishing attempts"""
    if not ml_model.is_loaded:
        raise HTTPException(status_code=503, detail="ML model not loaded")
    
    try:
        result = await ml_model.predict(request.message)
        return AnalysisResponse(
            is_phishing=result.is_phishing,
            confidence=result.confidence,
            features_used=result.features_used,
            message=request.message,
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/feedback")
async def submit_feedback(feedback: FeedbackRequest):
    """Submit feedback about prediction accuracy"""
    try:
        save_feedback(
            message=feedback.message,
            prediction=feedback.prediction,
            user_feedback=feedback.user_feedback,
            correct_prediction=feedback.correct_prediction
        )
        return {"status": "feedback_saved", "timestamp": datetime.now().isoformat()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Feedback save error: {str(e)}")

@app.get("/feedback/stats")
async def get_feedback_stats():
    """Get feedback statistics"""
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