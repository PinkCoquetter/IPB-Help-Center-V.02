from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class FAQCreate(BaseModel):
    question: str
    answer: str
    category_id: Optional[int] = None


class FAQUpdate(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None
    is_active: Optional[bool] = None
    category_id: Optional[int] = None


class FAQResponse(BaseModel):
    id: int
    question: str
    answer: str
    is_active: bool
    category_id: Optional[int]
    created_at: datetime

    model_config = {"from_attributes": True}
