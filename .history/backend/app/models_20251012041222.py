from pydantic import BaseModel, Field
from typing import List, Optional

class AnalysisRequest(BaseModel):
    message: str = Field(..., description="URL or message to analyze for phishing")

class AnalysisResponse(BaseModel):
    is_phishing: bool = Field(..., description="Whether the message is phishing")
    confidence: float = Field(..., description="Confidence score (0-1)")  # Changed from Optional[float]
    features_used: List[str] = Field(..., description="Features used for prediction")
    message: str = Field(..., description="Original message")
    timestamp: str = Field(..., description="Analysis timestamp")
    # Removed error field to avoid type issues

class FeedbackRequest(BaseModel):
    message: str = Field(..., description="Original message that was analyzed")
    prediction: bool = Field(..., description="Original prediction (True=phishing)")
    user_feedback: str = Field(..., description="User feedback text")
    correct_prediction: bool = Field(..., description="Whether the prediction was correct")