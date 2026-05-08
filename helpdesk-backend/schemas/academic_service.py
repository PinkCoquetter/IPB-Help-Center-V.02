from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AcademicServiceCreate(BaseModel):
    name: str
    description: Optional[str] = None
    guide: Optional[str] = None
    category_id: Optional[int] = None


class AcademicServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    guide: Optional[str] = None
    is_active: Optional[bool] = None
    category_id: Optional[int] = None


class AcademicServiceResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    guide: Optional[str]
    is_active: bool
    category_id: Optional[int]
    created_at: datetime

    model_config = {"from_attributes": True}
