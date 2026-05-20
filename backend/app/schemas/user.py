from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.user import RoleEnum
from app.schemas.division import DivisionResponse

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    nim: Optional[str] = None
    role: RoleEnum = RoleEnum.STUDENT
    division_id: Optional[int] = None

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    nim: Optional[str] = None
    role: Optional[RoleEnum] = None
    division_id: Optional[int] = None
    is_active: Optional[bool] = None

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    nim: Optional[str]
    role: RoleEnum
    division_id: Optional[int]
    is_active: bool
    created_at: datetime
    
    model_config = {"from_attributes": True}

class UserDetailResponse(UserResponse):
    division: Optional[DivisionResponse]
