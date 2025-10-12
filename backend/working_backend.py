from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import os
import sqlite3
from datetime import datetime

# Simple in-memory ML model for demo
class DemoModel:
    def predict(self, url):
        # Simple rule-based detection for demo
        suspicious_keywords = ['login', 'verify', 'account', 'security', 'banking', 'paypal']
        if any(keyword in url.lower() for keyword in suspicious_keywords):
            return True, 0.85
        return False, 0.15

app = FastAPI()
model = DemoModel()

class AnalysisRequest(BaseModel):
    message: str

class AnalysisResponse(BaseModel):
    is_phishing: bool
    confidence: float
    message: str
    timestamp: str

@app.post("/analyze")
async def analyze(request: AnalysisRequest):
    is_phishing, confidence = model.predict(request.message)
    
    return AnalysisResponse(
        is_phishing=is_phishing,
        confidence=confidence,
        message=request.message,
        timestamp=datetime.now().isoformat()
    )

@app.get("/")
async def health_check():
    return {"status": "healthy", "model": "demo_rule_based"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)