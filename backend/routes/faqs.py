from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models import FAQ
from models.user import RoleEnum
from schemas.faq import FAQCreate, FAQUpdate, FAQResponse
from utils.auth import require_roles

router = APIRouter(prefix="/api/faqs", tags=["FAQ"])


@router.get("/", response_model=List[FAQResponse])
async def list_faqs(
    category_id: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """
    Daftar FAQ aktif — bisa filter per kategori & cari keyword.
    Use Case: Melihat FAQ
    """
    query = select(FAQ).where(FAQ.is_active == True)
    if category_id:
        query = query.where(FAQ.category_id == category_id)
    result = await db.execute(query)
    faqs = result.scalars().all()

    if search:
        search_lower = search.lower()
        faqs = [f for f in faqs if search_lower in f.question.lower() or search_lower in f.answer.lower()]

    return faqs


@router.post("/", response_model=FAQResponse, status_code=201)
async def create_faq(
    payload: FAQCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_roles(RoleEnum.ADMIN)),
):
    """[Admin] Tambah FAQ. Use Case: Mengelola FAQ"""
    faq = FAQ(**payload.model_dump())
    db.add(faq)
    await db.flush()
    await db.refresh(faq)
    return faq


@router.put("/{faq_id}", response_model=FAQResponse)
async def update_faq(
    faq_id: int,
    payload: FAQUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_roles(RoleEnum.ADMIN)),
):
    """[Admin] Edit FAQ."""
    result = await db.execute(select(FAQ).where(FAQ.id == faq_id))
    faq = result.scalar_one_or_none()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ tidak ditemukan")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(faq, field, value)
    return faq


@router.delete("/{faq_id}", status_code=204)
async def delete_faq(
    faq_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_roles(RoleEnum.ADMIN)),
):
    """[Admin] Hapus FAQ."""
    result = await db.execute(select(FAQ).where(FAQ.id == faq_id))
    faq = result.scalar_one_or_none()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ tidak ditemukan")
    faq.is_active = False
