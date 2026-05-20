from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.faq import FAQVisibilityEnum

class FAQCreate(BaseModel):
    question: str
    answer: str
    category: str = "Umum"
    visibility: FAQVisibilityEnum = FAQVisibilityEnum.PUBLIC

class FAQUpdate(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None
    category: Optional[str] = None
    visibility: Optional[FAQVisibilityEnum] = None
    is_active: Optional[bool] = None

class FAQResponse(BaseModel):
    id: int
    question: str
    answer: str
    category: str
    visibility: FAQVisibilityEnum
    is_active: bool
    created_at: datetime
    
    model_config = {"from_attributes": True}
