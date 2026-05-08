from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime
from models.user import RoleEnum


class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    nim: Optional[str] = None
    program_studi: Optional[str] = None
    role: RoleEnum = RoleEnum.MAHASISWA

    @field_validator("nim")
    @classmethod
    def nim_required_for_mahasiswa(cls, v, info):
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    nim: Optional[str]
    role: RoleEnum
    program_studi: Optional[str]
    jabatan: Optional[str]
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
