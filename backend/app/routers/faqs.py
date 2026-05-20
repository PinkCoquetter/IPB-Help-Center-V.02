from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.faq import FAQ, FAQVisibilityEnum
from app.models.user import User, RoleEnum
from app.schemas.faq import FAQCreate, FAQUpdate, FAQResponse
from app.dependencies.auth import require_roles, get_current_user

router = APIRouter(prefix="/api/faqs", tags=["FAQ"])

@router.get("/public", response_model=List[FAQResponse])
async def list_public_faqs(search: Optional[str] = Query(None), db: AsyncSession = Depends(get_db)):
    query = select(FAQ).where(FAQ.is_active == True, FAQ.visibility == FAQVisibilityEnum.PUBLIC)
    result = await db.execute(query)
    faqs = result.scalars().all()
    if search:
        search_lower = search.lower()
        faqs = [f for f in faqs if search_lower in f.question.lower() or search_lower in f.answer.lower()]
    return faqs

@router.get("/student", response_model=List[FAQResponse])
async def list_student_faqs(search: Optional[str] = Query(None), db: AsyncSession = Depends(get_db), current_user: User = Depends(require_roles(RoleEnum.STUDENT, RoleEnum.STAFF, RoleEnum.ADMIN))):
    query = select(FAQ).where(FAQ.is_active == True)
    result = await db.execute(query)
    faqs = result.scalars().all()
    if search:
        search_lower = search.lower()
        faqs = [f for f in faqs if search_lower in f.question.lower() or search_lower in f.answer.lower()]
    return faqs

@router.post("/", response_model=FAQResponse, status_code=201)
async def create_faq(payload: FAQCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_roles(RoleEnum.ADMIN))):
    faq = FAQ(**payload.model_dump())
    db.add(faq)
    await db.flush()
    await db.refresh(faq)
    return faq

@router.put("/{faq_id}", response_model=FAQResponse)
async def update_faq(faq_id: int, payload: FAQUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_roles(RoleEnum.ADMIN))):
    result = await db.execute(select(FAQ).where(FAQ.id == faq_id))
    faq = result.scalar_one_or_none()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(faq, field, value)
    return faq

@router.delete("/{faq_id}", status_code=204)
async def delete_faq(faq_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_roles(RoleEnum.ADMIN))):
    result = await db.execute(select(FAQ).where(FAQ.id == faq_id))
    faq = result.scalar_one_or_none()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    faq.is_active = False
    await db.flush()
