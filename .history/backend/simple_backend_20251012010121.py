from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
from datetime import datetime
import re

app = FastAPI(title="Phishing Detection", version="1.0.0")

# CORS
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

def detect_phishing(url: str):
    features = []
    score = 0.0
    
    # Simple rules
    if len(url) > 75:
        features.append("long_url")
        score += 0.2
    
    if url.count('.') > 3:
        features.append("multiple_subdomains") 
        score += 0.15
    
    if '-' in url.split('//')[-1].split('/')[0]:
        features.append("hyphens_in_domain")
        score += 0.1
    
    if '@' in url:
        features.append("contains_at_symbol")
        score += 0.3
    
    if url.startswith('http://'):
        features.append("http_not_https")
        score += 0.1
    
    suspicious_keywords = ['login', 'verify', 'account', 'security', 'banking', 'update']
    for keyword in suspicious_keywords:
        if keyword in url.lower():
            features.append(f"suspicious_keyword_{keyword}")
            score += 0.1
    
    is_phishing = score > 0.5
    confidence = min(score, 0.95)
    
    if len(features) == 0:
        return False, 0.85, ["legitimate_url"]
    
    return is_phishing, confidence, features[:5]

@app.get("/")
async def root():
    return {"status": "working", "version": "simple"}

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze(request: AnalysisRequest):
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
            error=str(e)
        )

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting SIMPLE backend on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)