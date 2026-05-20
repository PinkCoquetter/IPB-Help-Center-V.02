from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.user import User, RoleEnum
from app.schemas.user import UserResponse, UserUpdate
from app.dependencies.auth import require_roles

router = APIRouter(prefix="/api/admin/users", tags=["User Management"])

@router.get("/", response_model=List[UserResponse])
async def list_users(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_roles(RoleEnum.ADMIN))):
    result = await db.execute(select(User))
    return result.scalars().all()

@router.put("/{user_id}", response_model=UserResponse)
async def update_user(user_id: int, payload: UserUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_roles(RoleEnum.ADMIN))):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = payload.model_dump(exclude_none=True)
    if "password" in update_data:
        from app.core.security import hash_password
        update_data["hashed_password"] = hash_password(update_data.pop("password"))
        
    for field, value in update_data.items():
        setattr(user, field, value)
        
    return user
