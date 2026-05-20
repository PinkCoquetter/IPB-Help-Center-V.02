from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DivisionCreate(BaseModel):
    name: str
    description: Optional[str] = None

class DivisionUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class DivisionResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    created_at: datetime
    
    model_config = {"from_attributes": True}
