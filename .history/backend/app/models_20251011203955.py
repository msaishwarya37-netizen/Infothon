from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class AnalysisRequest(BaseModel):
    message: str = Field(..., description="URL or message to analyze for phishing")
    
    class Config:
        schema_extra = {
            "example": {
                "message": "https://example-security-login.verify-account.com"
            }
        }

class AnalysisResponse(BaseModel):
    is_phishing: bool = Field(..., description="Whether the message is phishing")
    confidence: float = Field(..., description="Confidence score (0-1)")
    features_used: List[str] = Field(..., description="Features used for prediction")
    message: str = Field(..., description="Original message")
    timestamp: str = Field(..., description="Analysis timestamp")
    error: Optional[str] = Field(None, description="Error message if any")

class FeedbackRequest(BaseModel):
    message: str = Field(..., description="Original message that was analyzed")
    prediction: bool = Field(..., description="Original prediction (True=phishing)")
    user_feedback: str = Field(..., description="User feedback text")
    correct_prediction: bool = Field(..., description="Whether the prediction was correct")
    
    class Config:
        schema_extra = {
            "example": {
                "message": "https://example-security-login.verify-account.com",
                "prediction": True,
                "user_feedback": "This was actually a legitimate security alert",
                "correct_prediction": False
            }
        }