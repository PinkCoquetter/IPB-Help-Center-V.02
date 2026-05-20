from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.ticket_category import TicketCategory
from app.models.user import User, RoleEnum
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.dependencies.auth import require_roles

router = APIRouter(prefix="/api/categories", tags=["Categories"])

@router.get("/", response_model=List[CategoryResponse])
async def list_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TicketCategory).where(TicketCategory.is_active == True))
    return result.scalars().all()

@router.post("/", response_model=CategoryResponse, status_code=201)
async def create_category(payload: CategoryCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_roles(RoleEnum.ADMIN))):
    exists = await db.execute(select(TicketCategory).where(TicketCategory.name == payload.name))
    if exists.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Category already exists")
    cat = TicketCategory(**payload.model_dump())
    db.add(cat)
    await db.flush()
    await db.refresh(cat)
    return cat

@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(category_id: int, payload: CategoryUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_roles(RoleEnum.ADMIN))):
    result = await db.execute(select(TicketCategory).where(TicketCategory.id == category_id))
    cat = result.scalar_one_or_none()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(cat, field, value)
    return cat

@router.delete("/{category_id}", status_code=204)
async def delete_category(category_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_roles(RoleEnum.ADMIN))):
    result = await db.execute(select(TicketCategory).where(TicketCategory.id == category_id))
    cat = result.scalar_one_or_none()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    cat.is_active = False
    await db.flush()
